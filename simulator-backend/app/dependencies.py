from fastapi import Header, HTTPException, status
from app.config import settings


def verify_api_key(x_simulator_api_key: str = Header(...)):
    """Verify API key from header"""
    if x_simulator_api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )
    return True
