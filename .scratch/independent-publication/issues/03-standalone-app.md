# 03: Executar o aplicativo em clone independente

**What to build:** Instalar dependências, abrir o aplicativo e executar verificações sem acesso ao monorepositório.

**Blocked by:** 02 — Extrair e verificar o histórico do aplicativo

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [x] Adaptar scripts, configurações, lockfile próprio, recursos e rebuild de dependências nativas do Electron em commits posteriores identificáveis.
- [x] Em clone isolado sem referências relativas à origem, comprovar instalação com lockfile, abertura com perfil fictício, typecheck, lint, testes e build.
- [x] Preservar execução dos testes existentes de canais IPC, navegação, consultas e auxiliares de interface; testes unitários não comprovam instalação ou restauração.
- [x] Incluir MIT, geração de avisos de terceiros e recursos necessários, preservando atribuições e adaptando empacotamento.
- [x] Conferir exclusões de dados privados do Git e pacotes sem substituir auditoria histórica; preservar identidade e armazenamento, sem mudanças funcionais ou de esquema injustificadas.

## Comments

2026-11-10 — Ticket 02 resolvido. Continuar em
`.git/private-extraction/2026-11-10/app/`, branch `main`, commit de preparação
`8bd21359c2352e03aa1c8510cf2eda63d13c4cbd`, sem remotes ou tags.
O pacote compartilhado foi preservado em `migration-support/package.json`;
configuração e lockfile ainda exigem adaptação. Ver
[evidências da extração](../evidence/02-history-extraction.md).
Não transportar backups ou registros privados para o material publicável.


2026-11-10 — Implementação concluída e revisada. Commits `b536999` e `30986a7`
na branch `main` do clone extraído persistente. Instalação em clone limpo com
lockfile e rebuild Electron, abertura com perfis fictícios, typecheck, lint,
80 testes, build e inspeção de recursos passaram. Ver
[evidências e limites](../evidence/03-standalone-app.md).

## Answer

O aplicativo executa de forma autônoma, sem referências relativas à origem.
Configurações, ferramentas, lockfile, recursos e avisos foram adaptados sem alterar
fontes funcionais, esquema, identidade ou armazenamento. Revisão Standards/Spec:
zero achados em cada eixo. O ensaio gráfico local exigiu `--no-sandbox` no diretório
não instalado; instalação/atualização/restauração e auditoria histórica continuam
nos tickets posteriores. Os alertas npm foram registrados nos tickets 05 e 06.
