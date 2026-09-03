from pathlib import Path


# Evidence formats supported by our system
ALLOWED_EXTENSIONS = {
    ".dd",
    ".dav",
    ".bin",
    ".raw",
    ".264",
    ".h264",
    ".h265",
    ".hevc",
    ".mp4",
    ".avi",
    ".mkv"
}

# Maximum evidence file size: 10 GB
MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024


# Common file signatures (magic bytes)
FILE_SIGNATURES = {
    ".mp4": [
        b"ftyp"
    ],
    ".avi": [
        b"RIFF"
    ],
    ".mkv": [
        b"\x1A\x45\xDF\xA3"
    ]
}


def check_file_signature(path, extension):
    """
    Check whether the binary header matches the expected
    signature for formats where a standard signature exists.

    Vendor-specific formats such as .dav, .bin and .raw
    are not rejected based only on missing signatures because
    their internal structures vary between manufacturers.
    """

    if extension not in FILE_SIGNATURES:
        return True, "No standard signature check required."

    with open(path, "rb") as file:
        header = file.read(32)

    signatures = FILE_SIGNATURES[extension]

    for signature in signatures:

        # MP4: 'ftyp' is normally located at byte offset 4.
        if extension == ".mp4":
            if signature in header:
                return True, "Valid MP4 file signature detected."

        # AVI: starts with RIFF.
        elif extension == ".avi":
            if header.startswith(signature):
                return True, "Valid AVI file signature detected."

        # MKV/WebM: EBML header.
        elif extension == ".mkv":
            if header.startswith(signature):
                return True, "Valid MKV/EBML signature detected."

    return False, "File signature does not match the selected extension."


def validate_evidence(file_path):
    """
    Perform forensic evidence validation.

    Returns a dictionary containing:
    - validation status
    - filename
    - extension
    - file size
    - signature status
    """

    path = Path(file_path)

    # -------------------------------------------------
    # 1. Check whether the path exists
    # -------------------------------------------------
    if not path.exists():
        return {
            "valid": False,
            "error": "Evidence file does not exist."
        }

    # -------------------------------------------------
    # 2. Make sure the path points to a file
    # -------------------------------------------------
    if not path.is_file():
        return {
            "valid": False,
            "error": "Provided path is not a file."
        }

    # -------------------------------------------------
    # 3. Check file extension
    # -------------------------------------------------
    extension = path.suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        return {
            "valid": False,
            "error": f"Unsupported evidence format: {extension}"
        }

    # -------------------------------------------------
    # 4. Check file size
    # -------------------------------------------------
    file_size = path.stat().st_size

    if file_size == 0:
        return {
            "valid": False,
            "error": "Evidence file is empty."
        }

    if file_size > MAX_FILE_SIZE:
        return {
            "valid": False,
            "error": "Evidence file exceeds the 10 GB size limit."
        }

    # -------------------------------------------------
    # 5. Check binary file signature where applicable
    # -------------------------------------------------
    try:
        signature_valid, signature_message = check_file_signature(
            path,
            extension
        )

    except PermissionError:
        return {
            "valid": False,
            "error": "Permission denied while reading evidence file."
        }

    except OSError as error:
        return {
            "valid": False,
            "error": f"Unable to read evidence file: {error}"
        }

    if not signature_valid:
        return {
            "valid": False,
            "error": signature_message
        }

    # -------------------------------------------------
    # 6. Return successful validation result
    # -------------------------------------------------
    return {
        "valid": True,
        "filename": path.name,
        "extension": extension,
        "size_bytes": file_size,
        "signature_valid": signature_valid,
        "signature_message": signature_message,
        "message": "Evidence file passed validation."
    }