from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import Base, engine
from routers import cases
from routers import evidence as evidence_router

from models import case
from models import evidence as evidence_model


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="CCTV Forensic Backend"
)


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(cases.router)
app.include_router(evidence_router.router)


# Root endpoint
@app.get("/")
def root():
    return {
        "message": "CCTV Forensic Backend is Running Successfully!"
    }