import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { expenseFormSchema, ExpenseFormValues } from './formSchemas';

const emptyValues: ExpenseFormValues = { name: '', amount: '', dueDate: '', notes: '' };

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; amount: number; due_date?: string }) => Promise<boolean>;
}

export function AddExpenseDialog({ open, onClose, onSubmit }: AddExpenseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: emptyValues,
  });

  function handleClose() {
    reset(emptyValues);
    onClose();
  }

  const submit = handleSubmit(async (values) => {
    const success = await onSubmit({
      name: values.name,
      amount: Number(values.amount) || 0,
      due_date: values.dueDate || undefined,
    });
    if (success) handleClose();
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nova Despesa</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nome"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mt: 1, mb: 2 }}
          {...register('name')}
        />
        <TextField
          label="Valor (R$)"
          type="number"
          fullWidth
          error={!!errors.amount}
          helperText={errors.amount?.message}
          sx={{ mb: 2 }}
          {...register('amount')}
        />
        <TextField
          label="Data de vencimento"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('dueDate')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => submit()} disabled={isSubmitting}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
