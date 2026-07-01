# Money Manager

App local de controle financeiro pessoal: meses, contas com vencimento, contas padrão (recorrentes), comprovantes de pagamento e export/import de dados.

- **Backend**: Express + TypeScript + better-sqlite3 (`backend/`)
- **Frontend**: React 19 + MUI + Vite (`frontend/`)

Uso individual, local — sem autenticação.

## Requisitos

- Node.js 20+

## Rodando em desenvolvimento

Backend e frontend são pacotes independentes (sem workspace na raiz); rode cada um em um terminal.

```bash
# terminal 1 — backend (http://localhost:3001)
cd backend
npm install
npm run dev

# terminal 2 — frontend (http://localhost:5173, com proxy para /api)
cd frontend
npm install
npm run dev
```

O backend cria `data.db` (SQLite) e a pasta `uploads/` na raiz do projeto na primeira execução.

## Build de produção

```bash
cd frontend && npm run build   # gera frontend/dist
cd ../backend && npm run build # gera backend/dist
npm start                      # dentro de backend/, serve a API e o frontend/dist juntos
```

## Scripts disponíveis (em cada pacote)

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe em modo desenvolvimento (hot reload) |
| `npm run build` | Typecheck + build de produção |
| `npm run lint` | ESLint |
| `npm run format` | Formata com Prettier |
| `npm run format:check` | Verifica formatação sem alterar arquivos |

## Estrutura do backend

```
backend/src/
  routes/       # Express routers — parsing/validação, delega ao service
  services/     # Regra de negócio (SQL via better-sqlite3)
  schemas/      # Validação de entrada (zod)
  middleware/    # asyncHandler, errorHandler, validate
  errors/        # AppError
  constants/     # Nomes de mês, formatação de data de vencimento
```

## Plano de melhoria

O diagnóstico de qualidade de código e o plano priorizado (com andamento) estão em [`PLANO_MELHORIA.md`](./PLANO_MELHORIA.md).
