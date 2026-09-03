from datetime import datetime, timezone


def create_custody_record(evidence_id, action, user, details=""):
    """
    Create a single chain-of-custody record.
    """

    return {
        "evidence_id": evidence_id,
        "action": action,
        "user": user,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "details": details
    }


def add_custody_event(custody_chain, evidence_id, action, user, details=""):
    """
    Add a new event to an existing chain of custody.
    """

    record = create_custody_record(
        evidence_id=evidence_id,
        action=action,
        user=user,
        details=details
    )

    custody_chain.append(record)

    return record


def get_custody_chain(custody_chain, evidence_id):
    """
    Return all custody events belonging to an evidence item.
    """

    return [
        record
        for record in custody_chain
        if record["evidence_id"] == evidence_id
    ]