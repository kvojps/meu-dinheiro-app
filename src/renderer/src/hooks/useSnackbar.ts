import { useCallback, useState } from 'react';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarState {
  message: string;
  severity: SnackbarSeverity;
}

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = 'success') => {
    setSnackbar({ message, severity });
  }, []);

  const showError = useCallback((err: unknown, fallback = 'Ocorreu um erro') => {
    setSnackbar({ message: err instanceof Error ? err.message : fallback, severity: 'error' });
  }, []);

  const closeSnackbar = useCallback(() => setSnackbar(null), []);

  return { snackbar, showSnackbar, showError, closeSnackbar };
}
