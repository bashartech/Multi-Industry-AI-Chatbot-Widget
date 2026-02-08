

# backend page 

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
from datetime import datetime

# -----------------------------------
# LOAD ENV
# -----------------------------------

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

# -----------------------------------
# FASTAPI INIT
# -----------------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------
# FIREBASE INIT
# -----------------------------------

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# -----------------------------------
# SESSION MEMORY
# -----------------------------------

sessions = {}

# -----------------------------------
# INDUSTRY FLOWS
# -----------------------------------

FLOWS = {
    "hotel": ["roomType", "checkIn", "checkOut", "name", "phone"],
    "real_estate": ["purpose", "city", "budget", "name", "phone"],
    "healthcare": ["problem", "doctor", "date", "name", "phone"]
}

QUESTIONS = {
    "roomType": "Which room type do you want?",
    "checkIn": "What is your check-in date?",
    "checkOut": "What is your check-out date?",
    "purpose": "Do you want to buy or rent?",
    "city": "Which city are you looking in?",
    "budget": "What is your budget?",
    "problem": "What problem are you facing?",
    "doctor": "Which doctor do you want to consult?",
    "date": "Preferred appointment date?",
    "name": "What is your name?",
    "phone": "What is your phone number?"
}

# -----------------------------------
# KEYWORDS THAT START FORM MODE
# -----------------------------------

TRIGGER_WORDS = [
    "book", "appointment", "buy", "rent",
    "reserve", "schedule"
]

# -----------------------------------
# MODELS
# -----------------------------------

class ChatRequest(BaseModel):
    message: str
    industry: str
    sessionId: str

# -----------------------------------
# AI CHAT FUNCTION
# -----------------------------------

def ai_reply(text):
    response = model.generate_content(text)
    return response.text

# -----------------------------------
# CHAT ENDPOINT
# -----------------------------------

@app.post("/chat")
def chat(req: ChatRequest):

    # Create session if new
    if req.sessionId not in sessions:
        sessions[req.sessionId] = {
            "industry": req.industry,
            "mode": "chat",        # chat | form
            "step": 0,
            "data": {},
            "history": []
        }

    session = sessions[req.sessionId]

    # Save user message
    session["history"].append({
        "role": "user",
        "text": req.message
    })

    # -----------------------------------
    # CHAT MODE (GENERAL QUESTIONS)
    # -----------------------------------

    if session["mode"] == "chat":

        lower_msg = req.message.lower()

        if any(word in lower_msg for word in TRIGGER_WORDS):
            session["mode"] = "form"
            session["step"] = 0
            first_field = FLOWS[session["industry"]][0]
            question = QUESTIONS[first_field]

            session["history"].append({
                "role": "bot",
                "text": question
            })

            return {
                "reply": question,
                "completed": False
            }

        reply = ai_reply(req.message)

        session["history"].append({
            "role": "bot",
            "text": reply
        })

        return {
            "reply": reply,
            "completed": False
        }

    # -----------------------------------
    # FORM MODE (SLOT FILLING)
    # -----------------------------------

    flow = FLOWS[session["industry"]]
    step = session["step"]

    field_name = flow[step]
    session["data"][field_name] = req.message
    session["step"] += 1

    if session["step"] < len(flow):
        next_field = flow[session["step"]]
        question = QUESTIONS[next_field]

        session["history"].append({
            "role": "bot",
            "text": question
        })

        return {
            "reply": question,
            "completed": False
        }

    # -----------------------------------
    # SAVE TO FIREBASE
    # -----------------------------------

    lead_data = {
        "industry": session["industry"],
        **session["data"],
        "transcript": session["history"],
        "status": "new",
        "createdAt": datetime.utcnow()
    }

    db.collection("leads").add(lead_data)

    del sessions[req.sessionId]

    return {
        "reply": "Thank you! Our team will contact you shortly.",
        "completed": True
    }

# -----------------------------------
# HEALTH CHECK
# -----------------------------------

@app.get("/")
def root():
    return {"status": "Chatbot Backend Running"}
