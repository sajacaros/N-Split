from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import verify_api_key
from app.schemas.account import AccountResponse, AccountCreate
from app.models.account import SimAccount
from app.config import settings

router = APIRouter(prefix="/account", tags=["account"])


@router.post("/create", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
async def create_account(
    account_data: AccountCreate,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Create a new simulator account"""
    # Check if account already exists
    existing = db.query(SimAccount).filter(
        SimAccount.user_id == account_data.user_id
    ).first()

    if existing:
        return existing

    # Create new account
    account = SimAccount(
        user_id=account_data.user_id,
        cash=settings.DEFAULT_INITIAL_CASH,
    )
    db.add(account)
    db.commit()
    db.refresh(account)

    return account


@router.get("/{user_id}", response_model=AccountResponse)
async def get_account(
    user_id: str,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Get account details"""
    account = db.query(SimAccount).filter(
        SimAccount.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    return account


@router.post("/{user_id}/reset", response_model=AccountResponse)
async def reset_account(
    user_id: str,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Reset account to initial state"""
    account = db.query(SimAccount).filter(
        SimAccount.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    # Reset cash
    account.cash = settings.DEFAULT_INITIAL_CASH

    # Delete all stocks (cascade will handle this)
    # But we'll do it explicitly for clarity
    for stock in account.stocks:
        db.delete(stock)

    db.commit()
    db.refresh(account)

    return account
