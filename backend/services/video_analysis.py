from ultralytics import YOLO
import cv2
import math

print("NEW VIDEO ANALYSIS CODE LOADED")

model = YOLO("yolov8n.pt")


def analyze_video(video_path):

    cap = cv2.VideoCapture(video_path)

    fps = cap.get(cv2.CAP_PROP_FPS)

    total_person_detections = 0
    total_vehicle_detections = 0
    frame_count = 0

    detected_objects = []
    potential_obstacles = []
    suspicious_events = []

    # Unique objects tracking
    object_tracking = {}

    # To avoid repeated events
    reported_events = set()

    obstacle_objects = [
        "backpack",
        "handbag",
        "suitcase",
        "chair",
        "bicycle"
    ]

    while cap.isOpened():

        success, frame = cap.read()

        if not success:
            break

        frame_count += 1

        # Analyze every 5th frame
        if frame_count % 5 != 0:
            continue

        results = model.track(
            frame,
            persist=True,
            verbose=False
        )

        frame_person_count = 0
        frame_vehicle_count = 0

        for result in results:

            if result.boxes.id is None:
                continue

            for box, track_id in zip(
                result.boxes,
                result.boxes.id
            ):

                class_id = int(box.cls[0])
                class_name = model.names[class_id]
                track_id = int(track_id)

                x1, y1, x2, y2 = box.xyxy[0].tolist()

                center_x = (x1 + x2) / 2
                center_y = (y1 + y2) / 2

                current_position = (
                    center_x,
                    center_y
                )

                # Store unique detected objects
                if class_name not in detected_objects:
                    detected_objects.append(class_name)

                # Person detection
                if class_name == "person":

                    total_person_detections += 1
                    frame_person_count += 1

                # Vehicle detection
                elif class_name in [
                    "car",
                    "motorcycle",
                    "bus",
                    "truck"
                ]:

                    total_vehicle_detections += 1
                    frame_vehicle_count += 1

                # First time object appears
                if track_id not in object_tracking:

                    object_tracking[track_id] = {
                        "object": class_name,
                        "position": current_position,
                        "stationary_frames": 0,
                        "entered_frame": frame_count
                    }

                    # Report person entry only once
                    if class_name == "person":

                        event_key = (
                            "person_entered",
                            track_id
                        )

                        if event_key not in reported_events:

                            suspicious_events.append({
                                "frame": frame_count,
                                "track_id": track_id,
                                "event": "Person entered the scene"
                            })

                            reported_events.add(event_key)

                else:

                    previous_position = object_tracking[
                        track_id
                    ]["position"]

                    distance = math.sqrt(
                        (center_x - previous_position[0]) ** 2 +
                        (center_y - previous_position[1]) ** 2
                    )

                    # Object is moving
                    if distance >= 10:

                        object_tracking[
                            track_id
                        ]["stationary_frames"] = 0

                    # Object is stationary
                    else:

                        object_tracking[
                            track_id
                        ]["stationary_frames"] += 1

                    object_tracking[
                        track_id
                    ]["position"] = current_position

                    stationary_count = object_tracking[
                        track_id
                    ]["stationary_frames"]

                    # Possible loitering
                    if (
                        class_name == "person"
                        and stationary_count >= 10
                    ):

                        event_key = (
                            "loitering",
                            track_id
                        )

                        if event_key not in reported_events:

                            suspicious_events.append({
                                "frame": frame_count,
                                "track_id": track_id,
                                "event": "Possible loitering detected"
                            })

                            reported_events.add(event_key)

                # Potential obstacle detection
                if class_name in obstacle_objects:

                    event_key = (
                        "obstacle",
                        track_id
                    )

                    if event_key not in reported_events:

                        potential_obstacles.append({
                            "frame": frame_count,
                            "track_id": track_id,
                            "object": class_name,
                            "event": "Potential obstacle detected"
                        })

                        reported_events.add(event_key)

        # Crowd detection
        if frame_person_count >= 5:

            event_key = (
                "crowd",
                frame_count // 50
            )

            if event_key not in reported_events:

                suspicious_events.append({
                    "frame": frame_count,
                    "event": "Multiple people detected",
                    "person_count": frame_person_count
                })

                reported_events.add(event_key)

        # Multiple vehicle detection
        if frame_vehicle_count >= 3:

            event_key = (
                "multiple_vehicles",
                frame_count // 50
            )

            if event_key not in reported_events:

                suspicious_events.append({
                    "frame": frame_count,
                    "event": "Multiple vehicles detected",
                    "vehicle_count": frame_vehicle_count
                })

                reported_events.add(event_key)

    cap.release()

    # Calculate video duration
    duration = 0

    if fps:
        duration = frame_count / fps

    return {
        "total_person_detections": total_person_detections,
        "total_vehicle_detections": total_vehicle_detections,
        "frames_analyzed": frame_count,
        "video_duration_seconds": round(
            duration,
            2
        ),
        "detected_objects": detected_objects,
        "potential_obstacles": potential_obstacles,
        "suspicious_events": suspicious_events
    }