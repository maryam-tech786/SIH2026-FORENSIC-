from pydantic import BaseModel
from typing import Optional


class CaseCreate(BaseModel):
    case_name: str
    description: str


class CaseUpdate(BaseModel):
    case_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None