import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Grid,
  useTheme,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../api/client';
import { Month } from '../types/models';
import AppSnackbar from '../components/AppSnackbar';
import { useSnackbar } from '../hooks/useSnackbar';
import { formatCurrencyBRL } from '../utils/format';

export default function History() {
  const [data, setData] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const { snackbar, showError, closeSnackbar } = useSnackbar();
  const theme = useTheme();

  useEffect(() => {
    api
      .getMonths()
      .then(setData)
      .catch(showError)
      .finally(() => setLoading(false));
  }, [showError]);

  const years = useMemo(() => {
    const set = new Set(data.map((m) => m.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [data]);

  const [yearOverride, setYearOverride] = useState<number | null>(null);
  const selectedYear =
    yearOverride !== null && years.includes(yearOverride) ? yearOverride : (years[0] ?? 0);

  const currentIndex = years.indexOf(selectedYear);

  const yearMonths = useMemo(() => {
    return [...data].filter((m) => m.year === selectedYear).sort((a, b) => a.month - b.month);
  }, [data, selectedYear]);

  const chartData = yearMonths.map((m) => ({
    label: m.label,
    Pago: m.paid_amount ?? 0,
    Pendente: m.unpaid_amount ?? 0,
  }));

  const yearTotals = yearMonths.reduce(
    (acc, m) => ({
      paid: acc.paid + (m.paid_amount ?? 0),
      pending: acc.pending + (m.unpaid_amount ?? 0),
    }),
    { paid: 0, pending: 0 }
  );

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

      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          mb: 3,
        }}
      >
        <IconButton
          disabled={currentIndex >= years.length - 1}
          onClick={() => setYearOverride(years[currentIndex + 1])}
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">{selectedYear}</Typography>
        <IconButton
          disabled={currentIndex <= 0}
          onClick={() => setYearOverride(years[currentIndex - 1])}
        >
          <ChevronRight />
        </IconButton>
      </Paper>

      {yearMonths.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Nenhum mês cadastrado em {selectedYear}.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pago em {selectedYear}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }} color="success.main">
                  {formatCurrencyBRL(yearTotals.paid)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pendente em {selectedYear}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }} color="warning.main">
                  {formatCurrencyBRL(yearTotals.pending)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total em {selectedYear}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatCurrencyBRL(yearTotals.paid + yearTotals.pending)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="label" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip
                formatter={(value) => formatCurrencyBRL(Number(value) || 0)}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar
                dataKey="Pago"
                fill={theme.palette.success.main}
                stackId="a"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Pendente"
                fill={theme.palette.warning.main}
                stackId="a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
