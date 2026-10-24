# Personal AI Assistant: 100% free / open-source (Windows brain + Android phone UI)

Laptop pe server chalta hai: local LLM (Ollama) + tools + SQLite memory + OpenCV face recognition.
Phone browser/PWA se use karo. Koi paid API nahi.

## Free stack
Ollama (LLM, local) | OpenCV YuNet+SFace (faces) | SQLite (memory) | DuckDuckGo (search) |
Tailscale personal plan (phone access) | ntfy.sh (phone notifications)

## Setup (Windows)

1. Ollama install karo: https://ollama.com/download, phir PowerShell me:
   ```powershell
   ollama pull qwen2.5:7b        # main dimaag (tool calling). ~4.7 GB
   ollama pull qwen2.5vl:7b      # aankhen (screenshot/photo samajhna). ~6 GB, optional
   ```
   Kamzor PC (8 GB RAM, GPU nahi): `qwen2.5:3b` use karo (`$env:ASSISTANT_MODEL="qwen2.5:3b"`), par wo kam reliable hai.
2. Project:
   ```powershell
   cd pawan-assistant-free
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   $env:ASSISTANT_TOKEN = "koi-lamba-random-password"   # min 12 chars
   $env:NTFY_TOPIC      = "pawan-assistant-xyz123"      # optional
   python server.py
   ```
3. Laptop pe test: http://127.0.0.1:8000

## Phone se access
1. Dono devices pe Tailscale install karo, same account se login.
2. Laptop: `tailscale serve --bg 8000` -> milega `https://<laptop>.<tailnet>.ts.net`
3. Phone Chrome me kholo, token daalo, "Add to Home screen". Phone pe `ntfy` app me apna topic subscribe karo.
`index.html` `static/` folder me ho ya project root me, dono chalega.

## Env vars
ASSISTANT_MODEL (default qwen2.5:7b) | VISION_MODEL (qwen2.5vl:7b) | OLLAMA_HOST | ASSISTANT_NUM_CTX (8192)
HOST/PORT (default 127.0.0.1:8000)

## Honest limits
- 7B local model Claude/GPT jaisa smart nahi: lambe multi-step tasks me galti kar sakta hai. Isiliye shell/file-write/GUI pe har baar Allow/Deny aata hai.
- GUI mouse control experimental hai (vision model ke coordinates approximate hote hain). Shell, open_target aur hotkeys zyada reliable.
- Behtar model chahiye (GPU 12 GB+): `qwen2.5:14b` ya `qwen3:14b`.
- Face data sirf local DB me; sirf sahmati wale logon ko enroll karo.
