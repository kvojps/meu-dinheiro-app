import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  FormControl,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  BarChartOutlined,
  TableRowsOutlined,
  ErrorOutline,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../api/client';
import { Month } from '../types/models';
import AppSnackbar from '../components/AppSnackbar';
import { useSnackbar } from '../hooks/useSnackbar';
import { formatCurrencyBRL } from '../utils/format';

function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export default function History() {
  const [data, setData] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const { snackbar, showError, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  function loadMonths() {
    api
      .getMonths()
      .then((months) => {
        setData(months);
        setError(false);
      })
      .catch((err) => {
        setError(true);
        showError(err);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadMonths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function retry() {
    setLoading(true);
    setError(false);
    loadMonths();
  }

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

  const now = new Date();
  const currentKey = monthKey(now.getFullYear(), now.getMonth() + 1);

  const chartData = yearMonths.map((m) => {
    const overdue = m.overdue_amount ?? 0;
    const pending = Math.max(0, (m.unpaid_amount ?? 0) - overdue);
    return {
      id: m.id,
      label: m.label,
      isCurrent: monthKey(m.year, m.month) === currentKey,
      Pago: m.paid_amount ?? 0,
      Pendente: pending,
      Vencida: overdue,
    };
  });

  const yearTotals = yearMonths.reduce(
    (acc, m) => {
      const overdue = m.overdue_amount ?? 0;
      return {
        paid: acc.paid + (m.paid_amount ?? 0),
        pending: acc.pending + Math.max(0, (m.unpaid_amount ?? 0) - overdue),
        overdue: acc.overdue + overdue,
      };
    },
    { paid: 0, pending: 0, overdue: 0 }
  );
  const yearTotal = yearTotals.paid + yearTotals.pending + yearTotals.overdue;
  const paidPct = yearTotal > 0 ? (yearTotals.paid / yearTotal) * 100 : 0;
  const pendingPct = yearTotal > 0 ? (yearTotals.pending / yearTotal) * 100 : 0;
  const overduePct = yearTotal > 0 ? 100 - paidPct - pendingPct : 0;

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={220} height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={64} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={140} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          Não foi possível carregar o histórico
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Verifique sua conexão e tente novamente.
        </Typography>
        <Button variant="contained" onClick={retry}>
          Tentar novamente
        </Button>
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
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
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select value={selectedYear || ''} onChange={(e) => setYearOverride(Number(e.target.value))}>
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total em {selectedYear}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {formatCurrencyBRL(yearTotal)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                height: 8,
                borderRadius: 1,
                overflow: 'hidden',
                mt: 2,
                mb: 1.5,
                bgcolor: 'action.hover',
              }}
            >
              {yearTotal > 0 && (
                <>
                  <Box sx={{ width: `${paidPct}%`, bgcolor: 'success.main' }} />
                  <Box sx={{ width: `${pendingPct}%`, bgcolor: 'warning.main' }} />
                  <Box sx={{ width: `${overduePct}%`, bgcolor: 'error.main' }} />
                </>
              )}
            </Box>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Pago: <strong>{formatCurrencyBRL(yearTotals.paid)}</strong>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Pendente: <strong>{formatCurrencyBRL(yearTotals.pending)}</strong>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Vencida: <strong>{formatCurrencyBRL(yearTotals.overdue)}</strong>
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={view}
              onChange={(_, v) => v && setView(v)}
            >
              <ToggleButton value="chart">
                <BarChartOutlined fontSize="small" sx={{ mr: 0.5 }} />
                Gráfico
              </ToggleButton>
              <ToggleButton value="table">
                <TableRowsOutlined fontSize="small" sx={{ mr: 0.5 }} />
                Tabela
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {view === 'chart' ? (
            <ResponsiveContainer width="100%" height={isMobile ? 320 : 500}>
              <BarChart data={chartData} margin={isMobile ? { bottom: 40 } : undefined}>
                {chartData.map(
                  (entry) =>
                    entry.isCurrent && (
                      <ReferenceArea
                        key={entry.label}
                        x1={entry.label}
                        x2={entry.label}
                        fill={theme.palette.primary.main}
                        fillOpacity={0.08}
                        ifOverflow="visible"
                      />
                    )
                )}
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                  dataKey="label"
                  stroke={theme.palette.text.secondary}
                  angle={isMobile ? -40 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 50 : 30}
                  interval={0}
                  tick={{ fontSize: isMobile ? 11 : 12 }}
                />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip
                  cursor={{ fill: theme.palette.action.hover }}
                  formatter={(value) => formatCurrencyBRL(Number(value) || 0)}
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Bar dataKey="Pago" fill={theme.palette.success.main} stackId="a">
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      cursor="pointer"
                      onClick={() => navigate(`/months/${entry.id}`)}
                    />
                  ))}
                </Bar>
                <Bar dataKey="Pendente" fill={theme.palette.warning.main} stackId="a">
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      cursor="pointer"
                      onClick={() => navigate(`/months/${entry.id}`)}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="Vencida"
                  fill={theme.palette.error.main}
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      cursor="pointer"
                      onClick={() => navigate(`/months/${entry.id}`)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Paper sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Mês</TableCell>
                    <TableCell align="right">Pago</TableCell>
                    <TableCell align="right">Pendente</TableCell>
                    <TableCell align="right">Vencida</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chartData.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      onClick={() => navigate(`/months/${row.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontWeight: row.isCurrent ? 700 : 400 }}>
                        {row.label}
                        {row.isCurrent && ' (atual)'}
                      </TableCell>
                      <TableCell align="right">{formatCurrencyBRL(row.Pago)}</TableCell>
                      <TableCell align="right">{formatCurrencyBRL(row.Pendente)}</TableCell>
                      <TableCell align="right">{formatCurrencyBRL(row.Vencida)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrencyBRL(row.Pago + row.Pendente + row.Vencida)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </>
      )}

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
