"""
Love Compatibility Calculator - FastAPI Backend
Uses Zama's Concrete FHE for privacy-preserving compatibility computation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import secrets
import string
from typing import Dict
from datetime import datetime, timedelta

from .models import (
    CreateSessionRequest,
    CreateSessionResponse,
    JoinSessionRequest,
    JoinSessionResponse,
    SubmitAnswersRequest,
    SessionStatus,
    SessionStatusResponse,
    CompatibilityResult,
    QUESTIONS,
    get_compatibility_message
)
from .fhe_engine import get_compatibility_engine, NUM_QUESTIONS

app = FastAPI(
    title="Love Compatibility Calculator",
    description="Calculate your compatibility using Fully Homomorphic Encryption - your answers stay private!",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage (use Redis in production)
sessions: Dict[str, dict] = {}

# Session expiry time
SESSION_EXPIRY = timedelta(hours=24)


def generate_session_code(length: int = 6) -> str:
    """Generate a unique session code."""
    chars = string.ascii_uppercase + string.digits
    while True:
        code = ''.join(secrets.choice(chars) for _ in range(length))
        if code not in sessions:
            return code


def generate_person_id() -> str:
    """Generate a unique person ID."""
    return secrets.token_hex(8)


def cleanup_expired_sessions():
    """Remove expired sessions."""
    now = datetime.now()
    expired = [
        code for code, session in sessions.items()
        if now - session['created_at'] > SESSION_EXPIRY
    ]
    for code in expired:
        del sessions[code]


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "💕 Love Compatibility Calculator API",
        "status": "running",
        "fhe_enabled": True
    }


@app.get("/api/questions")
async def get_questions():
    """Get the list of questions."""
    return {"questions": QUESTIONS}


@app.post("/api/session/create", response_model=CreateSessionResponse)
async def create_session(request: CreateSessionRequest):
    """Create a new compatibility session."""
    cleanup_expired_sessions()

    session_code = generate_session_code()
    person_id = generate_person_id()

    sessions[session_code] = {
        "created_at": datetime.now(),
        "status": SessionStatus.WAITING,
        "person_a": {
            "id": person_id,
            "name": request.name,
            "answers": None
        },
        "person_b": None,
        "result": None
    }

    return CreateSessionResponse(
        session_code=session_code,
        person_id=person_id
    )


@app.post("/api/session/join", response_model=JoinSessionResponse)
async def join_session(request: JoinSessionRequest):
    """Join an existing session as Person B."""
    if request.session_code not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[request.session_code]

    if session["person_b"] is not None:
        raise HTTPException(status_code=400, detail="Session already has two participants")

    person_id = generate_person_id()

    session["person_b"] = {
        "id": person_id,
        "name": request.name,
        "answers": None
    }
    session["status"] = SessionStatus.PARTNER_JOINED

    return JoinSessionResponse(
        session_code=request.session_code,
        person_id=person_id,
        partner_name=session["person_a"]["name"]
    )


@app.post("/api/answers/submit")
async def submit_answers(request: SubmitAnswersRequest):
    """Submit encrypted answers for a session."""
    if request.session_code not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[request.session_code]

    # Validate answers
    if len(request.answers) != NUM_QUESTIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {NUM_QUESTIONS} answers, got {len(request.answers)}"
        )

    for answer in request.answers:
        if not (1 <= answer <= 5):
            raise HTTPException(status_code=400, detail="Answers must be between 1 and 5")

    # Determine which person is submitting
    if session["person_a"]["id"] == request.person_id:
        session["person_a"]["answers"] = request.answers
    elif session["person_b"] and session["person_b"]["id"] == request.person_id:
        session["person_b"]["answers"] = request.answers
    else:
        raise HTTPException(status_code=403, detail="Invalid person ID for this session")

    # Check if both have submitted and compute compatibility
    if (session["person_a"]["answers"] is not None and
        session["person_b"] is not None and
        session["person_b"]["answers"] is not None):

        session["status"] = SessionStatus.COMPUTING

        # Get FHE engine and compute compatibility
        engine = get_compatibility_engine()

        try:
            # This computation happens on encrypted data with real FHE
            score = engine.compute_compatibility(
                session["person_a"]["answers"],
                session["person_b"]["answers"]
            )

            session["result"] = {
                "score": score,
                "message": get_compatibility_message(score)
            }
            session["status"] = SessionStatus.COMPLETED

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"FHE computation failed: {str(e)}")

    return {"status": "success", "message": "Answers submitted successfully"}


@app.get("/api/session/{session_code}/status", response_model=SessionStatusResponse)
async def get_session_status(session_code: str):
    """Get the current status of a session."""
    if session_code not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_code]

    response = SessionStatusResponse(
        status=session["status"],
        person_a_name=session["person_a"]["name"],
        person_a_submitted=session["person_a"]["answers"] is not None
    )

    if session["person_b"]:
        response.person_b_name = session["person_b"]["name"]
        response.person_b_submitted = session["person_b"]["answers"] is not None

    if session["result"]:
        response.compatibility_score = session["result"]["score"]
        response.message = session["result"]["message"]

    return response


@app.get("/api/session/{session_code}/result", response_model=CompatibilityResult)
async def get_result(session_code: str):
    """Get the compatibility result for a completed session."""
    if session_code not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_code]

    if session["status"] != SessionStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Session not yet completed")

    if session["result"] is None:
        raise HTTPException(status_code=500, detail="Result not available")

    return CompatibilityResult(
        score=session["result"]["score"],
        message=session["result"]["message"],
        person_a_name=session["person_a"]["name"],
        person_b_name=session["person_b"]["name"]
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
