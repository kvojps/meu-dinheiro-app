const API_BASE = '/api';

export interface Month {
  id: number;
  label: string;
  year: number;
  month: number;
  created_at: string;
  total_accounts?: number;
  paid_accounts?: number;
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

  getDefaultAccounts() {
    return request<DefaultAccount[]>('/default-accounts');
  },

  createDefaultAccount(data: { name: string; due_day?: number; amount: number }) {
    return request<DefaultAccount>('/default-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateDefaultAccount(id: number, data: { name?: string; due_day?: number; amount?: number }) {
    return request<DefaultAccount>(`/default-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteDefaultAccount(id: number) {
    return request<{ message: string }>(`/default-accounts/${id}`, {
      method: 'DELETE',
    });
  },

  createAccount(monthId: number, data: { name: string; due_date?: string; amount: number }) {
    return request<Account>(`/months/${monthId}/accounts`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAccount(id: number, data: { name?: string; due_date?: string; amount?: number; notes?: string }) {
    return request<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteAccount(id: number) {
    return request<{ message: string }>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  },

  async payAccount(id: number, file?: File, notes?: string) {
    const formData = new FormData();
    if (file) formData.append('receipt', file);
    if (notes) formData.append('notes', notes);

    const res = await fetch(`${API_BASE}/accounts/${id}/pay`, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json() as Promise<Account>;
  },

  unpayAccount(id: number) {
    return request<Account>(`/accounts/${id}/unpay`, { method: 'PUT' });
  },
};
