# 07: Publicar o código após aceite

**What to build:** Disponibilizar repositório público após revisão concreta e aceite explícito do mantenedor.

**Blocked by:** 06 — Concluir a revisão do material publicável

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Conferir destino, remote, visibilidade, permissões e refs exatas, excluindo refs privadas, backups e tags da origem.
- [ ] Apresentar commit candidato, refs e evidências ao usuário e obter aceite explícito antes do envio público.
- [ ] Enviar somente conteúdo aprovado e conferir repositório publicado, histórico, documentação e ausência de refs não selecionadas; registrar aceite e commit sem dados sensíveis.
- [ ] Alterações no candidato exigem renovar verificações afetadas; não publicar release nem retirar app da origem.
- [ ] Preservar backup privado; aceite de código é distinto do aceite da release e recuperação não presume autorização para reescrever histórico público.
