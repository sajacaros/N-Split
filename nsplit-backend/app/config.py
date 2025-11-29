from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./nsplit.db"

    # Google OAuth (optional for development)
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: Optional[str] = None

    # JWT
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_DAYS: int = 7

    # Simulator
    SIMULATOR_API_URL: str = "http://localhost:8001"
    SIMULATOR_API_KEY: str = "dev-api-key"

    # Server
    PORT: int = 8000

    # Development mode (bypasses Google OAuth)
    DEV_MODE: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
