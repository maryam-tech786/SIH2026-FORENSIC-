from datetime import datetime, timezone
import uuid


def generate_evidence_id():
    """
    Generate a unique Evidence ID.
    
    Format:
    EVD-YYYYMMDD-HHMMSS-XXXXXXXX
    """

    now = datetime.now(timezone.utc)

    timestamp = now.strftime("%Y%m%d-%H%M%S")
    unique_part = uuid.uuid4().hex[:8].upper()

    evidence_id = f"EVD-{timestamp}-{unique_part}"

    return evidence_id


def get_acquisition_timestamp():
    """
    Return the UTC timestamp when evidence was acquired.
    """

    return datetime.now(timezone.utc).isoformat()