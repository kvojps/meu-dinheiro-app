# 10: Validar instalação e continuidade no Windows

**What to build:** Comprovar instalação, atualização e recuperação de dados no Windows x64.

**Blocked by:** 08 — Gerar a release candidata em rascunho

**Status:** ready-for-human

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Usar Windows x64 com interface gráfica, perfil isolado e dados fictícios; registrar versão e checksum do NSIS testado.
- [ ] Validar instalação limpa, abertura, navegação pelas telas demonstradas e persistência após reabrir.
- [ ] Criar perfil fictício no instalador anterior e atualizar para o candidato, comprovando preservação de dados, comprovantes e localização de armazenamento.
- [ ] Exportar e restaurar backup com dados e comprovantes, conferir substituição esperada e persistência após reabrir.
- [ ] Conferir instruções Windows, armazenamento e backup/restauração; registrar avisos observados na instalação sem assinatura, sem apresentar checksum como assinatura.
- [ ] Registrar evidências sem dados privados; ambiente indisponível ou incompatibilidades impedem conclusão. Abrir decisão específica quando necessário, sem prometer downgrade; correções exigem renovar revisões e testes afetados.

## Comments

2026-11-10 — Ambiente Windows x64 gráfico não demonstrado no checkpoint 01.
Providenciar esse ambiente e perfil fictício isolado antes da validação;
Wine local não atende ao critério. Tickets 11 e 12 continuam bloqueados por
esta validação, além das dependências já declaradas.
