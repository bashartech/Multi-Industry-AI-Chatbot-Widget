from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

class SenderType(str, Enum):
    user = "user"
    bot = "bot"

class Message(BaseModel):
    id: str
    text: str
    sender: SenderType
    timestamp: datetime
    is_fallback: Optional[bool] = False

class ChatRequest(BaseModel):
    message: str
    user_info: Optional[dict] = None
    conversation_history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    success: bool
    message: str
    is_fallback: Optional[bool] = False
    conversation_id: Optional[str] = None

class LeadRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    query: Optional[str] = ""
    source: Optional[str] = "chatbot"

class LeadResponse(BaseModel):
    success: bool
    message: str
    lead_id: Optional[str] = None

class AdminEscalationRequest(BaseModel):
    user_info: dict
    conversation: List[dict]
    reason: Optional[str] = "Unresolved query"

class AdminEscalationResponse(BaseModel):
    success: bool
    message: str
    escalation_id: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str = "1.0.0"