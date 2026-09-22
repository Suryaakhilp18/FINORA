from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import uuid
from datetime import datetime

from app.database.store import store
from app.database.models import (
    FinancialProfile, FinancialGoal, Transaction, DecisionAnalysisRequest,
    StressTestRequest, DecisionRecord
)
from app.financial_engine.calculator import FinancialEngine
from app.ai.gemini_service import gemini_service

router = APIRouter(prefix="/api/financial", tags=["Financial Engine"])

@router.get("/profile", response_model=FinancialProfile)
def get_profile(user_id: str = "user_demo_21"):
    return store.get_profile(user_id)

@router.post("/profile", response_model=FinancialProfile)
def update_profile(profile: FinancialProfile, user_id: str = "user_demo_21"):
    return store.update_profile(user_id, profile)

@router.get("/snapshot")
def get_snapshot(user_id: str = "user_demo_21"):
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
    available_money = profile.assets.cash + (inc - exp - ob)
    
    surplus = FinancialEngine.calculate_surplus(inc, exp, ob)
    health = FinancialEngine.assess_health_dimensions(
        income=inc,
        expenses=exp,
        obligations=ob,
        savings=savings,
        goals=[g.model_dump() for g in profile.goals]
    )

    return {
        "user_name": store.get_user(user_id).name if store.get_user(user_id) else "User",
        "available_money": round(available_money, 2),
        "monthly_income": round(inc, 2),
        "monthly_expenses": round(exp, 2),
        "upcoming_obligations": round(ob, 2),
        "savings": round(savings, 2),
        "monthly_surplus": round(surplus, 2),
        "emergency_buffer_months": health["emergency_buffer"]["value"],
        "debt_to_income_pct": health["debt_load"]["value"],
        "health_dimensions": health,
        "planning_profile": profile.planning_profile_risk,
        "data_completeness": profile.data_completeness
    }

@router.post("/what-if")
def simulate_what_if(req: DecisionAnalysisRequest, user_id: str = "user_demo_21"):
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
    
    primary_goal = profile.goals[0].model_dump() if profile.goals else None
    
    # 1. Deterministic calculation of all 5 scenarios
    scenarios = FinancialEngine.simulate_scenarios(
        price=req.price,
        product_name=req.product_name,
        current_savings=savings,
        monthly_income=inc,
        monthly_expenses=exp,
        existing_obligations=ob,
        primary_goal=primary_goal
    )
    
    # 2. Deterministic timeline calculation
    timeline = FinancialEngine.generate_timeline_projection(
        profile={
            "savings": savings,
            "monthly_income": inc,
            "rent": profile.expenses.rent,
            "food_transport": profile.expenses.food + profile.expenses.transport,
            "bills": profile.obligations.upcoming_bills,
            "existing_emi": profile.obligations.existing_emi
        },
        purchase_price=req.price,
        purchase_name=req.product_name,
        payment_method=req.payment_method
    )

    # 3. Gemini explainability generation
    profile_dict = profile.model_dump()
    profile_dict["calculated_surplus"] = FinancialEngine.calculate_surplus(inc, exp, ob)
    profile_dict["emergency_buffer_months"] = FinancialEngine.calculate_emergency_buffer(savings, exp + ob)
    
    explanation = gemini_service.generate_decision_explanation(
        query=req.query or f"Can I buy a {req.product_name} for ₹{req.price:,.0f}?",
        profile=profile_dict,
        scenarios=[s.model_dump() for s in scenarios],
        timeline=[t.model_dump() for t in timeline]
    )

    # 4. Finora Score & 3-Tier Verdict
    goal_delay = scenarios[0].goal_delay_months if scenarios else 1.0
    finora_score = FinancialEngine.calculate_finora_score(
        price=req.price,
        current_savings=savings,
        monthly_income=inc,
        monthly_expenses=exp,
        existing_obligations=ob,
        goal_delay_months=goal_delay
    )

    # 5. India No-Cost EMI Truth Detector (IRR + 18% GST)
    nocost_emi_analysis = FinancialEngine.calculate_nocost_emi_irr(
        price=req.price,
        tenure_months=6,
        nominal_annual_rate=14.0,
        processing_fee=199.0,
        lost_cash_discount=min(3000.0, req.price * 0.05)
    )

    # 6. Monte Carlo 1,000 Future Runs (Fan Chart)
    monte_carlo = FinancialEngine.run_monte_carlo(
        current_savings=savings,
        monthly_income=inc,
        monthly_expenses=exp,
        existing_obligations=ob,
        purchase_price=req.price,
        num_simulations=1000
    )

    # 7. Hallucination Guard
    ground_truth = {
        "price": req.price,
        "savings": savings,
        "income": inc,
        "expenses": exp,
        "surplus": profile_dict["calculated_surplus"],
        "buffer": profile_dict["emergency_buffer_months"],
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

    # 8. Agentic Reasoning Trace
    reasoning_trace = [
        {
            "step": 1,
            "tool": "parse_intent()",
            "status": "COMPLETED",
            "detail": f"🔍 Extracted intent: {req.product_name} for ₹{req.price:,.0f} ({req.payment_method.upper()})"
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
        "product_name": req.product_name,
        "price": req.price,
        "payment_method": req.payment_method,
        "baseline_context": {
            "current_liquid_savings": savings,
            "monthly_income": inc,
            "monthly_expenses": exp,
            "upcoming_obligations": ob,
            "monthly_surplus": profile_dict["calculated_surplus"],
            "emergency_buffer_months": profile_dict["emergency_buffer_months"]
        },
        "scenarios": [s.model_dump() for s in scenarios],
        "timeline": [t.model_dump() for t in timeline],
        "explanation": explanation,
        "finora_score": finora_score,
        "nocost_emi_analysis": nocost_emi_analysis,
        "monte_carlo": monte_carlo,
        "reasoning_trace": reasoning_trace,
        "hallucination_guard": hallucination_guard,
        "data_completeness": profile.data_completeness
    }

@router.post("/stress-test")
def run_stress_test(req: StressTestRequest, user_id: str = "user_demo_21"):
    profile = store.get_profile(user_id)
    inc = profile.income.monthly_income
    exp = (
        profile.expenses.rent + profile.expenses.food + profile.expenses.transport +
        profile.expenses.shopping + profile.expenses.entertainment + profile.expenses.utilities +
        profile.expenses.subscriptions + profile.expenses.healthcare + profile.expenses.other_recurring
    )
    ob = profile.obligations.existing_emi + profile.obligations.credit_card_payments
    savings = profile.assets.total_liquid_savings

    res = FinancialEngine.run_stress_test(
        profile={
            "savings": savings,
            "monthly_income": inc,
            "monthly_expenses": exp,
            "existing_emi": ob
        },
        shock_type=req.shock_type,
        duration_days=req.duration_days
    )
    return res

@router.get("/goals", response_model=List[FinancialGoal])
def get_goals(user_id: str = "user_demo_21"):
    profile = store.get_profile(user_id)
    return profile.goals

@router.post("/goals", response_model=FinancialGoal)
def add_goal(goal: FinancialGoal, user_id: str = "user_demo_21"):
    profile = store.get_profile(user_id)
    if not goal.id:
        goal.id = f"goal_{uuid.uuid4().hex[:6]}"
    profile.goals.append(goal)
    store.update_profile(user_id, profile)
    return goal

@router.get("/transactions", response_model=List[Transaction])
def get_transactions(user_id: str = "user_demo_21"):
    return store.get_transactions(user_id)

@router.get("/subscriptions")
def get_subscriptions(user_id: str = "user_demo_21"):
    txns = store.get_transactions(user_id)
    subs = [t for t in txns if t.is_recurring and t.category == "subscriptions"]
    total_monthly = sum(t.amount for t in subs)
    return {
        "subscriptions": subs,
        "monthly_recurring_total": round(total_monthly, 2),
        "annual_commitment": round(total_monthly * 12, 2),
        "ai_note": f"You have ₹{total_monthly:,.0f}/month committed across {len(subs)} recurring services."
    }

@router.get("/insights")
def get_insights(user_id: str = "user_demo_21"):
    profile = store.get_profile(user_id)
    txns = store.get_transactions(user_id)
    return gemini_service.generate_financial_insights(
        profile=profile.model_dump(),
        transactions=[t.model_dump() for t in txns]
    )

@router.get("/decisions", response_model=List[DecisionRecord])
def get_decisions(user_id: str = "user_demo_21"):
    return store.get_decisions(user_id)

@router.post("/decisions")
def record_decision(rec: DecisionRecord, user_id: str = "user_demo_21"):
    if not rec.id:
        rec.id = str(uuid.uuid4())
    store.add_decision(user_id, rec)
    return rec

@router.post("/reset-demo")
def reset_demo():
    store.seed_demo_user()
    return {"status": "ok", "message": "Demo profile restored to young Indian baseline"}
