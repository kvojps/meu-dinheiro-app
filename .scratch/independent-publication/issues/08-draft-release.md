# 08: Gerar a release candidata em rascunho

**What to build:** Oferecer instaladores verificáveis para testar a entrega antes de publicá-la.

**Blocked by:** 07 — Publicar o código após aceite

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Executar workflow manual sobre commit fixado e registrar execução, versão, tag e classificação de pré-release.
- [ ] Conferir deb Linux x64, nomes, notas e SHA-256 dos arquivos efetivamente anexados ao rascunho.
- [ ] Inspecionar artefatos finais, conteúdo, recursos externos, dependências, metadados, MIT e avisos; repetir verificações afetadas se divergirem dos candidatos anteriores.
- [ ] Conferir notas com mudanças verificadas, limitações e ausência de assinatura quando aplicável; manter rascunho sem publicação.
- [ ] Identificar por checksum os mesmos candidatos para os testes dos dois sistemas; build em runner não comprova instalação. Mudanças exigem repetir validações afetadas.

## Comments

2026-11-10 — Alteração de escopo aprovada pelo usuário: concluir este fluxo
somente com Linux x64 (deb). Windows fica fora desta pré-release, com nota
explícita de ausência de instalador independente e validação. A configuração
NSIS experimental pode permanecer, mas não bloqueia esta entrega. Auditoria,
ensaios Linux e aceites separados de código/release continuam obrigatórios.

2026-11-10 — A auditoria 06 fixou commit `573b8d3` e deb privado com SHA-256
`3d6bdb90d7be006c8b764856c2be94fba54c78c3df7c92dda93c9cfe0b92fa5f`.
Ver [evidências](../evidence/06-publication-audit.md). O candidato do 05 foi
sucedido pela correção de homepage. O workflow só gera Linux; conferir os bytes
que ele produzir, sem prometer igualdade binária com o ensaio local. Dependências
remediadas exigem nova auditoria antes de reutilizar qualquer conjunto.


2026-11-10 — A preparação 07 remediou dependências e renovou a auditoria no
candidato `9e348bd`, com deb privado SHA-256
`6193ca9efa7f57c08124e2e7f5caf8d38e5d516e13c2f53682d31e658c27fc83`.
Ver [evidências](../evidence/07-publish-source.md). O aceite e envio do código
continuam pendentes, bloqueando este ticket. Após concluir 07, fixar o commit
aprovado no workflow e inspecionar seus artefatos efetivos; o hash local não
atesta bytes que o runner ainda não produziu. Os candidatos 05/06 são históricos.


2026-11-10 — Ticket 07 resolvido: código publicado após aceite explícito em
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`, com histórico e árvore conferidos
em clone novo. Bloqueio de publicação do código removido. Este ticket pode
executar o workflow manual nesse commit; nenhuma execução ou release foi
criada pelo 07. Repetir inspeção nos bytes efetivamente produzidos pelo runner,
sem presumir igualdade binária com o deb privado. Aceite de release separado.
