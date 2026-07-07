import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { DefaultExpense } from '@shared/types/models';
import { defaultExpenseFormSchema, DefaultExpenseFormValues } from './formSchemas';

interface DefaultExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; due_day?: number; amount: number }) => void;
  initial?: DefaultExpense | null;
}

export function DefaultExpenseForm({ open, onClose, onSave, initial }: DefaultExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DefaultExpenseFormValues>({
    resolver: zodResolver(defaultExpenseFormSchema),
    defaultValues: {
      name: initial?.name ?? '',
      amount: initial ? String(initial.amount) : '',
      dueDay: initial?.due_day ? String(initial.due_day) : '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    onSave({
      name: values.name,
      due_day: values.dueDay ? Number(values.dueDay) : undefined,
      amount: Number(values.amount) || 0,
    });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Editar Despesa Padrão' : 'Nova Despesa Padrão'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nome da despesa"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mt: 1, mb: 2 }}
          {...register('name')}
        />
        <TextField
          label="Valor (R$) - opcional"
          type="number"
          fullWidth
          error={!!errors.amount}
          helperText={errors.amount?.message ?? 'Deixe em branco para despesas de valor variável.'}
          sx={{ mb: 2 }}
          {...register('amount')}
        />
        <TextField
          label="Dia de vencimento"
          type="number"
          fullWidth
          error={!!errors.dueDay}
          helperText={errors.dueDay?.message ?? 'Opcional. Dia do mês em que a despesa vence.'}
          inputProps={{ min: 1, max: 31 }}
          {...register('dueDay')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSubmit()}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
