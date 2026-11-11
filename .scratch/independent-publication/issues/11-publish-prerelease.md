# 11: Publicar a pré-release após aceite

**What to build:** Disponibilizar pré-release validada com instruções conferidas e integridade verificável dos downloads.

**Blocked by:** 09 — Validar instalação e continuidade no Linux

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Consolidar resultados Linux sobre o mesmo candidato por checksum; falhas, achados ou validações pendentes impedem publicação.
- [ ] Conferir documentação final contra comportamento observado, nomes dos artefatos, notas, limitações, avisos e instruções de instalação e backup/restauração.
- [ ] Submeter alterações finais às verificações afetadas e ao aceite aplicável de código público; mudanças de artefatos exigem renovar rascunho e testes afetados.
- [ ] Apresentar rascunho, commit, instaladores, checksums e evidências; obter aceite explícito da release, distinto do aceite do código.
- [ ] Publicar somente pré-release aprovada e conferir tag, commit, notas, anexos e SHA-256 dos downloads públicos.
- [ ] Manter origem e releases antigas intactas e backup privado até aceite final; não assumir suporte a downgrade ou reescrita pública.

2026-11-10 — Alteração de escopo aprovada pelo usuário: concluir este fluxo
somente com Linux x64 (deb). Windows fica fora desta pré-release, com nota
explícita de ausência de instalador independente e validação. A configuração
NSIS experimental pode permanecer, mas não bloqueia esta entrega. Auditoria,
ensaios Linux e aceites separados de código/release continuam obrigatórios.
