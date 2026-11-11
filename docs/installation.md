# Instalação e conferência dos candidatos

[Início](../README.md) · [Backup antes de atualizar](storage.md)

## Situação da distribuição

A pré-release `1.0.0-beta.1` está em rascunho, aguardando aceite explícito
para publicação. O único instalador é `meu-dinheiro-1.0.0-beta.1-linux-x64.deb`,
pacote `meu-dinheiro-app` versão `1.0.0~beta.1`, arquitetura `amd64`.

O candidato foi instalado pelo mantenedor como atualização em Ubuntu 26.04.1 LTS
x64. Abertura direta do executável, navegação, persistência e backup/restauração
com caminhos de diálogo automatizados foram conferidos com dados fictícios.
Instalação limpa, preservação de perfil preparado na versão anterior, interação
completa dos seletores nativos, abertura pelo menu e comprovante válido em leitor
externo não foram ensaiados. Essas limitações foram aceitas pelo mantenedor;
não há certificação de outras distribuições nem requisito mínimo comprovado.

**Windows:** fora desta pré-release. Não há instalador independente oferecido
nem validação de instalação, atualização ou recuperação de dados nesse sistema.
A configuração NSIS existente é experimental; não implica suporte validado.

## Conferir o arquivo

Obtenha o instalador e o SHA-256 da mesma release aprovada. Compare o hash antes
de executar. Na pasta do download:

```bash
sha256sum 'meu-dinheiro-1.0.0-beta.1-linux-x64.deb'
```

O checksum detecta diferença de conteúdo; não é assinatura digital nem prova
independente da origem. Este deb não possui assinatura digital. O hash esperado é:

```text
364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547
```

Na instalação observada, o apt leu o arquivo local como root por falta de acesso
do usuário `_apt` à pasta de download; a configuração do pacote concluiu.
Outros ambientes podem apresentar avisos diferentes. Não desative proteções
para contorná-los sem verificar origem e integridade.

## Instalar no Linux x64

Em uma máquina Debian/Ubuntu x64 de ensaio, com perfil fictício separado, instale
o candidato local (troque o caminho pelo arquivo baixado):

```bash
sudo apt install './meu-dinheiro-1.0.0-beta.1-linux-x64.deb'
```

Abra **Meu Dinheiro** pelo menu de aplicativos. Confira a versão em
**Configurações → Sobre**, a abertura das telas e a [pasta de dados](storage.md). A abertura pelo menu
continua sem ensaio. O executável instalado abriu sem `--no-sandbox`, mas o
renderer usa `sandbox: false`; isso não certifica isolamento do renderer.
Não acrescente flags para desativar proteções.

## Atualização e recuperação — Linux

Exporte um backup antes de atualizar. No ensaio de continuidade, use somente
cadastros e comprovantes fictícios: instale a versão anterior, prepare os dados,
feche o app e instale o candidato. Confirme que meses, saldos, tema e comprovantes
continuam disponíveis, inclusive depois de reabrir. Confira a identidade do app
e o diretório efetivo; não mude manualmente o perfil para esconder uma divergência.

Repita exportação e [restauração](storage.md) pelo aplicativo instalado, incluindo
o aviso de substituição e a abertura de comprovantes. Registre versão, sistema,
arquitetura, hash, mensagens e resultado. Refaça os ensaios se o candidato mudar.
Não há promessa de downgrade. O procedimento não autoriza usar dados reais em
capturas, logs ou evidências públicas.
