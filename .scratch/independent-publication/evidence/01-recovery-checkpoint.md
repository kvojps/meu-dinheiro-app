# Recuperação e ponto de corte — 2026-11-10

## Escopo e resultado

Checkpoint anterior à extração. Nenhuma reescrita, publicação, retirada de arquivos
ou alteração de configuração remota foi executada. O destino já é público; isso
não autoriza enviar os commits locais nem o conteúdo privado de recuperação.
Os bloqueios abaixo continuam obrigatórios nas etapas indicadas.

## Estado fixado

| Item | Origem | Destino |
| --- | --- | --- |
| Diretório relativo | `../my-desktop-apps` | `.` |
| Remote | `https://github.com/kvojps/my-desktop-apps.git` | `https://github.com/kvojps/meu-dinheiro-app.git` |
| Visibilidade conferida por API | privada | pública |
| Branch | `main` | `main` |
| HEAD local antes deste trabalho | `17cb66b31d39bd04725ec6708263ea2f3d113df9` | `3516b4f9158f61c908c8dcd19516a712930f1e1c` |
| HEAD remoto por `git ls-remote` | `17cb66b31d39bd04725ec6708263ea2f3d113df9` | `36b6c22635200203f3c13140f9674b40b305eb16` |
| Árvore inicial | limpa | limpa; oito commits à frente do remoto |
| Preparação original do destino | não se aplica | `36b6c22635200203f3c13140f9674b40b305eb16` |

Origem: uma branch local, três refs de branch/acompanhamento contando
`origin/HEAD` e seis tags locais; o remoto anuncia `main` e duas tags de release.
Destino: `main`, `origin/main` e `origin/HEAD`, sem tags locais ou remotas.
O inventário integral de nomes e hashes de refs está nos JSON privados. Não foi
feito fetch nem push. Refs que o servidor não anuncia não são cobertas.

O caminho do app contém 209 arquivos rastreados. Há 69 commits que o atingem
alcançáveis por HEAD e 102 considerando todas as refs locais. São conjuntos
diferentes: a extração deverá definir explicitamente a ancestralidade de HEAD
como linha de entrega e verificar separadamente as demais refs preservadas no
backup, sem importar tags.

## Caminhos selecionados

O filtro deve preservar `apps/meu-dinheiro-app/` e promover seu conteúdo à raiz.
O histórico local começa nesse prefixo, nos commits de entrada no monorepo.
A busca de renomeações em todas as refs locais (`git log --all --find-renames
--diff-filter=R --name-status`) não identificou entradas ou saídas desse prefixo.
Não foi identificado prefixo anterior a acrescentar. Isso cobre o histórico
presente no Git local, não eventuais repositórios anteriores externos.

| Suporte da raiz selecionado | Justificativa e adaptação posterior |
| --- | --- |
| `package.json`, `package-lock.json` | ferramentas, versões resolvidas e rebuild do Electron; remover workspaces e dependências alheias, gerar lockfile próprio |
| `tsconfig.base.json` | configuração estendida pelo `tsconfig.json` do app |
| `eslint.config.mjs` | regras existentes; adaptar globs para a raiz independente |
| `.prettierrc.json`, `.prettierignore` | formatação existente; adaptar globs e exclusões |
| `vitest.config.ts` | execução dos testes existentes; adaptar descoberta e aliases |
| `.gitignore`, `.gitattributes` | exclusão de dados/artefatos e normalização de arquivos |
| `LICENSE` | licença usada também pelo empacotamento |
| `scripts/generate-third-party-notices.mjs` | geração exigida por `notices` e pelos instaladores; remover pressupostos de workspace |

Esses arquivos são candidatos explícitos à preservação histórica, sujeitos à
revisão de privacidade. Não copiar seus conteúdos atuais sem validar histórico.
`README.md` da raiz do monorepo, demais `apps/`, `node_modules/`, `out/`, `dist/`,
planejamento `.scratch/`, skills e configurações pessoais não entram no filtro.
Documentação do app já está no prefixo selecionado. Os ADRs e design system da
raiz devem ser consultados na adaptação, sem inclusão indiscriminada: selecionar
somente trechos ainda aplicáveis no ticket 03 e registrar sua proveniência.
A preparação revisada deste destino deve ser aplicada depois da extração,
sem unir raízes desconectadas. Seus commits originais estão no backup.

## Backup privado

Local persistente nesta máquina: `.git/private-recovery/2026-11-10/`.
O diretório pai tem modo `0700`, fora da árvore versionada e do conteúdo
transportado por um push ou clone Git comum. Não adicionar, copiar para a árvore,
empacotar nem publicar seu conteúdo. Não usar o clone de recuperação como origem
de publicação. Uma cópia está no mesmo disco: não protege contra perda do disco.

- `source.tar`: diretório inteiro da origem, incluindo `.git`, refs, reflogs,
  objetos, arquivos ignorados, dependências e instaladores locais.
- `destination.tar`: `.git`, `.agents`, `.claude`, `.scratch`, `docs`, `AGENTS.md`
  e `skills-lock.json` anteriores ao trabalho. Exclui a própria pasta de backup.
  `.aws` e `.codex` são montagens da sessão e não são arquivos do projeto a migrar;
  não foram copiados nem foi feita leitura de credenciais.
- `source.bundle` e `destination.bundle`: `git bundle create ... --all`, ambos
  validados por `git bundle verify`; complemento aos arquivos completos do Git,
  pois bundle sozinho não conserva índice, configuração, reflogs ou ignorados.
- `source-checkpoint.json` e `destination-checkpoint.json`: HEAD, refs, estado e
  contagens. `checksums.json`: SHA-256 dos quatro arquivos de backup.
- `restored/`: restaurações isoladas dos arquivos e clones mirror dos bundles.
  `restore-results.json` e arquivos `*-fsck.txt`: resultados da validação.
- `prior-installers/`: download autenticado dos dois instaladores da release
  `2026-09-15-00-00-00`, sem alterar releases antigas.

Restauração comprovada: 70.297 arquivos regulares da origem e 479 do destino,
com HEAD, refs, estado e integridade Git conferidos nas duas cópias.

A restauração confere bytes SHA-256 de cada arquivo regular contra seu membro no
tar, modos e destinos dos links simbólicos antes de executar Git. Depois confere
HEAD, todas as refs e estado inicial, executa `git fsck --full` e compara refs dos
clones mirror dos bundles. Os proprietários originais permanecem nos metadados do
tar; a restauração de teste usa o usuário atual, sem aplicar propriedade de root.
Não usar os binários Electron restaurados como prova de instalação gráfica.

## Pré-requisitos e limites

| Verificação | Evidência / consequência |
| --- | --- |
| Espaço | 57 GiB livres antes da cópia; backups e restaurações no disco persistente, não no tmpfs de `/tmp` |
| Ferramentas | Git 2.53.0, GNU tar 1.35, Python 3.14.4, Node 24.20.0, npm 11.19.0 e `gh` disponíveis |
| Ferramentas do app | `tsc`, Vitest, ESLint, electron-builder e electron-rebuild presentes na origem e preservados na cópia; não comprova instalação autônoma |
| Filtragem | `git-filter-repo` não está no PATH; bloqueia o ticket 02 até disponibilização e registro da versão |
| Destino | API confirma `push`, `maintain` e `admin`; acesso de leitura e refs remotas conferidos, sem testar push |
| Actions | habilitado, ações permitidas; token de workflow tem escrita desabilitada por padrão (`read`); ticket 05 deverá declarar permissões mínimas para preparar release e ticket 08 comprovar execução |
| Instaladores anteriores | acesso autenticado e download realizados; hashes conferidos com arquivos locais e digests das duas releases |
| Linux x64 gráfico | kernel x86_64, sessão Wayland, DISPLAY e sockets Wayland/X11 presentes; instalação, isolamento de perfil e uso pelo agente ainda dependem da validação do ticket 09 |
| Windows x64 gráfico | ambiente não demonstrado; Wine presente não comprova Windows; bloqueia ticket 10 e, por dependência, 11 e 12 |
| Inspeção NSIS | `7z` não está no PATH; cobertura interna segue pendente no ticket 06; providenciar ferramenta apropriada antes de concluir auditoria |

Checksums dos instaladores anteriores (correspondem aos digests da API):

- deb: `1281db93073baf1c5f3ac35d3513044091982c5f3da9a928fe8f3122ab6f1adc`.
- NSIS: `c7a90769ed0fe17cf67778f96c2e41c47147d6f665cd46cf79c70f68cbb00460`.

A permissão administrativa consultada não comprova que um workflow futuro
conseguirá publicar. Não foram acionados workflows, alteradas permissões ou
revelados tokens. Os metadados internos dos instaladores e compatibilidade de
versão continuam para os tickets de empacotamento e validação.

## Recuperação e retenção

Antes de reescrever, conferir os checksums privados e os resultados de restauração.
Para recuperar, criar diretório privado vazio, extrair o tar correspondente com
preservação de permissões e validar HEAD, refs e `git fsck --full` contra o JSON.
O bundle permite reconstruir refs e objetos alcançáveis em clone mirror separado;
para arquivos ignorados, configuração e reflogs, usar o tar completo. Não sobrescrever
a origem ou destino em uso: comparar primeiro e recuperar apenas após identificar
o que mudou. Nenhum comando de reset ou limpeza da origem é parte deste checkpoint.

Manter backups, instaladores, mapeamento futuro de commits e evidências privadas
fora do material publicável até o aceite final. Antes de substituir ou apagar o
checkout do destino, copiar essa pasta privada para armazenamento privado
persistente e verificar os checksums novamente; uma nova clonagem não a transporta.
Se o ponto de corte mudar, repetir inventário, backup e prova de restauração antes
de prosseguir. Depois de publicar, não presumir autorização para reescrever
histórico público ou fazer downgrade: recuperação exige decisão específica que
preserve dados e respeite os aceites separados de código e release.

## Validação executada

Na cópia restaurada da origem, sem escrever no checkout original:

- `npm run typecheck -w meu-dinheiro-app`: passou.
- `npx --no-install vitest run apps/meu-dinheiro-app/src/shared/ipc/channels.test.ts`:
  um arquivo, cinco testes passaram.
- `npm test`: suíte completa existente, 44 arquivos e 369 testes passaram.

O destino ainda não contém aplicativo ou scripts de typecheck/testes. Nenhum
novo teste foi necessário para esta alteração documental e operacional; a prova
principal é a restauração real dos arquivos e refs. Esses resultados não
substituem os checks da futura extração autônoma nem os testes dos instaladores.
