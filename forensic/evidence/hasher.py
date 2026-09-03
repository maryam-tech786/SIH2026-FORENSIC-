import hashlib


def calculate_sha256(file_path):
    """
    Calculate the SHA-256 hash of an evidence file.

    The file is read in chunks so that large CCTV/DVR files
    do not need to be loaded completely into memory.
    """

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        while True:
            chunk = file.read(1024 * 1024)  # Read 1 MB at a time

            if not chunk:
                break

            sha256.update(chunk)

    return sha256.hexdigest()