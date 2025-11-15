from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from decimal import Decimal

from app.database import get_db
from app.dependencies import verify_api_key
from app.schemas.order import OrderCreate, OrderResponse
from app.models.account import SimAccount
from app.models.order import SimOrder
from app.engine.order_executor import order_executor

router = APIRouter(prefix="/order", tags=["order"])


@router.post("/buy", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def place_buy_order(
    order_data: OrderCreate,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Place a buy order"""
    # Get account
    account = db.query(SimAccount).filter(
        SimAccount.user_id == order_data.user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    # Execute order
    order = order_executor.execute_buy_order(
        db=db,
        account=account,
        stock_code=order_data.stock_code,
        price=Decimal(str(order_data.price)),
        quantity=order_data.quantity,
    )

    return order


@router.post("/sell", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def place_sell_order(
    order_data: OrderCreate,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Place a sell order"""
    # Get account
    account = db.query(SimAccount).filter(
        SimAccount.user_id == order_data.user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    # Execute order
    order = order_executor.execute_sell_order(
        db=db,
        account=account,
        stock_code=order_data.stock_code,
        price=Decimal(str(order_data.price)),
        quantity=order_data.quantity,
    )

    return order


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Get order details"""
    order = db.query(SimOrder).filter(SimOrder.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    return order


@router.get("/account/{user_id}", response_model=List[OrderResponse])
async def get_account_orders(
    user_id: str,
    api_key_valid: bool = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    """Get all orders for an account"""
    account = db.query(SimAccount).filter(
        SimAccount.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    orders = db.query(SimOrder).filter(
        SimOrder.account_id == account.id
    ).order_by(SimOrder.executed_at.desc()).all()

    return orders
