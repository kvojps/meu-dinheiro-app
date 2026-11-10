# Preparar uma pré-release

O workflow `release-draft.yml` só é acionado manualmente. Executá-lo somente após
publicar o código aprovado no destino correto (etapa separada). Informe o SHA
completo de 40 caracteres aprovado; o runner faz checkout desse SHA.
A versão do pacote e lockfile deve ser `1.0.0-beta.1`. A tag prevista é
`v1.0.0-beta.1`; tags ou releases existentes causam falha, sem sobrescrita.

Ubuntu 24.04 gera deb x64. O runner instala com
`npm ci`, executa typecheck, lint e testes e gera avisos antes do build. O
empacotador usa `--publish never`. Somente o job final recebe `contents: write`;
ele cria pré-release com `draft: true`, SHA de destino fixado, notas em português
e três anexos: um instalador, `SHA256SUMS` e `RELEASE-NOTES.md`.
O job confere os digests devolvidos pela API e os metadados do rascunho.
Falha após criar o rascunho pode deixá-lo incompleto: revisar e remover o
rascunho incompleto manualmente antes de repetir, sem publicar nem substituir.
Não acionar o workflow neste ticket de preparação.

Para candidatos privados, em Linux x64:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm test
npm run dist:linux
```

Preservar o nome gerado: `meu-dinheiro-1.0.0-beta.1-linux-x64.deb`. Para preparar notas localmente,
copiar somente esse arquivo para `release-assets/` em clone privado e
executar `RELEASE_COMMIT=<SHA completo do HEAD> node scripts/prepare-release.mjs`.
Não versionar candidatos, perfis, logs nem dados de ensaio.

## Inspeção e aceite

Registrar commit, Node/npm/Electron, sistema e hashes dos candidatos. Conferir
`dpkg-deb -f` e extrair o deb com `dpkg-deb -x`. Conferir ASAR, módulos nativos da
plataforma, ícones, MIT e avisos externos, licenças Electron/Chromium e ausência
de perfis, bancos, backups e material de planejamento. Comparar licenças e
avisos com os arquivos do commit. Revisar os alertas de `npm audit --omit=dev`
sem aplicar `npm audit fix` automaticamente. Cobertura de arquivos e alertas
não substitui revisão de conteúdo e histórico.

O appId continua `com.meudinheiro.app`; o pacote deb continua
`meu-dinheiro-app`, o executável Windows continua `Meu Dinheiro.exe` e o nome
em execução continua `meu-dinheiro`. Não mudar esses identificadores nem o
caminho `userData`. Ensaiar instalação limpa, atualização com perfil fictício,
backup/restauração com comprovantes e sandbox Linux antes de publicar.

## Integridade e assinatura

Os instaladores podem ser sem assinatura digital; SHA-256 não autentica autoria.
No Linux, executar `sha256sum -c SHA256SUMS`. Registrar os avisos efetivamente observados durante
os ensaios; não inferir ausência de avisos a partir do build.

O processo fixa fontes, lockfile e versões das ferramentas principais. Registrar
a versão exata de cada runner e dependência em cada execução. Imagens dos
runners e ferramentas transitivas podem variar; não há garantia de bytes
idênticos em reconstruções. Verificar os hashes dos arquivos efetivamente
entregues. Publicar código e publicar a release exigem aceites explícitos
separados; concluir o rascunho não autoriza publicar.

Referências: [electron-builder](https://www.electron.build/configuration/),
[NSIS](https://www.electron.build/docs/nsis/) e
[API de releases](https://docs.github.com/en/rest/releases/releases).

## Windows fora desta pré-release

Por decisão do mantenedor, esta entrega inclui apenas Linux x64. O workflow
não gera NSIS nem exige candidato Windows. A configuração `dist:win` existente
é experimental, sem instalador independente oferecido ou suporte validado.
Qualquer entrega Windows futura exige build nativo e inspeção, instalação,
atualização e backup/restauração em Windows x64. O NSIS anterior apresentou
módulo SQLite Linux em inspeção privada; reavaliar sua compatibilidade antes de
planejar uma atualização nesse sistema.
