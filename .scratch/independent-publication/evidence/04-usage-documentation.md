# Documentação e demonstração fictícia — 2026-11-10

## Entrega

Base do aplicativo: `30986a7fc92f91ab598e1e8b47ebafd4c9cf429e`.
Trabalho no clone de validação `/tmp/meu-dinheiro-validation-03`, branch `main`.
Documentação pública: README de apresentação, instalação e primeiros passos;
`docs/user-guide.md`, `docs/installation.md`, `docs/development.md`,
`docs/architecture.md`, `docs/storage.md` e `docs/screenshots.md`.
O conteúdo útil do manual anterior foi revisado contra a interface e os serviços;
foram corrigidos o número de seções de Configurações, a promessa de backup de
todo o perfil e a descrição de atomicidade da restauração.

Nenhum código, esquema, versão ou identidade do aplicativo foi alterado.
TDD não se aplica a esta alteração documental: os pontos de verificação são
execução real, inspeção de dados, imagens e regressões existentes, sem criar
testes que espelhem o texto.

## Cenário e capturas

Perfil novo em `/tmp/meu-dinheiro-demo-04/`, com `XDG_CONFIG_HOME` e
`XDG_DATA_HOME` isolados. `userData` observado em `config/meu-dinheiro/`.
Electron 43.4.0, Linux x64, bundle compilado do clone independente. A abertura
precisou de `--no-sandbox` somente no ensaio de diretório não instalado, como
no ticket 03. Isso não é uma instrução para o instalador.

Os cadastros foram criados pela API IPC real exposta no renderer, sem inserir
linhas SQL ou alterar os componentes. Navegação e troca de abas/tema usaram a
interface real. Capturas via DevTools local da instância isolada, sem incluir
janelas externas, perfis, logs ou arquivos pessoais.

Cenário inteiramente fictício, descrito também no guia das imagens:

- Uma Conta demonstração, com saldo inicial de R$ 2.000.
- Setembro a dezembro de 2026, cada mês com quatro despesas (R$ 1.950) e duas
  entradas (R$ 4.800), copiados dos padrões. Categorias iniciais do aplicativo.
- Setembro/outubro quitados; novembro com R$ 4.200 recebidos e R$ 1.650 pagos;
  dezembro pendente. Realizado do período R$ 8.250, previsto R$ 11.400 e saldo
  em contas R$ 10.250, coerentes entre as telas.
- Um comprovante PNG sintético mínimo, criado para o pagamento fictício.

Seis capturas reais em `docs/assets/`: Visão Geral clara, despesas do mês,
entradas do mesmo mês, Histórico, Configurações e Visão Geral escura. As duas
abas do mês foram separadas para mostrar despesas e entradas sem montagem.
Placeholder do README removido. As imagens têm 1440 × 960 e foram abertas
para inspeção visual; nomes, valores, status e legibilidade conferidos.
Inspeção binária dos seis PNGs encontrou somente chunks `IHDR`, `IDAT`, `IEND`,
sem EXIF, texto, comentários ou caminhos internos. A identificação de demonstração
está no README, nas legendas/textos alternativos e no guia do cenário.

## Backup e restauração exercitados

1. Exportação pela API IPC real, usando serviço, SQLite e gateway ZIP reais.
   Somente o retorno dos diálogos nativos foi temporariamente automatizado no
   processo principal para escolher `/tmp/meu-dinheiro-demo-04/roundtrip.zip`.
2. Inspeção do ZIP: `data.json` e `uploads/novembro_2026-aluguel_fict_cio-1.png`.
   JSON versão 1: dez categorias, quatro despesas padrão, duas entradas padrão,
   uma conta, quatro meses, 16 despesas e oito entradas. `app_settings` ausente.
3. Criada conta temporária com R$ 777; tema alterado para escuro; removido somente
   o comprovante sintético do perfil e criado `orphan-demo.txt` fictício em uploads.
4. Na interface, Backup → Importar mostrou “substituir todos os dados atuais”
   antes de “Escolher arquivo”. Confirmação percorrida e sucesso observado.
5. A conta temporária desapareceu, a conta demonstração voltou a R$ 10.250 e
   o comprovante foi restaurado com bytes idênticos aos do ZIP. O tema escuro e
   o arquivo órfão permaneceram: a importação não restaura o perfil inteiro nem
   limpa arquivos que não estão no ZIP.
6. Outro ZIP fictício, com estrutura JSON inválida, retornou `invalid-format`
   e “Formato de dados inválido”. Não é prova de todo caso de corrupção/legado.
7. Retornos originais dos diálogos restaurados; aplicativo fechado e reaberto.
   Confirmados quatro meses, conta/saldo, tema e vínculo do comprovante. Consulta
   somente leitura comparou todas as colunas exportadas das sete coleções com
   o JSON original, sem diferenças, e repetiu a comparação binária do comprovante.

Os seletores nativos não foram operados interativamente. Restauração no app
instalado, abertura no visualizador padrão, atualização a partir da versão
anterior e comportamentos específicos do Windows continuam nos tickets 09/10.
Não se afirma atomicidade entre SQLite e arquivos: o banco é trocado antes da
cópia dos comprovantes, e uma falha posterior pode deixar restauração parcial.
O comportamento foi documentado sem alterar a funcionalidade neste ticket.

## Verificações

- `npm run typecheck`: passou.
- `npm test -- src/shared/ipc/channels.test.ts`: um arquivo, cinco testes passaram.
- `npm run lint`: passou.
- `npm test`: suíte completa, dez arquivos e 80 testes passaram.
- `npm run build`: bundles principal, preload e renderer gerados.
- Prettier nos sete documentos novos/revisados: passou.
- Links locais dos sete documentos e imagens: todos os destinos existem.
- `git diff --check`: passou; sem dados de ensaio na árvore versionada.

Instalação limpa por `npm ci`, reconstrução nativa e empacotamento já foram
comprovados no ticket 03; não foram repetidos nem atribuídos a esta execução.
Comandos dos guias foram conferidos contra `package.json`; as receitas dos
instaladores e os hashes usam placeholders explícitos até existirem candidatos.
O guia Linux usa XDG; para Windows indica conta de sistema descartável, sem
supor que XDG isole esse sistema.

## Continuidade

O guia de instalação está preparado para conferência final nos tickets 09 e 10.
A release independente e seus nomes/links definitivos ainda não existem. O
README informa essa situação, sem inventar downloads. A auditoria 06 deve
repetir a revisão das imagens e dos documentos no estado candidato e atualizar
as instruções após os ensaios dos instaladores. Nenhum envio público foi feito.

## Revisão e preservação

Skill `code-review` aplicada contra
`30986a7fc92f91ab598e1e8b47ebafd4c9cf429e...510b7bd`, com agentes
independentes para os dois eixos.

### Standards

Nenhum achado. Idioma, nomes, links, escopo documental, legibilidade das seis
capturas e coerência do cenário conferidos. Nenhum smell aplicável.

### Spec

Nenhum achado. README, guias e capturas atendem aos critérios; backup/restauração
correspondem ao código e à execução. Limites dos instaladores e dos diálogos
nativos estão explícitos. Sem requisito ausente ou ampliação indevida de escopo.

Total: zero achados em Standards e zero em Spec.

Entrega no commit `510b7bd` (`docs: add usage guides and fictional app screenshots`),
incorporado por fast-forward na branch `main` de
`.git/private-extraction/2026-11-10/app/`, sem remotes ou tags. O clone persistente
contém os documentos e os PNGs; nenhum ZIP, perfil ou arquivo do ensaio foi
incorporado. A instância de demonstração foi encerrada.

O ticket 04 está concluído. As verificações dos candidatos permanecem nos
tickets 06, 09 e 10; o bloqueio por falta de Windows gráfico pertence ao 10.
Código e release continuam sem publicação.
