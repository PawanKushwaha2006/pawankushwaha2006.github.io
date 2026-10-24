"""Persistent memory: facts (FTS5 search), chat history, reminders, face embeddings.
Sab kuch ek SQLite file me: ~/.pawan_assistant/assistant.db
"""
import os
import re
import sqlite3
import threading
import time
from pathlib import Path

DB_PATH = Path(os.getenv("ASSISTANT_DB", Path.home() / ".pawan_assistant" / "assistant.db"))
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

_lock = threading.RLock()
_db = sqlite3.connect(DB_PATH, check_same_thread=False)
_db.row_factory = sqlite3.Row
_db.executescript(
    """
CREATE TABLE IF NOT EXISTS facts(id INTEGER PRIMARY KEY, text TEXT NOT NULL, created REAL NOT NULL);
CREATE VIRTUAL TABLE IF NOT EXISTS facts_fts USING fts5(text);
CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY, session TEXT, role TEXT, text TEXT, ts REAL);
CREATE TABLE IF NOT EXISTS reminders(id INTEGER PRIMARY KEY, text TEXT, due REAL, done INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS faces(id INTEGER PRIMARY KEY, name TEXT, emb BLOB, ts REAL);
"""
)
_db.commit()


# ---------- facts ----------
def add_fact(text: str) -> int:
    with _lock:
        cur = _db.execute("INSERT INTO facts(text, created) VALUES(?,?)", (text, time.time()))
        _db.execute("INSERT INTO facts_fts(rowid, text) VALUES(?,?)", (cur.lastrowid, text))
        _db.commit()
        return cur.lastrowid


def delete_fact(fact_id: int) -> bool:
    with _lock:
        cur = _db.execute("DELETE FROM facts WHERE id=?", (fact_id,))
        _db.execute("DELETE FROM facts_fts WHERE rowid=?", (fact_id,))
        _db.commit()
        return cur.rowcount > 0


def _fts_query(q: str) -> str:
    toks = [t for t in re.findall(r"\w+", q.lower()) if len(t) > 2][:12]
    return " OR ".join(f'"{t}"' for t in toks)


def search_facts(q: str, k: int = 8) -> list[dict]:
    fq = _fts_query(q)
    if not fq:
        return []
    with _lock:
        rows = _db.execute(
            "SELECT f.id, f.text FROM facts_fts JOIN facts f ON f.id = facts_fts.rowid "
            "WHERE facts_fts MATCH ? ORDER BY bm25(facts_fts) LIMIT ?",
            (fq, k),
        ).fetchall()
    return [dict(r) for r in rows]


def recent_facts(k: int = 5) -> list[dict]:
    with _lock:
        rows = _db.execute("SELECT id, text FROM facts ORDER BY id DESC LIMIT ?", (k,)).fetchall()
    return [dict(r) for r in rows]


def relevant(text: str) -> str:
    """Prompt me inject hone wala memory block: relevant + recent facts."""
    seen, out = set(), []
    for f in search_facts(text, 8) + recent_facts(5):
        if f["id"] not in seen:
            seen.add(f["id"])
            out.append(f"- [{f['id']}] {f['text']}")
    return "\n".join(out) if out else "(abhi kuch saved nahi)"


# ---------- chat history ----------
def add_msg(session: str, role: str, text: str) -> None:
    with _lock:
        _db.execute(
            "INSERT INTO messages(session, role, text, ts) VALUES(?,?,?,?)",
            (session, role, text, time.time()),
        )
        _db.commit()


def history(session: str, n: int = 20) -> list[dict]:
    with _lock:
        rows = _db.execute(
            "SELECT role, text FROM messages WHERE session=? ORDER BY id DESC LIMIT ?",
            (session, n),
        ).fetchall()
    msgs = [{"role": r["role"], "content": r["text"]} for r in reversed(rows)]
    while msgs and msgs[0]["role"] != "user":
        msgs.pop(0)
    return msgs


# ---------- reminders ----------
def add_reminder(text: str, due_ts: float) -> int:
    with _lock:
        cur = _db.execute("INSERT INTO reminders(text, due) VALUES(?,?)", (text, due_ts))
        _db.commit()
        return cur.lastrowid


def due_reminders() -> list[dict]:
    with _lock:
        rows = _db.execute(
            "SELECT id, text FROM reminders WHERE done=0 AND due<=?", (time.time(),)
        ).fetchall()
    return [dict(r) for r in rows]


def mark_done(rid: int) -> None:
    with _lock:
        _db.execute("UPDATE reminders SET done=1 WHERE id=?", (rid,))
        _db.commit()


def list_reminders() -> list[dict]:
    with _lock:
        rows = _db.execute("SELECT id, text, due FROM reminders WHERE done=0 ORDER BY due").fetchall()
    return [dict(r) for r in rows]


# ---------- faces ----------
def add_face(name: str, emb: bytes) -> None:
    with _lock:
        _db.execute("INSERT INTO faces(name, emb, ts) VALUES(?,?,?)", (name, emb, time.time()))
        _db.commit()


def all_faces() -> list[tuple[str, bytes]]:
    with _lock:
        rows = _db.execute("SELECT name, emb FROM faces").fetchall()
    return [(r["name"], r["emb"]) for r in rows]


def face_names() -> dict[str, int]:
    with _lock:
        rows = _db.execute("SELECT name, COUNT(*) c FROM faces GROUP BY name").fetchall()
    return {r["name"]: r["c"] for r in rows}


def delete_face(name: str) -> int:
    with _lock:
        cur = _db.execute("DELETE FROM faces WHERE name=?", (name,))
        _db.commit()
        return cur.rowcount
