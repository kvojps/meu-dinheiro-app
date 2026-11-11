# Geração da release em rascunho — 2026-11-10

## Primeira tentativa: GitHub Actions

Na primeira tentativa, o ticket 08 ficou pendente por bloqueio de cobrança do
GitHub. Essa execução não produziu rascunho ou instalador para conferir.

Destino conferido pela API: `kvojps/meu-dinheiro-app`, público, branch padrão
`main`, permissão `ADMIN`. `main` permanece no commit aprovado
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`; lista de releases vazia antes
e após a tentativa.

Workflow `release-draft.yml` acionado manualmente com `--ref main` e input
`commit=9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`.
[Execução 42930663083](https://github.com/kvojps/meu-dinheiro-app/actions/runs/42930663083),
criada em `2026-11-11T00:21:11Z` (2026-11-10, 21:21:11 em America/Recife).
O `headSha` retornado corresponde ao commit aprovado.

Job `build` (130228293532) terminou em `failure`, sem etapas executadas.
Sua anotação informa: “The job was not started because your account is locked
due to a billing issue.” Job `draft` ignorado (`skipped`). A API de artefatos
retornou `total_count: 0`; API de releases retornou lista vazia.

Versão esperada: `1.0.0-beta.1`; tag prevista: `v1.0.0-beta.1`;
classificação prevista: `draft: true`, `prerelease: true`. Esses valores são
configuração do workflow, não metadados de uma release criada. Nenhum checksum
novo disponível. O deb privado do 07 não substitui os bytes ausentes do runner.

## Retomada prevista antes da mudança de método

O mantenedor precisa regularizar o bloqueio de cobrança da conta no GitHub.
Depois, revalidar commit remoto, ausência de tag/release conflitante e repetir
o workflow sobre o SHA aprovado. Conferir os três anexos efetivos, hashes,
conteúdo do deb e notas antes de concluir 08. Manter rascunho sem publicação.
Linux instalado continua no 09; Windows permanece fora desta entrega.
Publicação depende do 11 e de aceite específico da release.

## Verificações no checkout de coordenação na primeira tentativa

Nenhum código, dependência, workflow ou candidato alterado. TDD não se aplica
a este registro operacional. `npm run typecheck` foi tentado neste checkout,
mas não executou: `tsc: not found` (sem `node_modules`). O workflow também não
executou typecheck, lint ou testes, pois o runner foi bloqueado antes do setup.
Essas verificações não são declaradas aprovadas nesta tentativa.
`npm test` também foi tentado e não executou: `vitest: not found`.

## Revisão da primeira tentativa

Skill `code-review` aplicada por dois agentes independentes ao diff desde
`d23b4ce`, base desta tarefa. Standards: zero achados. Spec: zero defeitos
acionáveis; critérios pendentes por bloqueio externo, sem declaração de
conclusão. `git diff --check` passou. Somente registros de coordenação
alterados; nenhuma mudança enviada ao repositório remoto.

## Mudança de método autorizada

O usuário instruiu: “não quero workflow pra isso, gere a release localmente
suba no github”. O ticket passa a usar geração local e upload ao rascunho;
a cobrança do Actions deixa de ser bloqueador. Permanecem commit aprovado,
escopo Linux, inspeção dos bytes, ensaios Linux e aceite separado da publicação.
Nenhuma alteração no código ou no workflow publicado foi necessária.

## Geração local

Clone isolado `/tmp/meu-dinheiro-remediation-07`, HEAD fixado em
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`, sem diferenças versionadas antes
e depois da geração. Reutilizado o ambiente instalado e auditado no 07,
sem mudar fontes, lockfile ou dependências. Ubuntu 26.04.1 LTS x86-64,
kernel `7.0.0-42-generic`, Node 24.20.0, npm 11.19.0, Electron 43.8.8,
electron-builder 26.18.0, Vitest 4.1.12.

Passaram `npm run typecheck`, `npm run lint`, teste isolado
`src/shared/ipc/channels.test.ts` (5 testes), suíte completa (10 arquivos,
80 testes) e typecheck final. Uma chamada inicial usou caminho de teste
inexistente e não encontrou testes; o caminho correto foi executado acima.
`npm audit` completo e `--omit=dev`: zero vulnerabilidades conhecidas
reportadas, sem garantia de ausência de vulnerabilidades.

Build: `npm run dist:linux -- -c.electronDist=node_modules/electron/dist`.
Usado o runtime oficial já verificado no 07. Primeira chamada interrompida
por `EPERM` do sandbox ao iniciar subprocesso; repetição fora do sandbox
concluiu, incluindo rebuild do SQLite. Avisos: duas anotações upstream do
Zod removidas pelo Rollup, referências duplicadas informadas pelo builder e
associação de janela sem desktopName. Este último fica para observação no 09.
Avisos regenerados de 144 pacotes, sem mudança no arquivo versionado.

## Inspeção do deb local

Arquivo `meu-dinheiro-1.0.0-beta.1-linux-x64.deb`, 116.234.356 bytes.
SHA-256: `364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547`.
Pacote `meu-dinheiro-app`, versão deb `1.0.0~beta.1`, arquitetura `amd64`,
licença MIT, homepage independente e contato noreply aprovado.

Extração com `dpkg-deb -x`; repetido o scanner do 07 contra este deb:
12.254 entradas ASAR, 11.486 arquivos internos varridos, nenhum caminho
suspeito de dados/planejamento. MIT e avisos idênticos ao commit, licenças
Electron/Chromium e ícone presentes. SQLite nativo ELF Linux x86-64.
Inventário das dependências distribuídas repetido. Os quatro hits heurísticos
mantêm os mesmos arquivos de exemplos legítimos classificados na auditoria 07.

Comparação por SHA-256 dos 135 arquivos/links extraídos, incluindo modos,
contra o deb privado auditado no 07: sem adições ou remoções. Único arquivo
diferente: `usr/share/doc/meu-dinheiro-app/changelog.gz`, cujo texto muda
somente de 20:41:52 para 21:25:16 em 2026-11-10 (-0300). Controle deb idêntico,
exceto a linha do md5 desse changelog em `md5sums`. ASAR, recursos externos,
binários e licenças são idênticos; verificações de conteúdo e SQLite do 07
continuam aplicáveis. O novo SHA-256 identifica exclusivamente este deb.
Limites heurísticos da auditoria anterior continuam válidos, sem promessa
de ausência absoluta de dados ofuscados ou vulnerabilidades.

## Rascunho enviado

Criado com `gh release create`, `--draft`, `--prerelease` e `--target` no
SHA completo aprovado, sem workflow. Versão `1.0.0-beta.1`, tag prevista
`v1.0.0-beta.1`, nome `Meu Dinheiro v1.0.0-beta.1`.
ID da release: `441089918`.
[Rascunho no GitHub](https://github.com/kvojps/meu-dinheiro-app/releases/tag/untagged-efa64d790f305d3a04b5).

Notas derivadas de `CHANGELOG.md` pelo script do commit aprovado e ajustadas
para registrar a geração local, auditorias atualizadas, ausência de assinatura
digital, Windows excluído, limitações e ensaios Linux ainda pendentes.
O corpo da release coincide com `RELEASE-NOTES.md`. `SHA256SUMS` contém
o checksum do único instalador. SHA-256 não autentica autoria.

Três anexos enviados, com estado `uploaded` e digests da API iguais aos locais:

| Anexo | Bytes | SHA-256 |
| --- | ---: | --- |
| `meu-dinheiro-1.0.0-beta.1-linux-x64.deb` | 116234356 | `364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547` |
| `RELEASE-NOTES.md` | 2617 | `c58d2bafc255e250e01b83ca155cd958be8f7f0556ac94d93188e8759a612bd2` |
| `SHA256SUMS` | 106 | `984545acba41f971fcfc1be388bce744fde6ccb3e50746d5599516f34bdcd642` |

Os três anexos foram baixados do GitHub e comparados byte a byte aos locais:
iguais. `sha256sum -c SHA256SUMS` passou sobre o download. Revalidados
`draft: true`, `prerelease: true`, `published_at: null`, tag prevista e
`target_commitish` no SHA aprovado. API de tags não retorna tag para
`v1.0.0-beta.1`; `main` permanece no commit aprovado.

## Encerramento

Ticket 08 resolvido no escopo local autorizado. Não houve publicação da
release nem alteração da origem. O ticket 09 deve usar este checksum para
instalação limpa, atualização e backup/restauração com perfil fictício; esses
ensaios não foram executados no 08. O ticket 11 mantém aceite separado e
publicação bloqueada até concluir o 09. Alterar bytes exige repetir as
verificações afetadas, sem presumir equivalência com reconstruções futuras.
