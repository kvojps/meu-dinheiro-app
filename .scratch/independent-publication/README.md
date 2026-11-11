# Publicação independente de Meu Dinheiro

Divisão e pontos de teste aprovados pelo usuário em 2026-11-10. A especificação e os tickets de planejamento foram preservados; o estado pendente no documento de origem antecede esta confirmação.

Fonte: [especificação](../dinheiro-publicacao/spec.md) e [mapa de decisões](../dinheiro-publicacao/map.md).

Tickets concluídos usam `resolved`; os demais mantêm seus estados de triagem.
Os tickets 01 a 08 estão `resolved`. O escopo aprovado em 2026-11-10 passou a
ser somente Linux x64 (deb). Windows está fora desta pré-release: ticket 10
`wontfix`, sem instalador independente oferecido ou validação nesse sistema.
A auditoria 06 foi concluída em `573b8d3`; o ticket 07 remediou dependências e
renovou as verificações no commit `9e348bd`. Código publicado nesse commit após
aceite explícito e conferência do destino. Após bloqueio do Actions por cobrança,
o usuário autorizou geração local: o 08 criou e conferiu o rascunho no GitHub,
com o deb de SHA-256 `364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547`.
Ensaios Linux e aceites separados continuam obrigatórios.

[Evidências do checkpoint e recuperação](evidence/01-recovery-checkpoint.md).
O backup privado fica fora da árvore versionada, dentro de `.git`; preservá-lo
antes de substituir o checkout. Código publicado no ticket 07; nenhuma release
publicada nesta etapa.

1. [Comprovar recuperação e fixar ponto de corte](issues/01-recovery-checkpoint.md) — resolvido em 2026-11-10.
2. [Extrair e verificar o histórico do aplicativo](issues/02-extract-history.md) — resolvido em 2026-11-10; [evidências](evidence/02-history-extraction.md).
3. [Executar o aplicativo em clone independente](issues/03-standalone-app.md) — resolvido em 2026-11-10; [evidências](evidence/03-standalone-app.md).
4. [Documentar o uso com demonstração fictícia](issues/04-usage-documentation.md) — resolvido em 2026-11-10; [evidências](evidence/04-usage-documentation.md).
5. [Preparar instaladores e workflow de release](issues/05-release-packaging.md) — resolvido no escopo Linux; workflow e notas ajustados; [evidências](evidence/05-release-packaging.md).
6. [Concluir a revisão do material publicável](issues/06-publication-audit.md) — resolvido; [evidências](evidence/06-publication-audit.md).
7. [Publicar o código após aceite](issues/07-publish-source.md) — resolvido após aceite e publicação conferida em `9e348bd`; [evidências](evidence/07-publish-source.md).
8. [Gerar a release candidata em rascunho](issues/08-draft-release.md) — resolvido por geração local e upload autorizado, rascunho `441089918` conferido; [evidências](evidence/08-draft-release.md).
9. [Validar instalação e continuidade no Linux](issues/09-linux-validation.md) — `ready-for-human`: atualização manual e ensaios do aplicativo instalado conferidos; faltam instalação limpa, continuidade de perfil fictício anterior e seletores nativos completos; [evidências](evidence/09-linux-validation.md).
10. [Validar instalação e continuidade no Windows](issues/10-windows-validation.md) — fora desta entrega (`wontfix`); nota Windows documentada.
11. [Publicar a pré-release após aceite](issues/11-publish-prerelease.md) — bloqueado por: 09.
12. [Validar a entrega pública e retirar o aplicativo da origem](issues/12-retire-source-app.md) — bloqueado por: 11.

O aplicativo instalado é o ponto principal de teste em Linux x64, com perfis fictícios, complementado por verificações de histórico, privacidade e build. Ambiente indisponível bloqueia validações dependentes, sem dispensar critérios.

A aprovação desta divisão autoriza criar os tickets. Publicar código e publicar a release continuam sujeitos a aceites explícitos separados sobre resultados concretos. Nenhuma migração foi executada ao criar estes tickets.

Windows não é dependência para concluir este fluxo. A decisão altera somente
o escopo de plataformas, sem declarar concluídas as etapas 07 a 12.
