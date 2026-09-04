import os
import shutil

from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from models.evidence import Evidence
from services.metadata import extract_metadata
from services.hash_service import generate_file_hash


router = APIRouter(
    prefix="/evidence",
    tags=["Evidence"]
)


@router.post("/upload")
def upload_evidence(
    case_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    upload_folder = "uploads"

    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(
        upload_folder,
        file.filename
    )

    # Save uploaded video
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract video metadata
    metadata = extract_metadata(file_path)

    # Generate SHA-256 hash
    file_hash = generate_file_hash(file_path)

    # Save evidence information in database
    new_evidence = Evidence(
        case_id=case_id,
        file_name=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        file_hash=file_hash,
        status="Uploaded"
    )

    db.add(new_evidence)
    db.commit()
    db.refresh(new_evidence)

    return {
        "message": "Evidence uploaded successfully!",
        "evidence_id": new_evidence.id,
        "case_id": new_evidence.case_id,
        "file_name": new_evidence.file_name,
        "status": new_evidence.status,
        "metadata": metadata,
        "sha256_hash": file_hash
    }
@router.post("/{evidence_id}/verify")
def verify_evidence(
    evidence_id: int,
    db: Session = Depends(get_db)
):

    evidence = db.query(Evidence).filter(
        Evidence.id == evidence_id
    ).first()

    if not evidence:
        return {
            "message": "Evidence not found"
        }

    current_hash = generate_file_hash(
        evidence.file_path
    )

    if current_hash == evidence.file_hash:
        integrity_status = "VALID"
    else:
        integrity_status = "TAMPERED"

    return {
        "evidence_id": evidence.id,
        "file_name": evidence.file_name,
        "stored_hash": evidence.file_hash,
        "current_hash": current_hash,
        "integrity_status": integrity_status
    }