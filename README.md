# Money Manager

Aplicativo desktop (Electron) para **controle financeiro pessoal organizado por mês**: contas a pagar/receber com vencimento, contas padrão (recorrentes), comprovantes de pagamento, contas bancárias e histórico com gráficos. Uso individual, local — sem autenticação e sem servidor.

## O que o app faz

- **Dashboard**: lista os meses cadastrados, totais por conta bancária e criação de novos meses (individual ou em lote/intervalo).
- **Detalhe do mês**: contas (despesas) e receitas do mês, com marcação de pago/recebido, vínculo com conta bancária, comprovante anexado (imagem ou PDF, até 10MB) e busca/paginação.
- **Contas padrão (recorrentes)**: modelos de despesas e receitas (nome, dia de vencimento/previsto, valor) usados para preencher automaticamente novos meses.
- **Contas bancárias**: cadastro de contas com saldo, vinculáveis a despesas e receitas.
- **Histórico**: gráficos (receitas x despesas ao longo do tempo) e visão tabular dos meses.
- **Configurações**: gerenciamento de contas padrão, contas bancárias, criação de intervalo de meses e exportação/importação dos dados.
- **Backup**: exportação e importação completa dos dados (banco + comprovantes) em um arquivo `.zip`, via diálogos nativos de salvar/abrir.

Os dados ficam armazenados localmente em um banco **SQLite** (`money-manager.db`) e os comprovantes em uma pasta `uploads/`, ambos em `%APPDATA%/money-manager` (Windows) — fora do repositório e do controle de versão.

## Como executar

Pré-requisitos: Node.js 20+.

```bash
# instalar dependências (recompila o better-sqlite3 para o Electron automaticamente)
npm install

# rodar em modo desenvolvimento (abre a janela do Electron com hot reload no renderer)
npm run dev

# gerar o build de produção (compila main/preload/renderer para out/)
npm run build

# rodar o build de produção localmente, sem servidor de dev
npm run preview

# build + empacotar o instalador .exe (NSIS) via electron-builder, gerado em dist/
npm run dist

# lint e formatação
npm run lint
npm run format
npm run format:check
```

## Estrutura do projeto

```
src/
├── main/                          # Processo principal do Electron (Node.js, acesso a banco/arquivos)
│   ├── index.ts                    # Bootstrap: cria a janela, inicializa o banco e registra os handlers de IPC
│   ├── constants/                  # Nomes de mês em pt-BR e formatação de data de vencimento
│   ├── db/                         # SQLite (better-sqlite3), um repositório por domínio
│   │   ├── connection.ts            # Conexão, criação/migração do schema (months, expenses, incomes, default_*, bank_accounts)
│   │   ├── monthsRepository.ts      # CRUD e totais agregados por mês (pago/pendente/atrasado, recebido/a receber)
│   │   ├── expensesRepository.ts    # CRUD de despesas, incl. marcar/desmarcar como pago
│   │   ├── incomesRepository.ts     # CRUD de receitas, incl. marcar/desmarcar como recebido
│   │   ├── defaultExpensesRepository.ts  # CRUD das despesas padrão (recorrentes)
│   │   ├── defaultIncomesRepository.ts   # CRUD das receitas padrão (recorrentes)
│   │   ├── bankAccountsRepository.ts     # CRUD de contas bancárias e saldos
│   │   ├── backupRepository.ts      # Exportação/importação completa em .zip (banco + uploads)
│   │   └── setupRepository.ts       # Lógica de primeira execução/configuração inicial
│   ├── ipc/
│   │   ├── registerIpc.ts           # Registra os handlers de IPC de cada domínio
│   │   └── backupHandlers.ts        # Handlers de exportação/importação de dados (diálogos de arquivo)
│   ├── files/
│   │   └── receiptsStorage.ts       # Salvar/excluir/abrir comprovantes (jpg/png/gif/pdf, limite de 10MB)
│   ├── schemas/                     # Validação de entrada dos IPCs por domínio (zod)
│   ├── errors/
│   │   └── AppError.ts              # Erro tipado (status + mensagem) repassado ao renderer
│   └── utils/                       # parseId (valida IDs numéricos) e validate/parseOrThrow (parse zod)
│
├── preload/
│   └── index.ts                     # Expõe com segurança `window.api` para o renderer (contextBridge)
│
├── shared/                          # Código/tipos compartilhados entre main, preload e renderer
│   ├── ipc/                          # Constantes de canais de IPC e contrato da API exposta
│   └── types/models.ts               # Tipos de domínio: Month, Expense, Income, DefaultExpense/Income, BankAccount
│
└── renderer/                        # Interface React (roda no Chromium, sem acesso direto ao Node)
    ├── index.html
    └── src/
        ├── main.tsx                  # Ponto de entrada do React
        ├── App.tsx                   # Rotas (react-router-dom): Dashboard, MonthDetail, History, Settings
        ├── api/client.ts             # Wrapper das chamadas a `window.api` usado por páginas e hooks
        ├── pages/                    # Dashboard, MonthDetail, History (gráficos), Settings
        ├── components/               # Diálogos, formulários e cards (despesas, receitas, contas bancárias, etc.)
        ├── hooks/                    # useMonth, useDefaultExpenses/Incomes, useBankAccounts, useDataTransfer, useThemeMode, etc.
        ├── theme/                    # Tema do MUI (claro/escuro)
        ├── types/                    # Tipos de domínio usados no renderer
        └── utils/                    # Formatação de data e moeda (BRL)
```

## Stack técnica

- **Electron 35** + **electron-vite** (build de main/preload/renderer)
- **React 19** + **React Router 7**
- **MUI (Material UI) 6** + Emotion para estilização
- **recharts** para os gráficos da tela de Histórico
- **zod** para validação dos dados recebidos via IPC
- **better-sqlite3** para persistência local (SQLite)
- **archiver** / **unzipper** para exportação/importação de backup em `.zip`
- **electron-builder** para gerar o instalador Windows (NSIS)
- **TypeScript**, **ESLint** e **Prettier**
