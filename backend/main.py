from fastapi import FastAPI

from database.connection import Base, engine

from models.case import Case
from models.evidence import Evidence

from routers import cases, evidence


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CCTV Forensic Analysis Tool API",
    version="1.0.0"
)


app.include_router(cases.router)
app.include_router(evidence.router)


@app.get("/")
def home():
    return {
        "message": "CCTV Forensic Backend is Running Successfully!"
    }