# Preparação e aceite da publicação do código — 2026-11-10

## Estado

Ticket 07 concluído após aceite explícito do mantenedor e conferência do envio.
Código publicado em `9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`, exclusivamente
em `refs/heads/main`. Nenhuma tag ou release criada, sem retirada da origem.
As seções de preparação e proposta abaixo conservam o contexto anterior ao
aceite; a execução e os resultados estão registrados ao final.

O tracker vigente está no checkout de coordenação. Os tickets presentes na
árvore extraída são snapshots históricos de preparação, conforme documentado
na auditoria 06; não representam o progresso atual deste esforço.

## Decisões e candidato

O usuário escolheu corrigir dependências e renovar verificações, em vez de
aceitar os riscos da auditoria 06. Base revisada `573b8d3caf301b81acaeba7c83e22b40ceaac675`.
Novo candidato `9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`, branch `main`,
árvore versionada limpa e somente `refs/heads/main` no clone privado persistente.

Commits da remediação:

- `2489f52`: Electron 43.8.8 na mesma linha principal, Zod 4.6.7, correções dirigidas no lockfile e avisos.
- `149a1d4`: restringe override de minimatch às linhas afetadas 7–10; conserva APIs legadas das linhas 3 e 5.
- `9e348bd`: incorpora licença do runtime Electron instalado aos avisos regenerados.

O override resolve minimatch 11.0.7; brace-expansion 5.0.12 acompanha o novo
runtime de backup. archiver 8 e readdir-glob 3 foram preservados. Ferramentas
foram atualizadas dentro das faixas declaradas, sem `npm audit fix --force`.
A API chamável de minimatch 3 permanece para ASAR e dir-compare. A necessidade
do override está explicada em `docs/development.md` do candidato.

Fontes das correções: [minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249),
[Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) e relatórios npm atuais.
As faixas dos avisos de Electron foram comparadas às versões da linha 43 no
registro npm; os relatórios completo e de produção finais não reportam alertas.
Zero alertas conhecidos pelo npm não é garantia de ausência de vulnerabilidades.

## Verificações renovadas

Clone isolado `/tmp/meu-dinheiro-remediation-07`, sem remote nem tags ao final.
Node 24.20.0, npm 11.19.0. Instaladas dependências do lockfile com `npm ci`;
o download automático do runtime foi interrompido por reinício do servidor e
não concluiu na repetição. Baixado o ZIP oficial via curl e conferido seu SHA-256
contra `electron/checksums.json`: `da1b962020a5a76330ebfca23ddedc4e27f7a1c369fdcff668a8a211792fcf55`.
Depois, `npm run postinstall` concluiu o rebuild do SQLite para Electron 43.8.8.
Após restringir o override, `npm install --ignore-scripts` atualizou as transitivas;
o empacotamento repetiu o rebuild nativo. Não se dispensou o postinstall.

Passaram typecheck, lint, teste isolado IPC (cinco testes) e suíte completa final
(10 arquivos, 80 testes). O typecheck foi repetido após instalar as definições
finais do Electron. `npm audit` completo e `--omit=dev`: zero vulnerabilidades.
Os quatro arquivos alterados passaram no Prettier e `git diff --check`.
A formatação global mantém os mesmos 12 avisos preexistentes do 06; não está verde.

Ensaio das dependências: parser real aceitou backup legado fictício, normalizou
campos ausentes e rejeitou registro inválido. ZIP gerado com archiver.directory
incluiu `data.json` e comprovante fictício; unzipper extraiu os bytes originais.
ASAR com opção `unpack` também passou, demonstrando a API legada preservada.
O SQLite carregou e executou consulta em memória sob Electron 43.8.8 (ABI 148);
o módulo nativo extraído do deb também carregou no runtime extraído.
Esses ensaios não comprovam instalação, diálogos ou restauração pela interface:
continuam obrigatórios no ticket 09. Não se mudou o esquema ou a lógica funcional.

`npm run dist:linux -- -c.electronDist=node_modules/electron/dist` concluiu,
usando o runtime oficial verificado e regenerando avisos de 144 pacotes.
O primeiro empacotamento foi interrompido para evitar baixar novamente esse
runtime. Build final com dois avisos de anotações upstream do Zod removidas pelo
Rollup, referências duplicadas de dependências informadas pelo builder e aviso
de associação de janela desktopName. Sem falha de build; associação de janela
permanece para observação no ensaio Linux, sem alterar identidade do aplicativo.

## Pacote privado

Arquivo `meu-dinheiro-1.0.0-beta.1-linux-x64.deb`.
SHA-256: `6193ca9efa7f57c08124e2e7f5caf8d38e5d516e13c2f53682d31e658c27fc83`.
Metadados: pacote `meu-dinheiro-app`, versão `1.0.0~beta.1`, arquitetura `amd64`,
homepage independente e contato noreply aprovado.

Inspeção do deb extraído: 12.254 entradas no ASAR, 11.486 arquivos internos
varridos, sem caminhos suspeitos de dados/planejamento. MIT e avisos externos
idênticos ao commit. Avisos Electron/Chromium e ícone presentes; SQLite ELF Linux
x86-64. Conferidas as versões efetivamente distribuídas de Zod, minimatch e
brace-expansion. fast-uri e ferramentas auditadas não aparecem como pacotes
separados no ASAR, sem inferir ausência de código embutido no Electron.
O recurso `default_app.asar` é idêntico ao ZIP oficial, com 14 entradas upstream.

Os quatro hits heurísticos são os mesmos exemplos legítimos de bindings,
eventemitter3, react-router e testes do Zod classificados no 06. Os valores
capturados pelos padrões foram comparados ao pacote anterior e permanecem
iguais; não reproduzidos neste registro. Sem achado novo não classificado.

## História, documentação e recuperação

Varredura final: 96 commits, 948 blobs únicos, 479 caminhos e 15.179.958 bytes.
Zero hits nos padrões históricos usados; identidades de autor/committer somente
noreply aprovado. Mantidos 58 e-mails distintos, sem novos contatos fora de
avisos/lockfile; atribuições de terceiros preservadas. `git fsck --full` passou.
Links relativos sem destinos ausentes e CRCs/metadados PNG conferidos novamente.
As imagens não mudaram; revisão visual do 06 permanece aplicável. Limites
heurísticos da auditoria 06 continuam válidos, inclusive ausência de scanner
especializado e de prova absoluta sobre dados ofuscados.

Os quatro backups do checkpoint 01 mantêm SHA-256 idêntico. Preservados novo deb,
relatórios, scripts e logs em `.git/private-extraction/2026-11-10/audit-07/`,
com `manifest.json`. Clone privado persistente avançado por fast-forward até o
candidato. Backup adicional `destination-before-publication.bundle` conserva a
preparação vigente `4d2aae1`; `git bundle verify` passou. Não substituir nem apagar
`.git` ou esses backups. Nenhum backup será enviado ao destino.

## Proposta apresentada antes do aceite

Destino conferido: `https://github.com/kvojps/meu-dinheiro-app.git`, público,
permissão `ADMIN`, branch padrão `main`. A configuração `origin` do checkout de
coordenação aponta a esse destino; o clone candidato continua sem remote.
O inventário remoto anuncia somente `refs/heads/main` em
`4d2aae11548ceeab191c5fca516edfc0e237fe98`, além do alias `HEAD`; sem tags.
A API informa branch sem proteção e lista vazia de rulesets. Revalidar estado
e permissões imediatamente antes do envio.

A publicação proposta substitui a história de preparação atualmente pública
pela história extraída e revisada. Não é fast-forward. O aceite deve mencionar
explicitamente essa substituição; não autoriza outras reescritas futuras.
Somente o refspec abaixo poderá ser enviado, para a URL conferida:

```text
9e348bdc6d5cdee0abea0d6c328232d8cb97da1f:refs/heads/main
```

Usar lease preso a `refs/heads/main:4d2aae11548ceeab191c5fca516edfc0e237fe98`,
`--no-follow-tags` e nenhuma opção `--mirror`/`--all`. Se o remoto mudar,
interromper e reapresentar a proposta; não ampliar a autorização. Excluir tags,
refs privadas, backups e registros de coordenação posteriores ao snapshot
revisado. Não criar tag, release, workflow run ou retirar aplicativo da origem.

Depois do aceite e envio, conferir refs anunciadas, commit padrão, histórico,
árvore e documentação do destino, registrar o aceite e resolver ticket/índice.
Sem essa conferência, ticket 07 permanece aberto e o 08 bloqueado. Aceite de
código é distinto do aceite da release; recuperação não presume autorização
para reescrever novamente a história pública.


## Revisão final da preparação

Skill `code-review` executada em dois agentes independentes, com bases
confirmadas pelo usuário: `573b8d3...9e348bd` no aplicativo e
`4d2aae1...3be628e` na coordenação. O primeiro exame identificou o override
global de minimatch; corrigido e reavaliado em `149a1d4`. A revisão final
conferiu o manifesto privado e confirmou a coerência entre candidato,
relatórios, pacote e proposta de envio. Não substitui aceite do mantenedor.

### Standards

Um achado documental: comentário do ticket 08 fora de `## Comments`.
Corrigido com a seção exigida pelo tracker. Nenhuma outra violação ou smell
relevante nos dois diffs; zero achados restantes após a correção.

### Spec

Zero achados restantes nos dois diffs. Requisitos ainda pendentes de aceite,
envio e conferência pública estão registrados como pendentes, sem resolver 07
ou liberar 08. Total final: zero achados restantes em cada eixo.


## Aceite e publicação conferida

2026-11-10 (America/Recife) — O mantenedor respondeu **“Aceito.”** ao pedido
que identificava exclusivamente `main`, a substituição de `4d2aae1` por
`9e348bd`, lease exato e ausência de tags/release. Esse aceite autoriza esta
operação de código, sem aceitar release ou outras reescritas futuras.

Revalidados antes do envio: destino `kvojps/meu-dinheiro-app`, público,
permissão `ADMIN`, branch padrão `main`, inventário anunciando somente `main`
no hash esperado `4d2aae11548ceeab191c5fca516edfc0e237fe98`. Árvore candidata
limpa e HEAD idêntico ao aprovado. Manifesto privado e quatro backups originais
conferidos novamente por SHA-256, sem divergência.

Push concluído com sucesso, com `push.followTags=false`,
`push.recurseSubmodules=no`, `--no-follow-tags` e
`--force-with-lease=refs/heads/main:4d2aae11548ceeab191c5fca516edfc0e237fe98`.
Único refspec enviado:
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f:refs/heads/main`.
A resposta do servidor confirmou a atualização exclusiva de `main`.

Conferência após publicação, concluída até 21:07 no fuso local:

- `git ls-remote --symref` anuncia somente `refs/heads/main` no hash aprovado e seu alias `HEAD`; nenhuma tag ou ref adicional anunciada.
- API confirma repositório público e branch padrão `main`; lista de releases vazia.
- Clone novo do GitHub em `/tmp/meu-dinheiro-publication-07`, sem tags, passou em `git fsck --full`, com árvore limpa.
- Comparação do clone com o candidato privado confirmou HEAD, árvore completa (incluindo documentação) e conjunto dos 96 commits idênticos.
- README obtido por HTTPS público, sem autenticação, idêntico byte a byte ao commit aprovado.

[Repositório publicado](https://github.com/kvojps/meu-dinheiro-app) e
[commit aprovado](https://github.com/kvojps/meu-dinheiro-app/commit/9e348bdc6d5cdee0abea0d6c328232d8cb97da1f).
O candidato não foi alterado entre o aceite e o envio. Nenhum workflow foi
acionado, instalador publicado, tag/release criada ou aplicativo retirado da
origem nesta operação. Backup privado preservado. O checkout de coordenação
continua separado; seus registros posteriores à preparação não foram enviados.

Limite da conferência de refs: cobre as refs anunciadas pelo servidor, sem
prometer remoção de objetos antigos, caches ou refs internas do provedor.
A substituição autorizada não constitui autorização para nova reescrita pública.
Ticket 07 resolvido; ticket 08 pode preparar o rascunho sobre o commit publicado.
Ensaios Linux e aceite específico da release continuam nas etapas seguintes.


## Revisão do encerramento

Skill `code-review` repetida em dois agentes independentes sobre
`4d2aae1...576af07`, usando a base já confirmada pelo usuário. Nenhuma alteração
no aplicativo publicado; revisão dos registros de aceite, verificação e resolução.

### Standards

Zero achados. Idioma, comentários em `## Comments`, resolução com `## Answer`
e índice atendem às convenções documentadas.

### Spec

Zero achados. Os cinco critérios de 07 estão satisfeitos; a publicação ficou
restrita ao candidato aprovado e o clone confirma os 96 commits e README.
O 08 está liberado, sem execução declarada; release continua com aceite separado.

Total: zero achados em cada eixo. `git diff --check` passou e árvores de trabalho
limpas ao concluir. Verificações funcionais não repetidas para o encerramento
exclusivamente documental; o código publicado é o mesmo já validado e aprovado.
