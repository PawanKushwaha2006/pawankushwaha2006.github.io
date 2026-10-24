"""Agent tools: memory, files, shell, GUI control, screenshots, reminders, phone notify, faces."""
import base64
import io
import os
import subprocess
import urllib.request
import webbrowser
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import faces
import memory

if os.name == "nt":
    try:
        import ctypes

        ctypes.windll.user32.SetProcessDPIAware()  # screenshot/click coordinates sahi rakhne ke liye
    except Exception:
        pass

NTFY_TOPIC = os.getenv("NTFY_TOPIC", "")  # phone pe ntfy app me yahi topic subscribe karo


@dataclass
class Ctx:
    image: bytes | None = None  # is turn me phone se aayi image


NEEDS_APPROVAL = {"run_shell", "write_file", "gui_action"}

VISION_MODEL = os.getenv("VISION_MODEL", "qwen2.5vl:7b")  # Ollama vision model


def _t(name, desc, props=None, required=None):
    return {
        "name": name,
        "description": desc,
        "input_schema": {"type": "object", "properties": props or {}, "required": required or []},
    }


S = {"type": "string"}
SCHEMAS = [
    _t("remember", "Durable fact/preference save karo (naam, pasand, plans). Passwords/card numbers kabhi nahi.",
       {"text": S}, ["text"]),
    _t("recall", "Saved memory me search karo.", {"query": S}, ["query"]),
    _t("forget", "Memory fact id se delete karo.", {"id": {"type": "integer"}}, ["id"]),
    _t("run_shell", "Laptop pe PowerShell command chalao (user approval lagta hai).",
       {"command": S, "timeout": {"type": "integer"}}, ["command"]),
    _t("read_file", "Text file padho.", {"path": S}, ["path"]),
    _t("write_file", "File likho ya append karo (user approval lagta hai).",
       {"path": S, "content": S, "append": {"type": "boolean"}}, ["path", "content"]),
    _t("list_dir", "Folder ki listing.", {"path": S}, ["path"]),
    _t("open_target", "App, file ya URL laptop pe kholo (e.g. 'notepad', 'https://...').",
       {"target": S}, ["target"]),
    _t("screenshot", "Laptop screen dekho aur question ka jawab do (e.g. 'kaunsi app khuli hai?'). Vision model use hota hai.",
       {"question": S}),
    _t("describe_image", "User ki attach ki hui photo ke baare me question ka jawab do.", {"question": S}),
    _t("web_search", "Internet pe search karo (DuckDuckGo), top 5 results.", {"query": S}, ["query"]),
    _t("gui_action", "Mouse/keyboard control (user approval). Coordinates screenshot ke hisaab se do.",
       {"action": {"type": "string", "enum": ["click", "type", "hotkey", "scroll"]},
        "x": {"type": "integer"}, "y": {"type": "integer"}, "clicks": {"type": "integer"},
        "text": S, "keys": {"type": "array", "items": S}, "amount": {"type": "integer"}},
       ["action"]),
    _t("set_reminder", "Reminder set karo. when = local time 'YYYY-MM-DD HH:MM'.",
       {"text": S, "when": S}, ["text", "when"]),
    _t("list_reminders", "Pending reminders dikhao."),
    _t("notify_phone", "Phone pe push notification bhejo (ntfy).", {"title": S, "message": S}, ["message"]),
    _t("face_enroll", "Kisi ka face enroll karo. Sirf tab jab wo insaan consent de chuka ho. source: attached ya webcam.",
       {"name": S, "source": {"type": "string", "enum": ["attached", "webcam"]}}, ["name", "source"]),
    _t("face_identify", "Photo me logon ko pehchano. source: attached ya webcam.",
       {"source": {"type": "string", "enum": ["attached", "webcam"]}}, ["source"]),
    _t("face_list", "Enrolled faces ki list."),
    _t("face_delete", "Kisi ka enrolled face data delete karo.", {"name": S}, ["name"]),
]


# ---------- implementations ----------
def remember(i, ctx):
    return f"Saved (id {memory.add_fact(i['text'])})."


def recall(i, ctx):
    r = memory.search_facts(i["query"], 10)
    return "\n".join(f"[{f['id']}] {f['text']}" for f in r) or "Kuch nahi mila."


def forget(i, ctx):
    return "Deleted." if memory.delete_fact(int(i["id"])) else "Id nahi mili."


def run_shell(i, ctx):
    cmd = i["command"]
    args = ["powershell", "-NoProfile", "-Command", cmd] if os.name == "nt" else ["bash", "-lc", cmd]
    p = subprocess.run(args, capture_output=True, text=True, errors="replace",
                       timeout=int(i.get("timeout", 60)))
    return f"exit={p.returncode}\n{(p.stdout + p.stderr)[-6000:]}"


def read_file(i, ctx):
    return Path(i["path"]).expanduser().read_text(encoding="utf-8", errors="replace")[:20000]


def write_file(i, ctx):
    p = Path(i["path"]).expanduser()
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "a" if i.get("append") else "w", encoding="utf-8") as f:
        f.write(i["content"])
    return f"Written: {p}"


def list_dir(i, ctx):
    p = Path(i["path"]).expanduser()
    items = sorted(p.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))[:200]
    return "\n".join(("[D] " if x.is_dir() else "    ") + x.name for x in items) or "(empty)"


def open_target(i, ctx):
    t = i["target"]
    if os.name == "nt":
        os.startfile(t)  # noqa: S606
    elif t.startswith("http"):
        webbrowser.open(t)
    else:
        subprocess.Popen([t])
    return f"Opened: {t}"


_state = {"scale": 1.0}


def _vision(image_bytes: bytes, question: str) -> str:
    import ollama

    r = ollama.Client(host=os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")).chat(
        model=VISION_MODEL,
        messages=[{"role": "user", "content": question, "images": [image_bytes]}],
    )
    return (r.message.content or "").strip()


def screenshot(i, ctx):
    import mss
    from PIL import Image

    with mss.mss() as s:
        shot = s.grab(s.monitors[1])
        img = Image.frombytes("RGB", shot.size, shot.bgra, "raw", "BGRX")
    full_w = img.width
    img.thumbnail((1280, 1280))
    _state["scale"] = full_w / img.width
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=70)
    q = i.get("question") or "Screen pe kya dikh raha hai? Khuli apps aur buttons ki list do, approx pixel coordinates ke saath."
    return f"(screenshot size {img.width}x{img.height}) " + _vision(buf.getvalue(), q)


def describe_image(i, ctx):
    if not ctx.image:
        return "Koi image attach nahi hai."
    return _vision(ctx.image, i.get("question") or "Is photo me kya hai? Detail me batao.")


def web_search(i, ctx):
    from ddgs import DDGS

    r = DDGS().text(i["query"], max_results=5)
    return "\n\n".join(f"{x.get('title')}\n{x.get('href')}\n{x.get('body')}" for x in r) or "Kuch nahi mila."


def gui_action(i, ctx):
    import pyautogui

    pyautogui.FAILSAFE = True  # mouse ko corner me le jao = emergency stop
    a, s = i["action"], _state["scale"]
    if a == "click":
        pyautogui.click(int(i["x"]) * s, int(i["y"]) * s, clicks=int(i.get("clicks", 1)))
    elif a == "type":
        text = i["text"]
        if text.isascii():
            pyautogui.write(text, interval=0.02)
        else:  # Hindi/unicode: clipboard se paste
            import pyperclip

            pyperclip.copy(text)
            pyautogui.hotkey("ctrl", "v")
    elif a == "hotkey":
        keys = i["keys"].split("+") if isinstance(i["keys"], str) else i["keys"]
        pyautogui.hotkey(*[k.strip() for k in keys])
    elif a == "scroll":
        pyautogui.scroll(int(i.get("amount", -500)))
    return f"Done: {a}"


def set_reminder(i, ctx):
    due = datetime.fromisoformat(i["when"].replace("T", " "))
    rid = memory.add_reminder(i["text"], due.timestamp())
    return f"Reminder #{rid} set for {due:%Y-%m-%d %H:%M}."


def list_reminders(i, ctx):
    r = memory.list_reminders()
    return "\n".join(f"#{x['id']} {datetime.fromtimestamp(x['due']):%Y-%m-%d %H:%M} - {x['text']}" for x in r) or "Koi pending reminder nahi."


def notify_phone(i, ctx):
    return send_ntfy(i.get("title", "Assistant"), i["message"])


def send_ntfy(title: str, message: str) -> str:
    if not NTFY_TOPIC:
        return "NTFY_TOPIC set nahi hai."
    req = urllib.request.Request(
        f"https://ntfy.sh/{NTFY_TOPIC}", data=message.encode("utf-8"),
        headers={"Title": title.encode("ascii", "ignore").decode() or "Assistant"},
    )
    urllib.request.urlopen(req, timeout=10).read()
    return "Phone pe bhej diya."


def _get_image(i, ctx):
    if i.get("source") == "webcam":
        return faces.webcam_frame()
    return faces.decode_image(ctx.image) if ctx.image else None


def face_enroll(i, ctx):
    img = _get_image(i, ctx)
    if img is None:
        return "Image nahi mili (photo attach karo ya webcam use karo)."
    return faces.enroll(img, i["name"].strip())


def face_identify(i, ctx):
    img = _get_image(i, ctx)
    if img is None:
        return "Image nahi mili."
    r = faces.identify(img)
    if not r:
        return "Koi face detect nahi hua."
    return "\n".join(f"{x['name']} (score {x['score']}, box {x['box']})" for x in r)


def face_list(i, ctx):
    return str(memory.face_names()) if memory.face_names() else "Koi face enrolled nahi."


def face_delete(i, ctx):
    return f"{memory.delete_face(i['name'])} sample(s) deleted."


REGISTRY = {f.__name__: f for f in [
    remember, recall, forget, run_shell, read_file, write_file, list_dir, open_target,
    screenshot, describe_image, web_search, gui_action, set_reminder, list_reminders, notify_phone,
    face_enroll, face_identify, face_list, face_delete,
]}


def execute(name: str, inp: dict, ctx: Ctx):
    fn = REGISTRY.get(name)
    if not fn:
        return f"Unknown tool: {name}"
    try:
        return fn(inp, ctx)
    except Exception as e:  # model ko error dikhao taaki wo recover kar sake
        return f"Error: {type(e).__name__}: {e}"


# Ollama / OpenAI-style tool format
OLLAMA_TOOLS = [
    {"type": "function", "function": {"name": t["name"], "description": t["description"],
                                       "parameters": t["input_schema"]}}
    for t in SCHEMAS
      ]
