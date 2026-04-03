export interface Appliance {
  _id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  daysPerWeek: number;
  status: 'active' | 'standby';
  monthlyUnits: number;
  monthlyCost: number;
  percentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplianceFormData {
  name: string;
  watts: number | string;
  hoursPerDay: number | string;
  daysPerWeek: number | string;
  status: 'active' | 'standby';
}

export interface DashboardData {
  totalUnits: number;
  totalBill: number;
  activeDevices: number;
  totalDevices: number;
  topAppliance: {
    name: string;
    monthlyUnits: number;
    percentage: number;
  } | null;
  savings: {
    units: number;
    amount: number;
    tip: string;
  };
  breakdown: ApplianceBreakdown[];
  ratePerUnit: number;
}

export interface ApplianceBreakdown {
  _id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  daysPerWeek: number;
  status: string;
  monthlyUnits: number;
  monthlyCost: number;
  percentage: number;
}

export interface WeeklyDataPoint {
  label: string;
  date: string;
  usage: number;
  target: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  errors?: string[];
}

// Auth types
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// AI types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AIInsight {
  type: 'warning' | 'tip' | 'info';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AIAlert {
  type: 'spike' | 'budget' | 'efficiency';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}
