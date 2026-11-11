# Arquitetura

[Início](../README.md) · [Desenvolvimento](development.md) · [Dados](storage.md)

O aplicativo reúne Electron, React e TypeScript num pacote npm independente.
O processo principal é dono do SQLite e do sistema de arquivos; o renderer
apresenta a interface e conversa por uma API tipada exposta pelo preload.

| Caminho                    | Responsabilidade                                      |
| -------------------------- | ----------------------------------------------------- |
| `src/main/index.ts`        | Inicialização do banco, serviços, janela e tema       |
| `src/main/controllers/`    | Canais IPC, validação de entradas e respostas         |
| `src/main/services/`       | Regras e coordenação de operações de negócio          |
| `src/main/domain/`         | Conceitos e cálculos puros do processo principal      |
| `src/main/infra/database/` | Conexão SQLite, migrações e repositórios              |
| `src/main/infra/gateways/` | ZIP, comprovantes e integração com o sistema          |
| `src/preload/`             | Ponte `window.api` com `contextIsolation`             |
| `src/shared/`              | Tipos, erros e contratos IPC compartilhados           |
| `src/renderer/src/`        | React, páginas, navegação, hooks e componentes locais |
| `resources/`, `build/`     | Ícones e recursos de empacotamento                    |
| `scripts/`                 | Geração dos avisos de terceiros                       |

## Fluxo

Uma ação da interface chama `window.api`; o preload invoca um canal IPC. O
controller valida a entrada, o serviço aplica a regra, e os repositórios/gateways
fazem a persistência. `registerIpcHandlers` compõe essas dependências. Erros são
traduzidos para a resposta IPC; avisos de alteração permitem recarregar consultas.
O renderer não recebe acesso direto ao Node.js nem ao banco.

## Composição e transações

`registerIpcHandlers` compõe repositórios, gateways e serviços e registra os
controllers. Retorna o serviço de meses para o bootstrap garantir o mês corrente
depois do registro dos canais e antes de criar a janela; ao recuperar o foco,
repete a garantia e notifica a interface somente se criou o mês.

Serviços coordenam operações compostas por `repos.transaction(fn)`, enquanto
repositórios recebem a conexão SQLite e executam persistência. A unidade de
trabalho também expõe a importação integral do backup; o serviço de backup
recebe o serviço de meses para garantir o mês corrente após importar.
O caminho de uploads vem de `connection.ts` e é fornecido aos consumidores
durante a composição, sem expor a conexão do banco por um getter global.

O bootstrap lê o tema pelo repositório de configurações antes de criar a janela,
para definir a aparência inicial e a moldura nativa. Em execução, o serviço de
configurações altera o tema pelo gateway; novas janelas consultam o modo atual.
Essas responsabilidades descrevem o código atual; referências antigas ao
ADR-0002 pertenciam à origem e não representam um ADR disponível neste projeto.

## Dados e regras

Meses são competências (ano/mês). Padrões são copiados na criação de meses;
criar um padrão também o propaga aos existentes. A lista de meses usa agregados
SQL; o detalhe contém os lançamentos. Realizado é recebido menos pago; Previsto
é o total de entradas menos o total de despesas. Contas bancárias têm saldos
próprios alterados por pagamentos e recebimentos vinculados.

SQLite usa chaves estrangeiras e WAL. A importação substitui sete coleções numa
transação; comprovantes são arquivos copiados depois, fora dessa transação.
`app_settings` guarda tema e marca do mês corrente, mas não participa do JSON
exportado. Veja [armazenamento](storage.md) para os limites de recuperação.

## Interface e verificações

As rotas principais são Visão Geral, Histórico, detalhe do mês e Configurações.
Consultas de navegação preservam recorte e retorno ao abrir um mês. A interface
usa Geist, Lucide, Tailwind, componentes locais e Recharts; a decisão visual
está no [ADR existente](adr/0001-migracao-visual-orca.md).

Vitest cobre canais, consultas, navegação, categorias, paginação, lotes e tema.
TypeScript e ESLint verificam contratos e convenções. Esses checks complementam
a execução do Electron e os ensaios dos instaladores; não os substituem.
Não há alteração de esquema, funcionalidade financeira ou identidade do app
nesta documentação.
