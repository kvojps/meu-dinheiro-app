import { useState } from 'react';
import { api } from '@/api/client';

export function useDataTransfer(
  showSnackbar: (message: string) => void,
  showError: (err: unknown) => void,
  onImported: () => void
) {
  const [importing, setImporting] = useState(false);

  async function exportData() {
    try {
      const result = await api.exportData();
      if (result.success) {
        showSnackbar('Arquivo exportado com sucesso');
      } else if (result.error !== 'canceled') {
        showError(new Error('Erro ao exportar dados'));
      }
    } catch (err) {
      showError(err);
    }
  }

  async function importData() {
    setImporting(true);
    try {
      const result = await api.importData();
      if (result.success) {
        showSnackbar('Dados importados com sucesso!');
        onImported();
      } else if (result.error !== 'canceled') {
        showError(new Error(result.message || 'Erro ao importar dados'));
      }
    } catch (err) {
      showError(err);
    } finally {
      setImporting(false);
    }
  }

  return { importing, exportData, importData };
}
