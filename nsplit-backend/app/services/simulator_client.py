import httpx
from typing import Optional, Dict, Any
from decimal import Decimal
from app.config import settings
import asyncio


class SimulatorClient:
    """Client for communicating with Simulator Backend"""

    def __init__(self):
        self.base_url = settings.SIMULATOR_API_URL
        self.api_key = settings.SIMULATOR_API_KEY
        self.timeout = 5.0
        self.max_retries = 3

    def _get_headers(self) -> Dict[str, str]:
        return {"X-Simulator-API-Key": self.api_key}

    async def _retry_request(self, method: str, url: str, **kwargs) -> httpx.Response:
        """Make HTTP request with exponential backoff retry"""
        for attempt in range(self.max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    if method == "GET":
                        response = await client.get(url, **kwargs)
                    elif method == "POST":
                        response = await client.post(url, **kwargs)
                    else:
                        raise ValueError(f"Unsupported HTTP method: {method}")

                    if response.status_code in [200, 201]:
                        return response
                    elif attempt < self.max_retries - 1:
                        await asyncio.sleep(2 ** attempt)  # Exponential backoff
                    else:
                        response.raise_for_status()

            except httpx.HTTPError as e:
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                else:
                    raise Exception(f"Simulator API request failed after {self.max_retries} attempts: {str(e)}")

        raise Exception("Max retries exceeded")

    async def get_current_price(self, stock_code: str) -> Decimal:
        """Get current price for a stock"""
        url = f"{self.base_url}/api/price/{stock_code}"
        response = await self._retry_request("GET", url, headers=self._get_headers())
        data = response.json()
        return Decimal(str(data["price"]))

    async def place_buy_order(
        self,
        user_id: str,
        stock_code: str,
        price: Decimal,
        quantity: int,
    ) -> Dict[str, Any]:
        """Place a buy order"""
        url = f"{self.base_url}/api/order/buy"
        payload = {
            "user_id": user_id,
            "stock_code": stock_code,
            "price": float(price),
            "quantity": quantity,
        }
        response = await self._retry_request(
            "POST",
            url,
            headers=self._get_headers(),
            json=payload,
        )
        return response.json()

    async def place_sell_order(
        self,
        user_id: str,
        stock_code: str,
        price: Decimal,
        quantity: int,
    ) -> Dict[str, Any]:
        """Place a sell order"""
        url = f"{self.base_url}/api/order/sell"
        payload = {
            "user_id": user_id,
            "stock_code": stock_code,
            "price": float(price),
            "quantity": quantity,
        }
        response = await self._retry_request(
            "POST",
            url,
            headers=self._get_headers(),
            json=payload,
        )
        return response.json()

    async def get_account_balance(self, user_id: str) -> Dict[str, Any]:
        """Get account balance"""
        url = f"{self.base_url}/api/account/{user_id}"
        response = await self._retry_request("GET", url, headers=self._get_headers())
        return response.json()


# Singleton instance
simulator_client = SimulatorClient()
