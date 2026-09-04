from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from models.case import Case
from schemas.case import CaseCreate, CaseUpdate


router = APIRouter(prefix="/cases", tags=["Cases"])


# CREATE CASE
@router.post("/")
def create_case(
    case: CaseCreate,
    db: Session = Depends(get_db)
):
    new_case = Case(
        fir_number=case.fir_number,
        case_name=case.case_name,
        description=case.description,
        police_station=case.police_station,
        jurisdiction=case.jurisdiction,
        investigating_officer=case.investigating_officer,
        forensic_examiner=case.forensic_examiner,
        incident_date=case.incident_date,
        date_opened=case.date_opened,
        priority=case.priority,
        status="Open"
    )

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    return new_case


# GET ALL CASES
@router.get("/")
def get_all_cases(
    db: Session = Depends(get_db)
):
    cases = db.query(Case).all()

    return cases


# GET ONE CASE
@router.get("/{case_id}")
def get_case_by_id(
    case_id: int,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if not case:
        return {"message": "Case not found"}

    return case


# UPDATE CASE
@router.put("/{case_id}")
def update_case(
    case_id: int,
    updated_data: CaseUpdate,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if not case:
        return {"message": "Case not found"}

    update_data = updated_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(case, field, value)

    db.commit()
    db.refresh(case)

    return case


# DELETE CASE
@router.delete("/{case_id}")
def delete_case(
    case_id: int,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if not case:
        return {"message": "Case not found"}

    db.delete(case)
    db.commit()

    return {
        "message": "Case deleted successfully!"
    }