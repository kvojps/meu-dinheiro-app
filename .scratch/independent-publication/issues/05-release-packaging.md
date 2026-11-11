# 05: Preparar instaladores e workflow de release

**What to build:** Gerar instaladores próprios e preparar pré-release em rascunho por acionamento manual.

**Blocked by:** 03 — Executar o aplicativo em clone independente

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [x] Conferir metadados dos instaladores anteriores antes de adotar 1.0.0-beta.1 e tag v1.0.0-beta.1; regressão de versão exige revisão com o usuário.
- [x] Configurar deb Linux x64, com nomes identificando app, versão, sistema e arquitetura e build em Linux.
- [x] Preservar appId com.meudinheiro.app, nome em execução meu-dinheiro, identidade efetiva dos instaladores e armazenamento sob userData.
- [x] Preparar workflow manual que gere somente rascunho sobre commit fixado, com instaladores, notas em português e SHA-256; conferir pacote, tag e artefatos.
- [x] Gerar candidato Linux local ou privado para auditoria, incluindo MIT, avisos e recursos; preparar changelog com extração, mudanças verificadas e limitações.
- [x] Permitir release sem assinatura, distinguindo checksum de assinatura; documentar processo verificável sem prometer identidade binária. Não publicar código, tag pública ou release neste ticket.


## Comments

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

2026-11-10 — Implementação privada em `4e0095c`; candidato deb gerado e
inspecionado, com checks e 80 testes passando. Ver [evidências](../evidence/05-release-packaging.md).
Falta candidato NSIS gerado e inspecionado em Windows x64 nativo; por isso o
ticket permanece aberto como `ready-for-human`. Não há ambiente Windows nesta
sessão. Workflow preparado, sem execução remota ou publicação.

2026-11-10 — Alteração de escopo aprovada pelo usuário: concluir este fluxo
somente com Linux x64 (deb). Windows fica fora desta pré-release, com nota
explícita de ausência de instalador independente e validação. A configuração
NSIS experimental pode permanecer, mas não bloqueia esta entrega. Auditoria,
ensaios Linux e aceites separados de código/release continuam obrigatórios.

## Answer

Concluído no escopo Linux aprovado: deb privado inspecionado, workflow manual
Linux com três anexos (deb, notas e SHA-256), documentação e changelog com
nota Windows. Checks e revisão registrados nas evidências do ticket.
