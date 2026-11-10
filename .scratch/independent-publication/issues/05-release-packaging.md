# 05: Preparar instaladores e workflow de release

**What to build:** Gerar instaladores próprios e preparar pré-release em rascunho por acionamento manual.

**Blocked by:** 03 — Executar o aplicativo em clone independente

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Conferir metadados dos instaladores anteriores antes de adotar 1.0.0-beta.1 e tag v1.0.0-beta.1; regressão de versão exige revisão com o usuário.
- [ ] Configurar NSIS Windows x64 e deb Linux x64, com nomes identificando app, versão, sistema e arquitetura e builds nos respectivos sistemas.
- [ ] Preservar appId com.meudinheiro.app, nome em execução meu-dinheiro, identidade efetiva dos instaladores e armazenamento sob userData.
- [ ] Preparar workflow manual que gere somente rascunho sobre commit fixado, com instaladores, notas em português e SHA-256; conferir pacote, tag e artefatos.
- [ ] Gerar candidatos locais ou privados para auditoria, incluindo MIT, avisos e recursos; preparar changelog com extração, mudanças verificadas e limitações.
- [ ] Permitir release sem assinatura, distinguindo checksum de assinatura; documentar processo verificável sem prometer identidade binária. Não publicar código, tag pública ou release neste ticket.
