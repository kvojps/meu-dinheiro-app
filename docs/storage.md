# Armazenamento, backup e restauração

[Início](../README.md) · [Manual](user-guide.md)

## Onde ficam os dados

O processo principal usa a pasta `userData` do Electron, com o nome de aplicação
`meu-dinheiro`. No Linux, abra no gerenciador de arquivos o caminho correspondente
à variável `XDG_CONFIG_HOME` usada ao iniciar o app, conforme a tabela abaixo.
O candidato `1.0.0-beta.1` não oferece **Abrir pasta de dados** na seção Backup;
esse botão existe na tela de erro, quando ela é apresentada.

| Sistema | Local padrão esperado                                        |
| ------- | ------------------------------------------------------------ |
| Linux   | `$XDG_CONFIG_HOME/meu-dinheiro`, ou `~/.config/meu-dinheiro` |
| Windows | `%APPDATA%\meu-dinheiro`                                     |

O caminho Linux foi observado em execução isolada; o caminho Windows deriva da
configuração e precisa de conferência no instalador Windows. Perfis personalizados
podem mudar esses locais.

O banco é `meu-dinheiro.db`; `uploads/` guarda comprovantes. SQLite usa WAL e pode
manter arquivos `meu-dinheiro.db-wal` e `meu-dinheiro.db-shm`. Não copie só o banco
enquanto o aplicativo estiver aberto. Para uma cópia integral do perfil, feche
todas as instâncias e preserve a pasta completa, em local protegido.

## Exportar

1. Em **Configurações → Backup**, clique em **Exportar**.
2. Escolha o destino do ZIP (nome sugerido `export-meu-dinheiro-AAAA-MM-DD.zip`).
3. Aguarde a confirmação e guarde uma cópia em outro dispositivo ou local seguro.

O ZIP contém `data.json` com versão do formato, data da exportação, meses,
despesas, entradas, contas bancárias (com saldos), categorias e padrões, além de
`uploads/` com os comprovantes existentes. Não contém o aplicativo, suas
preferências de tema, marcadores internos de criação do mês, nem todo o perfil
do Electron. Não é uma cópia bruta do SQLite.

O ZIP e o banco não recebem criptografia própria do app. Proteja-os como dados
financeiros: quem acessa esses arquivos pode ler os dados e comprovantes. Não
os envie a issues nem os coloque no repositório.

## Restaurar

**A importação substitui os dados financeiros atuais, sem mesclagem e sem desfazer.**

1. Exporte o estado atual antes de continuar e guarde esse ZIP separadamente.
2. Escolha **Importar**, leia a confirmação e clique em **Escolher arquivo**.
3. Selecione um ZIP exportado pelo aplicativo, de origem confiável.
4. Aguarde a mensagem de sucesso. Confira meses, saldos, padrões e comprovantes.
5. Feche e reabra o app e confira novamente antes de descartar qualquer cópia.

As sete coleções financeiras são substituídas numa transação de banco. Depois,
os comprovantes do ZIP são copiados para `uploads/`, sobrescrevendo nomes iguais.
**Arquivos que já estavam nessa pasta e não estão no ZIP não são removidos.**
O tema atual é preservado. Após importar, o app garante o mês corrente; se ele
não estiver no backup, poderá ser criado com os padrões restaurados.

A troca do banco e a cópia dos arquivos não formam uma única transação. Uma
falha de disco durante a cópia pode ocorrer depois de o banco ter sido trocado.
Se houver erro, preserve os backups, confira o estado e não suponha que tudo
foi desfeito. Um ZIP com estrutura de dados inválida é recusado antes da troca;
essa recusa foi conferida com um exemplo fictício, sem certificar todo arquivo
corrompido ou compatibilidade com qualquer versão histórica.

O leitor reconhece chaves antigas (`accounts`/`default_accounts`) e coleções
opcionais ausentes. Essa tolerância no código não garante restauração de todo
backup legado: confira uma cópia antes de depender dela. Não há garantia de
downgrade entre versões.

## O que foi conferido

Em 2026-11-10, no bundle Linux do clone independente, um perfil inteiramente
fictício exportou e restaurou quatro meses, 16 despesas, oito entradas, uma conta,
dez categorias, quatro despesas padrão, duas entradas padrão e um comprovante.
Um cadastro temporário foi substituído e o comprovante restaurado foi comparado
byte a byte com o ZIP. O tema e um arquivo órfão permaneceram no destino.

A confirmação de importação foi percorrida na interface. Somente os caminhos dos
diálogos nativos foram automatizados via DevTools; IPC, serviços, SQLite e ZIP
foram os reais. Isso não valida a interação dos seletores nativos em cada sistema.
Instalação, atualização e restauração pelo instalador Linux e backups de versões
anteriores ainda dependem da conferência do candidato. Windows está fora desta
pré-release; o caminho esperado acima é referência técnica, sem suporte validado.
