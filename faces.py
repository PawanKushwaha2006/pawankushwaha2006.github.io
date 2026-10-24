"""Face detection + recognition: OpenCV YuNet (detect) + SFace (embed). Fully local, no dlib.
Models pehli baar use pe auto-download hote hain (~40 MB total).
"""
import os
import threading
import urllib.request
from pathlib import Path

import cv2
import numpy as np

import memory

MODEL_DIR = Path(os.getenv("ASSISTANT_MODELS", Path.home() / ".pawan_assistant" / "models"))
URLS = {
    "yunet.onnx": "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx",
    "sface.onnx": "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx",
}
COSINE_THRESHOLD = 0.363  # SFace recommended cosine threshold

_lock = threading.Lock()
_det = None
_rec = None


def _init() -> None:
    global _det, _rec
    if _det is not None:
        return
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    for fname, url in URLS.items():
        path = MODEL_DIR / fname
        if not path.exists():
            tmp = path.with_suffix(".part")
            urllib.request.urlretrieve(url, tmp)
            tmp.rename(path)
    _det = cv2.FaceDetectorYN.create(str(MODEL_DIR / "yunet.onnx"), "", (320, 320), 0.8, 0.3, 5000)
    _rec = cv2.FaceRecognizerSF.create(str(MODEL_DIR / "sface.onnx"), "")


def decode_image(data: bytes) -> np.ndarray:
    img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Image decode nahi hui")
    h, w = img.shape[:2]
    if max(h, w) > 1280:
        s = 1280 / max(h, w)
        img = cv2.resize(img, (int(w * s), int(h * s)))
    return img


def webcam_frame():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW) if os.name == "nt" else cv2.VideoCapture(0)
    try:
        frame = None
        for _ in range(10):  # warm-up frames
            ok, f = cap.read()
            if ok:
                frame = f
        return frame
    finally:
        cap.release()


def _embeddings(img: np.ndarray):
    _init()
    h, w = img.shape[:2]
    _det.setInputSize((w, h))
    _, found = _det.detect(img)
    if found is None:
        return []
    return [(f, _rec.feature(_rec.alignCrop(img, f))) for f in found]


def enroll(img: np.ndarray, name: str) -> str:
    with _lock:
        faces = _embeddings(img)
        if len(faces) == 0:
            return "Koi face detect nahi hua. Better light me, seedha dekhte hue photo lo."
        if len(faces) > 1:
            return f"{len(faces)} faces mile. Enroll ke liye photo me sirf ek insaan hona chahiye."
        _, feat = faces[0]
        memory.add_face(name, feat.astype(np.float32).tobytes())
        return f"'{name}' ka face enroll ho gaya (total samples: {memory.face_names()[name]})."


def identify(img: np.ndarray) -> list[dict]:
    with _lock:
        faces = _embeddings(img)
        known = [(n, np.frombuffer(b, dtype=np.float32).reshape(1, -1)) for n, b in memory.all_faces()]
        results = []
        for box, feat in faces:
            best_name, best = "unknown", -1.0
            for n, emb in known:
                score = float(_rec.match(feat, emb, cv2.FaceRecognizerSF_FR_COSINE))
                if score > best:
                    best, best_name = score, n
            if best < COSINE_THRESHOLD:
                best_name = "unknown"
            results.append(
                {"name": best_name, "score": round(best, 3), "box": [int(v) for v in box[:4]]}
            )
        return results
