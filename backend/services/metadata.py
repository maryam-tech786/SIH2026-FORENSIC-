import os
import cv2


def extract_metadata(file_path):

    video = cv2.VideoCapture(file_path)

    fps = video.get(cv2.CAP_PROP_FPS)

    frame_count = video.get(cv2.CAP_PROP_FRAME_COUNT)

    width = video.get(cv2.CAP_PROP_FRAME_WIDTH)

    height = video.get(cv2.CAP_PROP_FRAME_HEIGHT)

    duration = 0

    if fps > 0:
        duration = frame_count / fps

    video.release()

    file_size = os.path.getsize(file_path)

    file_extension = os.path.splitext(file_path)[1]

    return {
        "file_size_bytes": file_size,
        "file_format": file_extension,
        "duration_seconds": round(duration, 2),
        "fps": fps,
        "resolution": f"{int(width)}x{int(height)}"
    }