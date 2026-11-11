# 12: Validar a entrega pública e retirar o aplicativo da origem

**What to build:** Concluir migração mantendo destino acessível e demais aplicativos funcionais na origem.

**Blocked by:** 11 — Publicar a pré-release após aceite

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Conferir repositório e release públicos e validar instalação dos artefatos baixados da publicação em Linux x64; registrar versões e checksums.
- [ ] Confirmar destino e ponto de corte antes da retirada; divergências ou falhas bloqueiam remoção.
- [ ] Retirar somente Meu Dinheiro e deixar link no README da origem; preservar demais aplicativos, histórico e releases antigas privadas.
- [ ] Conferir e adaptar comandos, workspaces, lockfile e referências afetados, executando verificações pertinentes dos demais apps sem migrá-los ou redesenhá-los.
- [ ] Registrar evidências dos oito marcos e aceites distintos de código e release; obter aceite final antes de liberar retenção do backup privado.
- [ ] Recuperação posterior exige decisão específica que preserve dados dos usuários, sem presumir downgrade seguro ou autorização para reescrever histórico público.

2026-11-10 — Alteração de escopo aprovada pelo usuário: concluir este fluxo
somente com Linux x64 (deb). Windows fica fora desta pré-release, com nota
explícita de ausência de instalador independente e validação. A configuração
NSIS experimental pode permanecer, mas não bloqueia esta entrega. Auditoria,
ensaios Linux e aceites separados de código/release continuam obrigatórios.
