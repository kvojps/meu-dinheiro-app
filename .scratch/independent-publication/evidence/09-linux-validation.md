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
