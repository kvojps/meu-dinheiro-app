# Validação autônoma

A raiz contém o aplicativo, as ferramentas e o lockfile próprio. Os comandos
abaixo não dependem de workspaces nem de arquivos externos ao clone.

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run notices
npm run dev
```

Use Node.js 24 e npm 11 (validados com 24.20.0 e 11.19.0 em Linux x64).
O `postinstall` instala explicitamente o Electron e executa
`electron-builder install-app-deps`, recompilando `better-sqlite3` para a ABI
do Electron. São necessários acesso à rede e ferramentas nativas de compilação
quando não houver binário pré-compilado. Não use `--ignore-scripts` na instalação.
Se recompilar dependências para o Node.js do sistema, execute novamente
`npm run postinstall` antes de abrir o Electron.

`npm run notices` consulta a árvore de produção instalada e acrescenta o Electron.
Inclui arquivos de licença e NOTICE, inclusive de código vendorizado, e a seção
License do README quando esse é o único texto disponível. Uma árvore npm inválida
interrompe a geração. Execute pelo script npm, que fornece o caminho do CLI também
no Windows. Créditos de terceiros são preservados, inclusive contatos legítimos.

Para conferir o conteúdo empacotado sem gerar instalador:

```bash
npm run build
npm run notices
npx electron-builder --linux --dir
```

O pacote inclui `out/`, dependências de produção, ícone, MIT, avisos de terceiros
e licenças do Electron/Chromium. Diretórios de planejamento, perfis e documentação
não são recursos do aplicativo. Não coloque dados de usuário em `resources/`.
Exclusões de Git e empacotamento não substituem a auditoria histórica nem a
inspeção dos instaladores finais.

Em Linux, isole o perfil fictício definindo `XDG_CONFIG_HOME` e `XDG_DATA_HOME`
para diretórios temporários novos antes de abrir o executável ou `npm run preview`.
A identidade permanece `meu-dinheiro`, com `appId` `com.meudinheiro.app`; os dados
continuam sob `userData`. Não use o perfil pessoal nos ensaios.

Na prova local de 2026-11-10, o diretório Linux não instalado exigiu
`--no-sandbox` porque o helper SUID não estava configurado. A opção foi usada
somente no ensaio com perfil descartável; não foi adicionada ao aplicativo nem
aos scripts de uso. Essa prova comprova abertura e renderização, sem comprovar
instalação, atualização ou restauração de backups. O ensaio posterior do deb
instalado e suas limitações aceitas estão no
[relatório Linux da 1.0.0-beta.1](validation/v1.0.0-beta.1-linux.md).
Para outra entrega, repita os ensaios de [instalação](installation.md);
Windows tem um [roteiro futuro próprio](windows-validation.md).
