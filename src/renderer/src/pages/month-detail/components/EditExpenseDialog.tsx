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
import { Expense } from '@/types/models';
import { expenseFormSchema, ExpenseFormValues } from './formSchemas';

interface EditExpenseDialogProps {
  open: boolean;
  expense: Expense;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    amount: number;
    due_date?: string;
    notes?: string;
  }) => Promise<boolean>;
}

export function EditExpenseDialog({ open, expense, onClose, onSubmit }: EditExpenseDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      name: expense.name,
      amount: expense.amount ? String(expense.amount) : '',
      dueDate: expense.due_date || '',
      notes: expense.notes || '',
    },
  });

  const submit = handleSubmit(async (values) => {
    const success = await onSubmit({
      name: values.name,
      amount: values.amount ? Number(values.amount) : 0,
      due_date: values.dueDate || undefined,
      notes: values.notes || undefined,
    });
    if (success) onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Despesa</DialogTitle>
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
          helperText={errors.amount?.message ?? 'Deixe em branco para valor variável.'}
          sx={{ mb: 2 }}
          {...register('amount')}
        />
        <TextField
          label="Data de vencimento"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
          {...register('dueDate')}
        />
        <TextField label="Observação" fullWidth multiline rows={2} {...register('notes')} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => submit()} disabled={isSubmitting}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
