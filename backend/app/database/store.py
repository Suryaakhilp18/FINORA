from typing import Dict, List, Optional
import uuid
from datetime import datetime, timedelta
from app.database.models import (
    User, FinancialProfile, IncomeDetails, ExpenseDetails,
    ObligationDetails, AssetDetails, FinancialGoal, Transaction, DecisionRecord
)

class DataStore:
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.profiles: Dict[str, FinancialProfile] = {}
        self.transactions: Dict[str, List[Transaction]] = {}
        self.decisions: Dict[str, List[DecisionRecord]] = {}
        self.seed_demo_user()

    def seed_demo_user(self):
        demo_user_id = "user_demo_21"
        self.users[demo_user_id] = User(
            id=demo_user_id,
            name="Aarav Sharma",
            email="aarav@finora.in",
            age=21,
            city="Bengaluru",
            occupation="Junior Software Engineer",
            token="demo-session-token-finora-2026"
        )

        # Realistic Financial Profile for a 21-year old Indian working professional
        self.profiles[demo_user_id] = FinancialProfile(
            user_id=demo_user_id,
            income=IncomeDetails(
                monthly_income=35000.0,
                sources=["Initech Infotech Salary (Net Credited)", "Occasional Freelance UI/UX"],
                frequency="Monthly (10th of every month)",
                expected_future_income="Annual appraisal due in Q3",
                variable_income=2500.0
            ),
            expenses=ExpenseDetails(
                rent=8000.0,
                food=4500.0,
                transport=2500.0,
                education=0.0,
                shopping=2000.0,
                entertainment=1500.0,
                utilities=1200.0,
                subscriptions=1200.0,
                healthcare=500.0,
                other_recurring=600.0
            ),
            obligations=ObligationDetails(
                existing_emi=3000.0,  # Phone purchase EMI with 4 months left
                credit_card_payments=1500.0,
                upcoming_bills=1200.0,
                tuition_payments=0.0,
                insurance=800.0,
                other_commitments=0.0
            ),
            assets=AssetDetails(
                cash=12000.0,
                savings=70000.0,
                investments=25000.0,
                fixed_deposits=20000.0,
                total_liquid_savings=82000.0  # Cash + Bank Savings
            ),
            goals=[
                FinancialGoal(
                    id="goal_1",
                    title="Emergency Fund Cushion",
                    category="emergency_fund",
                    target_amount=100000.0,
                    current_amount=45000.0,
                    target_date="2026-12-31",
                    monthly_contribution=5000.0,
                    status="In Progress"
                ),
                FinancialGoal(
                    id="goal_2",
                    title="Coding Laptop Upgrade (M3 Air)",
                    category="laptop",
                    target_amount=70000.0,
                    current_amount=30000.0,
                    target_date="2027-03-31",
                    monthly_contribution=4000.0,
                    status="In Progress"
                ),
                FinancialGoal(
                    id="goal_3",
                    title="Goa Team Offsite & Trip",
                    category="travel",
                    target_amount=25000.0,
                    current_amount=12000.0,
                    target_date="2026-11-15",
                    monthly_contribution=2500.0,
                    status="In Progress"
                )
            ],
            planning_profile_risk="Personalized planning profile: Prudent Growth & Liquidity First",
            data_completeness="High (Declared Income, 3 Months of Transactions, 4 Verified Commitments)",
            updated_at=datetime.now().isoformat()
        )

        # Realistic transactions for young Indian tech worker (UPI heavy, dining, OTT, bills)
        today = datetime.now()
        self.transactions[demo_user_id] = [
            Transaction(
                id=str(uuid.uuid4()),
                title="Swiggy Gourmet Dinner",
                merchant="Swiggy",
                amount=640.0,
                category="food",
                date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
                payment_method="UPI / HDFC",
                is_recurring=False
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Metro Smart Card Recharge",
                merchant="Namma Metro / PayTM",
                amount=500.0,
                category="transport",
                date=(today - timedelta(days=2)).strftime("%Y-%m-%d"),
                payment_method="UPI / GPay",
                is_recurring=False
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Netflix Premium Plan",
                merchant="Netflix India",
                amount=649.0,
                category="subscriptions",
                date=(today - timedelta(days=3)).strftime("%Y-%m-%d"),
                payment_method="Auto-Debit UPI",
                is_recurring=True
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Spotify Individual",
                merchant="Spotify AB",
                amount=119.0,
                category="subscriptions",
                date=(today - timedelta(days=4)).strftime("%Y-%m-%d"),
                payment_method="UPI Mandate",
                is_recurring=True
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Zepto Quick Groceries",
                merchant="Zepto",
                amount=420.0,
                category="food",
                date=(today - timedelta(days=5)).strftime("%Y-%m-%d"),
                payment_method="UPI / PhonePe",
                is_recurring=False
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Cult.fit Gym Monthly",
                merchant="Curefit",
                amount=1499.0,
                category="subscriptions",
                date=(today - timedelta(days=8)).strftime("%Y-%m-%d"),
                payment_method="Debit Card",
                is_recurring=True
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="House Rent Transfer to Landlord",
                merchant="Owner via CRED UPI",
                amount=8000.0,
                category="rent",
                date=(today - timedelta(days=11)).strftime("%Y-%m-%d"),
                payment_method="CRED UPI",
                is_recurring=True
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Existing Smartphone EMI (Month 8 of 12)",
                merchant="Bajaj Finserv",
                amount=3000.0,
                category="obligations",
                date=(today - timedelta(days=12)).strftime("%Y-%m-%d"),
                payment_method="Auto-NACH Debit",
                is_recurring=True
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Monthly Salary Credit",
                merchant="Initech Infotech Solutions",
                amount=35000.0,
                category="income",
                date=(today - timedelta(days=13)).strftime("%Y-%m-%d"),
                payment_method="NEFT / Bank",
                is_recurring=True
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Amazon Electronics (Earbuds)",
                merchant="Amazon India",
                amount=1899.0,
                category="shopping",
                date=(today - timedelta(days=15)).strftime("%Y-%m-%d"),
                payment_method="Amazon Pay ICICI",
                is_recurring=False
            ),
            Transaction(
                id=str(uuid.uuid4()),
                title="Chai Point & Snacks",
                merchant="Chai Point",
                amount=180.0,
                category="food",
                date=(today - timedelta(days=16)).strftime("%Y-%m-%d"),
                payment_method="UPI",
                is_recurring=False
            )
        ]

        # Prior decisions memory
        self.decisions[demo_user_id] = [
            DecisionRecord(
                id=str(uuid.uuid4()),
                timestamp=(today - timedelta(days=45)).strftime("%Y-%m-%d"),
                item_name="Noise Cancelling Headphones",
                amount=14999.0,
                recommended_path="Wait for Great Indian Festival sale",
                user_decision="Waited 3 weeks and bought during sale at ₹9,999",
                notes="Saved ₹5,000 cash; kept emergency runway intact."
            ),
            DecisionRecord(
                id=str(uuid.uuid4()),
                timestamp=(today - timedelta(days=90)).strftime("%Y-%m-%d"),
                item_name="Goa Weekend Trip with College Friends",
                amount=18000.0,
                recommended_path="Save first over 2 months",
                user_decision="Allocated ₹9,000 across two paydays",
                notes="Zero debt incurred, high personal satisfaction."
            )
        ]

    def get_user(self, user_id: str) -> Optional[User]:
        return self.users.get(user_id)

    def get_profile(self, user_id: str) -> FinancialProfile:
        if user_id not in self.profiles:
            self.seed_demo_user()
        return self.profiles[user_id]

    def update_profile(self, user_id: str, profile: FinancialProfile) -> FinancialProfile:
        self.profiles[user_id] = profile
        return profile

    def get_transactions(self, user_id: str) -> List[Transaction]:
        return self.transactions.get(user_id, [])

    def add_transaction(self, user_id: str, txn: Transaction):
        if user_id not in self.transactions:
            self.transactions[user_id] = []
        self.transactions[user_id].insert(0, txn)

    def get_decisions(self, user_id: str) -> List[DecisionRecord]:
        return self.decisions.get(user_id, [])

    def add_decision(self, user_id: str, dec: DecisionRecord):
        if user_id not in self.decisions:
            self.decisions[user_id] = []
        self.decisions[user_id].insert(0, dec)

store = DataStore()
