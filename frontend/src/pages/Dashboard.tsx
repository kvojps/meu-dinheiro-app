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
} from '@mui/material';
import { api, Month } from '../api/client';

const PAGE_SIZE = 12;

export default function Dashboard() {
  const [months, setMonths] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.getMonths()
      .then((data) => setMonths(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const monthOptions = useMemo(() => {
    return [...months]
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((m) => ({
        label: m.label,
        value: `${m.year}-${String(m.month).padStart(2, '0')}`,
      }));
  }, [months]);

  useEffect(() => {
    if (monthOptions.length > 0) {
      if (!fromValue) setFromValue(monthOptions[0].value);
      if (!toValue) setToValue(monthOptions[monthOptions.length - 1].value);
    }
  }, [monthOptions]);

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

  useEffect(() => {
    setPage(1);
  }, [fromValue, toValue]);

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
      </Box>
    );
  }

  return (
    <Box>
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
              onChange={(e) => setFromValue(e.target.value)}
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
              onChange={(e) => setToValue(e.target.value)}
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
                <CardActionArea onClick={() => navigate(`/meses/${month.id}`)}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {month.label}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      {total > 0 ? (
                        <>
                          <Chip
                            label={`${paid}/${total} pagas`}
                            color={allPaid ? 'success' : 'warning'}
                            size="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            {Math.round((paid / total) * 100)}%
                          </Typography>
                        </>
                      ) : (
                        <Chip label="Sem contas" size="small" />
                      )}
                    </Box>
                    <Typography variant="body1" color="primary">
                      Total: R$ {(month.total_amount ?? 0).toFixed(2)}
                    </Typography>
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
    </Box>
  );
}
