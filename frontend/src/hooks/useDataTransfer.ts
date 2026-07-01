import { useState } from 'react';
import { api } from '../api/client';

export function useDataTransfer(
  showSnackbar: (message: string) => void,
  showError: (err: unknown) => void,
  onImported: () => void
) {
  const [importing, setImporting] = useState(false);

  async function exportData() {
    try {
      const blob = await api.exportData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export-money-manager.zip';
      a.click();
      URL.revokeObjectURL(url);
      showSnackbar('Arquivo exportado com sucesso');
    } catch (err) {
      showError(err);
    }
  }

  async function importData(file: File) {
    setImporting(true);
    try {
      await api.importData(file);
      showSnackbar('Dados importados com sucesso!');
      onImported();
    } catch (err) {
      showError(err);
    } finally {
      setImporting(false);
    }
  }

  return { importing, exportData, importData };
}
