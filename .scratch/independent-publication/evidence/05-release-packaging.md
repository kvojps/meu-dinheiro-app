# Empacotamento da release — 2026-11-10

**Estado atual: concluído no escopo somente Linux aprovado pelo usuário.**
A pendência Windows registrada abaixo é histórica e foi retirada desta entrega;
ver a atualização ao final.

## Implementação privada

Clone persistente: `.git/private-extraction/2026-11-10/app/`, branch `main`,
sem remotes ou tags. Base `510b7bd`; commits `756388c` e
`4e0095c6d7be7fe3ca56bf6fbbfec83ec7821d76`. Nenhum código, tag ou release
foi publicado e nenhum workflow remoto foi executado.

- Pacote, lockfile e cabeçalho dos avisos avançados para `1.0.0-beta.1`.
- Configuração NSIS/deb explicitamente x64, comandos com `--publish never` e
  nomes contendo aplicativo, versão, sistema e arquitetura. No deb, `${arch}`
  é expandido para `amd64`; nome externo fixado em `x64`, mantendo `amd64`
  no metadado interno correto. Nenhuma identidade de execução foi alterada.
- Workflow somente `workflow_dispatch`, SHA completo obrigatório e checkout
  conferido em ambos os sistemas: Ubuntu 24.04 e Windows 2025. Node 24.20.0,
  instalação por lockfile, typecheck, lint, testes e avisos antes de empacotar.
- Somente job de rascunho recebe escrita de conteúdo; rejeita tags/releases
  existentes, fixa `target_commitish`, `draft` e `prerelease`. Confere nomes,
  versões de pacote/lockfile, metadados deb/NSIS, SHA-256 dos anexos pela API e
  conjunto final de quatro arquivos. Não há etapa de publicação. Falhas de
  upload podem deixar rascunho incompleto, conforme documentado.
- Notas em português em `CHANGELOG.md`, procedimento em `docs/release.md` e
  script `scripts/prepare-release.mjs`. Checksum não equivale a assinatura;
  builds reconstruíveis a partir de fontes registradas não prometem bytes idênticos.

## Instaladores anteriores

Usados os dois arquivos preservados no checkpoint 01, cujos hashes já constam
naquela evidência. `dpkg-deb -f` confirmou pacote `meu-dinheiro-app`, versão
`1.0.0~beta`, arquitetura `amd64`. Os recursos UTF-16 do PE do NSIS declaram
`FileVersion` e `ProductVersion` iguais a `1.0.0-beta`, produto `Meu Dinheiro`.
Não foi encontrada regressão para beta.1; `dpkg --compare-versions` confirmou
`1.0.0~beta.1 > 1.0.0~beta`.

7-Zip 24.09 disponível no cache do electron-builder, apesar de não estar no
PATH: `.cache/electron-builder/7zip@1.0.0/7zip-linux-x64-16wjr/bin/7za` sob o
home. Extraiu NSIS anterior e seu `$PLUGINSDIR/app-64.7z` em `/tmp`.
O executável anterior é `Meu Dinheiro.exe`. O pacote interno declara beta.

**Achado concreto:** o NSIS anterior contém `better_sqlite3.node` em formato
ELF Linux x86-64, confirmado por `file`, além de caminho `bin/linux-x64-148`.
Isso impede presumir funcionamento do banco no instalador Windows anterior.
Não alterar ou apagar releases antigas. Ticket 10 deve conferir comportamento
real e abrir decisão específica se não puder preparar o perfil de atualização.
Esta inspeção pontual não conclui a auditoria completa do ticket 06.

## Candidato Linux preservado

Arquivo privado:
`.git/private-extraction/2026-11-10/release-05/meu-dinheiro-1.0.0-beta.1-linux-x64.deb`.
SHA-256: `dceb9b3c353fd8ec0f2d39b897313b51f1a46cea0eea634ac0765c87d7facdbf`.
Ao lado estão `linux-build.log` e `npm-audit-production.json`.

Construído em clone `/tmp/meu-dinheiro-release-05` com `npm ci`, Electron
43.4.0 e electron-builder 26.15.3 em Linux x64. A árvore de empacotamento
corresponde ao commit final; o commit foi registrado após gerar o candidato.
A primeira tentativa com symlink de node_modules não passou na geração de
avisos; substituída por instalação real pelo lockfile. O sandbox bloqueou
subprocessos; instalação e build foram repetidos com execução autorizada fora
do sandbox. Essas tentativas falhas não são evidência de build bem-sucedido.

`dpkg-deb -f` confirmou pacote `meu-dinheiro-app`, versão `1.0.0~beta.1`,
arquitetura `amd64`. Extração real conferiu:

- ASAR com 12.128 entradas, versão interna `1.0.0-beta.1` e sem os caminhos
  de perfis, bancos, backups, uploads, `.env`, Git, skills e planejamento pesquisados.
- MIT e avisos externos idênticos byte a byte aos arquivos finais versionados.
- Ícone e licenças Electron/Chromium presentes.
- `better_sqlite3.node` ELF Linux x86-64, compatível com a plataforma alvo.

Typecheck, lint, teste isolado dos canais IPC (5 testes), suíte completa
(10 arquivos, 80 testes), avisos, build e `git diff --check` passaram.
O primeiro comando de teste usou caminho incorreto; foi corrigido e executado.
O YAML foi analisado e confirmou somente `workflow_dispatch`. Ensaio pontual
do CLI, com arquivos sintéticos descartáveis (não instaladores), comprovou
rejeição do conjunto incompleto, SHA-256 pelo vetor conhecido `abc` e inclusão
do commit nas notas. Nenhum arquivo de teste novo foi acrescentado.
Não houve ensaio de instalação, atualização ou sandbox neste ticket.

## Alertas e tratamento antes de publicar

Consulta `npm audit --omit=dev` reportou seis pacotes: três moderados e três
altos, sem críticos. Isso não equivale à contagem anterior da árvore completa.
No ASAR efetivo foram encontrados `archiver`, `readdir-glob`, `minimatch`,
`brace-expansion` e `zod`. `fast-uri` não apareceu como pacote separado; isso
não comprova ausência em bundles nem resolve seu alerta transitivo.

O backup chama `archive.directory(uploadsDir, 'uploads')`; a cadeia de globbing
alertada está distribuída. Zod valida entradas IPC e conteúdo do backup,
portanto não foi classificado como irrelevante. Os alertas envolvem exaustão de
recursos e, em fast-uri, normalização de URI. Ainda não há demonstração de
exploração nos fluxos do aplicativo nem parecer de aceitação de risco.

Tratamento: manter publicação bloqueada no 06 até avaliar alcance, atualizar
as dependências afetadas com testes direcionados ou obter decisão explícita
sobre risco residual. Não aplicar `npm audit fix` automaticamente (a sugestão
para archiver inclui mudança principal/downgrade para 7). O pacote não é
considerado liberado para distribuição por esta preparação.

## Revisão e pendência

Skill `code-review`: dois agentes independentes contra `510b7bd`, com segunda
revisão Spec das correções até `4e0095c`.

Standards: zero violações documentadas; uma sugestão heurística de duplicação
na validação de versão/commit entre os dois jobs. Mantida a validação curta em
cada fronteira para falhar antes de gerar os builds e antes de criar o rascunho.
Spec: zero defeitos de implementação; falta evidência do candidato Windows
nativo e de sua inspeção efetiva. A configuração dos runners não comprova execução.

**Ticket 05 permanece `ready-for-human`:** falta gerar candidato NSIS em
Windows x64 nativo e conferir PE, módulo SQLite Windows, ASAR, MIT, avisos e
recursos. Ambiente Windows não está disponível nesta sessão. Não usar Wine ou
build Linux como substituto de build Windows. Executar privadamente os comandos
documentados e preservar hash e evidências; não publicar código para obter um
runner, nem antecipar o workflow do ticket 08 sem seus bloqueadores/aceites.
Tickets 06 e posteriores permanecem sujeitos às dependências existentes.

## Atualização: entrega somente Linux

O usuário decidiu concluir o fluxo apenas com Linux e incluir uma nota Windows.
Commit privado `acd9407` sobre `4e0095c`, na branch `main` do clone persistente.

- Workflow gera somente deb em Ubuntu 24.04; não há job Windows.
- Preparação exige exatamente um deb; rascunho exige três anexos: deb, notas e
  SHA-256. Arquivos extras causam falha.
- README, instalação, changelog e processo de release informam que Windows está
  fora desta pré-release, sem instalador independente oferecido ou validação.
  A configuração NSIS existente permanece experimental.
- Ticket 05 resolvido; ticket 10 retirado deste fluxo (`wontfix`). Tickets 06,
  08, 11 e 12 e especificação atualizados para Linux; 11 depende apenas de 09.
- Auditoria de conteúdo, alertas e ensaios Linux continuam necessários.
  Publicar código e publicar release ainda exigem aceites separados.

Verificação local do workflow confirmou somente runner Ubuntu. O CLI foi
executado com o deb real já preservado: aceitou apenas esse instalador,
rejeitou arquivo extra, reproduziu seu SHA-256 e incluiu o commit e a nota
Windows nas notas. Essa prova verifica a preparação local, sem criar rascunho
remoto. Mudanças limitadas ao workflow, script de notas e documentação não
alteram o conteúdo instalado do deb já auditado; seu checksum permanece igual.

Typecheck, lint e suíte completa (10 arquivos, 80 testes) passaram.
Skill `code-review` aplicada por agentes independentes em
`4e0095c...acd9407`: Standards zero violações/smells; Spec zero defeitos no
escopo Linux aprovado. Nenhum código, tag ou release foi publicado.
