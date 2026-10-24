"""Multi-step agent loop: local LLM (Ollama, free/open-source) + tools + persistent memory."""
import asyncio
import os
import platform
from datetime import datetime

import ollama

import memory
import tools

MODEL = os.getenv("ASSISTANT_MODEL", "qwen2.5:7b")  # tool-calling wala model chahiye
NUM_CTX = int(os.getenv("ASSISTANT_NUM_CTX", "8192"))
MAX_STEPS = int(os.getenv("ASSISTANT_MAX_STEPS", "12"))
USER_NAME = os.getenv("USER_NAME", "Pawan")

client = ollama.AsyncClient(host=os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434"))

SYSTEM = """Tum {user}'s personal AI assistant ho. Tum unke Windows laptop pe chalte ho aur wo tumse Android phone se baat karte hain.
Aaj: {now} | Laptop OS: {os}

Rules:
- User jis language me likhe (Hinglish/Hindi/English) usi me chhota jawab do.
- Kaam multi-step ho to ek-ek tool call karo, result dekho, phir agla step. Kaam poora hone par hi final jawab do.
- Tool arguments exact aur poore do. Tool ka naam ya result kabhi mat banao. Jo tool list me nahi hai wo mat bulao.
- Mouse-click se pehle shell commands, open_target aur keyboard hotkeys prefer karo (zyada reliable).
- Durable facts/preferences milte hi `remember` karo. Passwords, card numbers, secrets kabhi nahi.
- Current info ke liye web_search use karo. Photo ke baare me sawal ho to describe_image.
- run_shell, write_file, gui_action pe user approval maangi jaati hai. Deny ho to wo action mat dohrao.
- Destructive ya unclear kaam (delete, bhejna) se pehle user se confirm karo.
- Face recognition sirf enrolled faces se. Kisi ko enroll tabhi karo jab user bataye ki us insaan ki sahmati hai.

Saved memory (relevant + recent):
{facts}
"""


def _trim(text) -> str:
    text = str(text)
    return text if len(text) <= 8000 else text[:8000] + "\n...[truncated]"


async def run_turn(session: str, text: str, image: bytes | None, send, approve) -> str:
    """send(dict) UI ko events bhejta hai; approve(name, input) -> bool user se permission maangta hai."""
    ctx = tools.Ctx(image=image)
    system = SYSTEM.format(
        user=USER_NAME,
        now=datetime.now().strftime("%A, %d %B %Y %H:%M"),
        os=platform.platform(),
        facts=memory.relevant(text),
    )
    user_text = text or "(image attached)"
    if image:
        user_text += "\n[User ne photo attach ki hai. Chehre ke liye face_identify/face_enroll (source=attached), photo samajhne ke liye describe_image use karo.]"

    messages = [{"role": "system", "content": system}]
    messages += memory.history(session, 16)
    messages.append({"role": "user", "content": user_text})

    final = ""
    for _ in range(MAX_STEPS):
        resp = await client.chat(
            model=MODEL,
            messages=messages,
            tools=tools.OLLAMA_TOOLS,
            options={"temperature": 0.3, "num_ctx": NUM_CTX},
        )
        msg = resp.message
        messages.append(msg)
        calls = msg.tool_calls or []
        if not calls:
            final = (msg.content or "").strip()
            break

        for c in calls:
            name, args = c.function.name, dict(c.function.arguments or {})
            await send({"type": "tool", "name": name, "input": args})
            if name in tools.NEEDS_APPROVAL and not await approve(name, args):
                out = "User ne permission deny kar di. Ye action mat karo."
            else:
                out = await asyncio.to_thread(tools.execute, name, args, ctx)
            messages.append({"role": "tool", "tool_name": name, "content": _trim(out)})
    else:
        final = "Step limit reach ho gaya, kaam adhoora ho sakta hai."

    final = final or "Done."
    memory.add_msg(session, "user", (text or "") + (" [image attached]" if image else ""))
    memory.add_msg(session, "assistant", final)
    return final
