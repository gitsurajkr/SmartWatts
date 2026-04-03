import type {
  Appliance,
  ApplianceFormData,
  DashboardData,
  WeeklyDataPoint,
  AuthResponse,
  LoginData,
  SignupData,
  User,
  AIInsight,
  AIAlert,
} from './types';

const BASE_URL = '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('smartwatts_token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smartwatts_token');
      localStorage.removeItem('smartwatts_user');
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please login again.');
  }

  const json = await res.json();

  if (!res.ok) {
    const message =
      json.errors?.join(', ') || json.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json.data;
}

// Auth
export async function login(data: LoginData): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function signup(data: SignupData): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<User> {
  return request<User>('/auth/me');
}

// Appliances
export async function getAppliances(): Promise<Appliance[]> {
  return request<Appliance[]>('/appliances');
}

export async function createAppliance(data: ApplianceFormData): Promise<Appliance> {
  return request<Appliance>('/appliances', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAppliance(
  id: string,
  data: ApplianceFormData
): Promise<Appliance> {
  return request<Appliance>(`/appliances/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAppliance(id: string): Promise<void> {
  return request<void>(`/appliances/${id}`, {
    method: 'DELETE',
  });
}

// Dashboard
export async function getDashboard(): Promise<DashboardData> {
  return request<DashboardData>('/dashboard');
}

// Usage / Trends
export async function getWeeklyTrend(): Promise<WeeklyDataPoint[]> {
  return request<WeeklyDataPoint[]>('/usage/weekly-trend');
}

export async function logUsageSnapshot(): Promise<void> {
  return request<void>('/usage', { method: 'POST' });
}

// AI
export async function aiChat(message: string): Promise<{ reply: string }> {
  return request<{ reply: string }>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function getAIInsights(): Promise<AIInsight[]> {
  return request<AIInsight[]>('/ai/insights');
}

export async function getMonthlyReport(): Promise<{ report: string }> {
  return request<{ report: string }>('/ai/monthly-report');
}

export async function getAIAlerts(): Promise<AIAlert[]> {
  return request<AIAlert[]>('/ai/alerts');
}

export async function getBudgetAdvice(): Promise<{ advice: string }> {
  return request<{ advice: string }>('/ai/budget-advice');
}

export async function setBudget(budget: number): Promise<{ budget: number }> {
  return request<{ budget: number }>('/ai/budget', {
    method: 'PUT',
    body: JSON.stringify({ budget }),
  });
}

export async function getBudget(): Promise<{ budget: number | null }> {
  return request<{ budget: number | null }>('/ai/budget');
}
