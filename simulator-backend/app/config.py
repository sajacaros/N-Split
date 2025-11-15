from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # API Security
    API_KEY: str

    # Simulator Settings
    DEFAULT_INITIAL_CASH: int = 10000000
    PRICE_UPDATE_INTERVAL: int = 5
    DEFAULT_VOLATILITY: float = 3.0

    # Server
    PORT: int = 8001

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
