from hasher import calculate_sha256


def verify_integrity(file_path, original_hash):
    """
    Verify the integrity of an evidence file.

    Compares the current SHA-256 hash of the file
    with the original SHA-256 hash recorded when
    the evidence was acquired.
    """

    current_hash = calculate_sha256(file_path)

    is_integrity_valid = current_hash.lower() == original_hash.lower()

    return {
        "integrity_valid": is_integrity_valid,
        "original_hash": original_hash,
        "current_hash": current_hash
    }