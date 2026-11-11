# Validação Linux — tentativa de 2026-11-10

## Candidato e ambiente

Ticket 08 concluído; candidato disponível no download local preservado em
`/tmp/meu-dinheiro-release-08/downloaded/`:

- Arquivo: `meu-dinheiro-1.0.0-beta.1-linux-x64.deb`.
- SHA-256 recalculado: `364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547`.
- Controle deb: pacote `meu-dinheiro-app`, versão `1.0.0~beta.1`, arquitetura `amd64`.
- Sistema informado: Ubuntu 26.04.1 LTS, kernel `7.0.0-42-generic`, x86-64.
- Variáveis gráficas presentes: `DISPLAY=:0`, `WAYLAND_DISPLAY=wayland-0`,
  `XDG_SESSION_TYPE=wayland`. Não foi comprovada a abertura de uma janela nesta tentativa.

`dpkg-query -W meu-dinheiro-app` informa versão instalada `1.0.0~beta`,
anterior à candidata. Não foi obtido checksum do instalador que originou essa
instalação. Nenhum perfil pessoal foi aberto, lido ou alterado.

## Bloqueio administrativo

No sandbox, `sudo -n true` falhou porque `no new privileges` impede elevação.
A repetição autorizada fora do sandbox também falhou:
`sudo: interactive authentication is required`.
Portanto, a sessão do agente não dispõe de autenticação administrativa para
instalar o deb. Não foi executada instalação, remoção ou atualização do pacote.

`apt install --simulate /tmp/meu-dinheiro-release-08/downloaded/meu-dinheiro-1.0.0-beta.1-linux-x64.deb`
terminou com sucesso e planejou uma atualização de `1.0.0~beta` para
`1.0.0~beta.1`, sem instalar/remover outras dependências. A simulação avisa que
não usa locks e exige root para execução real; não comprova instalação nem
ausência de falhas futuras.

A entrada desktop instalada aponta para `/opt/Meu Dinheiro/meu-dinheiro-app`.
O helper `chrome-sandbox` existente aparece nesta sessão como `nobody:nogroup`,
modo `755`. Essa observação pertence à instalação anterior e à visão restrita
do ambiente; não comprova permissões no host nem comportamento do candidato
instalado. O helper e os avisos continuam pendentes de inspeção no ensaio real.
Não foi usado `--no-sandbox` nem alterada proteção do sistema.

## Critérios ainda pendentes

Nenhum critério de aceite foi marcado como concluído. O hash e os metadados
foram conferidos, mas faltam todos os ensaios do aplicativo instalado:

1. Instalação limpa em ambiente Linux x64 de ensaio, perfil isolado e fictício,
   abertura pelo menu, versão, navegação e persistência após reabrir.
2. Identificação do instalador anterior e criação de dados e comprovantes
   fictícios nessa versão; atualização para os bytes acima, preservando o
   perfil no mesmo caminho e conferindo os dados após reabrir.
3. Exportação/restauração pelo aplicativo instalado, confirmação de substituição,
   conferência dos comprovantes, seletores nativos e persistência após reabrir.
4. Conferência efetiva de `docs/installation.md` e `docs/storage.md`, incluindo
   avisos de instalação, helper sandbox, associação de janela e caminhos.

## Retomada

É necessário um ambiente de ensaio com instalação administrativa disponível.
Preparar o perfil anterior fictício antes de atualizar; a instalação existente
não deve ser removida para simular instalação limpa. Usar outra máquina/VM ou
snapshot limpo para esse critério. Isolar `XDG_CONFIG_HOME` e `XDG_DATA_HOME`
em diretórios novos e preservar os mesmos caminhos entre versões no ensaio
de continuidade. Não usar dados reais nem prometer downgrade.

Em uma sessão administrativa desse ambiente, seguir `docs/installation.md`
com o caminho absoluto do deb conferido acima. Registrar os resultados reais
e as evidências sem dados privados antes de resolver 09. Se aparecer alguma
incompatibilidade, abrir decisão específica; mudanças no candidato exigem
renovar as revisões e verificações afetadas. O ticket 11 continua bloqueado.

## Verificações complementares

Sem alteração funcional; TDD não se aplica a este registro operacional.
Neste checkout, `npm run typecheck` e `npm test` foram tentados, mas não
executaram por ausência de dependências (`tsc: not found`, `vitest: not found`).
No clone de geração `/tmp/meu-dinheiro-remediation-07`, HEAD
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`, sem alterações versionadas,
passaram typecheck, teste isolado `src/shared/ipc/channels.test.ts` (5 testes)
e suíte completa (10 arquivos, 80 testes). São verificações do código do
candidato e não substituem ensaios do instalador. Nenhum artefato foi reconstruído.

## Retomada após instalação manual

O mantenedor instalou o candidato com `sudo apt install` e forneceu o log:
desempacotamento de `1.0.0~beta.1` sobre `1.0.0~beta`, configuração do pacote,
registro de `/usr/bin/meu-dinheiro-app` por `update-alternatives` e processamento
dos gatilhos de ícones, menus e arquivos desktop. O aviso sobre `zsh-common`
é de pacote órfão, independente do aplicativo. A nota final informa que `_apt`
não conseguiu acessar o arquivo em Downloads e o apt leu o deb local como root;
não é falha de instalação nem alteração do sandbox do aplicativo.

Conferência independente após o relato:

- `dpkg-query -W meu-dinheiro-app`: `1.0.0~beta.1`.
- SHA-256 do arquivo em Downloads: o mesmo candidato registrado acima.
- Comparação SHA-256 dos 132 arquivos regulares sob `/opt/Meu Dinheiro`
  com os extraídos do candidato do 08: nenhuma diferença.
- Helper conferido fora do sandbox: `root:root`, modo `755`, sem SUID.
  A visão anterior `nobody:nogroup` era do ambiente restrito.

### Abertura, dados e telas

Executável instalado `/opt/Meu Dinheiro/meu-dinheiro-app`, versão reportada
pelo processo principal e pela interface `1.0.0-beta.1`. Sessão gráfica real,
sem `--no-sandbox`. O processo foi aberto com `XDG_CONFIG_HOME` apontando para
`/tmp/meu-dinheiro-validation-09/config` e `XDG_DATA_HOME` para
`/tmp/meu-dinheiro-validation-09/data`. `app.getPath('userData')` confirmou
`/tmp/meu-dinheiro-validation-09/config/meu-dinheiro`.

Usadas portas de inspeção locais 9409 (renderer) e 9410 (main) para automação;
nenhuma modificação do ASAR, executável ou perfil pessoal. Preferência herdada
do BrowserWindow conferida em runtime: `sandbox: false`. A abertura sem flag
não certifica isolamento do renderer nem requisito mínimo de distribuição.

Cadastros fictícios criados pela API exposta no preload, percorrendo os handlers
IPC, serviços e SQLite reais: uma conta inicialmente com R$ 1.000, uma categoria
além das dez iniciais, uma despesa de R$ 120 paga com anexo, uma entrada de
R$ 250 recebida, uma despesa padrão de R$ 30 e uma entrada padrão de R$ 500.
Dois meses (novembro/dezembro de 2026), três despesas e três entradas no total.
Saldo final conferido: R$ 1.130. Tema escuro gravado, depois claro para verificar
que a restauração preserva a preferência atual.

Percorridas Visão Geral, Histórico, mês e as sete seções de Configurações.
Interface renderizada com os valores esperados; capturas e textos preservados
somente com dados fictícios. Não foi exercitado todo formulário nem toda
combinação de filtro. Abertura pelo menu de aplicativos ainda não foi ensaiada;
a entrada desktop aponta para o mesmo executável testado diretamente.

### Backup, substituição e reabertura

O botão Exportar abriu seletor nativo do portal Nautilus. A acessibilidade
local identificou Nome do arquivo e Salvar, mas não concluiu a seleção: a ação
automatizada retornou falha. Isso limita a prova de interação; não é diagnóstico
de defeito do aplicativo ou do portal. A operação nativa pendente foi encerrada
ao fechar a instância de ensaio.

Para testar a lógica instalada, foram automatizados somente os retornos de
`dialog.showSaveDialog` e `dialog.showOpenDialog` em memória, apontando para
`/tmp/meu-dinheiro-validation-09/backup.zip`. IPC, serviços, SQLite e ZIP
permaneceram reais. Exportação e importação retornaram sucesso. A confirmação
de substituição foi aberta e percorrida na interface com Escolher arquivo.
Um cadastro temporário de R$ 999 foi eliminado pela importação; conta original,
saldo, meses, despesas e entradas foram restaurados. Tema claro permaneceu.

O ZIP contém as sete coleções financeiras e o comprovante em `uploads/`.
SHA-256 do anexo tanto no ZIP quanto no perfil restaurado:
`dd374c7dead913ac04b4321a0b4ce281c2053e73e4268d17248534134382a40d`.
O anexo é texto fictício com extensão PDF para ensaio de transporte; abertura
em leitor externo e validade visual do documento não foram ensaiadas.
Após fechar e reabrir o executável instalado no mesmo perfil, conta, saldo,
meses, despesa paga com referência ao anexo, entrada recebida e tema persistiram.
O segundo processo foi encerrado após a conferência.

### Documentação e pendências

Corrigidos `docs/storage.md` e `docs/development.md`: não existe botão Abrir
pasta de dados em Configurações → Backup no candidato. O botão existe na tela
de erro; a documentação agora orienta a localizar a pasta pelo caminho XDG.
São correções locais de documentação, sem alterar o candidato ou publicar
mudanças. O ticket 11 deve conferir o material público final e seus aceites.

Esta retomada supera o bloqueio da instalação administrativa, mas não conclui
o ticket. A máquina foi atualizada, não recebeu instalação limpa. O perfil
fictício desta prova foi criado depois da atualização; não pode demonstrar
preservação de um perfil preparado na versão anterior. São necessários ensaios
em ambiente limpo e com instalador anterior identificado, além de concluir
seletores nativos, abertura pelo menu e abertura de comprovante válido no leitor.
Não reinstalar versão anterior sobre esta instalação nem usar dados pessoais
para preencher essa lacuna. Sem promessa de downgrade.

Typecheck, teste isolado (5 testes) e suíte completa (10 arquivos, 80 testes)
passaram novamente no clone do candidato `9e348bd`. Nenhum código funcional,
dependência ou artefato reconstruído. Ticket 09 continua `ready-for-human`,
com apenas o critério de ambiente/perfil/checksum marcado; ticket 11 bloqueado.
