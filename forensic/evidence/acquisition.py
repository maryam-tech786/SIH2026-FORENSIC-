from validator import validate_evidence
from evidence_id import generate_evidence_id, get_acquisition_timestamp
from hasher import calculate_sha256
from integrity import verify_integrity
from custody import create_custody_record
from storage import store_evidence
from metadata import create_evidence_metadata


def acquire_evidence(file_path, user="Investigator"):
    """
    Complete forensic evidence acquisition workflow.

    Steps:
    1. Validate evidence
    2. Generate Evidence ID
    3. Record acquisition timestamp
    4. Calculate original SHA-256
    5. Store evidence
    6. Verify stored evidence integrity
    7. Create chain-of-custody record
    8. Create evidence metadata
    """

    # 1. Validate evidence
    validation = validate_evidence(file_path)

    if not validation["valid"]:
        return {
            "success": False,
            "stage": "validation",
            "error": validation["error"]
        }

    # 2. Generate unique Evidence ID
    evidence_id = generate_evidence_id()

    # 3. Record acquisition time
    acquisition_time = get_acquisition_timestamp()

    # 4. Calculate REAL SHA-256 of original evidence
    original_hash = calculate_sha256(file_path)

    # 5. Store evidence
    storage_result = store_evidence(
        file_path,
        evidence_id
    )

    if not storage_result["success"]:
        return {
            "success": False,
            "stage": "storage",
            "evidence_id": evidence_id,
            "error": storage_result["error"]
        }

    # 6. Verify stored evidence integrity
    integrity_result = verify_integrity(
        storage_result["stored_path"],
        original_hash
    )

    if not integrity_result["integrity_valid"]:
        return {
            "success": False,
            "stage": "integrity_verification",
            "evidence_id": evidence_id,
            "error": "Stored evidence hash does not match original hash.",
            "original_hash": original_hash,
            "stored_hash": integrity_result["current_hash"]
        }

    # 7. Create chain-of-custody record
    custody_record = create_custody_record(
        evidence_id=evidence_id,
        action="Evidence Acquired",
        user=user,
        details="Evidence validated, hashed, stored and integrity verified."
    )

    # 8. Create standardized evidence metadata
    metadata = create_evidence_metadata(
        evidence_id=evidence_id,
        filename=validation["filename"],
        extension=validation["extension"],
        size_bytes=validation["size_bytes"],
        acquisition_time=acquisition_time,
        sha256=original_hash,
        stored_path=storage_result["stored_path"],
        integrity_valid=True
    )

    # Final evidence record
    return {
        "success": True,
        "evidence_id": evidence_id,
        "filename": validation["filename"],
        "extension": validation["extension"],
        "size_bytes": validation["size_bytes"],
        "acquisition_time": acquisition_time,
        "sha256": original_hash,
        "stored_path": storage_result["stored_path"],
        "integrity_valid": True,
        "custody_record": custody_record,
        "metadata": metadata
    }