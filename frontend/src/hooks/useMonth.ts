import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { MonthDetail } from '../types/models';
import { useSnackbar } from './useSnackbar';

export function useMonth(id: string | undefined) {
  const [month, setMonth] = useState<MonthDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [prevMonthId, setPrevMonthId] = useState<number | null>(null);
  const [nextMonthId, setNextMonthId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { snackbar, showSnackbar, showError, closeSnackbar } = useSnackbar();

  async function reload() {
    if (!id) return;
    try {
      const [data, allMonths] = await Promise.all([api.getMonth(Number(id)), api.getMonths()]);
      setMonth(data);
      setNotFound(false);
      setError(false);

      const sorted = [...allMonths].sort((a, b) => a.year - b.year || a.month - b.month);
      const index = sorted.findIndex((m) => m.id === data.id);
      setPrevMonthId(index > 0 ? sorted[index - 1].id : null);
      setNextMonthId(index >= 0 && index < sorted.length - 1 ? sorted[index + 1].id : null);
    } catch (err) {
      if (err instanceof Error && err.message === 'Month not found') {
        setNotFound(true);
      } else {
        setError(true);
        showError(err);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function retry() {
    setLoading(true);
    setNotFound(false);
    setError(false);
    reload();
  }

  async function pay(expenseId: number, file?: File, notes?: string, paidAt?: string) {
    try {
      await api.payExpense(expenseId, file, notes, paidAt);
      showSnackbar('Despesa marcada como paga!');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function unpay(expenseId: number) {
    try {
      await api.unpayExpense(expenseId);
      showSnackbar('Pagamento desmarcado');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function addExpense(data: { name: string; amount: number; due_date?: string }) {
    if (!id) return false;
    try {
      await api.createExpense(Number(id), data);
      showSnackbar('Despesa adicionada');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function editExpense(
    expenseId: number,
    data: { name: string; amount: number; due_date?: string; notes?: string }
  ) {
    try {
      await api.updateExpense(expenseId, data);
      showSnackbar('Despesa atualizada');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function deleteExpense(expenseId: number) {
    try {
      await api.deleteExpense(expenseId);
      showSnackbar('Despesa removida');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function deleteMonth() {
    if (!id) return false;
    setDeleting(true);
    try {
      await api.deleteMonth(Number(id));
      return true;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      setDeleting(false);
    }
  }

  return {
    month,
    loading,
    notFound,
    error,
    prevMonthId,
    nextMonthId,
    deleting,
    snackbar,
    closeSnackbar,
    retry,
    pay,
    unpay,
    addExpense,
    editExpense,
    deleteExpense,
    deleteMonth,
  };
}
