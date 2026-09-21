import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.auth import router as auth_router
from app.api.financial import router as financial_router
from app.api.copilot import router as copilot_router
from app.api.multimodal import router as multimodal_router

load_dotenv()

app = FastAPI(
    title="FINORA API - Financial Decision Intelligence Platform",
    description="AI-powered financial decision assistant built for young Indians. Answers 'If I make this decision, what happens to my future finances?'",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(financial_router)
app.include_router(copilot_router)
app.include_router(multimodal_router)

@app.get("/")
def root():
    return {
        "app": "FINORA",
        "tagline": "Think Before You Spend",
        "supporting_tagline": "An AI financial decision assistant built for the way young Indians earn, spend, borrow, save and invest.",
        "status": "operational",
        "gemini_model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "finora-backend"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
