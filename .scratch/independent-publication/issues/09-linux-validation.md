# 09: Validar instalação e continuidade no Linux

**What to build:** Comprovar instalação, atualização e recuperação de dados no Linux x64.

**Blocked by:** 08 — Gerar a release candidata em rascunho

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Usar Linux x64 com interface gráfica, perfil isolado e dados fictícios; registrar versão e checksum do deb testado.
- [ ] Validar instalação limpa, abertura, navegação pelas telas demonstradas e persistência após reabrir.
- [ ] Criar perfil fictício no instalador anterior e atualizar para o candidato, comprovando preservação de dados, comprovantes e localização de armazenamento.
- [ ] Exportar e restaurar backup com dados e comprovantes, conferir substituição esperada e persistência após reabrir.
- [ ] Conferir instruções Linux, armazenamento, backup/restauração e avisos observados; registrar evidências sem dados privados.
- [ ] Ambiente indisponível ou incompatibilidades impedem conclusão; abrir decisão específica quando necessário, sem prometer downgrade. Correções exigem renovar revisões e testes afetados.

## Comments

2026-11-10 — O ticket 04 preparou `docs/installation.md` e `docs/storage.md`
no clone extraído, com roteiro Linux e limites explícitos. Conferir comandos,
nomes, hashes, avisos, sandbox e restauração no deb candidato; o ensaio via
bundle e diálogos com caminhos automatizados não conclui estes critérios.
Ver [evidências documentais](../evidence/04-usage-documentation.md).

2026-11-10 — O 06 concluiu auditoria de build/conteúdo, sem ensaiar instalação.
A configuração herdada do BrowserWindow usa `sandbox: false`; o helper SUID e
o funcionamento do aplicativo instalado precisam ser conferidos. Não usar
`--no-sandbox` como substituto do critério. Registrar o resultado efetivo e
abrir decisão específica se exigir alteração funcional. Alertas bloqueiam o 07;
qualquer novo candidato exige renovar os checks do conjunto. Ver
[evidências](../evidence/06-publication-audit.md).
