from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class SessionStatus(str, Enum):
    WAITING = "waiting"
    PARTNER_JOINED = "partner_joined"
    COMPUTING = "computing"
    COMPLETED = "completed"

class CreateSessionRequest(BaseModel):
    name: str

class CreateSessionResponse(BaseModel):
    session_code: str
    person_id: str

class JoinSessionRequest(BaseModel):
    session_code: str
    name: str

class JoinSessionResponse(BaseModel):
    session_code: str
    person_id: str
    partner_name: str

class SubmitAnswersRequest(BaseModel):
    session_code: str
    person_id: str
    answers: List[int]  # 10 answers, each 1-5

class SessionStatusResponse(BaseModel):
    status: SessionStatus
    person_a_name: Optional[str] = None
    person_b_name: Optional[str] = None
    person_a_submitted: bool = False
    person_b_submitted: bool = False
    compatibility_score: Optional[int] = None
    message: Optional[str] = None

class CompatibilityResult(BaseModel):
    score: int
    message: str
    person_a_name: str
    person_b_name: str

QUESTIONS = [
    {
        "id": 1,
        "question": "Are you a morning person or a night owl?",
        "emoji": "🌙",
        "min_label": "Early bird",
        "max_label": "Night owl"
    },
    {
        "id": 2,
        "question": "Do you prefer cozy nights in or going out?",
        "emoji": "🏠",
        "min_label": "Stay home",
        "max_label": "Go out"
    },
    {
        "id": 3,
        "question": "How much do you value privacy in a relationship?",
        "emoji": "🔐",
        "min_label": "Share everything",
        "max_label": "Keep some secrets"
    },
    {
        "id": 4,
        "question": "Would you trust a system that protects your secrets even from itself?",
        "emoji": "✨",
        "min_label": "Sounds weird",
        "max_label": "That's amazing"
    },
    {
        "id": 5,
        "question": "Would you like to be a Zama Champ?",
        "emoji": "🏆",
        "min_label": "Maybe later",
        "max_label": "Absolutely yes!"
    }
]

COMPATIBILITY_MESSAGES = {
    (90, 100): "💖 Perfect Match! You two are soulmates written in the stars!",
    (75, 89): "💕 Amazing Connection! You complement each other beautifully!",
    (60, 74): "💗 Strong Potential! With understanding, you can build something special!",
    (45, 59): "💓 Interesting Mix! Opposites attract, embrace your differences!",
    (30, 44): "💔 Challenging Match! It'll take work, but love conquers all!",
    (0, 29): "🔥 Spicy Combo! You're very different, but that makes it exciting!"
}

def get_compatibility_message(score: int) -> str:
    for (min_score, max_score), message in COMPATIBILITY_MESSAGES.items():
        if min_score <= score <= max_score:
            return message
    return "💝 Love is unpredictable!"
