from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class User(BaseModel):
    id: str
    name: str
    email: str
    age: int = 21
    city: str = "Bengaluru"
    occupation: str = "Software Developer / Associate"
    token: Optional[str] = None

class IncomeDetails(BaseModel):
    monthly_income: float = 35000.0
    sources: List[str] = ["Primary Salary", "Freelance Gig"]
    frequency: str = "Monthly"
    expected_future_income: Optional[str] = "Appraisal expected in 6 months (+15%)"
    variable_income: float = 3000.0

class ExpenseDetails(BaseModel):
    rent: float = 8000.0
    food: float = 4500.0
    transport: float = 2500.0
    education: float = 0.0
    shopping: float = 2000.0
    entertainment: float = 1500.0
    utilities: float = 1200.0
    subscriptions: float = 1200.0
    healthcare: float = 500.0
    other_recurring: float = 600.0

class ObligationDetails(BaseModel):
    existing_emi: float = 3000.0
    credit_card_payments: float = 1500.0
    upcoming_bills: float = 1200.0
    tuition_payments: float = 0.0
    insurance: float = 800.0
    other_commitments: float = 0.0

class AssetDetails(BaseModel):
    cash: float = 12000.0
    savings: float = 70000.0
    investments: float = 25000.0  # Mutual fund SIPs
    fixed_deposits: float = 20000.0
    total_liquid_savings: float = 82000.0

class FinancialGoal(BaseModel):
    id: str
    title: str
    category: str  # emergency_fund, laptop, phone, travel, education, vehicle
    target_amount: float
    current_amount: float
    target_date: str
    monthly_contribution: float
    status: str = "In Progress"

class FinancialProfile(BaseModel):
    user_id: str
    income: IncomeDetails = Field(default_factory=IncomeDetails)
    expenses: ExpenseDetails = Field(default_factory=ExpenseDetails)
    obligations: ObligationDetails = Field(default_factory=ObligationDetails)
    assets: AssetDetails = Field(default_factory=AssetDetails)
    goals: List[FinancialGoal] = []
    planning_profile_risk: str = "Personalized planning profile: Prudent Growth & Liquidity First"
    data_completeness: str = "High (Declared Income, 3 Months of Transactions, 4 Verified Commitments)"
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class Transaction(BaseModel):
    id: str
    title: str
    merchant: str
    amount: float
    category: str
    date: str
    payment_method: str = "UPI"
    is_recurring: bool = False
    icon: Optional[str] = None

class DecisionRecord(BaseModel):
    id: str
    timestamp: str
    item_name: str
    amount: float
    recommended_path: str
    user_decision: str
    notes: str

class DecisionAnalysisRequest(BaseModel):
    query: Optional[str] = None
    product_name: str
    price: float
    payment_method: str = "cash"
    timeframe: Optional[str] = "now"
    notes: Optional[str] = None

class StressTestRequest(BaseModel):
    shock_type: str
    duration_days: int = 180
