import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { DefaultIncome } from '@shared/types/models';
import { useSnackbar } from '@/contexts/SnackbarContext';

export function useDefaultIncomes() {
  const { showError, showSnackbar } = useSnackbar();
  const [defaultIncomes, setDefaultIncomes] = useState<DefaultIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function reload() {
    try {
      const d = await api.getDefaultIncomes();
      d.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      setDefaultIncomes(d);
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
    data: { name: string; expected_day?: number; amount: number; bank_account_id?: number | null },
    editingId?: number
  ) {
    try {
      if (editingId) {
        await api.updateDefaultIncome(editingId, data);
        showSnackbar('Entrada padrão atualizada');
      } else {
        await api.createDefaultIncome(data);
        showSnackbar('Entrada padrão adicionada');
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
      await api.deleteDefaultIncome(id);
      showSnackbar('Entrada padrão removida');
      await reload();
    } catch (err) {
      showError(err);
    }
  }

  return { defaultIncomes, loading, error, retry, save, remove, reload };
}
