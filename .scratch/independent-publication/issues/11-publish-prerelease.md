# 11: Publicar a pré-release após aceite

**What to build:** Disponibilizar pré-release validada com instruções conferidas e integridade verificável dos downloads.

**Blocked by:** nenhum — 09 resolvido por decisão do mantenedor, com limitações aceitas

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [x] Consolidar resultados Linux sobre o mesmo candidato por checksum; falhas, achados ou validações pendentes impedem publicação.
- [x] Conferir documentação final contra comportamento observado, nomes dos artefatos, notas, limitações, avisos e instruções de instalação e backup/restauração.
- [x] Submeter alterações finais às verificações afetadas e ao aceite aplicável de código público; mudanças de artefatos exigem renovar rascunho e testes afetados.
- [x] Apresentar rascunho, commit, instaladores, checksums e evidências; obter aceite explícito da release, distinto do aceite do código.
- [x] Publicar somente pré-release aprovada e conferir tag, commit, notas, anexos e SHA-256 dos downloads públicos.
- [x] Manter origem e releases antigas intactas e backup privado até aceite final; não assumir suporte a downgrade ou reescrita pública.

## Comments

2026-11-10 — Mantenedor autorizou encerrar o 09 após conhecer os resultados
e as lacunas. O 09 está `resolved` e deixa de bloquear este ticket. Para a
consolidação, distinguir ensaios aprovados das limitações aceitas no
[encerramento do 09](09-linux-validation.md#answer); elas não representam testes
executados nem permanecem exigências bloqueadoras do 09 no escopo aceito.
Continuam obrigatórias a conferência documental final, a apresentação dessas
limitações e o aceite explícito da publicação. Nenhuma publicação autorizada
ou executada por esta mudança de status.

2026-11-10 — Instalação administrativa realizada pelo mantenedor e pacote
candidato conferido no 09. Abertura, navegação, persistência e backup/restauração
com caminhos de diálogo automatizados passaram. O 09 continua pendente por
instalação limpa, continuidade de perfil fictício anterior e seletores nativos
completos. `docs/storage.md` e `docs/development.md` corrigidos localmente:
Backup não possui o botão Abrir pasta de dados no candidato. Mudanças documentais
ainda precisam integrar a conferência final do material público; nenhum
artefato foi alterado. A publicação permanece bloqueada.

2026-11-10 — O 09 conferiu hash e simulação apt, mas não instalou o candidato:
autenticação administrativa interativa indisponível à sessão do agente.
Instalação limpa, atualização com perfil fictício e backup/restauração permanecem
pendentes. Publicação continua bloqueada até concluir os ensaios sobre o mesmo
deb. Ver [evidências do 09](../evidence/09-linux-validation.md).

2026-11-10 — Alteração de escopo aprovada pelo usuário: concluir este fluxo
somente com Linux x64 (deb). Windows fica fora desta pré-release, com nota
explícita de ausência de instalador independente e validação. A configuração
NSIS experimental pode permanecer, mas não bloqueia esta entrega. Auditoria,
ensaios Linux e aceites separados de código/release continuam obrigatórios.

2026-11-10 — Notas revisadas com resultados e limitações aceitas do 09;
correções propostas para os três documentos públicos. Deb e commit da tag
preservados. Aguardar revisão e aceites explícitos do envio documental e da
publicação. Ver [proposta](../evidence/11-publish-prerelease.md).

2026-11-10 — Preparação conferida e revisada: typecheck, lint, 5 testes isolados,
80 testes completos, formatação dos quatro documentos e downloads do rascunho
passaram. Standards e Spec sem achados remanescentes. Proposta documental
`3a9ec98` sobre main remoto `dff3002`; tag permanece no commit do instalador
`9e348bd`. Ainda faltam aceite do envio documental, aceite da release,
publicação e conferência pública. Não resolver até executar esses passos.

## Answer

2026-11-10 — Resolvido após autorização explícita do mantenedor para envio
documental e publicação. README e guia alinhados à instalação Linux, commit
`9f0e29b`, enviado sem force. Pré-release
[v1.0.0-beta.1](https://github.com/kvojps/meu-dinheiro-app/releases/tag/v1.0.0-beta.1)
publicada, tag em `9e348bd`, mantendo os mesmos bytes do deb ensaiado no 09.
Downloads públicos sem autenticação conferidos: SHA-256 do deb
`364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547`.
Notas, manifesto, metadados e README público coincidem com os arquivos revisados.
Typecheck, 5 testes isolados, 80 testes completos e formatação passaram;
revisão Standards/Spec sem achados remanescentes. Ver
[evidências finais](../evidence/11-publish-prerelease.md#aceite-e-publicação-executados).
Origem, releases antigas e backup privado preservados. Instalação a partir da
publicação e retirada da origem seguem no 12; não impedem esta resolução.
