import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { DefaultExpense } from '@/types/models';
import { useSnackbar } from '@/contexts/SnackbarContext';

export function useDefaultExpenses() {
  const { showError, showSnackbar } = useSnackbar();
  const [defaultExpenses, setDefaultExpenses] = useState<DefaultExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function reload() {
    try {
      const d = await api.getDefaultExpenses();
      d.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      setDefaultExpenses(d);
      setError(false);
    } catch (err) {
      setError(true);
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function retry() {
    setLoading(true);
    setError(false);
    reload();
  }

  async function save(
    data: { name: string; due_day?: number; amount: number },
    editingId?: number
  ) {
    try {
      if (editingId) {
        await api.updateDefaultExpense(editingId, data);
        showSnackbar('Despesa padrão atualizada');
      } else {
        await api.createDefaultExpense(data);
        showSnackbar('Despesa padrão adicionada');
      }
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function remove(id: number) {
    try {
      await api.deleteDefaultExpense(id);
      showSnackbar('Despesa padrão removida');
      await reload();
    } catch (err) {
      showError(err);
    }
  }

  return { defaultExpenses, loading, error, retry, save, remove, reload };
}
