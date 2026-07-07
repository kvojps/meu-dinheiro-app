import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { BankAccount } from '@/types/models';
import { useSnackbar } from '@/contexts/SnackbarContext';

export function useBankAccounts() {
  const { showError, showSnackbar } = useSnackbar();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function reload() {
    try {
      const d = await api.getBankAccounts();
      d.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      setBankAccounts(d);
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

  async function save(data: { name: string; balance?: number }, editingId?: number) {
    try {
      if (editingId) {
        await api.updateBankAccount(editingId, data);
        showSnackbar('Conta atualizada');
      } else {
        await api.createBankAccount(data);
        showSnackbar('Conta adicionada');
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
      await api.deleteBankAccount(id);
      showSnackbar('Conta removida');
      await reload();
    } catch (err) {
      showError(err);
    }
  }

  return { bankAccounts, loading, error, retry, save, remove, reload };
}
