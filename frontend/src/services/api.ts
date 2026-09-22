import {
  FinancialSnapshot, FinancialProfile, WhatIfResponse, FinancialGoal,
  Transaction, AIInsight, User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  // Auth Endpoints
  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Failed to login');
    return res.json();
  }

  static async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error('Failed to create account');
    return res.json();
  }

  static async demoLogin(): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/api/auth/demo`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Demo login failed');
    return res.json();
  }

  static async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  }

  // Financial Snapshot & Profile
  static async getSnapshot(userId: string = 'user_demo_21'): Promise<FinancialSnapshot> {
    const res = await fetch(`${API_BASE_URL}/api/financial/snapshot?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch snapshot');
    return res.json();
  }

  static async getProfile(userId: string = 'user_demo_21'): Promise<FinancialProfile> {
    const res = await fetch(`${API_BASE_URL}/api/financial/profile?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  }

  static async updateProfile(profile: FinancialProfile, userId: string = 'user_demo_21'): Promise<FinancialProfile> {
    const res = await fetch(`${API_BASE_URL}/api/financial/profile?user_id=${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }

  // What-If Simulator & Timeline
  static async simulateWhatIf(data: {
    product_name: string;
    price: number;
    payment_method?: string;
    query?: string;
  }, userId: string = 'user_demo_21'): Promise<WhatIfResponse> {
    const res = await fetch(`${API_BASE_URL}/api/financial/what-if?user_id=${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Simulation failed');
    return res.json();
  }

  // Stress Test
  static async runStressTest(shockType: string, durationDays: number = 180, userId: string = 'user_demo_21'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/financial/stress-test?user_id=${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ shock_type: shockType, duration_days: durationDays }),
    });
    if (!res.ok) throw new Error('Stress test failed');
    return res.json();
  }

  // Goals
  static async getGoals(userId: string = 'user_demo_21'): Promise<FinancialGoal[]> {
    const res = await fetch(`${API_BASE_URL}/api/financial/goals?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch goals');
    return res.json();
  }

  static async addGoal(goal: Partial<FinancialGoal>, userId: string = 'user_demo_21'): Promise<FinancialGoal> {
    const res = await fetch(`${API_BASE_URL}/api/financial/goals?user_id=${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(goal),
    });
    if (!res.ok) throw new Error('Failed to add goal');
    return res.json();
  }

  // Subscriptions & Transactions
  static async getSubscriptions(userId: string = 'user_demo_21'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/financial/subscriptions?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch subscriptions');
    return res.json();
  }

  static async getTransactions(userId: string = 'user_demo_21'): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE_URL}/api/financial/transactions?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  }

  static async getInsights(userId: string = 'user_demo_21'): Promise<AIInsight[]> {
    const res = await fetch(`${API_BASE_URL}/api/financial/insights?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
  }

  static async getDecisions(userId: string = 'user_demo_21'): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/api/financial/decisions?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch decisions');
    return res.json();
  }

  static async recordDecision(rec: any, userId: string = 'user_demo_21'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/financial/decisions?user_id=${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(rec),
    });
    if (!res.ok) throw new Error('Failed to record decision');
    return res.json();
  }

  static async resetDemo(): Promise<void> {
    await fetch(`${API_BASE_URL}/api/financial/reset-demo`, { method: 'POST' });
  }

  // Copilot (Ask FINORA)
  static async askCopilot(query: string, userId: string = 'user_demo_21'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/copilot/ask`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ query, user_id: userId }),
    });
    if (!res.ok) throw new Error('Copilot inquiry failed');
    return res.json();
  }

  // Multimodal File Upload (Screenshot / Document)
  static async uploadDocumentOrScreenshot(file: File, userId: string = 'user_demo_21'): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const res = await fetch(`${API_BASE_URL}/api/multimodal/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Document processing failed');
    return res.json();
  }

  // Interactive Counterfactual Negotiation
  static async negotiateDecision(
    counterfactualQuery: string,
    productName: string,
    price: number,
    userId: string = 'user_demo_21'
  ): Promise<any> {
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
    if (!res.ok) throw new Error('Negotiation failed');
    return res.json();
  }

  // Talk to Your Future Self at 30
  static async getFutureSelfDialogue(
    productName: string,
    price: number,
    targetAge: number = 30,
    userId: string = 'user_demo_21'
  ): Promise<any> {
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
    if (!res.ok) throw new Error('Future self calculation failed');
    return res.json();
  }

  // Tactical Negotiation Scripts
  static async getNegotiationScript(topic: string, context?: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/copilot/negotiation-script`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        topic,
        context
      }),
    });
    if (!res.ok) throw new Error('Negotiation script generation failed');
    return res.json();
  }
}
