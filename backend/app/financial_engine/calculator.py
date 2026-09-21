import math
from typing import Dict, List, Any, Optional
from pydantic import BaseModel

class ScenarioResult(BaseModel):
    id: str
    name: str
    tagline: str
    upfront_cash_required: float
    monthly_payment: float
    tenure_months: int
    total_cost: float
    total_interest: float
    post_purchase_savings: float
    post_purchase_surplus: float
    emergency_buffer_months: float
    goal_delay_months: float
    stress_level: str  # "Low", "Moderate", "High", "Critical"
    pros: List[str]
    cons: List[str]
    trade_offs: str

class TimelinePoint(BaseModel):
    label: str
    day_offset: int
    event: str
    balance_without_purchase: float
    balance_with_purchase: float
    change_description: str

class FinancialEngine:
    @staticmethod
    def calculate_emi(principal: float, annual_interest_rate: float, tenure_months: int) -> Dict[str, float]:
        """
        Deterministic EMI calculation.
        Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
        """
        if principal <= 0 or tenure_months <= 0:
            return {"monthly_emi": 0.0, "total_payment": 0.0, "total_interest": 0.0}
        
        if annual_interest_rate <= 0:
            emi = round(principal / tenure_months, 2)
            return {
                "monthly_emi": emi,
                "total_payment": round(principal, 2),
                "total_interest": 0.0
            }
        
        monthly_rate = (annual_interest_rate / 100.0) / 12.0
        numerator = principal * monthly_rate * math.pow(1.0 + monthly_rate, tenure_months)
        denominator = math.pow(1.0 + monthly_rate, tenure_months) - 1.0
        emi = round(numerator / denominator, 2)
        total_payment = round(emi * tenure_months, 2)
        total_interest = round(total_payment - principal, 2)
        
        return {
            "monthly_emi": emi,
            "total_payment": total_payment,
            "total_interest": total_interest
        }

    @staticmethod
    def calculate_surplus(monthly_income: float, monthly_expenses: float, monthly_obligations: float) -> float:
        """Surplus = Income - (Expenses + EMIs + Obligations)"""
        return round(monthly_income - (monthly_expenses + monthly_obligations), 2)

    @staticmethod
    def calculate_emergency_buffer(savings: float, monthly_fixed_commitments: float) -> float:
        """Number of months user can survive if income stops."""
        if monthly_fixed_commitments <= 0:
            return 99.0
        return round(savings / monthly_fixed_commitments, 1)

    @staticmethod
    def calculate_debt_to_income(monthly_debt_payments: float, monthly_income: float) -> float:
        """Debt-to-Income (DTI) ratio percentage."""
        if monthly_income <= 0:
            return 100.0
        return round((monthly_debt_payments / monthly_income) * 100.0, 1)

    @staticmethod
    def assess_health_dimensions(income: float, expenses: float, obligations: float, savings: float, goals: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        fixed_commitments = expenses + obligations
        surplus = income - fixed_commitments
        buffer_months = FinancialEngine.calculate_emergency_buffer(savings, fixed_commitments)
        dti = FinancialEngine.calculate_debt_to_income(obligations, income)
        
        # Cash Flow Status
        surplus_ratio = surplus / income if income > 0 else 0
        if surplus_ratio >= 0.25:
            cash_flow_status = "Healthy"
            cash_flow_desc = f"Strong surplus of ₹{surplus:,.0f} ({surplus_ratio*100:.0f}% of income) each month."
        elif surplus_ratio >= 0.10:
            cash_flow_status = "Watch"
            cash_flow_desc = f"Moderate buffer of ₹{surplus:,.0f}/month. Discretionary spikes could cause tightness."
        else:
            cash_flow_status = "Needs Attention"
            cash_flow_desc = f"Tight cash flow: only ₹{surplus:,.0f}/month remaining after fixed commitments."

        # Emergency Buffer Status
        if buffer_months >= 4.5:
            emergency_status = "Healthy"
            emergency_desc = f"Solid safety cushion: {buffer_months} months of living expenses covered."
        elif buffer_months >= 2.5:
            emergency_status = "Watch"
            emergency_desc = f"{buffer_months} months covered. Build toward the recommended 6-month buffer."
        else:
            emergency_status = "Needs Attention"
            emergency_desc = f"Vulnerable buffer ({buffer_months} months). Sudden medical or job shock poses high risk."

        # Debt Load Status
        if dti <= 20.0:
            debt_status = "Healthy"
            debt_desc = f"Low debt burden: EMIs take {dti}% of income, leaving headroom."
        elif dti <= 40.0:
            debt_status = "Watch"
            debt_desc = f"Moderate debt burden: {dti}% of income goes to debt. Avoid adding more EMIs."
        else:
            debt_status = "Needs Attention"
            debt_desc = f"Heavy debt pressure ({dti}% of income). Risk of compounding stress if unexpected costs occur."

        # Goal Progress Status
        goal_status = "Healthy"
        goal_desc = "Goals are on track based on steady monthly savings."
        if goals and len(goals) > 0:
            total_target = sum(g.get("target_amount", 0) for g in goals)
            total_current = sum(g.get("current_amount", 0) for g in goals)
            pct = (total_current / total_target * 100) if total_target > 0 else 100
            if pct < 30:
                goal_status = "Watch"
                goal_desc = f"Goals funded at {pct:.0f}%. Increasing monthly allocation will accelerate targets."

        return {
            "cash_flow": {"status": cash_flow_status, "description": cash_flow_desc, "value": surplus},
            "emergency_buffer": {"status": emergency_status, "description": emergency_desc, "value": buffer_months},
            "debt_load": {"status": debt_status, "description": debt_desc, "value": dti},
            "goal_progress": {"status": goal_status, "description": goal_desc, "value": surplus}
        }

    @staticmethod
    def simulate_scenarios(
        price: float,
        product_name: str,
        current_savings: float,
        monthly_income: float,
        monthly_expenses: float,
        existing_obligations: float,
        primary_goal: Optional[Dict[str, Any]] = None
    ) -> List[ScenarioResult]:
        """
        Generates 5 deterministic scenarios:
        1. Buy Now (Full Upfront Cash)
        2. Buy After 2 Months (Accumulate Surplus)
        3. Buy With EMI (12-month low-rate or no-cost EMI)
        4. Buy Cheaper Alternative (Refurbished / Mid-tier at ~65% price)
        5. Save First (Dedicated Target)
        """
        fixed_commitments = monthly_expenses + existing_obligations
        current_surplus = monthly_income - fixed_commitments
        current_buffer = FinancialEngine.calculate_emergency_buffer(current_savings, fixed_commitments)
        
        goal_target = primary_goal.get("target_amount", 100000.0) if primary_goal else 100000.0
        goal_current = primary_goal.get("current_amount", 45000.0) if primary_goal else 45000.0
        goal_deficit = max(0.0, goal_target - goal_current)
        normal_months_to_goal = (goal_deficit / current_surplus) if current_surplus > 0 else 99.0

        # Scenario A: Buy Now
        savings_a = current_savings - price
        buffer_a = FinancialEngine.calculate_emergency_buffer(savings_a, fixed_commitments)
        # goal delay
        if savings_a < 0:
            stress_a = "Critical"
            delay_a = 12.0
        elif buffer_a < 2.0:
            stress_a = "High"
            delay_a = round(price / current_surplus, 1) if current_surplus > 0 else 6.0
        elif buffer_a < 3.5:
            stress_a = "Moderate"
            delay_a = round(price / current_surplus, 1) if current_surplus > 0 else 3.0
        else:
            stress_a = "Low"
            delay_a = round(price / current_surplus, 1) if current_surplus > 0 else 1.0

        scen_a = ScenarioResult(
            id="buy_now",
            name="Buy Now (Full Cash)",
            tagline="Immediate possession, zero debt interest, instant liquidity depletion.",
            upfront_cash_required=price,
            monthly_payment=0.0,
            tenure_months=0,
            total_cost=price,
            total_interest=0.0,
            post_purchase_savings=max(0.0, savings_a),
            post_purchase_surplus=current_surplus,
            emergency_buffer_months=max(0.0, buffer_a),
            goal_delay_months=delay_a,
            stress_level=stress_a,
            pros=["Zero debt and no monthly recurring commitments", "Zero interest charged", "Get the device immediately"],
            cons=[
                f"Emergency buffer drops from {current_buffer} to {max(0.0, buffer_a)} months",
                f"Consumes {min(100.0, (price/current_savings)*100):.0f}% of your liquid savings immediately",
                f"Delays your emergency fund goal by ~{delay_a} months"
            ],
            trade_offs=f"You gain instant utility today, but sacrifice your cash buffer from {current_buffer} to {max(0.0, buffer_a)} months."
        )

        # Scenario B: Wait 2 Months
        accumulated_2m = current_surplus * 2
        savings_b = current_savings + accumulated_2m - price
        buffer_b = FinancialEngine.calculate_emergency_buffer(savings_b, fixed_commitments)
        stress_b = "Low" if buffer_b >= 3.0 else "Moderate"
        delay_b = max(0.5, delay_a - 2.0)

        scen_b = ScenarioResult(
            id="wait_2_months",
            name="Wait 2 Months",
            tagline="Save two salary cycles before buying. Protects emergency reserves.",
            upfront_cash_required=price,
            monthly_payment=0.0,
            tenure_months=0,
            total_cost=price,
            total_interest=0.0,
            post_purchase_savings=max(0.0, savings_b),
            post_purchase_surplus=current_surplus,
            emergency_buffer_months=max(0.0, buffer_b),
            goal_delay_months=delay_b,
            stress_level=stress_b,
            pros=[
                f"Preserves ₹{savings_b:,.0f} in bank after buying",
                f"Emergency buffer stays safer at {buffer_b} months",
                "Opportunity to catch festive/online sales or card discounts"
            ],
            cons=["Must wait 60 days to own the item", "Requires disciplined spending during the 2 months"],
            trade_offs=f"Waiting 2 months cushions your bank balance by ₹{accumulated_2m:,.0f} compared to buying today."
        )

        # Scenario C: Buy With EMI (12 months @ 13.5% APR)
        emi_calc = FinancialEngine.calculate_emi(price, 13.5, 12)
        monthly_emi = emi_calc["monthly_emi"]
        total_cost_emi = emi_calc["total_payment"]
        interest_emi = emi_calc["total_interest"]
        surplus_c = current_surplus - monthly_emi
        buffer_c = FinancialEngine.calculate_emergency_buffer(current_savings - monthly_emi, fixed_commitments + monthly_emi)
        dti_c = FinancialEngine.calculate_debt_to_income(existing_obligations + monthly_emi, monthly_income)
        stress_c = "High" if (surplus_c < 2000 or dti_c > 35) else "Moderate"

        scen_c = ScenarioResult(
            id="buy_emi_12m",
            name="Buy With 12-Month EMI",
            tagline="Preserve upfront cash, but commit to ₹" + f"{monthly_emi:,.0f}/month for a year.",
            upfront_cash_required=monthly_emi,
            monthly_payment=monthly_emi,
            tenure_months=12,
            total_cost=total_cost_emi,
            total_interest=interest_emi,
            post_purchase_savings=current_savings - monthly_emi,
            post_purchase_surplus=surplus_c,
            emergency_buffer_months=buffer_c,
            goal_delay_months=round(delay_a * 0.4, 1),
            stress_level=stress_c,
            pros=[
                f"Keeps ₹{current_savings - monthly_emi:,.0f} liquid in your account today",
                "Manageable monthly outflow if cash flow is steady",
                "Immediate possession of product"
            ],
            cons=[
                f"Total interest surcharge of ₹{interest_emi:,.0f} over 12 months",
                f"Reduces monthly surplus from ₹{current_surplus:,.0f} down to ₹{surplus_c:,.0f}",
                f"Increases monthly debt ratio to {dti_c}% of income"
            ],
            trade_offs=f"Liquidity is preserved today, but your monthly flexibility is restricted by ₹{monthly_emi:,.0f} every month until next year."
        )

        # Scenario D: Cheaper Alternative (65% price e.g. certified refurbished or previous gen)
        alt_price = round(price * 0.65, -2)
        savings_d = current_savings - alt_price
        buffer_d = FinancialEngine.calculate_emergency_buffer(savings_d, fixed_commitments)
        stress_d = "Low" if buffer_d >= 3.0 else "Moderate"

        scen_d = ScenarioResult(
            id="buy_cheaper_alt",
            name="Buy Smart Alternative (~₹" + f"{alt_price:,.0f})",
            tagline=f"85% of features for 65% of price. Saves ₹{price - alt_price:,.0f} instantly.",
            upfront_cash_required=alt_price,
            monthly_payment=0.0,
            tenure_months=0,
            total_cost=alt_price,
            total_interest=0.0,
            post_purchase_savings=savings_d,
            post_purchase_surplus=current_surplus,
            emergency_buffer_months=buffer_d,
            goal_delay_months=round(delay_a * 0.6, 1),
            stress_level=stress_d,
            pros=[
                f"Saves ₹{price - alt_price:,.0f} immediately",
                f"Retains {buffer_d} months emergency runway",
                "Full ownership immediately with zero interest"
            ],
            cons=["Slightly lower specifications or previous generation model"],
            trade_offs=f"You achieve your functional objective today while retaining an extra ₹{price - alt_price:,.0f} in liquid reserves."
        )

        # Scenario E: Save First (Dedicated Target for 5 Months)
        months_to_save = max(3, min(8, math.ceil(price / max(current_surplus * 0.7, 1000))))
        monthly_save_target = round(price / months_to_save, 2)

        scen_e = ScenarioResult(
            id="save_first",
            name=f"Save Dedicated Fund ({months_to_save} Months)",
            tagline=f"Set aside ₹{monthly_save_target:,.0f}/mo into a 7% flexi-FD, then buy outright.",
            upfront_cash_required=0.0,
            monthly_payment=monthly_save_target,
            tenure_months=months_to_save,
            total_cost=price,
            total_interest=0.0,
            post_purchase_savings=current_savings,
            post_purchase_surplus=current_surplus - monthly_save_target,
            emergency_buffer_months=current_buffer,
            goal_delay_months=0.0,
            stress_level="Low",
            pros=[
                "Zero risk to current emergency fund",
                "Earn ~₹1,200 interest while accumulating in liquid fund",
                "Zero financial regret; guaranteed affordability"
            ],
            cons=[f"Delayed gratification: must wait {months_to_save} months to purchase"],
            trade_offs=f"Highest financial resilience, but requires patience over {months_to_save} monthly cycles."
        )

        return [scen_a, scen_b, scen_c, scen_d, scen_e]

    @staticmethod
    def generate_timeline_projection(
        profile: Dict[str, Any],
        purchase_price: float,
        purchase_name: str,
        payment_method: str = "cash"
    ) -> List[TimelinePoint]:
        """
        Generates realistic visual timeline comparison:
        Points: Today, Day 5 (Bills), Day 10 (Next Payday), Day 15 (Rent/Tuition), Day 20 (EMI),
        Day 30 (Month-End), Month 2 (60d), Month 3 (90d), Month 6 (180d).
        """
        savings = profile.get("savings", 82000.0)
        income = profile.get("monthly_income", 35000.0)
        rent = profile.get("rent", 8000.0)
        food_transport = profile.get("food_transport", 7000.0)
        bills = profile.get("bills", 3000.0)
        existing_emi = profile.get("existing_emi", 3000.0)
        surplus = income - (rent + food_transport + bills + existing_emi)

        emi_12m = FinancialEngine.calculate_emi(purchase_price, 13.5, 12)["monthly_emi"] if payment_method == "emi" else 0.0

        milestones = [
            ("Today", 0, "Current Status", 0, -purchase_price if payment_method == "cash" else -emi_12m),
            ("Day 5", 5, "Upcoming Utility Bills & Subs", -bills, -bills),
            ("Day 10", 10, "Monthly Salary Credited (+₹35,000)", +income, +income),
            ("Day 15", 15, "Rent & College/Tuition Due", -rent, -rent),
            ("Day 20", 20, "Existing EMI Deduction", -existing_emi, -existing_emi - emi_12m),
            ("Day 30", 30, "Living Expenses & Month-End", -food_transport, -food_transport),
            ("Day 60", 60, "Month 2 Balance (+Net Surplus)", +surplus, +surplus - emi_12m),
            ("Day 90", 90, "Month 3 Balance (+Net Surplus)", +surplus, +surplus - emi_12m),
            ("Day 180", 180, "Month 6 Balance (+Net Surplus)", +(surplus * 3), +(surplus * 3) - (emi_12m * 3)),
        ]

        timeline = []
        cur_without = savings
        cur_with = savings

        for label, offset, event, delta_without, delta_with in milestones:
            cur_without = round(cur_without + delta_without, 2)
            cur_with = round(cur_with + delta_with, 2)
            
            timeline.append(TimelinePoint(
                label=label,
                day_offset=offset,
                event=event,
                balance_without_purchase=cur_without,
                balance_with_purchase=cur_with,
                change_description=f"Without: ₹{cur_without:,.0f} | With {purchase_name}: ₹{cur_with:,.0f}"
            ))

        return timeline

    @staticmethod
    def run_stress_test(
        profile: Dict[str, Any],
        shock_type: str,
        duration_days: int = 180
    ) -> Dict[str, Any]:
        """
        Simulates:
        - "income_drop_20": Income drops by 20%
        - "unexpected_expense_20k": Sudden ₹20,000 medical/repair expense
        - "new_emi_5k": Added ₹5,000 EMI
        - "rent_increase_3k": Rent increases by ₹3,000
        - "zero_income": Complete job loss for 1-2 months
        """
        savings = profile.get("savings", 82000.0)
        income = profile.get("monthly_income", 35000.0)
        fixed_expenses = profile.get("monthly_expenses", 18000.0)
        obligations = profile.get("existing_emi", 3000.0)
        
        simulated_income = income
        simulated_fixed = fixed_expenses
        simulated_obligations = obligations
        immediate_hit = 0.0

        if shock_type == "income_drop_20":
            simulated_income = income * 0.8
            title = "20% Income Reduction"
            narrative = "Freelance or bonus cuts reduce monthly pay to 80%."
        elif shock_type == "unexpected_expense_20k":
            immediate_hit = 20000.0
            title = "Unexpected ₹20,000 Emergency Expense"
            narrative = "Immediate medical bill or urgent bike/device repair."
        elif shock_type == "new_emi_5k":
            simulated_obligations += 5000.0
            title = "New ₹5,000 Monthly EMI Added"
            narrative = "An additional lifestyle loan or gadget installment committed."
        elif shock_type == "rent_increase_3k":
            simulated_fixed += 3000.0
            title = "Rent Increase of ₹3,000/Month"
            narrative = "Lease renewal or shifting to an independent PG."
        elif shock_type == "zero_income":
            simulated_income = 0.0
            title = "Zero Income (Job Search / Sabbatical)"
            narrative = "Income entirely stops for the simulation period."
        else:
            title = "Custom Stress Scenario"
            narrative = "Simulated financial variance."

        base_surplus = income - (fixed_expenses + obligations)
        stressed_surplus = simulated_income - (simulated_fixed + simulated_obligations)
        
        current_balance = savings - immediate_hit
        days_milestones = [30, 90, 180]
        curve = []
        
        # Day 0
        curve.append({"day": 0, "label": "Today", "balance": current_balance})

        for day in range(30, duration_days + 1, 30):
            months = day / 30.0
            # each month adds stressed_surplus
            bal = current_balance + (stressed_surplus * months)
            curve.append({"day": day, "label": f"{day} Days", "balance": round(bal, 2)})

        runway_months = (current_balance / (simulated_fixed + simulated_obligations)) if (simulated_fixed + simulated_obligations) > 0 else 99.0
        
        resilience = "Strong" if runway_months >= 4.0 else ("Moderate" if runway_months >= 2.0 else "Critical")

        return {
            "title": title,
            "narrative": narrative,
            "shock_type": shock_type,
            "initial_savings": savings,
            "post_shock_immediate_savings": current_balance,
            "base_monthly_surplus": base_surplus,
            "stressed_monthly_surplus": stressed_surplus,
            "emergency_runway_months": round(runway_months, 1),
            "resilience_rating": resilience,
            "curve": curve,
            "actionable_mitigations": [
                "Pause non-essential OTT and dining discretionary spends to recover ~₹2,500/mo.",
                "Ensure emergency buffer maintains at least 3 months of strict rent + food.",
                "Delay uncommitted high-ticket gadget or vacation expenses until reserves normalize."
            ]
        }
