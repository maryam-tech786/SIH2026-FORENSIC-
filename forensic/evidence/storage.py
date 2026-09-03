from pathlib import Path
import shutil


# Main evidence storage directory
STORAGE_DIR = Path(__file__).parent / "stored_evidence"


def store_evidence(file_path, evidence_id):
    """
    Store an evidence file using its unique Evidence ID.
    """

    source = Path(file_path)

    # 1. Check source file exists
    if not source.exists():
        return {
            "success": False,
            "error": "Evidence file does not exist."
        }

    # 2. Make sure source is a file
    if not source.is_file():
        return {
            "success": False,
            "error": "Provided path is not a file."
        }

    # 3. Create storage directory
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    # 4. Create destination filename
    destination = STORAGE_DIR / f"{evidence_id}{source.suffix.lower()}"

    # 5. Prevent accidental overwrite
    if destination.exists():
        return {
            "success": False,
            "error": "Evidence with this Evidence ID already exists."
        }

    # 6. Copy evidence while preserving file metadata
    try:
        shutil.copy2(source, destination)

    except PermissionError:
        return {
            "success": False,
            "error": "Permission denied while storing evidence."
        }

    except OSError as error:
        return {
            "success": False,
            "error": f"Unable to store evidence: {error}"
        }

    # 7. Verify destination exists
    if not destination.exists():
        return {
            "success": False,
            "error": "Evidence storage verification failed."
        }

    # 8. Return successful result
    return {
        "success": True,
        "evidence_id": evidence_id,
        "stored_path": str(destination),
        "stored_size_bytes": destination.stat().st_size,
        "message": "Evidence stored successfully."
    }