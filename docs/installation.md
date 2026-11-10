# Instalação e conferência dos candidatos

[Início](../README.md) · [Backup antes de atualizar](storage.md)

## Situação da distribuição

A release independente está em preparação. Este roteiro deve ser conferido nos
candidatos antes de acrescentar links de download e declarar suporte validado.
Não há instaladores independentes aprovados por este documento.

Estão previstos NSIS `.exe` para Windows x64 e `.deb` para Linux x64
(Debian/Ubuntu). A versão final, os nomes dos arquivos, os requisitos mínimos e
os avisos efetivos de instalação serão registrados junto da release candidata.

## Conferir o arquivo

Obtenha o instalador e o SHA-256 da mesma release aprovada. Compare o hash antes
de executar. Substitua `ARQUIVO` pelo caminho real do candidato:

```bash
sha256sum 'ARQUIVO.deb'
```

No PowerShell:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\ARQUIVO.exe'
```

O checksum detecta diferença de conteúdo; não é assinatura digital nem prova
independente da origem. A primeira release pode vir sem assinatura. Os avisos
efetivamente apresentados pelo sistema ainda precisam ser registrados; não
desative proteções para contorná-los sem verificar origem e integridade.

## Linux x64 — roteiro a validar

Em uma máquina Debian/Ubuntu x64 de ensaio, com perfil fictício separado, instale
o candidato local (troque o caminho pelo arquivo baixado):

```bash
sudo apt install './ARQUIVO.deb'
```

Abra **Meu Dinheiro** pelo menu de aplicativos. Confira a versão em
**Configurações → Sobre**, a abertura das telas e a pasta de dados. Este comando
é uma instrução preparada, ainda não uma prova de instalação do candidato.

## Windows x64 — roteiro a validar

Execute o `.exe` NSIS do candidato e siga as telas do assistente; a configuração
atual permite escolher o diretório de instalação. Abra **Meu Dinheiro**, confira
a versão e a pasta de dados, e registre eventuais avisos do Windows. O instalador
não foi executado em Windows nesta etapa.

## Atualização e recuperação — ambos os sistemas

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
