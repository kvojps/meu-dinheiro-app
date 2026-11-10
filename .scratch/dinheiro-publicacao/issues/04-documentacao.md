# Definir o padrão público de documentação e screenshots

Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: kvojps
Parent: ../map.md
Blocked by:

## Question

Quais convenções dos repositórios públicos do autor devem ser adotadas e quais telas demonstram o produto com dados fictícios?

Investigar os exemplos públicos antes de propor o padrão; delegar pesquisa factual conforme grilling quando necessário. Confrontar as referências com o README atual. Decidir estrutura do README, manual de uso, desenvolvimento, arquitetura, armazenamento e backup de dados, instalação, licença MIT e avisos de terceiros. Definir conjunto de telas, dados de demonstração, temas, captura e localização das imagens, substituindo o placeholder existente. Distinguir fatos documentados de funcionalidades ainda não verificadas.

## Comments

### Rodada 1 — público da documentação

Usuário confirmou priorizar instalação e uso no README e no manual, mantendo desenvolvimento e arquitetura em documentos separados. Demais decisões de documentação e screenshots permanecem abertas.

### Rodada 2 — confirmação do padrão

Usuário respondeu “Concordo com tudo” às propostas de estrutura, documentação de dados e licença e conjunto de screenshots, confirmando o entendimento compartilhado em 2026-11-10.

## Answer

Decisão confirmada pelo usuário em 2026-11-10. Este ticket define o padrão para execução posterior; os documentos e as capturas ainda serão produzidos e validados.

### Referências e situação atual

- [kvojps-monitor — README](https://github.com/kvojps/kvojps-monitor/blob/main/README.md): apresentação em português, screenshot com identificação dos dados demonstrativos, instalação, primeiros passos e desenvolvimento separado.
- [brazil-cancer-map — README](https://github.com/kvojps/brazil-cancer-map/blob/main/README.md): apresentação curta e navegação para guias específicos. É referência de organização, sem pressupor que seu licenciamento se aplique a este app.
- O README atual do Meu Dinheiro é um manual extenso com placeholder de screenshot e sem orientação de instalação ou desenvolvimento. Aproveitar o conteúdo útil, revisando as instruções na execução e deslocando detalhes internos para arquitetura.

### Documentação pública

- Priorizar quem quer instalar e usar o app no README e no manual. Manter documentação em português e novos nomes de arquivos e diretórios em inglês.
- README: apresentação, screenshots, instalação, primeiros passos e links para manual, desenvolvimento e arquitetura. As instruções de instalação devem refletir os artefatos e plataformas definidos em [Definir a versão inicial e o processo de release independente](05-releases.md).
- Manual: fluxos de uso revisados a partir do conteúdo atual. Guias separados para desenvolvimento e arquitetura, com comandos e informações conferidos após a extração.
- Incluir guia de armazenamento, backup e restauração. Documentar localização dos dados, conteúdo do backup e comportamento da restauração; validar a restauração antes de apresentar suas instruções como confiáveis.
- Licença MIT na raiz e avisos de terceiros aplicáveis, preservando atribuições legítimas conforme [Definir a sanitização e os critérios para publicação segura](03-sanitizacao.md). Adaptar as referências de empacotamento aos arquivos no repositório independente.

### Screenshots

- Quatro capturas principais: Visão Geral; mês com despesas e entradas; Histórico; Configurações.
- Tema claro como padrão e uma captura adicional no tema escuro.
- Capturas reais do app, usando perfil e dados inteiramente fictícios, coerentes entre telas e identificados como demonstração. Armazenar as imagens em `docs/assets/` e substituir o placeholder do README.
- A execução inclui preparar o cenário fictício, percorrer as telas e capturá-las, conferir legibilidade, consistência entre valores e ausência de dados pessoais, além da revisão de metadados prevista na decisão de sanitização.

### Evidências e limites

A inspeção local identificou as telas e o suporte aos temas claro/escuro. O código de backup usa ZIP com `data.json` e `uploads/`, a importação substitui dados e o armazenamento usa a pasta `userData` do Electron. Esses fatos orientam a revisão documental, mas não substituem testes dos fluxos.

O app não foi executado para esta decisão; telas, instaladores e restauração ainda exigem validação. Documentar apenas comportamentos conferidos, distinguindo limitações e recursos ainda não verificados.

### Continuidade do mapa

Os critérios deste ticket serão referenciados em [Consolidar a sequência de migração e os critérios de conclusão](06-plano-execucao.md). Nenhuma nova decisão surgiu que exija ticket adicional ou alteração da névoa do mapa.
