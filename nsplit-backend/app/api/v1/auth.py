from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.schemas.auth import TokenResponse, GoogleCallbackRequest
from app.schemas.user import UserResponse
from app.auth import (
    get_google_auth_url,
    exchange_code_for_token,
    verify_google_token,
    create_access_token,
)
from app.dependencies import get_current_user
import httpx

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/google/url")
async def get_google_login_url():
    """Get Google OAuth login URL"""
    url = get_google_auth_url()
    return {"url": url}


@router.post("/google/callback", response_model=TokenResponse)
async def google_callback(
    request: GoogleCallbackRequest,
    db: Session = Depends(get_db),
):
    """Handle Google OAuth callback and create/login user"""
    # Exchange code for access token
    google_access_token = await exchange_code_for_token(request.code)

    # Get user info from Google
    user_info = await verify_google_token(google_access_token)

    google_id = user_info.get("sub")
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")

    if not google_id or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get user info from Google",
        )

    # Check if user exists
    user = db.query(User).filter(User.google_id == google_id).first()

    if not user:
        # Create new user
        user = User(
            google_id=google_id,
            email=email,
            name=name or email,
            profile_picture_url=picture,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create simulator account for new user
        await create_simulator_account(str(user.id))
    else:
        # Update last login
        user.last_login_at = datetime.utcnow()
        db.commit()

    # Create JWT token
    access_token = create_access_token(data={"user_id": str(user.id), "email": user.email})

    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout (client should remove token)"""
    return {"message": "Logged out successfully"}


async def create_simulator_account(user_id: str):
    """Create simulator account for new user"""
    from app.config import settings

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.SIMULATOR_API_URL}/api/account/create",
                json={"user_id": user_id},
                headers={"X-Simulator-API-Key": settings.SIMULATOR_API_KEY},
                timeout=5.0,
            )
            if response.status_code not in [200, 201]:
                # Log error but don't fail user creation
                print(f"Failed to create simulator account for user {user_id}: {response.text}")
    except httpx.HTTPError as e:
        # Log error but don't fail user creation
        print(f"Failed to create simulator account for user {user_id}: {str(e)}")
