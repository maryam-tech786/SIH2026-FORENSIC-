def create_evidence_metadata(
    evidence_id,
    filename,
    extension,
    size_bytes,
    acquisition_time,
    sha256,
    stored_path,
    integrity_valid
):
    """
    Create standardized metadata for forensic evidence.
    """

    return {
        "evidence_id": evidence_id,
        "filename": filename,
        "extension": extension,
        "size_bytes": size_bytes,
        "acquisition_time": acquisition_time,
        "sha256": sha256,
        "stored_path": stored_path,
        "integrity_valid": integrity_valid
    }