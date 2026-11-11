# 06: Concluir a revisão do material publicável

**What to build:** Disponibilizar evidências de revisão concreta de privacidade, licenças e funcionamento independente.

**Blocked by:** 04 — Documentar o uso com demonstração fictícia; 05 — Preparar instaladores e workflow de release

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [x] Revisar árvore e todo histórico publicável, suporte, preparação, mensagens, atribuições e identidades; registrar cobertura e limites sem valores sensíveis.
- [x] Inspecionar candidato Linux: ASAR, recursos externos, dependências, metadados, MIT e avisos. Registrar o achado no NSIS anterior como limitação Windows, fora desta entrega.
- [x] Revisar documentação e screenshots visualmente e em metadados; assegurar dados fictícios e nenhum achado sem tratamento.
- [x] Comprovar instalação de dependências, typecheck, lint, testes, build e avisos em clone isolado no estado candidato.
- [x] Falhas, achados sem classificação ou verificações pendentes bloqueiam publicação; exposições concretas exigem decisão específica, sem apagar releases antigas, mudar visibilidade da origem ou revogar credenciais por hipótese.
- [x] Registrar commit e conjunto revisados e repetir verificações afetadas quando mudarem.

## Comments

2026-11-10 — Checkpoint 01 confirmou ausência de `7z` no PATH. A inspeção do
interior do NSIS anterior permanece pendente: disponibilizar ferramenta
apropriada e comprovar cobertura antes de concluir esta auditoria.


2026-11-10 — O ticket 03 concluiu a autonomia no clone persistente
`.git/private-extraction/2026-11-10/app/`, branch `main`, commit `30986a7`.
Ver [evidências](../evidence/03-standalone-app.md). O npm informou 29 alertas
na árvore completa (20 moderados, 9 altos), além de dependências descontinuadas;
avaliar incidência nos candidatos e registrar tratamento antes da publicação,
sem aplicar atualização automática que altere contratos nesta extração.
A abertura do diretório Linux não instalado exigiu `--no-sandbox` só no ensaio
fictício; isso não substitui validação do sandbox no instalador Linux. MIT,
avisos completos e recursos foram conferidos no pacote `--dir`; repetir nos
instaladores finais, inclusive NSIS. A execução Windows continua pendente das
etapas próprias; a compatibilidade das ferramentas foi apenas revista estaticamente.

2026-11-10 — O ticket 04 produziu README, seis guias e seis PNGs reais com
dados fictícios no clone privado. Ver [evidências](../evidence/04-usage-documentation.md).
Repetir revisão de conteúdo e metadados no estado candidato; completar nomes/links
de instaladores somente após sua conferência. O ZIP não inclui tema/configurações;
a cópia de uploads ocorre após a troca transacional do banco e preserva arquivos
órfãos. Esses limites foram documentados e não corrigidos funcionalmente no 04.

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

2026-11-10 — Revisão concluída no escopo Linux. Ver
[evidências e classificação dos achados](../evidence/06-publication-audit.md).
Commit privado `573b8d3`; histórico e candidato deb final revisados, instalação
independente, typecheck, lint e 80 testes passando. Links herdados e homepage
corrigidos; privacidade coberta com limites explícitos. Nenhum envio público.

## Answer

Auditoria concluída e conjunto fixado por commit e SHA-256. Os alertas de
runtime/dependências foram classificados; o tratamento pendente bloqueia a
publicação no ticket 07, sem converter revisão concluída em aceite de risco.
Ensaios do instalador Linux continuam no 09. Windows fora desta entrega.
