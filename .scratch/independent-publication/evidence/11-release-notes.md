# Meu Dinheiro 1.0.0-beta.1

Pré-release Linux x64, sem assinatura digital. Windows está fora desta entrega:
não há instalador independente nem validação nesse sistema. NSIS é experimental.

Aplicativo independente com histórico preservado, documentação em português,
MIT e avisos de terceiros. Commit do instalador e destino da tag
`v1.0.0-beta.1`: `9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`.

## Instalação e integridade

Baixe `meu-dinheiro-1.0.0-beta.1-linux-x64.deb` e `SHA256SUMS` desta release.
Na pasta dos downloads, confira:

```bash
sha256sum -c SHA256SUMS
sudo apt install './meu-dinheiro-1.0.0-beta.1-linux-x64.deb'
```

SHA-256 esperado do deb:
`364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547`.
Checksum verifica os bytes comparados; não autentica autoria.
Pacote `meu-dinheiro-app`, versão deb `1.0.0~beta.1`, arquitetura `amd64`.

## Resultados e limites aceitos

Instalado pelo mantenedor como atualização em Ubuntu 26.04.1 LTS x64;
132 arquivos instalados coincidem com o candidato. Abertura direta sem
`--no-sandbox`, navegação, dados fictícios e persistência após reabrir passaram.
Backup/restauração passaram com retornos dos diálogos automatizados, usando
IPC, SQLite e ZIP reais: cadastro temporário substituído e comprovante
restaurado idêntico ao ZIP. A confirmação de substituição foi percorrida.

Não foram ensaiados instalação limpa, continuidade de perfil preparado na
versão anterior, interação completa dos seletores nativos, abertura pelo menu
nem comprovante válido em leitor externo. O comprovante de transporte era
texto fictício com extensão PDF. O mantenedor aceitou essas limitações; elas
não representam testes aprovados. Não há requisito mínimo de distribuição
comprovado nem promessa de downgrade.

O renderer usa `sandbox: false`; abertura sem flag não certifica seu isolamento.
Helper instalado observado como root:root, modo 755, sem SUID. O builder avisou
sobre associação de janela desktopName; abertura pelo menu não foi ensaiada.
O apt concluiu a instalação lendo o deb como root porque `_apt` não tinha acesso
ao diretório de download. Não desative proteções para contornar avisos.

## Dados e recuperação

Exporte um backup em Configurações → Backup antes de atualizar ou importar.
A importação substitui os dados financeiros, sem mesclagem nem desfazer;
o tema permanece. Comprovantes com nomes iguais são sobrescritos e arquivos
órfãos não são removidos. Banco e cópia de arquivos não são uma transação única;
um erro de disco pode ocorrer após a troca do banco. Confira dados e anexos
depois de reabrir e preserve os backups. ZIPs e banco não têm criptografia própria.

No Linux, o perfil fica em `$XDG_CONFIG_HOME/meu-dinheiro` ou
`~/.config/meu-dinheiro`. Feche todas as instâncias antes de copiar a pasta
integral. Não existe botão Abrir pasta de dados na seção Backup deste candidato;
ele aparece na tela de erro. Consulte os documentos installation.md e storage.md
na pasta docs do repositório para os procedimentos e limites completos.

## Geração e verificações

Build local de 2026-11-10: Node 24.20.0, npm 11.19.0, Electron 43.8.8,
electron-builder 26.18.0. Sem workflow Actions. Typecheck, lint e 80 testes
(10 arquivos) passaram. Deb, ASAR, SQLite x64, MIT e avisos inspecionados.
Auditorias npm completa e de produção não reportaram vulnerabilidades conhecidas
na geração; isso não garante ausência de vulnerabilidades. Não há promessa
de identidade binária entre reconstruções. O instalador não foi reconstruído
para esta revisão documental.
