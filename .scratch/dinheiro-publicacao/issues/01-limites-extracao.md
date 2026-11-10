# Definir os limites da extração e a preservação do histórico

Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: kvojps
Parent: ../map.md
Blocked by:

## Question

Qual conjunto de código, ferramentas, documentação e histórico deve formar o repositório independente, e como validar sua equivalência antes de retirar o app da origem?

Inspecionar dependências da raiz, caminhos de build, lockfile, avisos de terceiros e histórico de arquivos renomeados. Definir como extrair commits relevantes, tratar commits compartilhados e normalizar autores e committers sem atribuir contribuições de terceiros ao autor. Distinguir preservação da árvore atual de preservação do histórico. Especificar cópia de segurança, validação e condição de retirada da origem.

O acordo de preservar histórico e usar noreply já está nas Notes do mapa; a decisão aqui é o método e os critérios de aceite.

## Comments

### Rodada 1 — acordos confirmados pelo usuário

- Retirar o app da origem somente após validar a publicação e a instalação; a validação da extração local é um marco anterior.
- Exigir backup local privado completo do Git e dos arquivos necessários antes de qualquer reescrita, fora do repositório público, mantido até o aceite do usuário.
- Ticket permanece em discussão; esses acordos ainda não encerram os limites da extração.

### Rodada 2 — acordos confirmados pelo usuário

- Extrair histórico dos caminhos do app e suporte necessário; commits compartilhados preservam apenas as alterações selecionadas, com autoria, datas e mensagens preservadas, sujeitos à sanitização. Hashes mudarão.
- Promover o app à raiz e adaptar ferramentas, lockfile e documentação para funcionar em clone isolado, sem depender da origem.

### Rodada 3 — confirmação final do usuário

- As duas variantes de e-mail pertencem ao autor; identidade noreply confirmada.
- Não importar nenhuma tag ou release da origem. Criar uma nova release a partir do conteúdo validado neste repositório.
- Preservar os arquivos de preparação do destino em commit posterior à extração; guardar o commit original no backup privado, sem juntar raízes Git desconectadas.

## Answer

Decisão confirmada pelo usuário em 2026-11-10. Este ticket define o método e os critérios da extração; não autoriza executá-la durante o planejamento.

### Escopo e método

- Trabalhar em clone descartável, com filtragem de caminhos (por exemplo, git-filter-repo), promovendo `apps/meu-dinheiro-app` à raiz. Incluir caminhos anteriores caso a verificação final do histórico os revele; a inspeção atual não detectou renomes atravessando a fronteira do app.
- Preservar os commits relevantes ao app e ao suporte selecionado. Commits compartilhados conservam apenas suas alterações dentro do escopo; preservar datas, mensagens e atribuições, salvo remediações decididas na sanitização. Hashes mudarão; manter correspondência entre hashes antigos e novos em registro privado.
- Selecionar explicitamente o suporte da raiz: configuração TypeScript, ferramentas e configurações de lint/formatação/testes, rebuild do Electron, licença e gerador de avisos de terceiros. Não importar outros apps ou toda a raiz. Incorporar ou reformular referências documentais necessárias, sem copiar indiscriminadamente `.scratch`.
- Preservar a árvore atual do app antes das adaptações. Fazer adaptações de autonomia em commits posteriores identificáveis: caminhos de licença e scripts, globs de workspace, configurações, lockfile próprio e documentação.
- Normalizar autores e committers do autor para `62623689+kvojps@users.noreply.github.com`; o usuário confirmou as duas variantes de e-mail como suas. Qualquer identidade adicional encontrada exige atribuição própria, sem converter contribuição de terceiros em contribuição do autor; privacidade passa pelo ticket de sanitização.
- Não importar tags nem releases da origem. A versão, os artefatos e o processo da nova release serão definidos em [Definir a versão inicial e o processo de release independente](05-releases.md).
- Preservar os arquivos atuais de preparação do destino, após revisão de exposição, em commit posterior à extração. Guardar o commit original no backup privado; não unir raízes Git desconectadas no histórico público.

### Backup e critérios de aceite

- Antes de reescrever, criar backup privado completo do Git (incluindo refs) e dos arquivos necessários da origem e do destino; comprovar restauração e mantê-lo fora do repositório público até o aceite do usuário.
- Registrar ponto de corte da origem e inventário dos caminhos selecionados. Comparar a árvore extraída com a árvore original do app antes de adaptar; justificar cada inclusão ou exclusão de suporte. Verificar a correspondência dos commits, datas e atribuições no histórico filtrado.
- Validar em clone isolado, sem acesso relativo ao monorepo: instalação com lockfile próprio, typecheck, lint, testes, build e geração dos avisos de terceiros. Verificar licença, avisos e recursos incluídos nos instaladores.
- Validar abertura, instalação e backup/restauração com dados fictícios. Compatibilidade detalhada de instalações e dados existentes pertence à decisão de release; a sanitização precisa ser concluída antes da publicação.
- Retirar apenas o app da origem e deixar link no README somente após validar o repositório publicado e a instalação, com destino e ponto de corte confirmados. Os demais apps permanecem na origem.

### Base factual da inspeção somente leitura

A origem estava limpa, com 209 arquivos rastreados no app. Dos 101 commits que tocam seu caminho atual, 53 também alteram outros caminhos. Não foi encontrado código compartilhado entre apps, mas há dependências de ferramentas e arquivos da raiz. O destino já possui Git e um commit de preparação. Esses números são uma fotografia da inspeção, a revalidar no ponto de corte.
