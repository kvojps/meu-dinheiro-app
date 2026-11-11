# 12: Validar a entrega pública e retirar o aplicativo da origem

**What to build:** Concluir migração mantendo destino acessível e demais aplicativos funcionais na origem.

**Blocked by:** nenhum — 11 resolvido

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [x] Conferir repositório e release públicos e validar instalação dos artefatos baixados da publicação em Linux x64; registrar versões e checksums.
- [x] Confirmar destino e ponto de corte antes da retirada; divergências ou falhas bloqueiam remoção.
- [x] Retirar somente Meu Dinheiro e deixar link no README da origem; preservar demais aplicativos, histórico e releases antigas privadas.
- [x] Conferir e adaptar comandos, workspaces, lockfile e referências afetados, executando verificações pertinentes dos demais apps sem migrá-los ou redesenhá-los.
- [x] Registrar evidências dos oito marcos e aceites distintos de código e release; obter aceite final antes de liberar retenção do backup privado.
- [x] Recuperação posterior exige decisão específica que preserve dados dos usuários, sem presumir downgrade seguro ou autorização para reescrever histórico público.

2026-11-10 — Alteração de escopo aprovada pelo usuário: concluir este fluxo
somente com Linux x64 (deb). Windows fica fora desta pré-release, com nota
explícita de ausência de instalador independente e validação. A configuração
NSIS experimental pode permanecer, mas não bloqueia esta entrega. Auditoria,
ensaios Linux e aceites separados de código/release continuam obrigatórios.

## Comments

2026-11-10 — Ticket 11 resolvido; pré-release publicada e downloads públicos
conferidos pelo mesmo SHA-256 do candidato Linux. Ver
[evidências](../evidence/11-publish-prerelease.md). Ainda é necessário validar
instalação a partir dos artefatos publicados e cumprir os demais critérios
deste ticket antes de retirar Meu Dinheiro da origem. Nenhuma retirada ou
liberação de backup autorizada pela conclusão do 11.

## Resultado

2026-11-10 — Retirada aplicada e enviada à origem privada em `a6cd3e0`,
com os três outros apps intactos e releases antigas preservadas. Destino e
release públicos reconferidos; 132 arquivos instalados coincidem com o deb
público. Mantenedor dispensou reinstalação: “Já tá validado não precisa
reinstalar.” Typecheck, lint sem erros, build e 289 testes passaram. Branch
alternativa e cópias temporárias redundantes removidas.

[Evidências consolidadas e oito marcos](../evidence/12-retire-source-app.md).
Aceites de código e release registrados separadamente no 07/11. Pendente
somente o aceite final desta entrega para liberar retenção do backup privado;
backups originais e mapa de commits preservados. Nenhum downgrade ou
reescrita pública autorizado.

## Aceite final e encerramento

2026-11-10 — Após receber o resultado concreto da retirada `a6cd3e0`, checks,
revisões e retenção, o mantenedor respondeu: “Aceito e autorizo excluir os
backups restantes”. Removidos `.git/private-recovery` e
`.git/private-extraction` conforme autorizado. Nenhuma alteração em objetos,
refs ou histórico principal do Git. Todos os critérios concluídos; ticket
`resolved`, respeitando a dispensa de reinstalação já registrada.
