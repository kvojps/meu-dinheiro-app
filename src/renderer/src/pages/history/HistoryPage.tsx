import {
  BarChartOutlined,
  ChevronLeft,
  ChevronRight,
  ErrorOutline,
  TableRowsOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LabelList,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Month } from '@shared/types/month';
import { api } from '@/api/client';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useCategoryTotals } from '@/hooks/categories/useCategoryTotals';
import { monthDetailPath } from '@/routes';
import { formatCurrencyBRL } from '@/utils/format';
import { StatTile } from './components/StatTile';

function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

type TabValue = 'comparativo' | 'categories';

export function HistoryPage() {
  const [data, setData] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<TabValue>('comparativo');
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const { showError } = useSnackbar();
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

  const comparativoData = yearMonths.map((m) => {
    const income = m.total_income ?? 0;
    const expense = m.total_amount ?? 0;
    return {
      id: m.id,
      label: m.label,
      isCurrent: monthKey(m.year, m.month) === currentKey,
      Entradas: income,
      Despesas: expense,
      Saldo: income - expense,
    };
  });

  const comparativoTotals = yearMonths.reduce(
    (acc, m) => ({
      income: acc.income + (m.total_income ?? 0),
      expense: acc.expense + (m.total_amount ?? 0),
    }),
    { income: 0, expense: 0 },
  );
  const comparativoBalance = comparativoTotals.income - comparativoTotals.expense;

  const previousYearMonths = useMemo(() => {
    return data.filter((m) => m.year === selectedYear - 1);
  }, [data, selectedYear]);

  const previousYearTotals = previousYearMonths.reduce(
    (acc, m) => ({
      income: acc.income + (m.total_income ?? 0),
      expense: acc.expense + (m.total_amount ?? 0),
    }),
    { income: 0, expense: 0 },
  );

  function yoyPercent(current: number, previous: number): number | null {
    if (previous <= 0) return null;
    return ((current - previous) / previous) * 100;
  }

  const expenseDeltaPercent = yoyPercent(comparativoTotals.expense, previousYearTotals.expense);
  const incomeDeltaPercent = yoyPercent(comparativoTotals.income, previousYearTotals.income);

  const { chartRows: categoryChartRows, tableRows: categoryTableRows } =
    useCategoryTotals(selectedYear);

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
      </Box>
    );
  }

  function renderSaldoDot(props: {
    cx?: number;
    cy?: number;
    payload?: { id: number; Saldo: number };
  }) {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || !payload) return <></>;
    const color = payload.Saldo >= 0 ? theme.palette.success.main : theme.palette.error.main;
    return (
      <circle
        key={`saldo-dot-${payload.id}`}
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke={theme.palette.background.paper}
        strokeWidth={2}
        cursor="pointer"
        onClick={() => navigate(monthDetailPath(payload.id))}
      />
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Histórico
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
          <Select
            value={selectedYear || ''}
            onChange={(e) => setYearOverride(Number(e.target.value))}
          >
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatTile
            label="Saldo do ano"
            value={formatCurrencyBRL(comparativoBalance)}
            valueColor={comparativoBalance >= 0 ? theme.palette.success.main : theme.palette.error.main}
            caption={comparativoBalance >= 0 ? 'Positivo' : 'Negativo'}
            dotColor={comparativoBalance >= 0 ? theme.palette.success.main : theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatTile
            label="Total recebido"
            value={formatCurrencyBRL(comparativoTotals.income)}
            valueColor={theme.palette.success.main}
            delta={
              incomeDeltaPercent === null
                ? null
                : {
                    percent: incomeDeltaPercent,
                    increaseIsGood: true,
                    comparisonLabel: `vs. ${selectedYear - 1}`,
                  }
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatTile
            label="Total gasto"
            value={formatCurrencyBRL(comparativoTotals.expense)}
            valueColor={theme.palette.error.main}
            delta={
              expenseDeltaPercent === null
                ? null
                : {
                    percent: expenseDeltaPercent,
                    increaseIsGood: false,
                    comparisonLabel: `vs. ${selectedYear - 1}`,
                  }
            }
          />
        </Grid>
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab value="comparativo" label="Comparativo" />
        <Tab value="categories" label="Categorias" />
      </Tabs>

      {yearMonths.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Nenhum mês cadastrado em {selectedYear}.
        </Typography>
      ) : (
        <>
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

          {tab === 'comparativo' && (
            <>
              {view === 'chart' ? (
                <ResponsiveContainer width="100%" height={isMobile ? 320 : 420}>
                  <ComposedChart
                    data={comparativoData}
                    margin={isMobile ? { bottom: 40 } : undefined}
                  >
                    {comparativoData.map(
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
                        ),
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
                      cursor={{ stroke: theme.palette.divider }}
                      formatter={(value) => formatCurrencyBRL(Number(value) || 0)}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <ReferenceLine y={0} stroke={theme.palette.divider} />
                    <Line
                      type="monotone"
                      dataKey="Saldo"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={renderSaldoDot}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <Paper sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Mês</TableCell>
                        <TableCell align="right">Entradas</TableCell>
                        <TableCell align="right">Despesas</TableCell>
                        <TableCell align="right">Saldo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comparativoData.map((row) => (
                        <TableRow
                          key={row.id}
                          hover
                          onClick={() => navigate(monthDetailPath(row.id))}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell sx={{ fontWeight: row.isCurrent ? 700 : 400 }}>
                            {row.label}
                            {row.isCurrent && ' (atual)'}
                          </TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Entradas)}</TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Despesas)}</TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 600,
                              color: row.Saldo >= 0 ? 'success.main' : 'error.main',
                            }}
                          >
                            {formatCurrencyBRL(row.Saldo)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </>
          )}

          {tab === 'categories' && (
            <>
              {categoryTableRows.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Nenhuma despesa categorizada em {selectedYear}.
                </Typography>
              ) : (
                <>
                  {view === 'chart' ? (
                    <ResponsiveContainer width="100%" height={Math.max(280, categoryChartRows.length * 48)}>
                      <BarChart
                        data={categoryChartRows}
                        layout="vertical"
                        margin={{ left: 8, right: 48 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme.palette.divider}
                          horizontal={false}
                        />
                        <XAxis type="number" stroke={theme.palette.text.secondary} hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          stroke={theme.palette.text.secondary}
                          width={140}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: theme.palette.action.hover }}
                          formatter={(value, _name, entry) => {
                            const row = entry.payload as (typeof categoryChartRows)[number];
                            return [
                              `${formatCurrencyBRL(Number(value) || 0)} · ${row.count} despesa(s) · ${row.percent.toFixed(1)}%`,
                              'Total',
                            ];
                          }}
                          contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="total" barSize={20} radius={[0, 4, 4, 0]}>
                          {categoryChartRows.map((row) => (
                            <Cell key={row.key} fill={row.color} />
                          ))}
                          <LabelList
                            dataKey="total"
                            position="right"
                            formatter={(value) => formatCurrencyBRL(Number(value) || 0)}
                            style={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Paper sx={{ overflowX: 'auto' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Categoria</TableCell>
                            <TableCell align="right">Valor</TableCell>
                            <TableCell align="right">%</TableCell>
                            <TableCell align="right">Despesas</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {categoryTableRows.map((row) => (
                            <TableRow key={row.key} hover>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: '50%',
                                      bgcolor: row.color,
                                    }}
                                  />
                                  {row.name}
                                </Stack>
                              </TableCell>
                              <TableCell align="right">{formatCurrencyBRL(row.total)}</TableCell>
                              <TableCell align="right">{row.percent.toFixed(1)}%</TableCell>
                              <TableCell align="right">{row.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}
