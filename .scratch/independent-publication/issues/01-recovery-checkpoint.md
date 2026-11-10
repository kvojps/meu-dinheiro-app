# 01: Comprovar recuperação e fixar ponto de corte

**What to build:** Recuperar origem e destino antes de qualquer reescrita e delimitar a migração.

**Blocked by:** Nenhum (pode começar imediatamente).

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [x] Conferir estado atual, commits e refs de origem e destino; registrar ponto de corte, caminhos do app, caminhos históricos e suporte selecionado com justificativa.
- [x] Criar backup privado completo do Git, incluindo refs, e arquivos necessários de ambos; comprovar restauração isolada e manter fora do material publicável até o aceite final.
- [x] Conferir ferramentas, espaço privado, acesso aos instaladores anteriores, permissões do destino e Actions e ambientes gráficos Windows x64 e Linux x64, sem registrar credenciais.
- [x] Registrar lacunas e bloquear etapas dependentes sem dispensar critérios; manter origem intacta e documentar recuperação anterior à publicação e limites posteriores.

## Resultado

Checkpoint executado em 2026-11-10, com lacunas registradas e bloqueios preservados.
Ticket resolvido; os pré-requisitos pendentes estão registrados nas etapas dependentes.

[Evidências, seleção de caminhos, recuperação e bloqueios](../evidence/01-recovery-checkpoint.md).
Backups privados em `.git/private-recovery/2026-11-10/`, fora da árvore versionada.
Restaurações isoladas e clones dos bundles preservam HEAD e todas as refs;
conteúdo e modos de 70.297 arquivos da origem e 479 do destino conferidos.
Origem mantida intacta; nenhum push, reescrita ou publicação realizado.

## Comments

- Ticket 02 bloqueado até disponibilizar `git-filter-repo` e registrar versão.
- Ticket 06 mantém a inspeção interna de NSIS pendente, sem `7z` no PATH.
- Ticket 10 requer ambiente Windows x64 gráfico; Wine não satisfaz o critério.
- Ticket 05 deve declarar permissões de escrita mínimas no workflow; ticket 08
  deve comprovar execução. A permissão padrão consultada é somente leitura.
- Nenhum desses requisitos foi dispensado. Os bloqueios específicos não impedem
  registrar e validar o checkpoint nem autorizam etapas posteriores dependentes.
