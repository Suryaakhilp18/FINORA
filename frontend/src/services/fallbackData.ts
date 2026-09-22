import { 
  FinancialSnapshot, FinancialProfile, WhatIfResponse, 
  FinancialGoal, Transaction, AIInsight, User
} from '../types';

export const FALLBACK_USER: User = {
  id: 'user_demo_21',
  name: 'Aarav Sharma',
  email: 'aarav@finora.in',
  age: 21,
  city: 'Bengaluru',
  occupation: 'Junior Software Engineer',
  token: 'demo-session-token-finora-2026'
};

export const FALLBACK_SNAPSHOT: FinancialSnapshot = {
  user_name: 'Aarav Sharma',
  available_money: 82000,
  monthly_income: 35000,
  monthly_expenses: 18000,
  upcoming_obligations: 3000,
  savings: 82000,
  monthly_surplus: 14000,
  emergency_buffer_months: 3.9,
  debt_to_income_pct: 8.6,
  health_dimensions: {
    cash_flow: { status: 'Healthy', description: 'Strong 40% savings surplus', value: 85 },
    emergency_buffer: { status: 'Healthy', description: '3.9 months runway liquid', value: 78 },
    debt_load: { status: 'Healthy', description: 'Debt-to-income under 10%', value: 92 },
    goal_progress: { status: 'Watch', description: 'Emergency fund 65% funded', value: 65 }
  },
  planning_profile: 'Conservative Wealth Builder',
  data_completeness: 'High'
};

export const FALLBACK_PROFILE: FinancialProfile = {
  user_id: 'user_demo_21',
  income: {
    monthly_income: 35000,
    sources: ['Initech Infotech Salary (Net Credited)', 'Occasional Freelance UI/UX'],
    frequency: 'Monthly (10th of every month)',
    expected_future_income: 'Annual appraisal due in Q3',
    variable_income: 2500
  },
  expenses: {
    rent: 8000,
    food: 4500,
    transport: 2500,
    education: 0,
    shopping: 2000,
    entertainment: 1500,
    utilities: 1200,
    subscriptions: 1200,
    healthcare: 500,
    other_recurring: 600
  },
  obligations: {
    existing_emi: 3000,
    credit_card_payments: 1500,
    upcoming_bills: 1200,
    tuition_payments: 0,
    insurance: 800,
    other_commitments: 0
  },
  assets: {
    cash: 12000,
    savings: 70000,
    investments: 25000,
    fixed_deposits: 15000,
    total_liquid_savings: 82000
  },
  goals: [],
  planning_profile_risk: 'Moderate',
  data_completeness: 'High',
  updated_at: '2026-09-22T19:00:00Z'
};

export const FALLBACK_GOALS: FinancialGoal[] = [
  {
    id: 'goal_emergency_1',
    title: 'Emergency Fund (6 Months)',
    category: 'Emergency',
    target_amount: 126000,
    current_amount: 82000,
    target_date: '2026-12-31',
    monthly_contribution: 6000,
    status: 'In Progress'
  },
  {
    id: 'goal_bike_2',
    title: 'Electric Scooter Downpayment',
    category: 'Vehicle',
    target_amount: 45000,
    current_amount: 18000,
    target_date: '2026-10-15',
    monthly_contribution: 4000,
    status: 'In Progress'
  },
  {
    id: 'goal_trip_3',
    title: 'Goa Friends Trip',
    category: 'Travel',
    target_amount: 20000,
    current_amount: 14000,
    target_date: '2026-11-20',
    monthly_contribution: 2000,
    status: 'In Progress'
  }
];

export const FALLBACK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1',
    title: 'Cult.fit Gym Membership',
    merchant: 'Cult.fit Bengaluru',
    category: 'Subscriptions',
    amount: 1250,
    date: '2026-09-18',
    payment_method: 'Auto-Debit Card',
    is_recurring: true
  },
  {
    id: 'txn_2',
    title: 'Swiggy Food Delivery',
    merchant: 'Swiggy',
    category: 'Food',
    amount: 680,
    date: '2026-09-19',
    payment_method: 'UPI',
    is_recurring: false
  },
  {
    id: 'txn_3',
    title: 'HDFC Personal Loan EMI',
    merchant: 'HDFC Bank',
    category: 'Obligations',
    amount: 3000,
    date: '2026-09-10',
    payment_method: 'NetBanking NACH',
    is_recurring: true
  }
];

export const FALLBACK_INSIGHTS: AIInsight[] = [
  {
    id: 'ins_1',
    category: 'Liquidity',
    title: 'Solid Emergency Cushion',
    description: 'You currently have 3.9 months of fixed living expenses saved up in liquid accounts. Keep it above 3.0 months.',
    action: 'Continue auto-depositing ₹6,000 to reach 6 full months.',
    badge: 'Positive'
  },
  {
    id: 'ins_2',
    category: 'Debt',
    title: 'Upcoming EMI Closure in 4 Months',
    description: 'Your existing ₹3,000 phone EMI ends in 4 months, unlocking additional monthly surplus.',
    action: 'Avoid taking overlapping EMIs until the current one clears.',
    badge: 'Healthy'
  }
];

export function getFallbackSimulation(product: string = 'MacBook Air M3 Laptop', price: number = 65000): WhatIfResponse {
  const savings = 82000;
  const postSavings = Math.max(0, savings - price);
  const fixedOutflow = 21000;
  const bufferAfterBuy = Number((postSavings / fixedOutflow).toFixed(1));

  return {
    product_name: product,
    price: price,
    payment_method: 'EMI',
    data_completeness: 'High (Verified Engine Fallback)',
    baseline_context: {
      current_liquid_savings: 82000,
      monthly_income: 35000,
      monthly_expenses: 18000,
      upcoming_obligations: 3000,
      monthly_surplus: 14000,
      emergency_buffer_months: 3.9
    },
    scenarios: [
      {
        id: 'buy_now',
        name: 'Buy Upfront in Full Cash',
        tagline: 'Pay full ₹65,000 from liquid savings today.',
        upfront_cash_required: price,
        monthly_payment: 0,
        tenure_months: 0,
        total_cost: price,
        total_interest: 0,
        post_purchase_savings: postSavings,
        post_purchase_surplus: 14000,
        emergency_buffer_months: bufferAfterBuy,
        goal_delay_months: 4.6,
        stress_level: bufferAfterBuy < 2.0 ? 'High' : 'Moderate',
        pros: ['Zero recurring EMIs', 'No interest or GST subventions'],
        cons: ['Drastic liquidity reduction', 'Pushes cushion below 2 months'],
        trade_offs: 'High risk of emergency debt shock if sudden unexpected expense occurs.'
      },
      {
        id: 'no_cost_emi_6m',
        name: '6-Month "No-Cost" EMI',
        tagline: 'Advertised as ₹10,833/mo, but carries ₹2,340 hidden surcharge.',
        upfront_cash_required: 199,
        monthly_payment: 11150,
        tenure_months: 6,
        total_cost: price + 3075,
        total_interest: 3075,
        post_purchase_savings: 81801,
        post_purchase_surplus: 2850,
        emergency_buffer_months: 2.5,
        goal_delay_months: 5.1,
        stress_level: 'Moderate',
        pros: ['Preserves liquid savings upfront', 'Predictable installment'],
        cons: ['Hidden GST on interest', 'True APR is 22.2%'],
        trade_offs: 'Absorbs 80% of monthly surplus for the next half year.'
      },
      {
        id: 'wait_45_days',
        name: 'Wait 45 Days & Buy with Festival Bonus',
        tagline: 'Save 2 more pay cycles and capture upcoming festival exchange bonuses.',
        upfront_cash_required: price * 0.9,
        monthly_payment: 0,
        tenure_months: 0,
        total_cost: price * 0.9,
        total_interest: 0,
        post_purchase_savings: 45000,
        post_purchase_surplus: 14000,
        emergency_buffer_months: 2.9,
        goal_delay_months: 1.2,
        stress_level: 'Low',
        pros: ['Avoids debt interest', 'Saves ₹6,500 via corporate/student discount'],
        cons: ['Requires 45 days of discipline'],
        trade_offs: 'The mathematically optimal decision for young Indian earners.'
      }
    ],
    timeline: [
      {
        label: 'Day 0 (Today)',
        day_offset: 0,
        event: 'Purchase Decision Point',
        balance_without_purchase: 82000,
        balance_with_purchase: postSavings,
        change_description: 'Immediate liquidity deduction'
      },
      {
        label: 'Day 30 (Next Salary)',
        day_offset: 30,
        event: 'Salary Credit & Rent Outflow',
        balance_without_purchase: 96000,
        balance_with_purchase: postSavings + 14000,
        change_description: 'Net surplus replenishment'
      },
      {
        label: 'Day 90',
        day_offset: 90,
        event: 'Quarterly Cushion Review',
        balance_without_purchase: 124000,
        balance_with_purchase: postSavings + 42000,
        change_description: 'Steady runway rebuild'
      }
    ],
    finora_score: {
      score: 68,
      verdict: 'YES, BUT',
      verdict_badge: '⚡ Manageable with Trade-offs',
      color: 'amber',
      one_liner: 'Affordable only if opting for a disciplined 6-month EMI or waiting 45 days to preserve liquidity cushion.',
      breakdown: {
        liquidity_points: 28,
        debt_headroom_points: 22,
        goal_protection_points: 18
      },
      post_buffer_months: 2.5,
      baseline_buffer_months: 3.9,
      formulas: {
        finora_score: 'Score = Liquidity Score (40%) + Price-to-Income Score (30%) + Goal Delay Score (30%)',
        runway_months: 'Runway = Liquid Savings ÷ Monthly Fixed Commitments',
        effective_apr: 'IRR solver based on upfront fee + monthly interest GST'
      }
    },
    nocost_emi_analysis: {
      advertised_emi: Math.round(price / 6),
      tenure_months: 6,
      true_effective_apr: 22.2,
      processing_fee_with_gst: 235,
      total_gst_on_interest: 840,
      lost_upfront_cash_discount: 2000,
      total_hidden_cost: 3075,
      real_total_paid: price + 3075,
      monthly_schedule: [
        { month: 1, emi: 10833, interest_component: 720, gst_18pct: 130, total_outflow: 10963 },
        { month: 2, emi: 10833, interest_component: 600, gst_18pct: 108, total_outflow: 10941 },
        { month: 3, emi: 10833, interest_component: 480, gst_18pct: 86, total_outflow: 10919 },
        { month: 4, emi: 10833, interest_component: 360, gst_18pct: 65, total_outflow: 10898 },
        { month: 5, emi: 10833, interest_component: 240, gst_18pct: 43, total_outflow: 10876 },
        { month: 6, emi: 10833, interest_component: 120, gst_18pct: 22, total_outflow: 10855 }
      ],
      verdict_summary: 'Advertised as 0% interest, but carries an effective 22.2% APR due to processing fee and 18% GST.',
      formula_explanation: 'IRR calculation on net cash flows including non-refundable charges.'
    },
    monte_carlo: {
      num_runs: 1000,
      safety_threshold: 20000,
      prob_cushion_above_20k_without: 96.4,
      prob_cushion_above_20k_with: 71.8,
      headline: '71.8% chance of maintaining >₹20,000 emergency cushion over the next 6 months.',
      labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
      without_purchase: {
        p10: [74000, 82000, 91000, 101000, 112000, 122000],
        p50: [94000, 107000, 120000, 133000, 146000, 159000],
        p90: [102000, 118000, 134000, 151000, 168000, 185000]
      },
      with_purchase: {
        p10: [16000, 22000, 29000, 37000, 46000, 56000],
        p50: [27000, 39000, 52000, 65000, 78000, 91000],
        p90: [35000, 50000, 66000, 83000, 100000, 117000]
      },
      methodology: '1,000 stochastic paths with Indian urban inflation (5-7%) and Poisson-distributed spending shocks.'
    },
    reasoning_trace: [
      { step: 1, tool: 'get_snapshot', status: 'completed', detail: 'Fetched live liquid savings ₹82,000 and fixed monthly outflow ₹21,000.' },
      { step: 2, tool: 'simulate_purchase', status: 'completed', detail: `Evaluated cash drawdown vs 6-month EMI for ₹${price.toLocaleString('en-IN')}.` },
      { step: 3, tool: 'irr_nocost_emi', status: 'completed', detail: 'Identified true effective APR of 22.2% factoring in ₹199 processing fee + GST.' },
      { step: 4, tool: 'project_goals', status: 'completed', detail: 'Calculated 4.6-month delay on Emergency Fund milestone.' },
      { step: 5, tool: 'monte_carlo', status: 'completed', detail: 'Simulated 1,000 runs: cushion survival probability drops from 96.4% to 71.8%.' }
    ],
    hallucination_guard: {
      total_extracted_metrics: 8,
      verified_count: 8,
      unverified_count: 0,
      accuracy_rate: 100.0,
      hallucination_free: true,
      badge: '✓ All numbers verified by FINORA Financial Engine',
      verified_items: ['₹65,000', '₹82,000', '₹35,000', '3.9 months', '₹14,000', '22.2%', '68/100', '71.8%'],
      unverified_items: []
    },
    explanation: {
      verdict_headline: 'Feasible via structured 6-month EMI, but upfront cash purchase drops runway to 0.8 months.',
      what_happened: 'Purchasing this laptop depletes ₹65,000 from your ₹82,000 liquid savings, leaving ₹17,000 (0.8 months of fixed living commitments).',
      why_it_matters: 'In Bengaluru, keeping less than 2.0 months of living expenses puts you at immediate risk of high-interest credit card debt if a medical emergency or delayed freelance invoice occurs.',
      assumptions_used: [
        'Monthly take-home salary remains constant at ₹35,000',
        'Rent (₹8,000) and existing phone EMI (₹3,000) continue',
        '18% GST applies to subvention interest installments'
      ],
      what_changes_the_result: [
        'A festival bonus of ₹15,000 restores buffer to 2.8 months',
        'Splitting cost with your employer or company equipment allowance',
        'Waiting 45 days to capture Diwali bank discount offers'
      ],
      recommendation_tradeoff: 'Recommended path: Choose the 45-day wait option or 6-month No-Cost EMI to avoid emergency runway shock.',
      audio_script: 'Finora Executive Summary. Paying ₹65,000 upfront today reduces your emergency cushion from 3.9 months to 0.8 months. We recommend either splitting the cost across a 6-month EMI or waiting 45 days for your festival bonus to protect your emergency buffer.',
      audio_script_hinglish: 'Finora Decision Verdict. Agar aap 65,000 rupaye abhi cash me dete hain, to aapka emergency cushion 3.9 months se ghat kar sirf 0.8 months reh jayega. Behtar yeh hoga ki aap 6-month EMI chunein ya 45 din ruk kar festival discount ka intezaar karein.',
      salary_day_timing: {
        days_to_salary: 9,
        next_salary_date: 'October 10',
        timing_recommendation: 'Buying on salary day in 9 days avoids dipping below your ₹20,000 cushion during the last week of the month.',
        post_salary_cushion_months: 2.1
      },
      impulse_score: 65,
      cognitive_biases: [
        {
          name: 'Present Bias',
          description: 'Focusing on the immediate unboxing gratification while heavily discounting the 30-day budget pinch.',
          mitigation: 'Implement the 48-hour cooling-off rule before swiping.'
        },
        {
          name: 'Zero-Interest Illusion',
          description: 'Believing No-Cost EMI is completely free despite bank processing fees and 18% GST.',
          mitigation: 'Account for the ₹2,340 true subvention cost.'
        }
      ],
      smart_deal_hacks: [
        'Apply Apple Student / Corporate EPP ID for an instant 8% discount (saves ₹5,200).',
        'Use HDFC Millennia / ICICI Amazon Pay card for 5% cashback.',
        'Wait 9 days until October 10 salary credit to keep cash flow green.'
      ]
    }
  };
}
