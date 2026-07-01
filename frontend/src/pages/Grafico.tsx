import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { api, Month } from '../api/client';

export default function Grafico() {
  const [data, setData] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMonths()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => {
    const set = new Set(data.map((m) => m.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(0);

  useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const currentIndex = years.indexOf(selectedYear);

  const yearMonths = useMemo(() => {
    return [...data]
      .filter((m) => m.year === selectedYear)
      .sort((a, b) => a.month - b.month);
  }, [data, selectedYear]);

  const chartData = yearMonths.map((m) => ({
    label: m.label,
    Pago: m.paid_amount ?? 0,
    Pendente: m.unpaid_amount ?? 0,
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Histórico Mensal
      </Typography>

      <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, p: 2, mb: 3 }}>
        <IconButton
          disabled={currentIndex >= years.length - 1}
          onClick={() => setSelectedYear(years[currentIndex + 1])}
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">{selectedYear}</Typography>
        <IconButton
          disabled={currentIndex <= 0}
          onClick={() => setSelectedYear(years[currentIndex - 1])}
        >
          <ChevronRight />
        </IconButton>
      </Paper>

      {yearMonths.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Nenhum mês cadastrado em {selectedYear}.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pago" fill="#2e7d32" stackId="a" />
            <Bar dataKey="Pendente" fill="#ed6c02" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
