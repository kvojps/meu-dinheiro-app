import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DefaultAccount } from '../types/models';

export function useDefaultAccounts(
  showError: (err: unknown) => void,
  showSnackbar: (message: string) => void
) {
  const [defaultAccounts, setDefaultAccounts] = useState<DefaultAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function reload() {
    try {
      const d = await api.getDefaultAccounts();
      d.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      setDefaultAccounts(d);
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
        await api.updateDefaultAccount(editingId, data);
        showSnackbar('Conta padrão atualizada');
      } else {
        await api.createDefaultAccount(data);
        showSnackbar('Conta padrão adicionada');
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
      await api.deleteDefaultAccount(id);
      showSnackbar('Conta padrão removida');
      await reload();
    } catch (err) {
      showError(err);
    }
  }

  return { defaultAccounts, loading, error, retry, save, remove, reload };
}
