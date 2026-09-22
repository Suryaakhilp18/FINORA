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

    # 4. Finora Score & 3-Tier Verdict
    goal_delay = scenarios[0].goal_delay_months if scenarios else 1.0
    finora_score = FinancialEngine.calculate_finora_score(
        price=amount,
        current_savings=savings,
        monthly_income=inc,
        monthly_expenses=exp,
        existing_obligations=ob,
        goal_delay_months=goal_delay
    )

    # 5. India No-Cost EMI Truth Detector (IRR + 18% GST)
    nocost_emi_analysis = FinancialEngine.calculate_nocost_emi_irr(
        price=amount,
        tenure_months=6,
        nominal_annual_rate=14.0,
        processing_fee=199.0,
        lost_cash_discount=min(3000.0, amount * 0.05)
    )

    # 6. Monte Carlo 1,000 Future Runs (Fan Chart)
    monte_carlo = FinancialEngine.run_monte_carlo(
        current_savings=savings,
        monthly_income=inc,
        monthly_expenses=exp,
        existing_obligations=ob,
        purchase_price=amount,
        num_simulations=1000
    )

    # 7. Gemini structured explanation
    profile_dict = profile.model_dump()
    profile_dict["calculated_surplus"] = surplus
    profile_dict["emergency_buffer_months"] = buffer
    
    explanation = gemini_service.generate_decision_explanation(
        query=req.query,
        profile=profile_dict,
        scenarios=[s.model_dump() for s in scenarios],
        timeline=[t.model_dump() for t in timeline]
    )

    # 8. Hallucination Guard
    ground_truth = {
        "price": amount,
        "savings": savings,
        "income": inc,
        "expenses": exp,
        "surplus": surplus,
        "buffer": buffer,
        "finora_score": finora_score["score"],
        "post_buffer": finora_score["post_buffer_months"],
        "emi_amount": nocost_emi_analysis["advertised_emi"],
        "true_apr": nocost_emi_analysis["true_effective_apr"],
        "total_hidden_cost": nocost_emi_analysis["total_hidden_cost"]
    }
    hallucination_guard = FinancialEngine.extract_and_verify_numbers(
        text=str(explanation.get("verdict_headline", "")) + " " + str(explanation.get("what_happened", "")) + " " + str(explanation.get("audio_script", "")),
        verified_ground_truth=ground_truth
    )

    # 9. Visible Agentic Reasoning Trace
    reasoning_trace = [
        {
            "step": 1,
            "tool": "parse_intent()",
            "status": "COMPLETED",
            "detail": f"🔍 Extracted intent: {product} for ₹{amount:,.0f} ({intent_data.get('financing_preference', 'cash').upper()})"
        },
        {
            "step": 2,
            "tool": "simulate_scenarios()",
            "status": "COMPLETED",
            "detail": f"🧮 5 deterministic financial scenarios simulated by Python arithmetic"
        },
        {
            "step": 3,
            "tool": "calculate_finora_score()",
            "status": "COMPLETED",
            "detail": f"⭐ Finora Score: {finora_score['score']}/100 [{finora_score['verdict']}] ({finora_score['verdict_badge']})"
        },
        {
            "step": 4,
            "tool": "calculate_nocost_emi_irr()",
            "status": "COMPLETED",
            "detail": f"🛡️ Unmasked No-Cost EMI: 18% GST + ₹{nocost_emi_analysis['processing_fee_with_gst']:,.0f} fee = {nocost_emi_analysis['true_effective_apr']}% True APR"
        },
        {
            "step": 5,
            "tool": "run_monte_carlo(1000)",
            "status": "COMPLETED",
            "detail": f"🎲 1,000 stochastic futures: >₹20k cushion probability drops {monte_carlo['prob_cushion_above_20k_without']}% → {monte_carlo['prob_cushion_above_20k_with']}%"
        },
        {
            "step": 6,
            "tool": "extract_and_verify_numbers()",
            "status": "COMPLETED",
            "detail": f"✅ Hallucination Guard: {hallucination_guard['verified_count']}/{hallucination_guard['total_extracted_metrics']} numbers verified against engine"
        }
    ]

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
        "finora_score": finora_score,
        "nocost_emi_analysis": nocost_emi_analysis,
        "monte_carlo": monte_carlo,
        "reasoning_trace": reasoning_trace,
        "hallucination_guard": hallucination_guard,
        "data_completeness": profile.data_completeness,
        "disclaimer": "FINORA provides informational decision support based on the numbers you provide. It does not guarantee financial outcomes."
    }

@router.post("/negotiate")
def negotiate_decision(req: NegotiateRequest):
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

class FutureSelfRequest(BaseModel):
    user_id: Optional[str] = "user_demo_21"
    purchase_name: str
    price: float
    target_age: Optional[int] = 30

@router.post("/future-self")
def get_future_self_dialogue(req: FutureSelfRequest):
    user_id = req.user_id or "user_demo_21"
    profile = store.get_profile(user_id)
    surplus = FinancialEngine.calculate_surplus(
        profile.income.monthly_income,
        profile.expenses.rent + profile.expenses.food + profile.expenses.transport + profile.expenses.utilities,
        profile.obligations.existing_emi
    )
    res = gemini_service.generate_future_self_message(
        user_name=profile.personal.name or "Aarav",
        current_age=profile.personal.age or 21,
        target_age=req.target_age or 30,
        current_net_worth=profile.assets.total_liquid_savings,
        monthly_savings=surplus,
        purchase_name=req.purchase_name,
        purchase_price=req.price
    )
    return res

class NegotiationScriptRequest(BaseModel):
    topic: str  # "rent_reduction", "card_fee_waiver", "subscription"
    context: Optional[Dict[str, Any]] = None

@router.post("/negotiation-script")
def get_negotiation_script(req: NegotiationScriptRequest):
    return gemini_service.generate_negotiation_script(req.topic, req.context or {})
