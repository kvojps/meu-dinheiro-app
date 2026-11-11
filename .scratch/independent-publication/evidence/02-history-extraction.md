# Extração do histórico — 2026-11-10

## Resultado

Ticket 02 executado em clone descartável privado, sem substituir o checkout atual,
sem push e sem retirar arquivos da origem. O ticket 03 deve continuar a partir do
clone extraído; executar o aplicativo de forma autônoma ainda depende das adaptações
desse ticket. O destino público permanece com seu histórico remoto anterior.

- Ponto de corte: `17cb66b31d39bd04725ec6708263ea2f3d113df9`.
- Ferramenta: `git-filter-repo` 2.47.0, identificação `a40bce548d2c`, disponível
  no cache local de uv; executada com Python 3.14.4, sem download.
- Histórico selecionado: ancestralidade de `main` no ponto de corte, clonada do
  bundle com `--single-branch --branch main --no-tags`.
- Entrada do filtro: 248 commits; 84 commits sobreviventes, com 220 arquivos
  na árvore final (209 do aplicativo e 11 de suporte).
- Árvore filtrada: `02db387800c36bb0b8ffe1ede1ec190958e2908b`.
- Preparação posterior: `8bd21359c2352e03aa1c8510cf2eda63d13c4cbd`, descendente
  direto da árvore filtrada, com 168 arquivos do destino e 388 arquivos finais.
- Nenhuma tag, release, remote ou raiz Git desconectada foi importada.

## Seleção e equivalência

Aplicada a seleção e as justificativas do [checkpoint 01](01-recovery-checkpoint.md):
`apps/meu-dinheiro-app/` promovido à raiz; suporte explícito preservado.
A única exceção de localização é o `package.json` compartilhado, colocado em
`migration-support/package.json` para não colidir com o pacote do aplicativo.
Esse arquivo conserva ferramentas e scripts como referência para adaptação;
não é o pacote executável da nova raiz. O lockfile compartilhado continua na raiz,
ainda sem validade como lockfile independente até o ticket 03.

Os demais arquivos de suporte selecionados conservam seus nomes na raiz:
`package-lock.json`, `tsconfig.base.json`, `eslint.config.mjs`, `.prettierrc.json`,
`.prettierignore`, `vitest.config.ts`, `.gitignore`, `.gitattributes`, `LICENSE` e
`scripts/generate-third-party-notices.mjs`. Não foram importados outros caminhos
da origem. O suporte pode mencionar outros aplicativos; sua adaptação e auditoria
continuam obrigatórias nos tickets 03 e 06.

A comparação independente por `git ls-tree -rz` verificou caminhos, modos e IDs
Git dos blobs de **cada um dos 84 commits sobreviventes**, além da árvore de ponta,
contra a seleção correspondente no commit original. Nenhuma adaptação de conteúdo
foi aplicada. Commits compartilhados retêm somente os caminhos selecionados;
mensagens sobre outros aplicativos podem permanecer quando o commit altera suporte
selecionado. Mensagens não foram reescritas para disfarçar essa proveniência.

Os 33 commits do aplicativo alcançáveis somente pelas outras refs locais foram
inventariados separadamente, permanecem no backup validado e não pertencem à linha
de entrega escolhida. Não foram importadas essas refs nem suas tags. Não foi
identificado prefixo histórico adicional no checkpoint; repositórios externos
anteriores não são cobertos.

## Atribuições e mensagens

Comparados autoria, committer, nomes, e-mails, datas com fuso e mensagens de todos
os commits sobreviventes. Todos os campos de autor e committer já usam
`62623689+kvojps@users.noreply.github.com`; nenhuma substituição adicional foi
necessária. A ferramenta preservou referências textuais aos hashes antigos
(`--preserve-commit-hashes`) e a codificação (`--preserve-commit-encoding`).

A revisão das mensagens encontrou trailers `Claude-Session` apontando para sessões
pessoais. O usuário autorizou especificamente sua remoção nesta execução.
Removidas 29 linhas, preservando o restante das mensagens byte a byte, inclusive
créditos `Co-Authored-By` e o contato legítimo de coautoria. Não foram substituídos
indiscriminadamente e-mails de terceiros. Nenhum outro achado de mensagem ficou
sem classificação nesta revisão; isso não substitui a auditoria de conteúdo
histórico, imagens e instaladores prevista no ticket 06.

## Preparação e recuperação

O commit original da preparação `36b6c22635200203f3c13140f9674b40b305eb16`
continua no backup original. Antes de aplicar a preparação, também foi criado e
validado um bundle privado de todas as refs atuais do destino, incluindo
`918ed7bcc9e0128b068d7a0a9a0e43a020bab0be`.

A preparação revisada inclui skills, convenções, documentação de agentes e
planejamento local do destino. A inspeção dirigida não encontrou trailers de
sessão, caminhos pessoais absolutos ou padrões de chave privada/token nesses
arquivos. Seus 168 arquivos foram preservados sem alteração em um commit novo;
comparação de blobs e modos comprovou essa preservação e a ausência de colisões
com os 220 arquivos extraídos. O histórico final tem uma única raiz. A revisão
completa do material publicável permanece no ticket 06, inclusive decidir quais
arquivos de preparação devem compor a entrega pública.

Registros privados persistentes em `.git/private-extraction/2026-11-10/` (pasta
protegida por modo 0700, fora da árvore versionada):

- `app/`: clone filtrado, branch `main`, sem remotes ou tags.
- `commit-map`: correspondência dos hashes originais e extraídos, inclusive
  entradas descartadas; original também em `app/.git/filter-repo/commit-map`.
- `verification.json`, `filter-command.json`: resultados e argumentos do filtro.
- `extract-history.py`, `preserve-preparation.py`: procedimentos executados;
  não executar novamente sobre o clone final, pois recriam etapas da extração.
- `other-ref-app-commits.txt`: inventário dos 33 commits fora da linha selecionada.
- `destination-before-extraction.bundle`, `preparation.tar`: recuperação adicional
  da preparação, com checksum do bundle registrado no JSON privado.

Os quatro checksums dos backups do checkpoint 01 foram conferidos novamente
antes da filtragem. `git fsck --full` passou no clone filtrado. A origem continua
no mesmo HEAD, com árvore limpa. Não substituir este checkout ou remover `.git`
sem antes copiar os registros privados e os backups para armazenamento privado
persistente e conferir os checksums, como exige o checkpoint 01.

## Validação e limites

Typecheck e teste isolado de canais IPC passaram na cópia restaurada da origem
(um arquivo, cinco testes). A suíte completa existente também foi executada nessa
cópia: 44 arquivos, 369 testes passaram. Esses checks não demonstram autonomia do
clone extraído: configuração, dependências e lockfile continuam para o ticket 03.
Nenhum teste novo foi necessário para esta operação de Git; as provas desta etapa
são comparações reais de árvores, metadados, mensagens, refs e preservação.

## Revisão final

Skill `code-review` executada em dois agentes independentes, com referências
confirmadas pelo usuário: `918ed7b...9b38989` na documentação desta entrega e
`02db387...8bd2135` no clone extraído.

### Standards

Nenhum achado. Convenções de idioma e resolução dos tickets atendidas; preparação
preservada sem colisões, com contagens e hashes coerentes com os registros.

### Spec

Nenhum achado. Revisão independente confirmou as árvores e metadados dos 84
commits sobreviventes, a única alteração autorizada nas mensagens e a preservação
dos 168 arquivos de preparação. Autonomia, auditoria e publicação permanecem nas
etapas subsequentes. Total: zero achados em cada eixo.
