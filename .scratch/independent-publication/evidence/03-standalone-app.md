# Autonomia do aplicativo — 2026-11-10

## Implementação

Base aprovada para revisão: preparação `8bd21359c2352e03aa1c8510cf2eda63d13c4cbd`.
Adaptações nos commits `b536999` (autonomia) e `30986a7` (normalização dos
avisos), descendentes identificáveis na branch `main` do clone extraído.
Ambos foram incorporados por fast-forward ao clone persistente
`.git/private-extraction/2026-11-10/app/`, agora em `30986a7`, sem remotes ou tags. A origem e o checkout de preparação deste destino permanecem separados;
a aplicação do histórico extraído ao checkout público depende das etapas seguintes.

- Ferramentas compartilhadas incorporadas ao pacote raiz, com scripts de lint,
  testes, formatação e instalação nativa. Removido o pacote transitório
  `migration-support/package.json` após incorporar o suporte necessário.
- TypeScript estende configuração local. ESLint aplica as regras existentes aos
  caminhos promovidos à raiz; material de skills não é código do aplicativo.
  Vitest encontra `src/**/*.test.ts` e resolve aliases locais.
- Lockfile regenerado para um único pacote, sem workspaces, links locais ou outros
  aplicativos. Dependências funcionais e versão do aplicativo foram preservadas.
- `postinstall` executa `install-electron && electron-builder install-app-deps`.
  O download explícito é necessário também com npm 11, que pode deixar de executar
  scripts de instalação das dependências. `better-sqlite3` é recompilado para o
  Electron 43.4.0 x64, e não para a ABI do Node.js do sistema.
- Geração de avisos local e independente, interrompida se `npm ls` falhar; o CLI npm
  é executado com Node.js, sem depender de invocação de `.cmd` no Windows.
  Incluídos arquivos NOTICE/licenças e licenças vendorizadas, além da seção License
  do README quando não há arquivo próprio. Autoria e contatos de terceiros são
  preservados; apenas quebras de linha e espaços finais são normalizados.
- MIT agora usa caminho local no empacotamento. Ícones e avisos continuam incluídos.
  Exclusões do Git ampliadas para arquivos SQLite, perfis, backups e `.env`.
  A lista de recursos do pacote continua restrita aos bundles, dependências e
  recursos explicitamente selecionados. `resources/` contém somente o ícone.
- Nenhuma alteração em `src/`, esquema, `appId` `com.meudinheiro.app`, nome em
  execução `meu-dinheiro` ou resolução de `userData`. Versão mantida em
  `1.0.0-beta`; a conferência dos instaladores anteriores precede eventual mudança
  para beta.1 no ticket 05.

## Verificações

Ambiente: Linux x64, Node.js 24.20.0, npm 11.19.0, Electron 43.4.0.
Procedimento de contribuição e limites em `docs/standalone-validation.md` no clone.

Primeiro clone independente, sem remotes ou tags: `/tmp/meu-dinheiro-standalone-03`.
`npm ci --no-audit --no-fund` concluiu, inclusive rebuild nativo. Typecheck, lint,
build e teste isolado dos canais IPC (1 arquivo, 5 testes) passaram. Suíte completa:
10 arquivos, 80 testes, cobrindo canais IPC, navegação, consultas de Histórico e
Visão Geral, paginação, categorias, lotes de meses, tema e retorno pendente.
Os arquivos existentes foram preservados sem alterações. Não foram criados testes
que espelhem configuração; as provas são instalação, execução e empacotamento reais.

A geração final reuniu 143 pacotes, sem avisos de licença ausente, incluindo
Electron, os avisos vendorizados de `victory-vendor` e a MIT de `isarray` no README.
O binário também distribui `LICENSE.electron.txt` e `LICENSES.chromium.html`.

Segundo clone limpo em `/tmp/meu-dinheiro-validation-03`, feito com `--no-local`
e remoção do remote antes de instalar: `npm ci --no-audit --no-fund` passou,
com download explícito do Electron e rebuild de `better-sqlite3`. Typecheck, lint,
suíte completa (10 arquivos, 80 testes), build, avisos e empacotamento Linux
`--dir` passaram. `git diff --exit-code` confirmou que regenerar os avisos
mantém a árvore limpa. O lockfile tem 718 entradas, sem workspaces ou links locais.
`git check-ignore` confirmou exclusão de perfis, backups, uploads, bancos e `.env`.

O Electron instalado por esse `npm ci` também abriu o bundle diretamente da raiz,
com novo perfil em `/tmp/meu-dinheiro-final-demo-03/`. A inspeção via DevTools
confirmou novamente título, `#/dashboard`, estado `complete` e valores zero.
As duas instâncias de ensaio foram fechadas após as verificações.

## Abertura com perfil fictício

O executável Linux empacotado abriu com `XDG_CONFIG_HOME` e `XDG_DATA_HOME`
em diretórios novos dentro de `/tmp/meu-dinheiro-demo-03/`. O perfil do aplicativo
foi criado em `config/meu-dinheiro/`, confirmando a identidade preservada.
Consulta ao DevTools local comprovou página `Meu Dinheiro`, rota `#/dashboard`,
`document.readyState = complete`, Visão Geral, um mês corrente e valores R$ 0,00.
Somente dados vazios/fictícios foram utilizados; nenhum perfil pessoal foi aberto.

O helper SUID do diretório não instalado não estava configurado. A primeira
abertura abortou; a prova gráfica foi repetida com `--no-sandbox`, apenas como
opção do comando local, sem incorporá-la a código ou scripts. Essa prova demonstra
abertura e renderização, não instalação limpa, atualização ou backup/restauração.
Essas verificações permanecem obrigatórias nos tickets 09 e 10.

## Privacidade e cobertura do pacote

A primeira inspeção real do ASAR listou 12.128 entradas, sem bancos, SQLite, ZIP,
`.env` ou diretórios de perfis, uploads, backups, Git, planejamento e skills na raiz.
MIT, avisos e ícone foram encontrados em recursos externos; licenças de Electron e
Chromium ao lado do executável. A inspeção final no segundo clone repetiu as 12.128 entradas sem caminhos
inesperados, conferiu os ícones e as licenças de Electron/Chromium, e comparou
byte a byte MIT e avisos externos com os arquivos finais da árvore versionada. Isso é uma conferência de caminhos e recursos efetivos,
sem substituir auditoria de conteúdo e histórico do ticket 06 nem inspeção do NSIS.
Nenhum perfil, backup ou log privado foi copiado para a árvore publicável.

O npm informou 29 alertas na árvore completa (20 moderados, 9 altos), além de
pacotes legados descontinuados. Não foi aplicado `npm audit fix`, que poderia
alterar contratos ou versões fora desta extração. A avaliação dos alertas e sua
presença nos candidatos é registrada para os tickets 05 e 06, antes da publicação.

## Revisão final

Skill `code-review` executada em agentes independentes contra a base aprovada.
Base dos registros locais: `9ccb9bd218f5c23725dcd9d42f371d450527ffbe`.

### Standards

Nenhuma violação documentada ou smell reportável. Convenções de idioma atendidas;
execução do CLI npm e resolução dos caminhos Windows conferidas estaticamente.
Não houve execução em Windows nesta etapa.

### Spec

Nenhum requisito ausente, escopo extra ou implementação incorreta no diff.
A instalação e reconstrução finais, pendentes durante a revisão inicial, passaram
no segundo clone; abertura e conteúdo dos recursos foram conferidos novamente.

Total: zero achados por eixo. O ticket 03 está concluído; validação de instalação,
atualização e restauração nos sistemas, auditoria histórica e publicação continuam
nos respectivos tickets. Nenhum código, tag ou release foi publicado.
