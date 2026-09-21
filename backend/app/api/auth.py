from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.database.store import store
from app.database.models import User

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    age: Optional[int] = 21
    city: Optional[str] = "Bengaluru"
    occupation: Optional[str] = "Software Engineer"

class AuthResponse(BaseModel):
    token: str
    user: User
    message: str

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    # In-memory / demo auth
    for u in store.users.values():
        if u.email.lower() == req.email.lower():
            return AuthResponse(
                token=u.token or "session-token-valid",
                user=u,
                message="Login successful"
            )
    # If not found, check if it's the demo email or create new session
    if "demo" in req.email.lower() or "aarav" in req.email.lower():
        u = store.get_user("user_demo_21")
        return AuthResponse(
            token=u.token,
            user=u,
            message="Logged in as Demo User"
        )
    
    # Auto-provision user for seamless hackathon testing
    new_user = User(
        id=f"user_{len(store.users)+1}",
        name=req.email.split("@")[0].capitalize(),
        email=req.email,
        token="generated-session-token"
    )
    store.users[new_user.id] = new_user
    store.get_profile(new_user.id)  # initializes profile
    return AuthResponse(token=new_user.token, user=new_user, message="Welcome to FINORA!")

@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest):
    new_user = User(
        id=f"user_{len(store.users)+1}",
        name=req.name,
        email=req.email,
        age=req.age or 21,
        city=req.city or "Bengaluru",
        occupation=req.occupation or "Professional",
        token=f"token_{req.email}"
    )
    store.users[new_user.id] = new_user
    store.get_profile(new_user.id)
    return AuthResponse(token=new_user.token, user=new_user, message="Account created successfully")

@router.post("/demo", response_model=AuthResponse)
def demo_login():
    """1-Click Demo Login for hackathon judges"""
    store.seed_demo_user()
    demo_user = store.get_user("user_demo_21")
    return AuthResponse(
        token=demo_user.token,
        user=demo_user,
        message="Demo session loaded with realistic young Indian financial profile"
    )

@router.get("/me", response_model=User)
def get_current_user():
    return store.get_user("user_demo_21")
