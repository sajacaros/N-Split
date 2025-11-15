from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime
import asyncio
import logging

from app.database import SessionLocal
from app.models.session import Session as SessionModel
from app.models.position import Position
from app.models.session_event import SessionEvent
from app.services.simulator_client import simulator_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def start_worker():
    """Start the auto trading worker"""
    scheduler.add_job(
        run_auto_trading,
        'interval',
        seconds=5,
        id='auto_trading_worker',
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Auto trading worker started")


def stop_worker():
    """Stop the auto trading worker"""
    scheduler.shutdown()
    logger.info("Auto trading worker stopped")


def run_auto_trading():
    """Main worker function that runs every 5 seconds"""
    db = SessionLocal()
    try:
        # Process running sessions
        sessions = db.query(SessionModel).filter(SessionModel.status == "running").all()

        for session in sessions:
            try:
                asyncio.run(process_session(db, session))
            except Exception as e:
                logger.error(f"Error processing session {session.id}: {str(e)}")
                # Pause session on error
                session.status = "paused"
                event = SessionEvent(
                    session_id=session.id,
                    event_type="error",
                    message=f"Error: {str(e)}",
                )
                db.add(event)
                db.commit()

    except Exception as e:
        logger.error(f"Error in auto trading worker: {str(e)}")
    finally:
        db.close()


async def process_session(db: Session, session: SessionModel):
    """Process a single session for buy/sell opportunities"""
    try:
        # Get current price
        current_price = await simulator_client.get_current_price(session.stock_code)

        # Check for sell opportunities first
        await check_sell_opportunities(db, session, current_price)

        # Check for buy opportunities
        await check_buy_opportunities(db, session, current_price)

        db.commit()

    except Exception as e:
        logger.error(f"Error processing session {session.id}: {str(e)}")
        raise


async def check_buy_opportunities(db: Session, session: SessionModel, current_price: Decimal):
    """Check if we should buy at any step"""
    # Determine first buy price
    if session.first_buy_price is None:
        first_buy_price = session.initial_buy_price or current_price
        session.first_buy_price = first_buy_price
    else:
        first_buy_price = session.first_buy_price

    # Calculate buy prices for all steps
    buy_trigger_ratio = Decimal('1') - (session.buy_trigger_pct / Decimal('100'))

    for step in range(1, session.max_steps + 1):
        # Calculate buy price for this step
        step_buy_price = first_buy_price * (buy_trigger_ratio ** (step - 1))

        # Check if current price is at or below buy price
        if current_price <= step_buy_price:
            # Check if we already have a holding position at this step
            existing_position = db.query(Position).filter(
                Position.session_id == session.id,
                Position.step_number == step,
                Position.status == "holding"
            ).first()

            if existing_position:
                continue  # Already have position at this step

            # Check if lower steps have holding positions
            lower_holding = db.query(Position).filter(
                Position.session_id == session.id,
                Position.step_number < step,
                Position.status == "holding"
            ).first()

            if lower_holding:
                continue  # Can't buy higher step while lower steps are holding

            # Calculate quantity
            quantity = int(session.amount_per_step / step_buy_price)

            if quantity <= 0:
                logger.warning(f"Quantity is 0 for session {session.id} step {step}")
                continue

            # Place buy order
            try:
                order_result = await simulator_client.place_buy_order(
                    user_id=str(session.user_id),
                    stock_code=session.stock_code,
                    price=step_buy_price,
                    quantity=quantity,
                )

                # Calculate sell target price
                sell_target_price = step_buy_price * (Decimal('1') + session.sell_trigger_pct / Decimal('100'))

                # Create position
                position = Position(
                    session_id=session.id,
                    step_number=step,
                    buy_price=step_buy_price,
                    quantity=quantity,
                    buy_time=datetime.utcnow(),
                    sell_target_price=sell_target_price,
                    status="holding",
                )
                db.add(position)

                # Update session current step
                if step > session.current_step:
                    session.current_step = step

                # Log event
                event = SessionEvent(
                    session_id=session.id,
                    event_type="buy",
                    position_id=position.id,
                    price=step_buy_price,
                    quantity=quantity,
                    message=f"Bought {quantity} shares at step {step} for {step_buy_price}",
                )
                db.add(event)

                logger.info(f"Buy order executed: session={session.id}, step={step}, price={step_buy_price}, qty={quantity}")

            except Exception as e:
                logger.error(f"Failed to place buy order: {str(e)}")
                raise


async def check_sell_opportunities(db: Session, session: SessionModel, current_price: Decimal):
    """Check if we should sell any holding positions"""
    holding_positions = db.query(Position).filter(
        Position.session_id == session.id,
        Position.status == "holding"
    ).all()

    for position in holding_positions:
        # Check if current price meets sell target
        if current_price >= position.sell_target_price:
            try:
                # Place sell order
                order_result = await simulator_client.place_sell_order(
                    user_id=str(session.user_id),
                    stock_code=session.stock_code,
                    price=current_price,
                    quantity=position.quantity,
                )

                # Update position
                position.sell_price = current_price
                position.sell_time = datetime.utcnow()
                position.realized_profit = (current_price - position.buy_price) * position.quantity
                position.status = "sold"

                # Log event
                event = SessionEvent(
                    session_id=session.id,
                    event_type="sell",
                    position_id=position.id,
                    price=current_price,
                    quantity=position.quantity,
                    message=f"Sold {position.quantity} shares at step {position.step_number} for {current_price}, profit: {position.realized_profit}",
                )
                db.add(event)

                logger.info(f"Sell order executed: session={session.id}, step={position.step_number}, price={current_price}, profit={position.realized_profit}")

            except Exception as e:
                logger.error(f"Failed to place sell order: {str(e)}")
                raise

    # Check if all positions are sold
    remaining_positions = db.query(Position).filter(
        Position.session_id == session.id,
        Position.status == "holding"
    ).count()

    if remaining_positions == 0 and session.current_step > 0:
        # All positions sold, complete the session
        session.status = "completed"
        session.completed_at = datetime.utcnow()

        event = SessionEvent(
            session_id=session.id,
            event_type="complete",
            message="All positions sold, session completed",
        )
        db.add(event)

        logger.info(f"Session {session.id} completed")
