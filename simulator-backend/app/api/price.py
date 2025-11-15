from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.database import get_db
from app.dependencies import verify_api_key
from app.schemas.price import PriceResponse, PriceHistoryResponse
from app.models.price_history import SimPriceHistory
from app.engine.price_simulator import price_simulator

router = APIRouter(prefix="/price", tags=["price"])


@router.get("/{stock_code}", response_model=PriceResponse)
async def get_current_price(
    stock_code: str,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Get current price for a stock"""
    price = price_simulator.get_price(stock_code)

    # Save to history
    history = SimPriceHistory(
        stock_code=stock_code,
        price=price,
    )
    db.add(history)
    db.commit()

    return PriceResponse(
        stock_code=stock_code,
        price=price,
        timestamp=datetime.utcnow(),
    )


@router.get("/{stock_code}/history", response_model=List[PriceHistoryResponse])
async def get_price_history(
    stock_code: str,
    limit: int = 100,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Get price history for a stock"""
    history = db.query(SimPriceHistory).filter(
        SimPriceHistory.stock_code == stock_code
    ).order_by(SimPriceHistory.timestamp.desc()).limit(limit).all()

    return history
