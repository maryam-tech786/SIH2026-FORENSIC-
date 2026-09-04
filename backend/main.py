from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import cases
from routers import evidence


app = FastAPI(
    title="SIH 2026 Forensic Evidence API"
)


# ==========================================
# CORS CONFIGURATION
# Allows React frontend to access this backend
# ==========================================

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


# ==========================================
# ROUTERS
# ==========================================

app.include_router(cases.router)

app.include_router(evidence.router)


# ==========================================
# HOME ROUTE
# ==========================================

@app.get("/")
def home():

    return {
        "message": "SIH 2026 Forensic Evidence Backend is running successfully!"
    }