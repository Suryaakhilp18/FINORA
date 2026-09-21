from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.database.store import store
from app.ai.gemini_service import gemini_service
from app.financial_engine.calculator import FinancialEngine

router = APIRouter(prefix="/api/copilot", tags=["AI Copilot"])

class CopilotQueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "user_demo_21"
    context: Optional[Dict[str, Any]] = None

class NegotiateRequest(BaseModel):
    user_id: Optional[str] = "user_demo_21"
    product_name: str
    price: float
    counterfactual_query: str

@router.post("/ask")
def ask_copilot(req: CopilotQueryRequest):
    user_id = req.user_id or "user_demo_21"
    profile = store.get_profile(user_id)
    inc = profile.income.monthly_income
    exp = (
        profile.expenses.rent + profile.expenses.food + profile.expenses.transport +
        profile.expenses.shopping + profile.expenses.entertainment + profile.expenses.utilities +
        profile.expenses.subscriptions + profile.expenses.healthcare + profile.expenses.other_recurring
    )
    ob = (
        profile.obligations.existing_emi + profile.obligations.credit_card_payments +
        profile.obligations.upcoming_bills + profile.obligations.insurance
    )
    savings = profile.assets.total_liquid_savings
    surplus = FinancialEngine.calculate_surplus(inc, exp, ob)
    buffer = FinancialEngine.calculate_emergency_buffer(savings, exp + ob)

    # 1. Intent Detection with Gemini
    intent_data = gemini_service.parse_intent(req.query)
    
    # 2. Extract item details
    product = intent_data.get("product") or "Item"
    amount = intent_data.get("amount") or 65000.0
    intent_type = intent_data.get("intent", "PURCHASE_ANALYSIS")

    # 3. Deterministic calculation
    scenarios = FinancialEngine.simulate_scenarios(
        price=amount,
        product_name=product,
        current_savings=savings,
        monthly_income=inc,
        monthly_expenses=exp,
        existing_obligations=ob,
        primary_goal=profile.goals[0].model_dump() if profile.goals else None
    )

    timeline = FinancialEngine.generate_timeline_projection(
        profile={
            "savings": savings,
            "monthly_income": inc,
            "rent": profile.expenses.rent,
            "food_transport": profile.expenses.food + profile.expenses.transport,
            "bills": profile.obligations.upcoming_bills,
            "existing_emi": profile.obligations.existing_emi
        },
        purchase_price=amount,
        purchase_name=product,
        payment_method=intent_data.get("financing_preference", "cash")
    )

    # 4. Gemini structured explanation
    profile_dict = profile.model_dump()
    profile_dict["calculated_surplus"] = surplus
    profile_dict["emergency_buffer_months"] = buffer
    
    explanation = gemini_service.generate_decision_explanation(
        query=req.query,
        profile=profile_dict,
        scenarios=[s.model_dump() for s in scenarios],
        timeline=[t.model_dump() for t in timeline]
    )

    return {
        "query": req.query,
        "parsed_intent": intent_data,
        "financial_context": {
            "current_liquid_savings": savings,
            "monthly_income": inc,
            "monthly_expenses": exp,
            "monthly_obligations": ob,
            "monthly_surplus": surplus,
            "emergency_buffer_months": buffer
        },
        "deterministic_scenarios": [s.model_dump() for s in scenarios],
        "timeline": [t.model_dump() for t in timeline],
        "explanation": explanation,
        "data_completeness": profile.data_completeness,
        "disclaimer": "FINORA provides informational decision support based on the numbers you provide. It does not guarantee financial outcomes."
    }

@router.post("/negotiate")
def negotiate_decision(req: NegotiateRequest):
    """
    Counterfactual decision negotiation.
    User asks: 'What if I get a 15k bonus?', 'What if roommate splits half?', etc.
    """
    user_id = req.user_id or "user_demo_21"
    profile = store.get_profile(user_id)
    inc = profile.income.monthly_income
    exp = (
        profile.expenses.rent + profile.expenses.food + profile.expenses.transport +
        profile.expenses.shopping + profile.expenses.entertainment + profile.expenses.utilities +
        profile.expenses.subscriptions + profile.expenses.healthcare + profile.expenses.other_recurring
    )
    ob = (
        profile.obligations.existing_emi + profile.obligations.credit_card_payments +
        profile.obligations.upcoming_bills + profile.obligations.insurance
    )
    savings = profile.assets.total_liquid_savings
    surplus = FinancialEngine.calculate_surplus(inc, exp, ob)

    result = gemini_service.negotiate_decision(
        counterfactual_query=req.counterfactual_query,
        product=req.product_name,
        current_price=req.price,
        savings=savings,
        income=inc,
        surplus=surplus,
        expenses=exp
    )
    return result
