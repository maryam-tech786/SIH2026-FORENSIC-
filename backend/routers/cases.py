from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from models.case import Case
from schemas.case import CaseCreate, CaseUpdate


router = APIRouter(
    prefix="/cases",
    tags=["Cases"]
)


@router.post("/")
def create_case(
    case: CaseCreate,
    db: Session = Depends(get_db)
):
    new_case = Case(
        case_name=case.case_name,
        description=case.description
    )

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    return {
        "message": "Case created successfully!",
        "case_id": new_case.id,
        "case_name": new_case.case_name,
        "description": new_case.description,
        "status": new_case.status
    }


@router.get("/")
def get_all_cases(db: Session = Depends(get_db)):
    cases = db.query(Case).all()
    return cases


@router.get("/{case_id}")
def get_case_by_id(
    case_id: int,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()

    if not case:
        return {
            "message": "Case not found"
        }

    return case


@router.put("/{case_id}")
def update_case(
    case_id: int,
    updated_data: CaseUpdate,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()

    if not case:
        return {
            "message": "Case not found"
        }

    if updated_data.case_name is not None:
        case.case_name = updated_data.case_name

    if updated_data.description is not None:
        case.description = updated_data.description

    if updated_data.status is not None:
        case.status = updated_data.status

    db.commit()
    db.refresh(case)

    return {
        "message": "Case updated successfully!",
        "case": case
    }
@router.delete("/{case_id}")
def delete_case(
    case_id: int,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()

    if not case:
        return {
            "message": "Case not found"
        }

    db.delete(case)
    db.commit()

    return {
        "message": "Case deleted successfully!"
    }