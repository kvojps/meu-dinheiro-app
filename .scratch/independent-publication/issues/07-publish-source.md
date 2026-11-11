# 07: Publicar o código após aceite

**What to build:** Disponibilizar repositório público após revisão concreta e aceite explícito do mantenedor.

**Blocked by:** 06 — Concluir a revisão do material publicável

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [x] Conferir destino, remote, visibilidade, permissões e refs exatas, excluindo refs privadas, backups e tags da origem.
- [x] Apresentar commit candidato, refs e evidências ao usuário e obter aceite explícito antes do envio público.
- [x] Enviar somente conteúdo aprovado e conferir repositório publicado, histórico, documentação e ausência de refs não selecionadas; registrar aceite e commit sem dados sensíveis.
- [x] Alterações no candidato exigem renovar verificações afetadas; não publicar release nem retirar app da origem.
- [x] Preservar backup privado; aceite de código é distinto do aceite da release e recuperação não presume autorização para reescrever histórico público.

## Comments

2026-11-10 — O 06 concluiu a revisão em `573b8d3`, mas **publicação bloqueada**
por tratamento dos alertas: Electron 43.4.0 distribuído, Zod e cadeia de globbing,
além de ferramentas de build. Ver [auditoria](../evidence/06-publication-audit.md).
Antes de pedir aceite sobre o código, remediar de forma dirigida, sem atualização
automática que mude contratos, e renovar avisos/candidato/auditoria/checks; ou
obter decisão explícita do mantenedor sobre risco residual classificado.
A conclusão do 06 não aceita risco e não autoriza publicação.
O format:check global tem 12 avisos preexistentes, registrados na evidência;
não declarar todos os checks verdes. Preservar o backup privado.


2026-11-10 — O usuário escolheu remediação dirigida, sem aceite dos riscos
anteriores. Novo candidato `9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`:
Electron 43.8.8, Zod 4.6.7, minimatch 11.0.7 nas linhas afetadas e transitivas
corrigidas. `npm audit` completo/produção sem alertas; typecheck, lint, 80 testes,
build deb e inspeção repetidos. Formatação global conserva os 12 avisos prévios.
Ver [preparação e proposta concreta](../evidence/07-publish-source.md).
O bloqueio de dependências foi tratado; aguardam aceite explícito do código e
verificação posterior ao envio. A proposta substitui a história de preparação
pública `4d2aae1` pela extraída, com lease exato e somente `refs/heads/main`.
Backups privados preservados. Nenhum push, tag ou release nesta etapa.


2026-11-10 — Mantenedor respondeu “Aceito.” à proposta concreta de substituir
somente `main` de `4d2aae1` por `9e348bd` com lease exato. Envio concluído e
conferido por inventário remoto, API, clone novo e README público. Os 96 commits
e a árvore publicada coincidem com o candidato aprovado; nenhuma tag/release
criada, backups privados preservados, sem retirada da origem.

## Answer

Código publicado em [kvojps/meu-dinheiro-app](https://github.com/kvojps/meu-dinheiro-app),
branch `main`, commit `9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`, após remediação,
revisão e aceite explícito. [Evidências completas](../evidence/07-publish-source.md).
Todos os critérios deste ticket concluídos. O 08 fica liberado para preparar
rascunho no commit publicado; ensaios e aceite de release permanecem posteriores.
