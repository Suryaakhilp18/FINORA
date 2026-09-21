import unittest
from app.financial_engine.calculator import FinancialEngine

class TestFinancialEngine(unittest.TestCase):
    def test_emi_zero_interest(self):
        res = FinancialEngine.calculate_emi(60000, 0, 6)
        self.assertEqual(res["monthly_emi"], 10000.0)
        self.assertEqual(res["total_interest"], 0.0)

    def test_emi_standard_interest(self):
        # 12,000 at 12% APR for 12 months => monthly interest 1%
        res = FinancialEngine.calculate_emi(12000, 12, 12)
        # E = 12000 * 0.01 * (1.01)^12 / ((1.01)^12 - 1) = ~1066.19
        self.assertAlmostEqual(res["monthly_emi"], 1066.19, delta=1.0)
        self.assertGreater(res["total_interest"], 700)

    def test_surplus(self):
        surplus = FinancialEngine.calculate_surplus(35000, 18000, 3000)
        self.assertEqual(surplus, 14000.0)

    def test_emergency_buffer(self):
        buffer = FinancialEngine.calculate_emergency_buffer(82000, 21000)
        self.assertAlmostEqual(buffer, 3.9, delta=0.1)

    def test_scenarios_generation(self):
        scenarios = FinancialEngine.simulate_scenarios(
            price=70000,
            product_name="MacBook / Laptop",
            current_savings=82000,
            monthly_income=35000,
            monthly_expenses=18000,
            existing_obligations=3000
        )
        self.assertEqual(len(scenarios), 5)
        # Buy now has 0 interest
        self.assertEqual(scenarios[0].total_interest, 0.0)
        self.assertEqual(scenarios[0].upfront_cash_required, 70000.0)
        # Check scenario IDs
        ids = [s.id for s in scenarios]
        self.assertIn("buy_now", ids)
        self.assertIn("wait_2_months", ids)
        self.assertIn("buy_emi_12m", ids)
        self.assertIn("buy_cheaper_alt", ids)
        self.assertIn("save_first", ids)

    def test_stress_test(self):
        profile = {
            "savings": 82000.0,
            "monthly_income": 35000.0,
            "monthly_expenses": 18000.0,
            "existing_emi": 3000.0
        }
        res = FinancialEngine.run_stress_test(profile, "income_drop_20", 180)
        self.assertEqual(res["shock_type"], "income_drop_20")
        self.assertTrue(len(res["curve"]) > 0)

if __name__ == "__main__":
    unittest.main()
