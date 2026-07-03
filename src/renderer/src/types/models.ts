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
  total_incomes?: number;
  received_incomes?: number;
  received_income?: number;
  pending_income?: number;
  total_income?: number;
}

export interface MonthDetail extends Month {
  expenses: Expense[];
  incomes: Income[];
}

export interface DefaultExpense {
  id: number;
  name: string;
  due_day: number | null;
  amount: number;
  created_at: string;
}

export interface DefaultIncome {
  id: number;
  name: string;
  expected_day: number | null;
  amount: number;
  bank_account_id: number | null;
  bank_account_name?: string | null;
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

export interface Income {
  id: number;
  month_id: number;
  name: string;
  expected_date: string | null;
  amount: number;
  is_received: number;
  received_at: string | null;
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
