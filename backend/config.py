import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables
load_dotenv()

class Settings:
    # Google Generative AI
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")

    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "")

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    # AI Model Settings
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gemini-pro")
    AI_TEMPERATURE: float = float(os.getenv("AI_TEMPERATURE", "0.7"))
    AI_MAX_OUTPUT_TOKENS: int = int(os.getenv("AI_MAX_OUTPUT_TOKENS", "1000"))

    # Safety Settings
    HARM_CATEGORY_HATE_SPEECH_THRESHOLD: str = os.getenv("HARM_CATEGORY_HATE_SPEECH_THRESHOLD", "BLOCK_MEDIUM_AND_ABOVE")
    HARM_CATEGORY_DANGEROUS_CONTENT_THRESHOLD: str = os.getenv("HARM_CATEGORY_DANGEROUS_CONTENT_THRESHOLD", "BLOCK_MEDIUM_AND_ABOVE")
    HARM_CATEGORY_HARASSMENT_THRESHOLD: str = os.getenv("HARM_CATEGORY_HARASSMENT_THRESHOLD", "BLOCK_MEDIUM_AND_ABOVE")
    HARM_CATEGORY_SEXUALLY_EXPLICIT_THRESHOLD: str = os.getenv("HARM_CATEGORY_SEXUALLY_EXPLICIT_THRESHOLD", "BLOCK_MEDIUM_AND_ABOVE")

settings = Settings()