export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  city: string;
  occupation: string;
  token?: string;
}

export interface IncomeDetails {
  monthly_income: number;
  sources: string[];
  frequency: string;
  expected_future_income?: string;
  variable_income: number;
}

export interface ExpenseDetails {
  rent: number;
  food: number;
  transport: number;
  education: number;
  shopping: number;
  entertainment: number;
  utilities: number;
  subscriptions: number;
  healthcare: number;
  other_recurring: number;
}

export interface ObligationDetails {
  existing_emi: number;
  credit_card_payments: number;
  upcoming_bills: number;
  tuition_payments: number;
  insurance: number;
  other_commitments: number;
}

export interface AssetDetails {
  cash: number;
  savings: number;
  investments: number;
  fixed_deposits: number;
  total_liquid_savings: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  category: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  monthly_contribution: number;
  status: string;
}

export interface FinancialProfile {
  user_id: string;
  income: IncomeDetails;
  expenses: ExpenseDetails;
  obligations: ObligationDetails;
  assets: AssetDetails;
  goals: FinancialGoal[];
  planning_profile_risk: string;
  data_completeness: string;
  updated_at: string;
}

export interface HealthDimension {
  status: 'Healthy' | 'Watch' | 'Needs Attention';
  description: string;
  value: number;
}

export interface FinancialSnapshot {
  user_name: string;
  available_money: number;
  monthly_income: number;
  monthly_expenses: number;
  upcoming_obligations: number;
  savings: number;
  monthly_surplus: number;
  emergency_buffer_months: number;
  debt_to_income_pct: number;
  health_dimensions: {
    cash_flow: HealthDimension;
    emergency_buffer: HealthDimension;
    debt_load: HealthDimension;
    goal_progress: HealthDimension;
  };
  planning_profile: string;
  data_completeness: string;
}

export interface ScenarioResult {
  id: string;
  name: string;
  tagline: string;
  upfront_cash_required: number;
  monthly_payment: number;
  tenure_months: number;
  total_cost: number;
  total_interest: number;
  post_purchase_savings: number;
  post_purchase_surplus: number;
  emergency_buffer_months: number;
  goal_delay_months: number;
  stress_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  pros: string[];
  cons: string[];
  trade_offs: string;
}

export interface TimelinePoint {
  label: string;
  day_offset: number;
  event: string;
  balance_without_purchase: number;
  balance_with_purchase: number;
  change_description: string;
}

export interface CognitiveBias {
  name: string;
  description: string;
  mitigation: string;
}

export interface FinoraScore {
  score: number;
  verdict: 'YES' | 'YES, BUT' | 'NOT NOW';
  verdict_badge: string;
  color: 'emerald' | 'amber' | 'rose';
  one_liner: string;
  breakdown: {
    liquidity_points: number;
    debt_headroom_points: number;
    goal_protection_points: number;
  };
  post_buffer_months: number;
  baseline_buffer_months: number;
  formulas: Record<string, string>;
}

export interface NoCostEmiScheduleItem {
  month: number;
  emi: number;
  interest_component: number;
  gst_18pct: number;
  total_outflow: number;
}

export interface NoCostEmiAnalysis {
  advertised_emi: number;
  tenure_months: number;
  true_effective_apr: number;
  processing_fee_with_gst: number;
  total_gst_on_interest: number;
  lost_upfront_cash_discount: number;
  total_hidden_cost: number;
  real_total_paid: number;
  monthly_schedule: NoCostEmiScheduleItem[];
  verdict_summary: string;
  formula_explanation: string;
}

export interface MonteCarloPercentiles {
  p10: number[];
  p50: number[];
  p90: number[];
}

export interface MonteCarloResult {
  num_runs: number;
  safety_threshold: number;
  prob_cushion_above_20k_without: number;
  prob_cushion_above_20k_with: number;
  headline: string;
  labels: string[];
  without_purchase: MonteCarloPercentiles;
  with_purchase: MonteCarloPercentiles;
  methodology: string;
}

export interface ReasoningStep {
  step: number;
  tool: string;
  status: string;
  detail: string;
}

export interface HallucinationGuard {
  total_extracted_metrics: number;
  verified_count: number;
  unverified_count: number;
  accuracy_rate: number;
  hallucination_free: boolean;
  badge: string;
  verified_items: string[];
  unverified_items: string[];
}

export interface DecisionExplanation {
  verdict_headline: string;
  what_happened: string;
  why_it_matters: string;
  assumptions_used: string[];
  what_changes_the_result: string[];
  recommendation_tradeoff: string;
  audio_script?: string;
  audio_script_hinglish?: string;
  audio_script_telugu?: string;
  salary_day_timing?: {
    days_to_salary: number;
    next_salary_date: string;
    timing_recommendation: string;
    post_salary_cushion_months: number;
  };
  impulse_score?: number;
  cognitive_biases?: CognitiveBias[];
  cooling_off_advice?: string;
  hidden_costs_warning?: string;
  smart_deal_hacks?: string[];
}

export interface NegotiationResponse {
  query: string;
  response_text: string;
  adjusted_price: number;
  adjusted_savings: number;
  adjusted_surplus: number;
  new_emergency_runway_months: number;
  verdict_shift: string;
  notes: string[];
}

export interface FutureSelfResponse {
  future_age: number;
  projected_portfolio_normal: number;
  projected_portfolio_with_purchase: number;
  opportunity_cost_at_future_age: number;
  dialogue: string;
  key_takeaway: string;
}

export interface NegotiationScriptResponse {
  topic: string;
  title: string;
  script: string;
  advice: string;
}

export interface WhatIfResponse {
  product_name: string;
  price: number;
  payment_method: string;
  baseline_context: {
    current_liquid_savings: number;
    monthly_income: number;
    monthly_expenses: number;
    upcoming_obligations: number;
    monthly_surplus: number;
    emergency_buffer_months: number;
  };
  scenarios: ScenarioResult[];
  timeline: TimelinePoint[];
  explanation: DecisionExplanation;
  finora_score?: FinoraScore;
  nocost_emi_analysis?: NoCostEmiAnalysis;
  monte_carlo?: MonteCarloResult;
  reasoning_trace?: ReasoningStep[];
  hallucination_guard?: HallucinationGuard;
  data_completeness: string;
}

export interface Transaction {
  id: string;
  title: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  payment_method: string;
  is_recurring: boolean;
}

export interface AIInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  action: string;
  badge: string;
}
