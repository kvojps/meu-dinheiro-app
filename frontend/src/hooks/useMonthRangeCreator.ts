import { useState } from 'react';
import { api } from '../api/client';
import { SnackbarSeverity } from './useSnackbar';

export function useMonthRangeCreator(
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void,
  showError: (err: unknown) => void
) {
  const currentYear = new Date().getFullYear();
  const [range, setRange] = useState({
    fromYear: currentYear,
    fromMonth: 1,
    toYear: currentYear,
    toMonth: 12,
  });
  const [creating, setCreating] = useState(false);

  async function createRange() {
    setCreating(true);
    try {
      const result = await api.createMonthsBatch(
        range.fromYear,
        range.fromMonth,
        range.toYear,
        range.toMonth
      );
      const msgs = [`${result.created.length} mes(es) adicionado(s)!`];
      if (result.errors.length > 0) msgs.push(...result.errors);
      showSnackbar(msgs.join(' | '), result.errors.length > 0 ? 'warning' : 'success');
    } catch (err) {
      showError(err);
    } finally {
      setCreating(false);
    }
  }

  return { range, setRange, creating, createRange };
}
