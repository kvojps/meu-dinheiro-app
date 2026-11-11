# Entrega pública e retirada da origem — 2026-11-10

## Destino, versão e validação

API reconferida: `kvojps/meu-dinheiro-app` público, branch padrão `main`,
única branch remota `main` em `9f0e29b221bcdebe902ba8beea4d2976dd35c655`.
A tag `v1.0.0-beta.1` continua em
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`.
Release pública `441089918`, `draft: false`, `prerelease: true`, mesmos três
anexos do 11. Nenhum rebuild nem alteração na release.

| Artefato público | SHA-256 |
| --- | --- |
| `meu-dinheiro-1.0.0-beta.1-linux-x64.deb` | `364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547` |
| `RELEASE-NOTES.md` | `725e1c3f93fdf9193f44f32db2d76cc7648e992559783a079224d68fd1c3ac8b` |
| `SHA256SUMS` | `984545acba41f971fcfc1be388bce744fde6ccb3e50746d5599516f34bdcd642` |

Recalculados os hashes dos downloads públicos preservados pelo 11, conferidos
contra os digests atuais da API. Pacote deb `meu-dinheiro-app`, versão
`1.0.0~beta.1`, arquitetura `amd64`; versão instalada confirmada por
`dpkg-query`. Extraído o deb público em diretório isolado: os 132 arquivos
regulares sob `/opt/Meu Dinheiro` coincidem por SHA-256 com a instalação atual.

A tentativa de reinstalar esse download foi bloqueada por autenticação sudo;
nenhuma reinstalação ocorreu. O mantenedor respondeu: “Já tá validado não
precisa reinstalar.” Essa decisão aceita a validação existente e dispensa a
reinstalação para a retirada. Não se declara novo ensaio de instalação limpa,
continuidade de perfil anterior, menu, seletores completos ou leitor de PDF.
Permanecem os resultados e limites aceitos do [09](09-linux-validation.md).
Windows permanece fora desta entrega, sem instalador independente validado.

## Corte e retirada

Origem `kvojps/my-desktop-apps` reconferida privada, branch `main`, árvore limpa;
HEAD local e remoto ainda no corte aprovado
`17cb66b31d39bd04725ec6708263ea2f3d113df9`. Sem divergência.

Preparação em clone isolado `/tmp/source-retirement-12-prepared`, seguida de
avanço fast-forward da origem para o commit revisado
`a6cd3e04f3537239ec983e069c11b8afe3661020`
(`chore: retire Meu Dinheiro from source workspaces`). Commit enviado por push
normal de `main`, sem tags nem reescrita; ref remota reconferida nesse hash.

Removidos os 209 arquivos rastreados de `apps/meu-dinheiro-app` e os artefatos
locais remanescentes somente dessa pasta. README aponta ao destino e à
pré-release. Removidos os três scripts de Meu Dinheiro; o glob `apps/*` passa a
resolver os três workspaces restantes. Lockfile regenerado por npm, sem mudar
versão ou integridade de qualquer dependência retida no mesmo caminho.
Atualizados mapa de contextos, instruções de agentes, guia de domínio e links
do design system. ADRs e planejamento históricos preservados.

`git diff 17cb66b HEAD -- apps/git-dlog apps/meu-negocio-app
apps/meu-movel-planejado` vazio: nenhum arquivo dos demais apps alterado.
Árvore versionada da origem limpa após a retirada. Inventários da API de
releases antigas antes/depois idênticos (IDs, tags, estado e anexos com digests).
Origem continua privada; histórico preservado por commit aditivo.

## Verificações e revisão

No clone isolado com o commit exato aplicado à origem:

- `npm ci --ignore-scripts --no-audit --no-fund`: passou usando lockfile novo;
  não executou rebuild nativo ou download de Electron via postinstall.
- `npm run typecheck`: passou nos três apps.
- Teste isolado de canais IPC do Git Dlog: seis testes passaram.
- `npm run lint`: zero erros; dois avisos de dependências de hooks em
  `OrdersContext.tsx` e `ProductsContext.tsx`, arquivos preservados sem alteração.
- `npm run build`: passou nos três apps.
- `npm test`: 34 arquivos e 289 testes passaram.
- Prettier dos sete arquivos de suporte alterados e `git diff --check`: passaram.

Tentativa inicial de reutilizar somente `node_modules` da raiz da origem por
symlink não resolveu dependências aninhadas dos outros apps. Descartada como
ambiente incompleto; os resultados acima usam instalação isolada pelo lockfile.
Não houve alteração funcional nem seam de implementação novo: TDD inaplicável.

Skill `code-review` aplicada com dois agentes independentes, base da origem
`17cb66b`, commit `a6cd3e0`. Standards: zero achados. Spec: zero achados no patch
de retirada; consolidação e aceite final tratados neste registro.

## Oito marcos e aceites

| Marco | Resultado e evidência |
| --- | --- |
| 1. Recuperação e corte | Backup privado restaurado e verificado no [01](01-recovery-checkpoint.md); corte reconferido no 12. |
| 2. Extração | Equivalência e correspondência de commits no [02](02-history-extraction.md). |
| 3. Autonomia e documentação | [03](03-standalone-app.md), [04](04-usage-documentation.md), [05](05-release-packaging.md). |
| 4. Validação local e privacidade | [06](06-publication-audit.md) e renovação no [07](07-publish-source.md). |
| 5. Código público após aceite | Aceite específico e publicação de código no [07](07-publish-source.md); avanço documental autorizado no [11](11-publish-prerelease.md). |
| 6. Rascunho e testes Linux | [08](08-draft-release.md), [09](09-linux-validation.md), limitações aceitas pelo mantenedor. |
| 7. Release após aceite próprio | Aceite distinto do código, publicação e downloads no [11](11-publish-prerelease.md). |
| 8. Retirada restrita da origem | Commit `a6cd3e0`, origem privada atualizada e releases antigas preservadas; validação existente aceita pelo mantenedor neste 12. |

## Limpeza local e retenção

Pedido adicional do mantenedor: remover branches alternativas a `main` deste
repositório e cópias locais desnecessárias em `.git`.
Removida a única branch local alternativa,
`private/publication-coordination-2026-11-10` (antigo `6f06040`).
GitHub confirmou somente `main`; não havia branch remota alternativa a remover.
Nenhuma tag, histórico público, reflog ou objeto Git principal foi apagado.

Removidas as restaurações de teste em `.git/private-recovery/2026-11-10/restored`
e as cópias temporárias `app`, `audit-06`, `audit-07`, `release-05`, `release-08`
e `validation-09` em `.git/private-extraction/2026-11-10`. São cópias de trabalho;
relatórios versionados, arquivos originais de recuperação e mapa de commits
permanecem disponíveis. O conjunto privado caiu de aproximadamente 9,1 GiB
para aproximadamente 4,2 GiB; conferir tamanho atual no encerramento.

Backups originais (`source.tar`, `source.bundle`, `destination.tar`,
`destination.bundle`), instaladores anteriores, manifests, mapa de commits e
checkpoint de coordenação continuam retidos fora da árvore pública até o aceite
final desta entrega. A limpeza dos temporários não equivale à liberação dessa
retenção. O ticket permanece `ready-for-human` exclusivamente pelo aceite final.

## Recuperação posterior

Exige decisão específica que preserve dados atuais dos usuários. Backups da
migração são evidência de recuperação anterior à publicação e não autorizam
restaurar sobre perfis atuais, fazer downgrade ou reescrever histórico público.
Não apagar releases antigas privadas nem alterar visibilidade da origem.
