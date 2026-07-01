// Datas "YYYY-MM-DD" (due_date) não têm horário: interpretá-las com `new Date()`
// as trata como UTC meia-noite, exibindo o dia anterior em fusos negativos (ex: Brasil).
// Por isso formatamos direto das partes da string, sem passar por Date.
export function formatDateOnlyBR(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

// `paid_at` vem do SQLite (`datetime('now')`) em UTC, no formato "YYYY-MM-DD HH:MM:SS".
// Sem indicar o fuso explicitamente, `new Date()` teria parsing inconsistente entre engines.
export function formatDateTimeBR(dateTimeStr: string): string {
  const iso = dateTimeStr.includes('T') ? dateTimeStr : `${dateTimeStr.replace(' ', 'T')}Z`;
  return new Date(iso).toLocaleDateString('pt-BR');
}
