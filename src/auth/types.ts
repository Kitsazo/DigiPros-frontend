export interface User {
  id: number;
  email: string;

  contact_name: string | null;
  phone: string | null;
  avatar_url: string | null;

  company_name: string;
  industry: string | null;
  employee_count: string | null;
  yearly_revenue: string | null;
  website: string | null;
  business_phone: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  notes: string | null;

  created_at: string;
  has_password: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  is_new?: boolean;
}

export interface PasswordChangePayload {
  current_password: string;
  new_password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  contact_name?: string | null;
  phone?: string | null;

  company_name?: string;
  industry?: string | null;
  employee_count?: string | null;
  yearly_revenue?: string | null;
  website?: string | null;
  business_phone?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserUpdatePayload {
  contact_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;

  company_name?: string;
  industry?: string | null;
  employee_count?: string | null;
  yearly_revenue?: string | null;
  website?: string | null;
  business_phone?: string | null;
  address_line1?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  notes?: string | null;
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  starts_at: string;
  deliverables: string[];
  icon: string;
}

export interface QuotePayload {
  service_slug: string;
  service_name: string;

  contact_name: string;
  contact_email: string;
  contact_phone?: string | null;

  company_name: string;
  industry?: string | null;
  employee_count?: string | null;
  yearly_revenue?: string | null;

  monthly_budget?: string | null;
  timeline?: string | null;
  goals?: string | null;
  notes?: string | null;
  referral_source?: string | null;
}

export interface Quote extends QuotePayload {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
}

export interface AnalyticsPoint {
  label: string;
  spent: number;
  returned: number;
}

export interface Analytics {
  total_spent: number;
  total_returned: number;
  roas: number;
  active_campaigns: number;
  leads_this_month: number;
  impressions: number;
  clicks: number;
  conversions: number;
  history: AnalyticsPoint[];
}

export type OAuthProvider = 'google' | 'apple';
