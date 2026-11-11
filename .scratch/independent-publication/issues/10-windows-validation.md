# 10: Validar instalação e continuidade no Windows

**What to build:** Comprovar instalação, atualização e recuperação de dados no Windows x64.

**Blocked by:** 08 — Gerar a release candidata em rascunho

**Status:** wontfix

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

2026-11-10 — O ticket 04 preparou `docs/installation.md` e `docs/storage.md`
no clone extraído. Conferir no NSIS candidato os passos, caminho `%APPDATA%`,
seletores nativos, avisos sem assinatura, atualização e restauração com
comprovantes. A ausência de Windows gráfico permanece bloqueio deste ticket;
não impede concluir a produção documental do 04. Ver
[evidências](../evidence/04-usage-documentation.md).

2026-11-10 — A preparação 05 gerou deb privado e configurou workflow manual,
mas falta candidato NSIS nativo. Ver [evidências](../evidence/05-release-packaging.md).
O NSIS anterior foi extraído com 7-Zip do cache: seu módulo SQLite é ELF Linux
x86-64. Conferir impacto real e abrir decisão específica se a preparação do
perfil de atualização falhar; não presumir compatibilidade nem apagar releases.
A avaliação dos seis pacotes de produção alertados pelo npm continua obrigatória
antes de publicar; cinco foram encontrados como pacotes no ASAR Linux.

2026-11-10 — Alteração de escopo aprovada pelo usuário: concluir este fluxo
somente com Linux x64 (deb). Windows fica fora desta pré-release, com nota
explícita de ausência de instalador independente e validação. A configuração
NSIS experimental pode permanecer, mas não bloqueia esta entrega. Auditoria,
ensaios Linux e aceites separados de código/release continuam obrigatórios.

Retirado do fluxo atual por decisão do usuário; nenhum critério Windows foi
executado ou dispensado como se tivesse passado. Retomar em esforço próprio
quando houver decisão de oferecer Windows. Não bloqueia tickets 11 e 12.
