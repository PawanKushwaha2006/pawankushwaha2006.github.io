import random
import datetime
import urllib.request
import json

BOT_NAME = " Naughty AI "

# ===== NAYI CHABI - YzQA WALI =====
API_KEY = "AQ.Ab8RN6IB7uBoXPgBGvOh4HYh2GummYlxCSKSdtSLmtmkfOYzQA"
API_KEY = API_KEY.strip().replace(" ", "").replace("\n", "")
# ==================================

def ai_reply(message):
    # Sahi model + sahi version
    tries = [
        ("v1beta", "gemini-3.8-flash"),
        ("v1beta", "gemini-3.5-flash"),
        ("v1beta", "gemini-3.7-flash"),
        ("v1", "gemini-2.5-flash"),
        ("v1", "gemini-3.5-flash"),
    ]
    for version, model in tries:
        try:
            url = "https://generativelanguage.googleapis.com/" + version + "/models/" + model + ":generateContent?key=" + API_KEY
            data = {
                "contents": [{"parts": [{"text": "Tum Naughty AI ho, Hinglish me jawab do. Sawal: " + message}]}]
            }
            req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=15) as response:
                result = json.loads(response.read().decode('utf-8'))
                return result["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(version, model, "fail:", e)
            continue
    return None

def reply(message):
    msg = message.lower().strip()
    msg = msg.replace("?", "").replace("!", "").replace(".", "")

    if not msg:
        return "Kuchh likho, main jawab dunga!"

    ai = ai_reply(message)
    if ai:
        return ai

    if any(x in msg for x in ["hello", "hi", "hey", "namaste"]):
        return random.choice([
            "Hello! Kaise ho? 😊",
            "Namaste! Batao kya haal hai?",
            "Hey! Aaj kya baat karein?"
        ])

    if any(x in msg for x in ["tumhara naam", "tumhara nam", "aapka naam", "aapka nam", "your name", "who are you"]):
        return f"Mera naam {BOT_NAME} hai! 🤖"

    if any(x in msg for x in ["kaise ho", "kese ho", "how are you"]):
        return "Main badhiya hoon! Tum kaise ho? 😊"

    if any(x in msg for x in ["main thik hu", "mai thik hu", "main theek hu", "i am fine"]):
        return "Bahut badhiya! Aaj kya kar rahe ho?"

    if "time" in msg or "samay" in msg:
        return datetime.datetime.now().strftime("%I:%M %p")

    if "date" in msg or "tarikh" in msg:
        return datetime.datetime.now().strftime("%d-%m-%Y")

    if "python" in msg:
        return "Python ek powerful programming language hai! 🐍"

    if any(x in msg for x in ["bye", "goodbye", "alvida"]):
        return "Bye! Phir milenge. 👋"

    return "Achha! 😊 Main abhi ye baat nahi samajh paya. Thoda alag tarike se poochho."

print("=" * 35)
print("WELCOME TO Naughty AI")
print("Ab mai Asli AI hu! Kuch bhi pucho")
print("Band karne ke liye exit likho.")
print("=" * 35)

while True:
    user = input("\nYou: ")

    if user.lower().strip() == "exit":
        print("Naughty AI: Bye! 👋")
        break

    print(" Naughty AI:", reply(user))
