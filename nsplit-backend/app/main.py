from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, sessions, positions
from app.database import engine, Base
from app.workers.auto_trading_worker import start_worker, stop_worker

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="N-Split Trading API",
    description="Automated trading system with N-step split strategy",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(positions.router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Start background worker on startup"""
    start_worker()


@app.on_event("shutdown")
async def shutdown_event():
    """Stop background worker on shutdown"""
    stop_worker()


@app.get("/")
async def root():
    return {"message": "N-Split Trading API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
