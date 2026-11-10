# Definir a sanitização e os critérios para publicação segura

Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: kvojps
Parent: ../map.md
Blocked by: 02

## Question

Com base no inventário, qual tratamento cada exposição exige e qual evidência permitirá liberar a publicação?

Definir remoção na árvore e no histórico, tratamento de artefatos e tags, uso de noreply para autores e committers, prevenção de recorrência e verificação final. Uma credencial exposta pode exigir revogação, mesmo após remoção do Git. Separar ações locais das que afetam origem ou conteúdo remoto e definir sequência, backup e limites de cobertura. Qualquer divergência entre preservar o histórico e eliminar dados privados deve ser decidida explicitamente com o usuário.

## Comments

### Rodada 1 — acordos e esclarecimento

- Usuário confirmou preservar créditos e contatos legítimos de terceiros, normalizando apenas suas identidades para noreply e revisando separadamente outros dados pessoais.
- Usuário confirmou revisão final do histórico extraído, mensagens, preparação, imagens e novos instaladores; screenshots e testes em perfil fictício; achados sem classificação impedem publicação até tratamento, com cobertura e limitações registradas sem valores sensíveis.
- Sobre releases antigas, o usuário informou que a origem é privada e perguntou sobre o risco. A classificação anterior como releases públicas não está demonstrada por consulta autenticada. Decisão sobre tratamento das releases antigas permanece pendente de esclarecimento.

- Verificação via API em 2026-11-10 confirmou que a origem está privada. Isso corrige a classificação do inventário, sem comprovar ausência de exposição histórica ou distribuição externa.

### Rodada 2 — confirmação final

Usuário concordou em manter as releases antigas na origem privada, exigir inspeção complementar do instalador Windows antes da nova publicação e reavaliar qualquer exposição concreta encontrada.

## Answer

Decisão confirmada pelo usuário em 2026-11-10. Define critérios para a execução posterior; nenhuma sanitização, reescrita, exclusão de release ou revogação foi executada nesta conversa.

### Identidades e preservação

- Normalizar as identidades do autor nos campos de autoria e committer para o noreply confirmado em [Definir os limites da extração e a preservação do histórico](01-limites-extracao.md). Revisar também mensagens e trailers que contenham suas identidades pessoais.
- Preservar créditos, coautorias e contatos legítimos de terceiros, incluindo atribuições de licença. Não atribuir suas contribuições ao autor nem substituir indiscriminadamente todos os e-mails.
- Classificar separadamente qualquer outro dado pessoal encontrado. Achados sem classificação ou conflitos entre preservar histórico e eliminar dados privados impedem a publicação até decisão explícita; este acordo não autoriza descartar histórico indiscriminadamente.

### Critérios para liberar a publicação

- Após o backup privado e a extração local previstos na decisão de extração, revisar a árvore final e todo o histórico que será publicado: suporte selecionado, mensagens, atribuições, arquivos de preparação e imagens. Conferir a normalização de identidade e o tratamento de cada achado também nas revisões históricas pertinentes.
- Revisar o conteúdo efetivo dos novos instaladores, incluindo NSIS Windows, ASAR, recursos externos, dependências e metadados. A inspeção complementar do instalador Windows da origem permanece requisito antes da nova publicação, pois a auditoria anterior não comprovou seu conteúdo interno.
- Revisar visualmente e verificar metadados das imagens escolhidas. Produzir screenshots e evidências de testes com perfil e dados fictícios, sem copiar dados reais, backups, uploads ou logs pessoais para o material público.
- Conferir que regras de exclusão do Git e de empacotamento protegem os dados privados identificados no escopo final. Regras de exclusão não substituem a revisão do histórico nem a inspeção dos instaladores.
- Registrar cobertura, limitações e resultado das verificações, sem reproduzir valores sensíveis. Ausência de achados não constitui garantia absoluta; achados sem classificação impedem publicação até tratamento.

### Origem privada e releases existentes

- A API confirmou em 2026-11-10 que `my-desktop-apps` é privado. Acesso autenticado às releases não demonstra exposição pública; a classificação anterior no inventário foi corrigida.
- Manter as releases antigas na origem privada. A decisão de extração continua sem importar tags ou releases para o destino; a nova release partirá do conteúdo validado.
- Privacidade atual não comprova ausência de exposição anterior ou distribuição externa. Se houver exposição concreta, reavaliar o tratamento da origem, releases e cópias distribuídas conforme o achado. Credencial comprovadamente exposta exige avaliar revogação, além de remoção do material publicável; não há evidência atual que justifique revogação específica.
- Alterações na origem ou em conteúdo remoto decorrentes de novos achados dependem dessa reavaliação. O planejamento atual não autoriza apagar releases nem mudar a visibilidade da origem.

### Continuidade do mapa

Nenhum achado novo tornou uma remediação específica ticketável. Remediações condicionadas a futuras descobertas permanecem em Not yet specified. Os critérios acima devem integrar [Consolidar a sequência de migração e os critérios de conclusão](06-plano-execucao.md).
