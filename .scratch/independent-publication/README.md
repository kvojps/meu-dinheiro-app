# Publicação independente de Meu Dinheiro

Divisão e pontos de teste aprovados pelo usuário em 2026-11-10. A especificação e os tickets de planejamento foram preservados; o estado pendente no documento de origem antecede esta confirmação.

Fonte: [especificação](../dinheiro-publicacao/spec.md) e [mapa de decisões](../dinheiro-publicacao/map.md).

Tickets concluídos usam `resolved`; os demais mantêm seus estados de triagem.
O checkpoint 01 está `resolved`, executado e comprovado em 2026-11-10. O ticket 02 mantém a triagem
`ready-for-agent`, com bloqueio operacional até disponibilizar a ferramenta de
filtragem; o ticket 10 está
`ready-for-human` pela falta de ambiente Windows x64 gráfico demonstrado.
Os demais tickets só podem começar após concluir seus bloqueadores.

[Evidências do checkpoint e recuperação](evidence/01-recovery-checkpoint.md).
O backup privado fica fora da árvore versionada, dentro de `.git`; preservá-lo
antes de substituir o checkout. Nenhum conteúdo novo foi publicado.

1. [Comprovar recuperação e fixar ponto de corte](issues/01-recovery-checkpoint.md) — resolvido em 2026-11-10.
2. [Extrair e verificar o histórico do aplicativo](issues/02-extract-history.md) — bloqueado por: 01.
3. [Executar o aplicativo em clone independente](issues/03-standalone-app.md) — bloqueado por: 02.
4. [Documentar o uso com demonstração fictícia](issues/04-usage-documentation.md) — bloqueado por: 03.
5. [Preparar instaladores e workflow de release](issues/05-release-packaging.md) — bloqueado por: 03.
6. [Concluir a revisão do material publicável](issues/06-publication-audit.md) — bloqueado por: 04, 05.
7. [Publicar o código após aceite](issues/07-publish-source.md) — bloqueado por: 06.
8. [Gerar a release candidata em rascunho](issues/08-draft-release.md) — bloqueado por: 07.
9. [Validar instalação e continuidade no Linux](issues/09-linux-validation.md) — bloqueado por: 08.
10. [Validar instalação e continuidade no Windows](issues/10-windows-validation.md) — bloqueado por: 08.
11. [Publicar a pré-release após aceite](issues/11-publish-prerelease.md) — bloqueado por: 09, 10.
12. [Validar a entrega pública e retirar o aplicativo da origem](issues/12-retire-source-app.md) — bloqueado por: 11.

O aplicativo instalado é o ponto principal de teste em Windows x64 e Linux x64, com perfis fictícios, complementado por verificações de histórico, privacidade e build. Ambiente indisponível bloqueia validações dependentes, sem dispensar critérios.

A aprovação desta divisão autoriza criar os tickets. Publicar código e publicar a release continuam sujeitos a aceites explícitos separados sobre resultados concretos. Nenhuma migração foi executada ao criar estes tickets.
