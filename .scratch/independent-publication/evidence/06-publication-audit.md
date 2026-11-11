# Auditoria do material publicável — 2026-11-10

## Resultado e escopo

Auditoria do aplicativo independente apenas para Linux x64. Windows está fora
desta pré-release por decisão do usuário. O achado do NSIS anterior (módulo
SQLite Linux dentro do instalador Windows) permanece classificado e documentado
no ticket 05; não constitui oferta nem validação Windows.

Base `acd9407ab63a7c6dfc625ec2d44abe03949ef332`; revisão documental em `d61ff6c`
e correção da homepage dos instaladores em `573b8d3`. Clone isolado em
`/tmp/meu-dinheiro-audit-06`, criado com `git clone --no-local`, remote removido,
sem tags. Os commits foram incorporados por fast-forward ao clone privado persistente.
Nenhum código, tag ou release foi publicado; origem e releases antigas intactas.

A auditoria identifica cobertura, classifica achados e registra ações. **Não é
aceite de publicação:** alertas das dependências, inclusive Electron distribuído,
continuam bloqueando o ticket 07 até tratamento ou decisão explícita do
mantenedor sobre risco residual. Ensaios de instalação Linux continuam no 09.

## Árvore, histórico, preparação e atribuições

Percorridos todos os commits alcançáveis de `main`, árvores e blobs únicos via
`git rev-list`, `git ls-tree -rz` e `git cat-file`, incluindo versões removidas.
A base tinha 91 commits, 934 blobs únicos, 479 caminhos e 13.811.580 bytes de
blobs; as correções foram incluídas na repetição final registrada abaixo.
Somente `refs/heads/main`, uma raiz, nenhum remote/tag/ref privado importado.

Padrões examinados: chaves privadas, tokens GitHub, IDs AWS, URLs com credenciais,
caminhos pessoais Unix/Windows, cabeçalho SQLite e trailers pessoais de sessão.
Nenhum achado nesses padrões nos blobs ou mensagens da base. Conferidos autores
e committers de todos os commits: somente o noreply aprovado. Mensagens mantêm
coautorias legítimas; não houve nova reescrita de histórico.

Encontrados 58 endereços distintos em blobs históricos: o noreply aprovado e
57 contatos de terceiros em avisos de licença e lockfile. Não houve outro
endereço fora desses arquivos. Preservados por serem atribuições/contatos de
dependências, sem substituição indiscriminada. Créditos das skills também
preservados, incluindo a atribuição em `.agents/skills/pr/CREDITS.md`.

Revisão dirigida abrangeu fonte, scripts, configurações, lockfile, avisos,
licença, documentos e preparação `.agents`, `.claude`, `.scratch`, `AGENTS.md`,
`CONTEXT.md` e `skills-lock.json`. Estes arquivos de preparação foram preservados
como registros da extração e não fazem parte do instalador. Os tickets/snapshots
históricos neles contidos não substituem o estado atual do esforço no checkout
de coordenação nem os guias de instalação/release vigentes. Referências históricas
a outros aplicativos são proveniência, não inclusão de seu código no pacote.

Limite: busca heurística e leitura dirigida, sem scanner especializado de
segredos, OCR em todo o histórico ou demonstração de ausência absoluta de
segredos ofuscados/dados pessoais. Os registros não reproduzem valores sensíveis.
Não foi identificado motivo concreto para revogar credenciais, apagar releases
antigas, mudar visibilidade da origem ou reescrever novamente o histórico.

## Imagens e documentação

Revisadas visualmente as seis capturas 1440 × 960: Visão Geral clara/escura,
Histórico, mês com despesas/entradas e Configurações. Conta e lançamentos são
explicitamente demonstrativos, sem nome pessoal ou comprovante real visível.
Conferidos totais e consistência com `docs/screenshots.md`.

Os seis PNGs contêm somente IHDR/IDAT/IEND, com CRCs conferidos; nenhum EXIF,
texto ou caminho de perfil. Há onze blobs binários únicos no histórico:
seis capturas, três variantes PNG de ícones/logos e duas versões ICO. Variantes
PNG foram abertas e conferidas como ícones, sem captura de dados reais. As duas
versões ICO têm sete frames cada; seus frames PNG de 256 pixels também foram
extraídos e revisados visualmente como os ícones correspondentes.
O logo claro tem bloco `caBX` com proveniência C2PA e certificados do fornecedor;
não é EXIF pessoal nem credencial do mantenedor. Não há endereço de e-mail nesse
bloco. A atribuição/proveniência legítima foi preservada, sem remover metadados
indiscriminadamente. A afirmação de capturas reais refere-se às seis screenshots,
não à origem artística de todos os ícones.

Corrigidos 13 links relativos quebrados em `docs/orca-theme.md` e no ADR visual:
passaram a referências históricas explícitas à origem, sem copiar evidências
privadas nem inventar destinos públicos. Repetição dos links relativos de
README, CONTEXT e Markdown sob `docs/` não encontrou arquivos ausentes.
Isto verifica caminhos, não disponibilidade de todos os links externos/âncoras.

O selo das screenshots mostra `1.0.0-beta`; documentada a diferença para o
candidato `1.0.0-beta.1`, sem alterar artificialmente imagens reais. Guias de
desenvolvimento e armazenamento atualizados para não sugerir Windows como alvo
da entrega atual. Conferidos manual/armazenamento contra IPC, serviços e gateways:
`userData`, exportação, substituição transacional das sete coleções e cópia
posterior de uploads; ausência de criptografia própria, tema fora do ZIP e
arquivos órfãos preservados estão documentados.

A homepage do pacote ainda apontava à origem privada: corrigida para o destino
independente `https://github.com/kvojps/meu-dinheiro-app`, sem alterar appId,
nomes de execução/instalação, esquema ou diretório de dados. Essa correção exigiu
regenerar o candidato e repetir metadados e inspeção.

## Instalação independente e candidato Linux

Node 24.20.0, npm 11.19.0, Electron 43.4.0, electron-builder 26.15.3, Linux x64.
Instalação real pelo lockfile próprio com `npm ci --no-audit --no-fund`, incluindo
download Electron e rebuild de better-sqlite3. Typecheck, lint e teste isolado
dos canais IPC (5 testes) passaram. Suíte completa: 10 arquivos, 80 testes.
Avisos regenerados com 143 pacotes, incluindo OFL da Geist e licenças vendorizadas.
Nenhuma dependência foi atualizada automaticamente.

As primeiras tentativas de deb falharam por quota de temporários (`EDQUOT`).
Removidas somente extrações e builds descartáveis do ensaio 05, cujos instaladores
originais/candidatos estavam preservados. Repetição com `TMPDIR` privado no
armazenamento persistente passou. A falha ambiental não foi tratada como sucesso.

A instalação limpa, atualização, seletores nativos, sandbox Linux e restauração
pelo instalador continuam obrigatórios no ticket 09. Nenhum `--no-sandbox` foi
incorporado aos scripts. A configuração herdada do BrowserWindow tem
`contextIsolation: true`, `nodeIntegration: false` e `sandbox: false`;
isolamento de contexto não comprova sandbox habilitado. Registrar essa limitação
no ensaio Linux e reavaliar se impedir os critérios da entrega.

## Dependências: incidência e tratamento

Consultas atuais: `npm audit` reporta 29 pacotes (20 moderados, 9 altos), sem
críticos. `npm audit --omit=dev` reporta seis (3 moderados, 3 altos).
As contagens representam pacotes afetados, não número de vulnerabilidades.
A classificação de desenvolvimento do npm não significa ausência no produto:
o Electron 43.4.0 é o runtime distribuído, embora declarado em devDependencies.

| Grupo | Incidência e alcance observado | Tratamento antes de publicar |
| --- | --- | --- |
| Electron 43.4.0 | Runtime efetivamente distribuído; 12 avisos no relatório, envolvendo origens/permissões, sandbox, geometria de frames e certificados. Algumas APIs não são usadas e um aviso é específico de macOS; isso não resolve o conjunto Linux. | Atualizar de forma dirigida para versão que cubra os avisos aplicáveis, reconstruir módulo nativo e repetir candidato/ensaios, ou obter decisão explícita de risco residual. |
| Zod 4.4.3 | Distribuído; valida IPC e backups. Alerta de exaustão de memória em coleções; backup lê JSON integralmente e sem limite global. Não foi reproduzido exploit nem inferida proteção suficiente por ser desktop. | Correção dirigida e prova nos fluxos de validação/importação, ou decisão explícita de risco residual. |
| archiver 8 / readdir-glob 3 / minimatch 10.2.6 / brace-expansion 5.0.9 | Todos distribuídos; alertas de consumo de recursos em padrões de glob. Exportação usa `directory(uploadsDir, 'uploads')`; o código instalado passa somente `stat`/`dot`, sem padrão ou ignore controlado pelo usuário. Alcance direto do padrão malicioso não foi encontrado nesse fluxo. | Classificado como alcance reduzido no fluxo atual, sem declarar pacote corrigido. Avaliar atualização transitiva compatível e retestar backup; não aplicar a sugestão automática de mudar archiver para 7. |
| fast-uri 3.1.5 | Surge em produção pelo lockfile; `npm explain` liga a ajv. Não encontrado como pacote no ASAR nem referência nos bundles principais/renderer; ferramentas usam ajv. | Classificado no ambiente de ferramentas; verificar novamente após mudanças de árvore. Não confundir ausência desse pacote separado com garantia sobre dependências embutidas no runtime Electron. |
| Demais alertas de ferramentas | ESLint/typescript-eslint, Vitest, Vite, electron-builder e transitivas: ambiente de build/checks. Vite, undici npm, js-yaml, xmldom e source-map-js não aparecem como pacotes no ASAR. | Rever versões e execução do build em ambiente confiável; não equiparar esses pacotes ao runtime instalado nem ignorar a cadeia de build. Relatório completo privado preservado. |

Essa classificação é análise estática do alcance, não prova de exploração ou
aceitação de risco. **Bloqueio de publicação mantido no ticket 07.** Não foi
aplicado `npm audit fix`, patch de esquema ou correção funcional fora da extração.
Mudanças futuras de dependências exigem renovar o conjunto auditado.

Fontes consultadas, além do lockfile, código instalado e relatórios npm:
[aviso Electron sobre certificados](https://github.com/electron/electron/security/advisories/GHSA-jr5w-w6x2-84p9),
[aviso Electron sobre sandbox](https://github.com/electron/electron/security/advisories/GHSA-gr2m-v5gq-v685),
[aviso do mantenedor minimatch](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249),
[aviso do mantenedor brace-expansion](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-qhr7-859c-m2p7)
e [aviso Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).

## Conjunto final auditado

Commit: `573b8d3caf301b81acaeba7c83e22b40ceaac675`. A repetição histórica cobriu
93 commits, 940 blobs únicos, 479 caminhos e 13.867.205 bytes, mantendo zero
achados nos padrões históricos usados e somente o noreply aprovado. `git fsck
--full` passou; regenerar avisos e build deixou a árvore versionada limpa.

Candidato privado preservado em
`.git/private-extraction/2026-11-10/audit-06/meu-dinheiro-1.0.0-beta.1-linux-x64.deb`.
SHA-256: `3d6bdb90d7be006c8b764856c2be94fba54c78c3df7c92dda93c9cfe0b92fa5f`.
O candidato anterior do 05 permanece preservado como evidência histórica e não
é o arquivo auditado aqui. Não se espera identidade binária entre reconstruções.

Extração do deb final confirmou pacote `meu-dinheiro-app`, versão
`1.0.0~beta.1`, `amd64`, homepage independente e contatos noreply. ASAR com
12.128 entradas; 11.366 arquivos internos não desempacotados lidos pela varredura.
Nenhum caminho de dados, `.env`, Git, skills ou planejamento detectado no ASAR.
MIT e THIRD-PARTY-NOTICES externos são idênticos byte a byte ao commit. Ícone,
LICENSE.electron.txt e LICENSES.chromium.html presentes. Módulo SQLite externo
confirmado ELF Linux x86-64. Nenhum symlink encontrado na extração deb.

Os quatro hits da varredura interna foram classificados:

- `bindings/bindings.js`: exemplo de caminho em comentário de dependência.
- `eventemitter3` sourcemap: caminho de build do fornecedor da dependência.
- documentação de `react-router`: caminho relativo de exemplo confundido com
  home pessoal pela heurística.
- testes distribuídos de Zod: URL com usuário/senha fictícios para testar parsing,
  referência pública a exemplo de URL; não é credencial do mantenedor.

Preservados como conteúdo upstream legítimo. A presença de documentação, testes
e sourcemaps de dependências aumenta o volume do pacote, mas não foi identificada
nesses hits exposição de dados privados do aplicativo. Exame de nomes/recursos e
heurísticas não substitui auditoria especializada de binários ou cadeia de software.

O `format:check` adicional reportou 12 arquivos com formatação preexistente.
Nenhum deles foi alterado neste ticket; os avisos foram comparados com a base.
Não foi feita reformatação funcional ampla para mascarar a linha de base.
Typecheck, lint e os 80 testes passaram; a formatação global não é declarada verde.

Registros privados: relatórios de histórico, pacote, metadados PNG/links,
`npm audit` completo/produção, `npm explain fast-uri`, logs de instalação,
checks, build e formatação, e scripts locais usados nas verificações.
Não incluem perfis ou dados financeiros reais. A lista exata e seus hashes ficam
no manifesto privado; não importar `.git` ou seus backups para o destino público.

## Estado dos marcos seguintes

Todos os achados desta auditoria foram classificados e receberam tratamento:
correção documental/metadados, preservação de conteúdo legítimo upstream ou
bloqueio explícito antes de publicar. Não há aceite implícito de risco.

Ticket 06 pode ser resolvido como revisão concluída; 07 recebe o bloqueio dos
alertas e exige novo conjunto auditado após remediação, ou decisão explícita e
registrada sobre risco residual. O 08 deve conferir os artefatos efetivos do
workflow contra o commit aprovado, sem reaproveitar hashes de builds diferentes.
O 09 deve registrar sandbox e ensaios do instalador; não confundir os checks de
build deste ticket com instalação, continuidade ou recuperação validadas.

## Revisão final

Skill `code-review` executada em dois agentes independentes, com referências
fixadas: `64ea973...5c14395` no checkout de coordenação e
`acd9407...573b8d3` no aplicativo. Verificados os relatórios privados e manifesto.

Standards: zero violações documentadas e zero heurísticas reportáveis.
Spec: zero desvios; a revisão confirmou que resolver a auditoria não aceita
os riscos e que os bloqueios de publicação estão registrados no ticket 07.
A revisão independente não é nova auditoria integral nem aceite de publicação.

Total: zero achados em cada eixo. Ticket 06 resolvido; ticket 07 recebe o
resultado concreto e seus bloqueios. Não houve push, tag ou release.
