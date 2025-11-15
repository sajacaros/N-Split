from sqlalchemy.orm import Session
from decimal import Decimal
from fastapi import HTTPException, status
from uuid import UUID

from app.models.account import SimAccount
from app.models.order import SimOrder
from app.models.stock import SimStock


class OrderExecutor:
    """Executes buy and sell orders instantly (simulation)"""

    @staticmethod
    def execute_buy_order(
        db: Session,
        account: SimAccount,
        stock_code: str,
        price: Decimal,
        quantity: int,
    ) -> SimOrder:
        """Execute a buy order"""
        total_cost = price * quantity

        # Check if account has enough cash
        if account.cash < total_cost:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient funds. Required: {total_cost}, Available: {account.cash}",
            )

        # Deduct cash
        account.cash -= total_cost

        # Update stock holdings
        stock = db.query(SimStock).filter(
            SimStock.account_id == account.id,
            SimStock.stock_code == stock_code,
        ).first()

        if stock:
            # Update existing holding
            total_quantity = stock.quantity + quantity
            total_cost_basis = (stock.avg_buy_price * stock.quantity) + (price * quantity)
            stock.avg_buy_price = total_cost_basis / total_quantity
            stock.quantity = total_quantity
        else:
            # Create new holding
            stock = SimStock(
                account_id=account.id,
                stock_code=stock_code,
                quantity=quantity,
                avg_buy_price=price,
            )
            db.add(stock)

        # Create order record
        order = SimOrder(
            account_id=account.id,
            stock_code=stock_code,
            order_type="buy",
            price=price,
            quantity=quantity,
            status="filled",
        )
        db.add(order)

        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def execute_sell_order(
        db: Session,
        account: SimAccount,
        stock_code: str,
        price: Decimal,
        quantity: int,
    ) -> SimOrder:
        """Execute a sell order"""
        # Check if account has enough stock
        stock = db.query(SimStock).filter(
            SimStock.account_id == account.id,
            SimStock.stock_code == stock_code,
        ).first()

        if not stock or stock.quantity < quantity:
            available = stock.quantity if stock else 0
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock. Required: {quantity}, Available: {available}",
            )

        # Add cash
        total_proceeds = price * quantity
        account.cash += total_proceeds

        # Update stock holdings
        stock.quantity -= quantity

        if stock.quantity == 0:
            # Remove stock if all sold
            db.delete(stock)

        # Create order record
        order = SimOrder(
            account_id=account.id,
            stock_code=stock_code,
            order_type="sell",
            price=price,
            quantity=quantity,
            status="filled",
        )
        db.add(order)

        db.commit()
        db.refresh(order)
        return order


# Singleton instance
order_executor = OrderExecutor()
