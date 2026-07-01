import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { MonthDetail } from '../types/models';
import { useSnackbar } from './useSnackbar';

export function useMonth(id: string | undefined) {
  const [month, setMonth] = useState<MonthDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { snackbar, showSnackbar, showError, closeSnackbar } = useSnackbar();

  async function reload() {
    if (!id) return;
    try {
      const data = await api.getMonth(Number(id));
      data.accounts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      setMonth(data);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, [id]);

  async function pay(accountId: number, file?: File, notes?: string) {
    try {
      await api.payAccount(accountId, file, notes);
      showSnackbar('Conta marcada como paga!');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function unpay(accountId: number) {
    try {
      await api.unpayAccount(accountId);
      showSnackbar('Pagamento desmarcado');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function addAccount(data: { name: string; amount: number; due_date?: string }) {
    if (!id) return false;
    try {
      await api.createAccount(Number(id), data);
      showSnackbar('Conta adicionada');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function editAccount(
    accountId: number,
    data: { name: string; amount: number; due_date?: string; notes?: string }
  ) {
    try {
      await api.updateAccount(accountId, data);
      showSnackbar('Conta atualizada');
      await reload();
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  async function deleteAccount(accountId: number) {
    try {
      await api.deleteAccount(accountId);
      showSnackbar('Conta removida');
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
    deleting,
    snackbar,
    closeSnackbar,
    pay,
    unpay,
    addAccount,
    editAccount,
    deleteAccount,
    deleteMonth,
  };
}
