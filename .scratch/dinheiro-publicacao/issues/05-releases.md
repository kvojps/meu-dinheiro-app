# Definir a versão inicial e o processo de release independente

Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: kvojps
Parent: ../map.md
Blocked by: 01

## Question

Qual versão, tag e conjunto de instaladores deve inaugurar o repositório independente, e como tornar sua publicação verificável e repetível?

Conforme [Definir os limites da extração e a preservação do histórico](01-limites-extracao.md), não importar tags nem releases da origem: criar uma nova release a partir do conteúdo validado aqui. Definir sua versão considerando o package atual `1.0.0-beta` e a compatibilidade com instalações existentes; a tag antiga não determina a nova versão. Definir plataformas e arquiteturas, continuidade de identidade do aplicativo e compatibilidade de dados instalados, nomes dos artefatos, changelog, checksums, validações e automação apropriada. Avaliar assinatura conforme viabilidade, sem prometer certificados ou builds não disponíveis. Definir se a primeira entrega prepara uma release draft ou inclui publicação e qual evento a autoriza.

## Comments

### Rodada 1 — preparação e publicação

Usuário confirmou preparar uma release em rascunho na execução posterior, com instaladores, notas e verificações, e publicá-la somente após seu aceite explícito. Esta sessão permanece no planejamento; as demais decisões do ticket continuam abertas.

### Rodada 2 — plataformas, continuidade e automação

Usuário confirmou Windows x64 com NSIS e Linux x64 com `.deb`, exigindo validação de instalação nos dois sistemas. Preservar identidade e localização dos dados; exigir teste de atualização com perfil fictício da versão anterior, além de backup e restauração. Prever workflow acionado manualmente, com builds nos respectivos sistemas, que prepare o rascunho com instaladores, notas e checksums SHA-256; publicação permanece condicionada ao aceite explícito.

### Rodada 3 — confirmação final

Usuário respondeu “Concordo com tudo” à versão inicial condicionada à conferência dos instaladores anteriores, à possibilidade de release sem assinatura digital e ao conjunto de artefatos, registros e critérios de aceite abaixo.

## Answer

Decisão confirmada pelo usuário em 2026-11-10. Define a release para execução posterior; nenhum workflow, instalador, tag ou release foi criado nesta sessão.

### Versão e artefatos

- Adotar inicialmente `1.0.0-beta.1`, com tag `v1.0.0-beta.1` e classificação de pré-release. Antes de fechar a versão, conferir os metadados dos instaladores anteriores; se indicarem regressão de versão, revisar a escolha com o usuário. A tag antiga da origem não determina a versão e não será importada.
- Entregar Windows x64 em NSIS (`.exe`) e Linux x64 em `.deb`, com arquiteturas explícitas e validação de instalação nos dois sistemas. Outras plataformas e arquiteturas não integram esta primeira release.
- Os nomes dos instaladores devem identificar app, versão, sistema e arquitetura. Definir a grafia efetiva na configuração de empacotamento e refletir os nomes efetivamente gerados nas instruções de instalação.
- Manter `CHANGELOG.md` em português e notas da release que descrevam a extração para o repositório independente, mudanças verificadas e limitações conhecidas.
- Permitir a primeira release sem assinatura digital, documentando essa condição e os avisos efetivamente observados na instalação. Aquisição de certificados não é requisito desta publicação; checksums não serão apresentados como assinatura digital.

### Identidade e compatibilidade

- Preservar a identidade do aplicativo e a localização dos dados: `appId` atual `com.meudinheiro.app`, nome em execução `meu-dinheiro` e armazenamento sob `userData`, com banco e comprovantes. Conferir também a identidade efetiva dos instaladores ao configurar o destino.
- Validar atualização a partir da versão anterior com perfil e dados fictícios, preservando os dados; exigir também instalação limpa e backup/restauração nos dois sistemas. A extração não deve obrigar o usuário a recomeçar seus dados.
- Não declarar suporte a downgrade sem validação específica. Se os testes revelarem incompatibilidade ou necessidade de remediação, interromper a publicação e decidir o tratamento, sem assumir compatibilidade apenas pela preservação dos nomes.

### Processo e critérios de aceite

- Prever workflow acionado manualmente, com builds nos respectivos sistemas e preparação de release em rascunho. Fixar o commit utilizado e verificar coerência entre versão do pacote, tag, artefatos e notas.
- Incluir no rascunho instaladores, notas e checksums SHA-256 dos arquivos entregues. Registrar o commit de origem do build e os resultados das validações, sem dados sensíveis. Repetibilidade significa processo documentado e verificável, sem pressupor identidade binária entre builds.
- Exigir os checks do projeto (typecheck, lint, testes e build), revisão de privacidade, licenças e avisos de terceiros conforme [Definir a sanitização e os critérios para publicação segura](03-sanitizacao.md), e instalação limpa, atualização e backup/restauração com dados fictícios nos dois sistemas.
- Falhas ou validações pendentes impedem publicar. A execução prepara o conjunto concreto em rascunho; a publicação depende de aceite explícito do usuário após sua revisão. Acionar o workflow não autoriza publicar automaticamente.

### Base factual e limites

A inspeção somente leitura da origem encontrou `1.0.0-beta` no pacote, scripts de empacotamento NSIS e `.deb`, sem arquitetura ou nome de artefato explícitos e sem pipeline de release encontrado. O app usa `app.setName('meu-dinheiro')`, SQLite sob `userData` e migrações numeradas. O backup contém `data.json` e `uploads/`; a restauração dos arquivos ocorre após a transação de dados e exige validação própria. Esses fatos não demonstram compatibilidade de atualização nem substituem execução nos sistemas de destino.

### Continuidade do mapa

Integrar estes critérios, acessos e ambientes necessários em [Consolidar a sequência de migração e os critérios de conclusão](06-plano-execucao.md). A conferência dos metadados anteriores e os testes são verificações da execução, com retorno à decisão se revelarem conflito; não há nova decisão independente já especificável nesta resolução.
