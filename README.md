# Meu Dinheiro

Aplicativo desktop de controle financeiro pessoal organizado por mês. Cadastre
aluguel, salário e outras despesas e entradas recorrentes; acompanhe pagamentos,
recebimentos, comprovantes e saldos em uma interface em português.

Os dados ficam no computador, em SQLite e numa pasta de comprovantes, sem conta
online ou servidor do aplicativo. Você pode exportá-los para um ZIP.
Consulte os [limites e cuidados com os dados](docs/storage.md).

![Visão Geral em tema claro, com quatro meses fictícios](docs/assets/dashboard-light.png)

**Demonstração:** todas as capturas usam dados inteiramente fictícios de setembro
a dezembro de 2026. Valores e nomes não representam pessoas ou contas reais.
Veja as [demais telas e o cenário](docs/screenshots.md), incluindo o tema escuro.

## Instalação

A publicação independente está em preparação. Ainda não há instalador independente
validado indicado aqui. Esta pré-release terá apenas **Linux x64
(Debian/Ubuntu, `.deb`)**; o nome e link definitivos serão conferidos com o
candidato da release.

**Windows:** fora desta pré-release. Não há instalador independente oferecido
nem validação nesse sistema; a configuração NSIS existente é experimental.
Não há instruções validadas para macOS ou outras arquiteturas.

O [guia de instalação](docs/installation.md) prepara os passos de conferência dos
candidatos, incluindo integridade, atualização e limites da versão sem assinatura.
Para executar o código localmente, veja [Desenvolvimento](docs/development.md).

## Primeiros passos

1. Abra **Configurações → Contas bancárias** e cadastre uma conta com seu saldo inicial.
2. Em **Categorias**, ajuste a classificação das despesas.
3. Cadastre **Despesas padrão** e **Entradas padrão**. Os padrões são copiados
   para meses novos; cadastrar um padrão também o acrescenta aos meses existentes.
4. Em **Adicionar Meses**, escolha o intervalo que quer acompanhar.
5. Na **Visão Geral**, abra um mês, use **Pagar** ou **Receber** e confira as
   datas, a conta e os valores. O mês corrente é criado automaticamente.
6. Consulte o **Histórico** e exporte um backup em **Configurações → Backup**.

## Guias

- [Manual de uso](docs/user-guide.md)
- [Instalação e conferência dos candidatos](docs/installation.md)
- [Armazenamento, backup e restauração](docs/storage.md)
- [Desenvolvimento](docs/development.md)
- [Arquitetura](docs/architecture.md)
- [Capturas de demonstração](docs/screenshots.md)

## Licença

Código sob a [licença MIT](LICENSE). Bibliotecas e recursos de terceiros mantêm
suas próprias licenças e atribuições em [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
