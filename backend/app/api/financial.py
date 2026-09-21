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
