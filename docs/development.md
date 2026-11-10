# Desenvolvimento

[Início](../README.md) · [Arquitetura](architecture.md)

## Preparar o ambiente

Use Node.js 24 e npm 11 (conferidos com 24.20.0 e 11.19.0 em Linux x64).
Na raiz de um clone independente:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run notices
npm run dev
```

`npm ci` precisa de rede. O `postinstall` baixa o Electron e recompila
`better-sqlite3` para sua ABI. Instale ferramentas nativas de compilação se não
houver binário pré-compilado; não use `--ignore-scripts`. Depois de recompilar
para o Node.js do sistema, execute `npm run postinstall` antes de abrir o Electron.

`npm run dev` abre o servidor de desenvolvimento e o Electron com DevTools.
`npm run preview` abre o bundle já gerado por `npm run build`.
Para um teste isolado, execute, por exemplo:

```bash
npm test -- src/shared/ipc/channels.test.ts
```

Use `npm run format:check` para conferir formatação. A geração de avisos usa a
árvore instalada e falha se `npm ls` detectar inconsistências. Consulte os
[detalhes da validação autônoma](standalone-validation.md).

## Separar dados de ensaio

Desenvolvimento também usa a identidade `meu-dinheiro`. Antes de iniciar, escolha
um perfil descartável. No Linux, o comando abaixo cria diretórios novos fora do
repositório e isola o perfil do processo:

```bash
demo_dir=$(mktemp -d /tmp/meu-dinheiro-demo.XXXXXX)
XDG_CONFIG_HOME="$demo_dir/config" XDG_DATA_HOME="$demo_dir/data" npm run preview
```

Confirme o caminho em **Configurações → Backup → Abrir pasta de dados**.
A receita XDG é para Linux; não a aplique como isolamento no Windows. Use uma
conta de sistema descartável nos ensaios Windows até conferir seu perfil.
Não adicione perfis, ZIPs, bancos, logs ou comprovantes ao Git ou a `resources/`.

## Empacotar

```bash
npm run dist:linux
```

Gera o alvo `.deb` definido em `package.json`, incluindo build e avisos.
Execute em Linux x64 e confira os recursos e licenças. O comando `dist:win`
permanece experimental, fora desta pré-release e sem suporte validado.
Para inspecionar o diretório Linux antes do instalador:

```bash
npm run build
npm run notices
npx electron-builder --linux --dir
```

Compilar não comprova instalação ou continuidade dos dados. Os comandos de build
Linux e verificações autônomas já foram executados; empacotamento e instalação
Windows estão fora desta entrega; atualização e uso do candidato Linux continuam
pendentes. O ensaio local
com diretório não instalado precisou de `--no-sandbox` por falta de helper SUID;
não acrescente essa opção aos scripts ou às instruções de instalação.
