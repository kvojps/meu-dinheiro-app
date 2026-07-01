export interface Month {
  id: number;
  label: string;
  year: number;
  month: number;
  created_at: string;
  total_accounts?: number;
  paid_accounts?: number;
  paid_amount?: number;
  unpaid_amount?: number;
  total_amount?: number;
}

export interface MonthDetail extends Month {
  accounts: Account[];
}

export interface DefaultAccount {
  id: number;
  name: string;
  due_day: number | null;
  amount: number;
  created_at: string;
}

export interface Account {
  id: number;
  month_id: number;
  name: string;
  due_date: string | null;
  amount: number;
  is_paid: number;
  paid_at: string | null;
  receipt: string | null;
  notes: string | null;
  created_at: string;
}
