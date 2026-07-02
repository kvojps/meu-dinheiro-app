export interface Month {
  id: number;
  label: string;
  year: number;
  month: number;
  created_at: string;
  total_expenses?: number;
  paid_expenses?: number;
  paid_amount?: number;
  unpaid_amount?: number;
  total_amount?: number;
  overdue_expenses?: number;
  overdue_amount?: number;
}

export interface MonthDetail extends Month {
  expenses: Expense[];
}

export interface DefaultExpense {
  id: number;
  name: string;
  due_day: number | null;
  amount: number;
  created_at: string;
}

export interface Expense {
  id: number;
  month_id: number;
  name: string;
  due_date: string | null;
  amount: number;
  is_paid: number;
  paid_at: string | null;
  receipt: string | null;
  notes: string | null;
  bank_account_id: number | null;
  bank_account_name?: string | null;
  created_at: string;
}

export interface BankAccount {
  id: number;
  name: string;
  balance: number;
  created_at: string;
}
