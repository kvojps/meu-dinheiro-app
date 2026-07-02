import type {
  Month,
  MonthDetail,
  DefaultExpense,
  DefaultIncome,
  Expense,
  Income,
  BankAccount,
} from '../types/models';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  setup(initialMonth: number, initialYear: number) {
    return request<{ months: Month[] }>('/setup', {
      method: 'POST',
      body: JSON.stringify({ initialMonth, initialYear }),
    });
  },

  getMonths() {
    return request<Month[]>('/months');
  },

  deleteMonth(id: number) {
    return request<{ message: string }>(`/months/${id}`, {
      method: 'DELETE',
    });
  },

  createMonth(year?: number, month?: number) {
    return request<Month>('/months', {
      method: 'POST',
      body: JSON.stringify({ year, month }),
    });
  },

  createMonthsBatch(fromYear: number, fromMonth: number, toYear: number, toMonth: number) {
    return request<{ created: Month[]; errors: string[] }>('/months/batch', {
      method: 'POST',
      body: JSON.stringify({ fromYear, fromMonth, toYear, toMonth }),
    });
  },

  getMonth(id: number) {
    return request<MonthDetail>(`/months/${id}`);
  },

  getDefaultExpenses() {
    return request<DefaultExpense[]>('/default-expenses');
  },

  createDefaultExpense(data: { name: string; due_day?: number; amount: number }) {
    return request<DefaultExpense>('/default-expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateDefaultExpense(id: number, data: { name?: string; due_day?: number; amount?: number }) {
    return request<DefaultExpense>(`/default-expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteDefaultExpense(id: number) {
    return request<{ message: string }>(`/default-expenses/${id}`, {
      method: 'DELETE',
    });
  },

  getBankAccounts() {
    return request<BankAccount[]>('/bank-accounts');
  },

  createBankAccount(data: { name: string; balance?: number }) {
    return request<BankAccount>('/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateBankAccount(id: number, data: { name?: string; balance?: number }) {
    return request<BankAccount>(`/bank-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteBankAccount(id: number) {
    return request<{ message: string }>(`/bank-accounts/${id}`, {
      method: 'DELETE',
    });
  },

  createExpense(monthId: number, data: { name: string; due_date?: string; amount: number }) {
    return request<Expense>(`/months/${monthId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateExpense(
    id: number,
    data: { name?: string; due_date?: string; amount?: number; notes?: string }
  ) {
    return request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteExpense(id: number) {
    return request<{ message: string }>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  async payExpense(
    id: number,
    file?: File,
    notes?: string,
    paidAt?: string,
    bankAccountId?: number
  ) {
    const formData = new FormData();
    if (file) formData.append('receipt', file);
    if (notes) formData.append('notes', notes);
    if (paidAt) formData.append('paid_at', paidAt);
    if (bankAccountId) formData.append('bank_account_id', String(bankAccountId));

    const res = await fetch(`${API_BASE}/expenses/${id}/pay`, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json() as Promise<Expense>;
  },

  unpayExpense(id: number) {
    return request<Expense>(`/expenses/${id}/unpay`, { method: 'PUT' });
  },

  getDefaultIncomes() {
    return request<DefaultIncome[]>('/default-incomes');
  },

  createDefaultIncome(data: {
    name: string;
    expected_day?: number;
    amount: number;
    bank_account_id?: number | null;
  }) {
    return request<DefaultIncome>('/default-incomes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateDefaultIncome(
    id: number,
    data: { name?: string; expected_day?: number; amount?: number; bank_account_id?: number | null }
  ) {
    return request<DefaultIncome>(`/default-incomes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteDefaultIncome(id: number) {
    return request<{ message: string }>(`/default-incomes/${id}`, {
      method: 'DELETE',
    });
  },

  createIncome(
    monthId: number,
    data: { name: string; expected_date?: string; amount: number; bank_account_id?: number | null }
  ) {
    return request<Income>(`/months/${monthId}/incomes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateIncome(
    id: number,
    data: {
      name?: string;
      expected_date?: string;
      amount?: number;
      notes?: string;
      bank_account_id?: number | null;
    }
  ) {
    return request<Income>(`/incomes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteIncome(id: number) {
    return request<{ message: string }>(`/incomes/${id}`, {
      method: 'DELETE',
    });
  },

  receiveIncome(id: number, notes?: string, receivedAt?: string, bankAccountId?: number) {
    return request<Income>(`/incomes/${id}/receive`, {
      method: 'PUT',
      body: JSON.stringify({
        notes,
        received_at: receivedAt,
        bank_account_id: bankAccountId,
      }),
    });
  },

  unreceiveIncome(id: number) {
    return request<Income>(`/incomes/${id}/unreceive`, { method: 'PUT' });
  },

  async exportData() {
    const res = await fetch(`${API_BASE}/export`);
    if (!res.ok) throw new Error('Erro ao exportar dados');
    return res.blob();
  },

  async importData(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/import`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Erro ao importar dados');
    }
    return res.json();
  },
};
