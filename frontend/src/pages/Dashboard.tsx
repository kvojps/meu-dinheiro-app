import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Pagination,
  LinearProgress,
} from '@mui/material';
import { api } from '../api/client';
import { Month } from '../types/models';
import AppSnackbar from '../components/AppSnackbar';
import { useSnackbar } from '../hooks/useSnackbar';
import { formatCurrencyBRL } from '../utils/format';

const PAGE_SIZE = 12;

export default function Dashboard() {
  const [months, setMonths] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromOverride, setFromOverride] = useState('');
  const [toOverride, setToOverride] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { snackbar, showError, closeSnackbar } = useSnackbar();

  useEffect(() => {
    api
      .getMonths()
      .then((data) => setMonths(data))
      .catch(showError)
      .finally(() => setLoading(false));
  }, [showError]);

  const monthOptions = useMemo(() => {
    return [...months]
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((m) => ({
        label: m.label,
        value: `${m.year}-${String(m.month).padStart(2, '0')}`,
      }));
  }, [months]);

  const fromValue = fromOverride || monthOptions[0]?.value || '';
  const toValue = toOverride || monthOptions[monthOptions.length - 1]?.value || '';

  const filteredMonths = useMemo(() => {
    return months.filter((m) => {
      const key = `${m.year}-${String(m.month).padStart(2, '0')}`;
      return key >= fromValue && key <= toValue;
    });
  }, [months, fromValue, toValue]);

  const totalPages = Math.max(1, Math.ceil(filteredMonths.length / PAGE_SIZE));
  const paginatedMonths = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredMonths.slice(start, start + PAGE_SIZE);
  }, [filteredMonths, page]);

  const summary = useMemo(
    () =>
      filteredMonths.reduce(
        (acc, m) => ({
          paid: acc.paid + (m.paid_amount ?? 0),
          pending: acc.pending + (m.unpaid_amount ?? 0),
        }),
        { paid: 0, pending: 0 }
      ),
    [filteredMonths]
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (months.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Nenhum mês cadastrado
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Vá para a página de Configuração para iniciar.
        </Typography>
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Pago no período
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }} color="success.main">
              {formatCurrencyBRL(summary.paid)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Pendente no período
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }} color="warning.main">
              {formatCurrencyBRL(summary.pending)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total no período
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {formatCurrencyBRL(summary.paid + summary.pending)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1" sx={{ minWidth: 80 }}>
            Exibir meses:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>De</InputLabel>
            <Select
              value={fromValue}
              label="De"
              onChange={(e) => {
                setFromOverride(e.target.value);
                setPage(1);
              }}
            >
              {monthOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Até</InputLabel>
            <Select
              value={toValue}
              label="Até"
              onChange={(e) => {
                setToOverride(e.target.value);
                setPage(1);
              }}
            >
              {monthOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {paginatedMonths.map((month) => {
          const total = month.total_accounts ?? 0;
          const paid = month.paid_accounts ?? 0;
          const allPaid = total > 0 && paid === total;

          return (
            <Grid item xs={12} sm={6} md={4} key={month.id}>
              <Card>
                <CardActionArea onClick={() => navigate(`/months/${month.id}`)}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {month.label}
                      </Typography>
                      {total > 0 ? (
                        <Chip
                          label={`${paid}/${total} pagas`}
                          color={allPaid ? 'success' : 'warning'}
                          size="small"
                        />
                      ) : (
                        <Chip label="Sem contas" size="small" />
                      )}
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700 }}
                      color={allPaid ? 'success.main' : 'text.primary'}
                    >
                      {formatCurrencyBRL(month.total_amount ?? 0)}
                    </Typography>

                    {total > 0 && (
                      <Box sx={{ mt: 1.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(paid / total) * 100}
                          color={allPaid ? 'success' : 'warning'}
                          sx={{ height: 6, borderRadius: 1, mb: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {Math.round((paid / total) * 100)}% pago
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredMonths.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Nenhum mês encontrado no intervalo selecionado.
        </Typography>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
