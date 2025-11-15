import numpy as np
from decimal import Decimal
from datetime import datetime
from typing import Dict, Optional
from app.config import settings
import random


class PriceSimulator:
    """Simulates stock prices using random walk"""

    def __init__(self):
        self.prices: Dict[str, Decimal] = {}  # stock_code -> current_price
        self.volatility = settings.DEFAULT_VOLATILITY / 100.0  # Convert to decimal

    def get_or_initialize_price(self, stock_code: str, initial_price: Optional[Decimal] = None) -> Decimal:
        """Get current price or initialize with random price"""
        if stock_code not in self.prices:
            if initial_price:
                self.prices[stock_code] = Decimal(str(initial_price))
            else:
                # Initialize with random price between 50,000 and 100,000
                self.prices[stock_code] = Decimal(str(random.randint(50000, 100000)))

        return self.prices[stock_code]

    def update_price(self, stock_code: str) -> Decimal:
        """Update price using random walk"""
        current_price = self.get_or_initialize_price(stock_code)

        # Random walk: price change = current_price * volatility * random_normal
        change_pct = np.random.normal(0, self.volatility)
        new_price = float(current_price) * (1 + change_pct)

        # Ensure price doesn't go below 1000
        new_price = max(new_price, 1000)

        self.prices[stock_code] = Decimal(str(round(new_price, 2)))
        return self.prices[stock_code]

    def set_price(self, stock_code: str, price: Decimal):
        """Manually set price for a stock"""
        self.prices[stock_code] = price

    def get_price(self, stock_code: str) -> Decimal:
        """Get current price without updating"""
        return self.get_or_initialize_price(stock_code)


# Singleton instance
price_simulator = PriceSimulator()
