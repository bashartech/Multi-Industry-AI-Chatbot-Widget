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
genai.configure(api_key="AIzaSyCLjYNZyc4NvtF_bBLBSUFmKdt1XBj1fDs")
model = genai.GenerativeModel("gemini-2.5-flash")

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

try:
    # Try to load from current directory first, then from parent directory
    import os
    service_account_path = "serviceAccountKey.json"
    if not os.path.exists(service_account_path):
        service_account_path = "../serviceAccountKey.json"
    
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Firebase initialization error: {e}")
    db = None

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
    try:
        response = model.generate_content(text)
        return response.text
    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}"

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
            # Detect industry from the message content to override the session industry if needed
            detected_industry = session["industry"]  # Default to existing industry
            
            # Try to detect industry based on keywords in the message
            # Order matters - check more specific terms first
            if any(keyword in lower_msg for keyword in ["real estate", "property", "apartment", "house", "flat", "home"]) or \
               (any(keyword in lower_msg for keyword in ["buy", "rent"]) and 
                any(keyword in lower_msg for keyword in ["house", "apartment", "flat", "property", "real estate", "home"])):
                detected_industry = "real_estate"
            elif any(keyword in lower_msg for keyword in ["appointment", "doctor", "medical", "health", "consultation", "hospital", "clinic"]):
                detected_industry = "healthcare"
            elif any(keyword in lower_msg for keyword in ["book", "room", "hotel", "reservation", "stay", "night"]):
                detected_industry = "hotel"
            
            # Update the session industry if a different one was detected
            session["industry"] = detected_industry
            
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

    if db:
        lead_data = {
            "industry": session["industry"],
            **session["data"],
            "transcript": session["history"],
            "status": "new",
            "createdAt": datetime.utcnow()
        }

        db.collection("leads").add(lead_data)
 
    # Clean up session after saving
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

# -----------------------------------
# LEAD ENDPOINT
# -----------------------------------

class LeadRequest(BaseModel):
    name: str
    email: str
    phone: str = ""
    query: str = ""

@app.post("/lead")
def save_lead(req: LeadRequest):
    if db:
        lead_data = {
            "name": req.name,
            "email": req.email,
            "phone": req.phone,
            "query": req.query,
            "status": "new",
            "source": "lead_capture_form",
            "createdAt": datetime.utcnow()
        }

        db.collection("leads").add(lead_data)

        return {"success": True}
    else:
        return {"success": False, "error": "Database not available"}

# -----------------------------------
# RUN SERVER
# -----------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
