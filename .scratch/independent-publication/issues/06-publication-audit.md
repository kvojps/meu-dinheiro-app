# 06: Concluir a revisão do material publicável

**What to build:** Disponibilizar evidências de revisão concreta de privacidade, licenças e funcionamento independente.

**Blocked by:** 04 — Documentar o uso com demonstração fictícia; 05 — Preparar instaladores e workflow de release

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Revisar árvore e todo histórico publicável, suporte, preparação, mensagens, atribuições e identidades; registrar cobertura e limites sem valores sensíveis.
- [ ] Inspecionar candidatos Windows e Linux: ASAR, recursos externos, dependências, metadados, MIT e avisos. Concluir inspeção interna pendente do NSIS anterior da origem privada.
- [ ] Revisar documentação e screenshots visualmente e em metadados; assegurar dados fictícios e nenhum achado sem tratamento.
- [ ] Comprovar instalação de dependências, typecheck, lint, testes, build e avisos em clone isolado no estado candidato.
- [ ] Falhas, achados sem classificação ou verificações pendentes bloqueiam publicação; exposições concretas exigem decisão específica, sem apagar releases antigas, mudar visibilidade da origem ou revogar credenciais por hipótese.
- [ ] Registrar commit e conjunto revisados e repetir verificações afetadas quando mudarem.

## Comments

2026-11-10 — Checkpoint 01 confirmou ausência de `7z` no PATH. A inspeção do
interior do NSIS anterior permanece pendente: disponibilizar ferramenta
apropriada e comprovar cobertura antes de concluir esta auditoria.
