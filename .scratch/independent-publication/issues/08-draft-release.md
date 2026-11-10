# 08: Gerar a release candidata em rascunho

**What to build:** Oferecer instaladores verificáveis para testar a entrega antes de publicá-la.

**Blocked by:** 07 — Publicar o código após aceite

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Executar workflow manual sobre commit fixado e registrar execução, versão, tag e classificação de pré-release.
- [ ] Conferir NSIS Windows x64, deb Linux x64, nomes, notas e SHA-256 dos arquivos efetivamente anexados ao rascunho.
- [ ] Inspecionar artefatos finais, conteúdo, recursos externos, dependências, metadados, MIT e avisos; repetir verificações afetadas se divergirem dos candidatos anteriores.
- [ ] Conferir notas com mudanças verificadas, limitações e ausência de assinatura quando aplicável; manter rascunho sem publicação.
- [ ] Identificar por checksum os mesmos candidatos para os testes dos dois sistemas; build em runner não comprova instalação. Mudanças exigem repetir validações afetadas.
