# Issue tracker

Issues e especificações vivem em `.scratch/`.

## Convenções

- Diretório por esforço: `.scratch/<feature-slug>/`.
- Especificação: `spec.md`.
- Ticket por arquivo: `issues/NN-<slug>.md`, numerado desde `01`.
- Novos nomes de diretórios e arquivos usam inglês.
- Estado de triagem: campo `Status:`, conforme `triage-labels.md`.
- Comentários: acrescentar em `## Comments`.

Quando uma skill pedir publicação no tracker, crie ou atualize
o arquivo local correspondente.

## Encerramento e limpeza

`.scratch/` é temporário e pode ser recriado para novos esforços. Antes de
remover um esforço concluído, consolide em `docs/` os procedimentos reutilizáveis,
decisões ainda relevantes, resultados finais e pendências que precisam sobreviver.
Distinga ensaios executados de limitações aceitas. Atualize referências de código
e documentação para os destinos permanentes e confira os links antes da remoção.
Comentários de acompanhamento, caminhos temporários e estados superados podem
ser descartados. Preserve esta convenção de tracker após limpar os registros.

## Wayfinding operations

- Mapa: `.scratch/<effort>/map.md`.
- Filhos: `issues/NN-<slug>.md`.
- Metadados: `Type`, `Labels`, `Status`, `Assignee`, `Parent`
  e `Blocked by`.
- Estados do wayfinder: `open`, `claimed` e `resolved`.
- Bloqueadores: números dos tickets em `Blocked by`.
- Fronteira: primeiro ticket por número que esteja aberto,
  sem assignee e com todos os bloqueadores resolvidos.
- Claim: preencher `Assignee` e definir `Status: claimed`
  antes de trabalhar.
- Resolução: registrar resposta em `## Answer`, definir
  `Status: resolved` e indexar a decisão no mapa.
- Mapas e filhos usam somente labels `wayfinder:*`;
  os estados de triagem não se aplicam a eles.
