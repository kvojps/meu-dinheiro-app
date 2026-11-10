# Inventariar a exposição de dados antes de definir a sanitização

Type: task
Labels: wayfinder:task
Status: resolved
Assignee: kvojps
Parent: ../map.md
Blocked by: 01

## Question

Que evidências concretas de dados privados existem na árvore, no histórico relevante, nas tags e nos artefatos publicados, para permitir decidir a sanitização necessária?

Tarefa AFK que desbloqueia a decisão de sanitização. Auditar segredos, configurações, dados financeiros, bancos, backups, logs, screenshots, caminhos pessoais, autoria Git e arquivos empacotados. Registrar apenas categoria, localização segura, alcance e ação proposta; nunca reproduzir segredos. Diferenciar ausência de achados de garantia de ausência. Se acesso remoto não estiver disponível, registrar a cobertura pendente. Não alterar histórico ou revogar credenciais neste ticket.


## Answer

Inventário realizado em 2026-11-10, somente leitura na origem e nos artefatos. Não houve reescrita, revogação ou publicação. Este inventário subsidia a decisão de sanitização; não certifica ausência de dados privados.

### Cobertura e método

- Origem no commit `17cb66b31d39bd04725ec6708263ea2f3d113df9`, árvore limpa. Percorridos objetos alcançáveis por todas as refs locais, incluindo as seis tags locais e refs de acompanhamento remoto. Escopo: caminho atual do app, arquivos diretamente na raiz e `scripts/`; 748 blobs únicos examinados. Não inclui objetos inalcançáveis, refs remotas não buscadas, outros apps ou todo o conteúdo documental do monorepo.
- Busca heurística por e-mails, caminhos pessoais Unix/Windows, marcadores de chaves privadas, tokens GitHub, IDs AWS, atribuições literais de credenciais e cabeçalho SQLite; inventário de nomes associados a bancos, backups, logs, uploads e imagens. Não foi usado scanner especializado de segredos; valores ofuscados e padrões não cobertos podem passar.
- Mensagens de commits que tocam o app e identidades de autores/committers examinadas separadamente. O destino também teve 156 blobs alcançáveis examinados por marcadores de caminho pessoal, chave/token e SQLite; sem achados nesses padrões. Esse exame do destino não é auditoria semântica de todo o material de preparação.
- Pacotes locais: inventário do `.deb`, leitura direta dos índices e conteúdo próprio do app em `linux-unpacked/resources/app.asar` e `win-unpacked/resources/app.asar` (11.378 entradas cada). Sem executar instaladores nem abrir banco real do usuário.
- GitHub consultado via API: duas releases da origem, `2026-09-13-21-27-00` e `2026-09-15-00-00-00`, ambas com os mesmos instaladores do app. Os SHA-256 fornecidos pela API coincidem com os arquivos locais Windows e Linux. O `app.asar` dentro do `.deb` coincide por SHA-256 com o arquivo Linux inspecionado. Não foi comprovada essa correspondência interna entre o instalador NSIS e `win-unpacked`.

### Achados e encaminhamentos propostos

| Categoria | Localização e alcance | Evidência e encaminhamento para a decisão |
| --- | --- | --- |
| Identidade pessoal Git | Autores e committers dos commits que tocam o app | Duas identidades de e-mail distintas, uma fora de noreply. Aplicar a normalização já acordada e repetir o exame após filtrar o suporte, que pode acrescentar outras identidades. Não reproduzir os endereços pessoais. |
| Créditos em mensagens | Mensagens dos commits que tocam o app | 48 ocorrências de e-mail, todas em linhas `Co-authored-by`. Examinar atribuição antes de qualquer substituição: não converter coautoria de terceiros na identidade do autor. Ausência de marcadores de credencial e caminho pessoal nos padrões usados. |
| E-mails incorporados | Histórico de `package.json`, `THIRD-PARTY-NOTICES.md` e lockfile da raiz | Package do app: apenas noreply. Avisos de terceiros: 55 e-mails distintos fora de noreply, sujeitos a preservação das atribuições das licenças. Lockfile: um e-mail fora de noreply; no arquivo atual não corresponde às identidades Git do app. Classificar como contato de dependência antes de decidir editar; não tratar automaticamente como segredo do autor. |
| Credenciais | Blobs históricos no escopo acima | Nenhum achado pelos padrões usados. Não há evidência suficiente para recomendar revogação específica. Revalidar os caminhos finais e os arquivos locais escolhidos no ponto de corte. |
| Dados financeiros e comprovantes | Árvore/histórico do app e índice dos dois ASAR locais | Sem arquivos de banco, backup ou uploads detectados pelo inventário, nem cabeçalho SQLite nos blobs históricos examinados. As ocorrências de nomes de backup/comprovante no histórico são código. Não equivale a excluir dados reais inseridos em texto comum, fixtures ou imagens. |
| Dados fora do Git | Persistência descrita em `src/main/infra/database/connection.ts` e gateways de backup/comprovantes | Banco e uploads atuais ficam em `userData`; há leitura de banco legado na pasta do app e `backend/uploads`. Backup exporta `data.json` e comprovantes. Não ler dados reais para esta publicação; excluir essas pastas e exportações do material selecionado. Não copiar diretórios de usuário para reproduzir screenshots. |
| Logs e caminhos pessoais | Código de migração e tratamento de erro de comprovantes | Migração registra caminho do banco; erros de filesystem podem carregar caminhos. Nenhum caminho pessoal literal detectado no escopo histórico. Logs capturados durante testes reais devem ficar privados; gerar evidências com perfil fictício. |
| Screenshots e recursos | Histórico de imagens do app | Encontrados somente caminhos de ícones/logos: `build/icon.ico`, `build/icon.png`, `resources/icon.png` e logos em `src/renderer/src/assets/`. Não houve revisão visual nem de metadados de cada revisão; nome de arquivo não comprova conteúdo. README ainda não fornece screenshot real validado. Revisão das imagens escolhidas e criação com dados fictícios permanecem critérios de documentação/sanitização. |
| Artefatos nas releases da origem | As duas releases da origem | SHA-256 comprova que os instaladores das releases são os arquivos locais inventariados. Não foram detectados e-mail ou caminho pessoal pelos padrões usados nos textos das releases. A inspeção do ASAR Linux não encontrou arquivos de banco/uploads nem marcadores pesquisados no conteúdo próprio do app; dependências não tiveram auditoria textual integral. Windows exige inspeção do interior do NSIS antes de afirmar o mesmo sobre o instalador. |
| Exclusões de Git e embalagem | `.gitignore` da raiz e `package.json` do app | Ignore cobre `.db`, WAL/SHM, uploads, logs, out e dist; não cobre universalmente `.env`, exportações JSON/ZIP ou todo formato de banco. Build declara `out/**/*` e recursos extras selecionados. Essas regras reduzem risco, mas não removem arquivos históricos nem comprovam o conteúdo efetivo de instaladores. |

### Lacunas que a rota precisa conservar

- A decisão de sanitização deve estabelecer a checagem final do histórico extraído, mensagens, atribuições, suporte selecionado, arquivos de preparação e árvore de publicação, incluindo dados financeiros textuais e URLs com credenciais que a heurística não cobre.
- A decisão deve incluir inspeção interna do NSIS, recursos externos ao ASAR, metadados dos instaladores (incluindo contatos) e dependências, além de revisão visual/metadados das imagens efetivamente publicadas. Sem executar o instalador nesta auditoria.
- Não houve inventário de todos os diretórios de dados do usuário, backups privados, downloads antigos, caches, forks, anexos de issues ou cópias externas. Não é necessário abrir finanças reais para decidir a publicação; qualquer exposição confirmada depois deve voltar à remediação.
- API e refs locais são uma fotografia: não houve fetch nem auditoria de toda a superfície remota. Revalidar refs, releases e digests no ponto de corte. Nenhuma constatação atual justifica afirmar necessidade de apagar releases antigas ou revogar uma credencial específica.

Essas lacunas pertencem aos critérios de [Definir a sanitização e os critérios para publicação segura](03-sanitizacao.md), que fica desbloqueado. A tarefa de inventário termina com cobertura e limites explícitos; a decisão de aceitar essa cobertura e exigir verificações adicionais pertence à conversa seguinte.

### Correção de visibilidade — 2026-11-10

Consulta autenticada ao endpoint de metadados do repositório confirmou `private: true` e `visibility: private`. A consulta anterior às releases não demonstrava acesso público; referências anteriores a artefatos públicos estavam incorretas. Não foi investigado se a origem já foi pública ou se houve distribuição externa dos instaladores.
