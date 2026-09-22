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

    def test_nocost_emi_irr(self):
        res = FinancialEngine.calculate_nocost_emi_irr(60000, 6, 14.0, 199.0, 2000.0)
        self.assertGreater(res["true_effective_apr"], 0.0)
        self.assertGreater(res["total_hidden_cost"], 2000.0)
        self.assertEqual(len(res["monthly_schedule"]), 6)
        self.assertTrue("formula_explanation" in res)

    def test_finora_score(self):
        res = FinancialEngine.calculate_finora_score(
            price=65000,
            current_savings=82000,
            monthly_income=35000,
            monthly_expenses=18000,
            existing_obligations=3000,
            goal_delay_months=3.2
        )
        self.assertIn(res["verdict"], ["YES", "YES, BUT", "NOT NOW"])
        self.assertGreaterEqual(res["score"], 0)
        self.assertLessEqual(res["score"], 100)
        self.assertTrue("formulas" in res)

    def test_monte_carlo(self):
        res = FinancialEngine.run_monte_carlo(82000, 35000, 18000, 3000, 65000, 100)
        self.assertEqual(res["num_runs"], 100)
        self.assertGreaterEqual(res["prob_cushion_above_20k_without"], 0.0)
        self.assertLessEqual(res["prob_cushion_above_20k_without"], 100.0)
        self.assertEqual(len(res["labels"]), 7)
        self.assertEqual(len(res["without_purchase"]["p50"]), 7)

    def test_hallucination_verifier(self):
        truth = {"income": 35000, "savings": 82000, "cushion": 3.9, "emi": 5800}
        text = "Your income is ₹35,000 with ₹82,000 savings. Emergency cushion is 3.9 months and EMI is ₹5,800."
        res = FinancialEngine.extract_and_verify_numbers(text, truth)
        self.assertEqual(res["verified_count"], 4)
        self.assertTrue(res["hallucination_free"])

if __name__ == "__main__":
    unittest.main()
