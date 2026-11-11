# 04: Documentar o uso com demonstração fictícia

**What to build:** Oferecer guias em português e screenshots reais para conhecer e usar o aplicativo.

**Blocked by:** 03 — Executar o aplicativo em clone independente

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [x] Produzir README com apresentação, instalação e primeiros passos, manual e guias separados de desenvolvimento, arquitetura e armazenamento/backup/restauração.
- [x] Usar português no conteúdo e inglês em novos nomes; aproveitar conteúdo revisado e organização documental investigada no mapa.
- [x] Produzir quatro screenshots em tema claro: Visão Geral, mês com despesas e entradas, Histórico e Configurações; acrescentar captura em tema escuro e substituir placeholder.
- [x] Usar perfil isolado e dados inteiramente fictícios, coerentes e identificados como demonstração; revisar legibilidade, conteúdo e metadados.
- [x] Conferir comandos e comportamentos, incluindo conteúdo do backup e substituição de dados na restauração; não apresentar verificações pendentes como concluídas.
- [x] Preparar instruções de instalação para conferência final nos tickets de cada sistema; nunca copiar dados, backups ou logs reais.

## Answer

Concluído em 2026-11-10. README de apresentação/instalação/primeiros passos,
manual e guias de instalação, desenvolvimento, arquitetura, armazenamento e
capturas preparados em português no clone independente. Seis PNGs reais de
perfil fictício isolado cobrem as quatro telas claras, ambas as abas do mês
e uma Visão Geral escura; placeholder substituído, conteúdo e metadados revisados.

Backup/restauração exercitados com comprovante fictício e persistência após
reabrir; os limites da substituição, preferências fora do ZIP e arquivos órfãos
foram documentados. Seletores nativos tiveram somente caminhos automatizados;
instaladores/atualização e Windows não foram apresentados como validados.
Instruções e pendências encaminhadas aos tickets 06, 09 e 10.

Typecheck, lint, teste isolado (5), suíte completa (80), build, formatação e
links passaram. Revisão `code-review`: zero achados por eixo.
Commit `510b7bd` na branch `main` do clone privado persistente
`.git/private-extraction/2026-11-10/app/`, sem publicação.
Ver [evidências e limites](../evidence/04-usage-documentation.md).
