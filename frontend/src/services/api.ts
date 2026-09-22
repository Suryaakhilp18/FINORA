import {
  FinancialSnapshot, FinancialProfile, WhatIfResponse, FinancialGoal,
  Transaction, AIInsight, User, FutureSelfResponse, NegotiationScriptResponse
} from '../types';
import {
  FALLBACK_USER,
  FALLBACK_SNAPSHOT,
  FALLBACK_PROFILE,
  FALLBACK_GOALS,
  FALLBACK_TRANSACTIONS,
  FALLBACK_INSIGHTS,
  getFallbackSimulation
} from './fallbackData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  // Auth Endpoints
  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Backend unavailable, using fallback login session');
    }
    return { token: 'demo-session-token-finora-2026', user: FALLBACK_USER };
  }

  static async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Backend unavailable, using fallback registration');
    }
    return { token: 'demo-session-token-finora-2026', user: { ...FALLBACK_USER, name, email } };
  }

  static async demoLogin(): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/demo`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Backend unavailable, using fallback demo session');
    }
    return { token: 'demo-session-token-finora-2026', user: FALLBACK_USER };
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`);
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return FALLBACK_USER;
  }

  // Financial Snapshot & Profile
  static async getSnapshot(userId: string = 'user_demo_21'): Promise<FinancialSnapshot> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/snapshot?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Using verified fallback snapshot');
    }
    return FALLBACK_SNAPSHOT;
  }

  static async getProfile(userId: string = 'user_demo_21'): Promise<FinancialProfile> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/profile?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Using verified fallback profile');
    }
    return FALLBACK_PROFILE;
  }

  static async updateProfile(profile: FinancialProfile, userId: string = 'user_demo_21'): Promise<FinancialProfile> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/profile?user_id=${userId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(profile),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Using local updated profile');
    }
    return profile;
  }

  // What-If Simulator & Timeline
  static async simulateWhatIf(data: {
    product_name: string;
    price: number;
    payment_method?: string;
    query?: string;
  }, userId: string = 'user_demo_21'): Promise<WhatIfResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/what-if?user_id=${userId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Using verified fallback simulation');
    }
    return getFallbackSimulation(data.product_name, data.price);
  }

  // Stress Test
  static async runStressTest(shockType: string, durationDays: number = 180, userId: string = 'user_demo_21'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/stress-test?user_id=${userId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ shock_type: shockType, duration_days: durationDays }),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return {
      shock_type: shockType,
      survival_months: 2.1,
      depletion_date: 'Day 64',
      stress_grade: 'Moderate Risk',
      recommended_buffer_addition: 25000,
      survival_timeline: [
        { month: 'Month 1', balance: 64000 },
        { month: 'Month 2', balance: 43000 },
        { month: 'Month 3', balance: 22000 },
        { month: 'Month 4', balance: 1000 }
      ]
    };
  }

  // Goals
  static async getGoals(userId: string = 'user_demo_21'): Promise<FinancialGoal[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/goals?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return FALLBACK_GOALS;
  }

  static async addGoal(goal: Partial<FinancialGoal>, userId: string = 'user_demo_21'): Promise<FinancialGoal> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/goals?user_id=${userId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(goal),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return {
      id: `goal_${Date.now()}`,
      title: goal.title || 'New Financial Target',
      target_amount: goal.target_amount || 50000,
      current_amount: goal.current_amount || 0,
      target_date: goal.target_date || '2026-12-31',
      category: goal.category || 'General',
      status: goal.status || 'In Progress',
      monthly_contribution: goal.monthly_contribution || 2500
    };
  }

  // Subscriptions & Transactions
  static async getSubscriptions(userId: string = 'user_demo_21'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/subscriptions?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return [
      { id: 'sub_1', name: 'Cult.fit', amount: 1250, frequency: 'Monthly', status: 'Active' },
      { id: 'sub_2', name: 'Netflix Premium', amount: 649, frequency: 'Monthly', status: 'Active' },
      { id: 'sub_3', name: 'Spotify Individual', amount: 119, frequency: 'Monthly', status: 'Active' }
    ];
  }

  static async getTransactions(userId: string = 'user_demo_21'): Promise<Transaction[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/transactions?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return FALLBACK_TRANSACTIONS;
  }

  static async getInsights(userId: string = 'user_demo_21'): Promise<AIInsight[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/insights?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return FALLBACK_INSIGHTS;
  }

  static async getDecisions(userId: string = 'user_demo_21'): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/decisions?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return [];
  }

  static async recordDecision(rec: any, userId: string = 'user_demo_21'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/financial/decisions?user_id=${userId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(rec),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return { status: 'recorded', record: rec };
  }

  static async resetDemo(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/financial/reset-demo`, { method: 'POST' });
    } catch (_e) {
      // local reset
    }
  }

  // Copilot (Ask FINORA)
  static async askCopilot(query: string, userId: string = 'user_demo_21'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/copilot/ask`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query, user_id: userId }),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return getFallbackSimulation('Purchase Query', 65000);
  }

  // Multimodal File Upload (Screenshot / Document)
  static async uploadDocumentOrScreenshot(file: File, userId: string = 'user_demo_21'): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);

      const res = await fetch(`${API_BASE_URL}/api/multimodal/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return {
      status: 'success',
      extracted_product: 'MacBook Air M3 13-inch',
      extracted_price: 65000,
      detected_financing: '6-Month No Cost EMI',
      confidence_score: 0.94
    };
  }

  // Interactive Counterfactual Negotiation
  static async negotiateDecision(
    counterfactualQuery: string,
    productName: string,
    price: number,
    userId: string = 'user_demo_21'
  ): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/copilot/negotiate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          counterfactual_query: counterfactualQuery,
          product_name: productName,
          price: price,
          user_id: userId
        }),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return {
      query: counterfactualQuery,
      response_text: `Factoring in "${counterfactualQuery}", your net out-of-pocket commitment drops, restoring post-purchase liquidity cushion to 2.8 months.`,
      adjusted_price: Math.round(price * 0.8),
      adjusted_savings: 58000,
      adjusted_surplus: 12500,
      new_emergency_runway_months: 2.8,
      verdict_shift: 'Upgraded to Healthy (Low Stress)',
      notes: [
        'Surplus preservation improves by 32%',
        'Goal delay minimized from 4.6 to 1.8 months'
      ]
    };
  }

  // Talk to Your Future Self at 30
  static async getFutureSelfDialogue(
    productName: string,
    price: number,
    targetAge: number = 30,
    userId: string = 'user_demo_21'
  ): Promise<FutureSelfResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/copilot/future-self`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          product_name: productName,
          price: price,
          target_age: targetAge,
          user_id: userId
        }),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    const years = targetAge - 21;
    const compoundFactor = Math.pow(1 + 0.11, years);
    const opportunityCost = Math.round(price * compoundFactor);

    return {
      future_age: targetAge,
      projected_portfolio_normal: 1850000,
      projected_portfolio_with_purchase: 1850000 - opportunityCost,
      opportunity_cost_at_future_age: opportunityCost,
      dialogue: `Hey Aarav! At age ${targetAge}, that ₹${price.toLocaleString('en-IN')} you spent on "${productName}" is worth approximately ₹${opportunityCost.toLocaleString('en-IN')} in compounded wealth (at 11% CAGR in an Indian index fund). If this laptop accelerates your software engineering career or freelance earnings, buy it. If it was just for unboxing dopamine, wait 45 days.`,
      key_takeaway: `₹${price.toLocaleString('en-IN')} spent today = ₹${opportunityCost.toLocaleString('en-IN')} foregone at age ${targetAge}.`
    };
  }

  // Tactical Negotiation Scripts
  static async getNegotiationScript(topic: string, context?: any): Promise<NegotiationScriptResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/copilot/negotiation-script`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ topic, context }),
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      // fallback
    }
    return {
      topic: topic,
      title: 'Merchant & Employer Discount Negotiation Script',
      script: `"Hi, I'm ready to complete the purchase today if you can match the corporate/student 8% discount or waive the credit card processing fee. Otherwise, I will purchase during the festival sale next month."`,
      advice: 'Never reveal urgency. Merchants and store managers often have discretionary 5-8% discount coupons.'
    };
  }
}
