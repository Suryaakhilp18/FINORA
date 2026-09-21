from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.ai.gemini_service import gemini_service
from app.database.store import store
from app.financial_engine.calculator import FinancialEngine

router = APIRouter(prefix="/api/multimodal", tags=["Multimodal AI"])

@router.post("/upload")
async def process_document_or_image(
    file: UploadFile = File(...),
    document_type: Optional[str] = Form("auto"),
    user_id: Optional[str] = Form("user_demo_21")
):
    try:
        content = await file.read()
        mime_type = file.content_type or "image/jpeg"
        
        # Multimodal Gemini extraction
        extracted = gemini_service.extract_from_image_or_doc(content, mime_type)
        
        amount = extracted.get("amount") or 65000.0
        product = extracted.get("product_or_merchant") or "Detected Product"

        # Pre-calculate immediate affordability
        profile = store.get_profile(user_id)
        inc = profile.income.monthly_income
        exp = (
            profile.expenses.rent + profile.expenses.food + profile.expenses.transport +
            profile.expenses.shopping + profile.expenses.entertainment + profile.expenses.utilities +
            profile.expenses.subscriptions + profile.expenses.healthcare + profile.expenses.other_recurring
        )
        ob = profile.obligations.existing_emi + profile.obligations.credit_card_payments
        savings = profile.assets.total_liquid_savings

        scenarios = FinancialEngine.simulate_scenarios(
            price=amount,
            product_name=product,
            current_savings=savings,
            monthly_income=inc,
            monthly_expenses=exp,
            existing_obligations=ob
        )

        return {
            "status": "success",
            "filename": file.filename,
            "extracted": extracted,
            "quick_summary": f"Detected: {product} for ₹{amount:,.0f}",
            "quick_scenarios": [s.model_dump() for s in scenarios[:2]]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multimodal processing error: {str(e)}")
