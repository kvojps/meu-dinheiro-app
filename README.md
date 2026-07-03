# Money Manager

App local de controle financeiro pessoal: meses, contas com vencimento, contas padrão (recorrentes), comprovantes de pagamento e export/import de dados.

App desktop Electron (via `electron-vite`), com SQLite (`better-sqlite3`) acessado diretamente no processo main e comunicação main ↔ renderer por IPC (`contextBridge` + `ipcMain.handle`). Sem servidor HTTP.

Uso individual, local — sem autenticação.

## Requisitos

- Node.js 20+

## Rodando em desenvolvimento

```bash
npm install
npm run dev
```

O banco (`money-manager.db`) e a pasta `uploads/` (comprovantes) ficam em `%APPDATA%/money-manager` (Windows), fora do repositório.

## Build de produção / instalador

```bash
npm run build   # gera out/main, out/preload, out/renderer
npm run dist    # gera o instalador NSIS em dist/
```

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe o app Electron em modo desenvolvimento (hot reload no renderer) |
| `npm run build` | Build de produção via `electron-vite` |
| `npm run preview` | Roda o build de produção localmente |
| `npm run dist` | Build + empacota o instalador `.exe` (NSIS) via `electron-builder` |
| `npm run lint` | ESLint |
| `npm run format` | Formata com Prettier |
| `npm run format:check` | Verifica formatação sem alterar arquivos |

## Estrutura

```
src/
  main/
    index.ts          # bootstrap do Electron (BrowserWindow, lifecycle)
    db/                # connection.ts + repositórios SQL por domínio
    ipc/               # registerIpc.ts, backupHandlers.ts
    files/             # I/O de comprovantes (receiptsStorage.ts)
    schemas/           # Validação de entrada (zod)
    errors/            # AppError
    constants/         # Nomes de mês, formatação de data de vencimento
    utils/             # parseId, parseOrThrow
  preload/
    index.ts           # contextBridge: expõe window.api
  shared/
    ipc/               # channels.ts, api.ts (contrato ElectronApi)
    types/             # Tipos de domínio compartilhados
  renderer/
    src/                # React 19 + MUI + Vite (components, hooks, pages)
```
