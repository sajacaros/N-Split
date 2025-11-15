from apscheduler.schedulers.background import BackgroundScheduler
from app.engine.price_simulator import price_simulator
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def start_price_updater():
    """Start the price updater worker"""
    scheduler.add_job(
        update_all_prices,
        'interval',
        seconds=settings.PRICE_UPDATE_INTERVAL,
        id='price_updater',
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Price updater worker started")


def stop_price_updater():
    """Stop the price updater worker"""
    scheduler.shutdown()
    logger.info("Price updater worker stopped")


def update_all_prices():
    """Update all tracked stock prices"""
    try:
        for stock_code in list(price_simulator.prices.keys()):
            new_price = price_simulator.update_price(stock_code)
            logger.debug(f"Updated {stock_code}: {new_price}")
    except Exception as e:
        logger.error(f"Error updating prices: {str(e)}")
