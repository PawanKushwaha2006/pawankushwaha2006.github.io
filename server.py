"""FastAPI server: phone UI + WebSocket chat + approvals + reminder scheduler.
Run: python server.py
"""
import asyncio
import base64
import os
import secrets
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse

import agent
import memory
import tools

BASE = Path(__file__).parent
TOKEN = os.getenv("ASSISTANT_TOKEN", "")
if len(TOKEN) < 12:
    raise SystemExit("ASSISTANT_TOKEN set karo (kam se kam 12 chars). Ye shell access ka password hai.")

clients: set[WebSocket] = set()
pending: dict[str, asyncio.Future] = {}


async def reminder_loop():
    while True:
        for r in memory.due_reminders():
            try:
                await asyncio.to_thread(tools.send_ntfy, "Reminder", r["text"])
            except Exception:
                pass
            for ws in list(clients):
                try:
                    await ws.send_json({"type": "reminder", "text": r["text"]})
                except Exception:
                    clients.discard(ws)
            memory.mark_done(r["id"])
        await asyncio.sleep(15)


@asynccontextmanager
async def lifespan(_):
    task = asyncio.create_task(reminder_loop())
    yield
    task.cancel()


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def index():
    p = BASE / "static" / "index.html"
    return FileResponse(p if p.exists() else BASE / "index.html")


async def handle_chat(msg: dict, send, approve):
    img = None
    if msg.get("image"):
        img = base64.b64decode(msg["image"].split(",", 1)[-1])
    try:
        reply = await agent.run_turn("default", (msg.get("text") or "").strip(), img, send, approve)
        await send({"type": "reply", "text": reply})
    except Exception as e:
        await send({"type": "error", "text": f"{type(e).__name__}: {e}"})


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    if not secrets.compare_digest(ws.query_params.get("token", ""), TOKEN):
        await ws.close(code=4401)
        return
    clients.add(ws)

    async def send(m: dict):
        await ws.send_json(m)

    async def approve(name: str, inp: dict) -> bool:
        aid = uuid.uuid4().hex
        fut = asyncio.get_running_loop().create_future()
        pending[aid] = fut
        await send({"type": "approve", "id": aid, "name": name, "input": inp})
        try:
            return await asyncio.wait_for(fut, 120)
        except asyncio.TimeoutError:
            return False
        finally:
            pending.pop(aid, None)

    task: asyncio.Task | None = None
    try:
        while True:
            msg = await ws.receive_json()
            if msg.get("type") == "approval":
                fut = pending.get(msg.get("id"))
                if fut and not fut.done():
                    fut.set_result(bool(msg.get("ok")))
            elif msg.get("type") == "chat":
                if task and not task.done():
                    await send({"type": "error", "text": "Pichla kaam chal raha hai, ruko."})
                    continue
                task = asyncio.create_task(handle_chat(msg, send, approve))
    except WebSocketDisconnect:
        pass
    finally:
        clients.discard(ws)
        if task and not task.done():
            task.cancel()


if __name__ == "__main__":
    # Default sirf localhost. Phone ke liye Tailscale Serve use karo (README dekho).
    uvicorn.run(app, host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", "8000")))
