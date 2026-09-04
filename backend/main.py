from fastapi import FastAPI

from database.connection import Base, engine
from models.case import Case
from routers import cases


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CCTV Forensic Analysis Tool API",
    version="1.0.0"
)


app.include_router(cases.router)


@app.get("/")
def home():
    return {
        "message": "CCTV Forensic Backend is Running Successfully!"
    }