from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import price, order, account
from app.database import engine, Base
from app.workers.price_updater import start_price_updater, stop_price_updater

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stock Simulator API",
    description="Stock price and trading simulator",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(price.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(account.router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Start background worker on startup"""
    start_price_updater()


@app.on_event("shutdown")
async def shutdown_event():
    """Stop background worker on shutdown"""
    stop_price_updater()


@app.get("/")
async def root():
    return {"message": "Stock Simulator API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
