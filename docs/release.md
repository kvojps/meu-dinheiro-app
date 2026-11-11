# Preparar uma pré-release

[Auditoria de publicação](publication-audit.md) ·
[Relatório da 1.0.0-beta.1](validation/v1.0.0-beta.1-linux.md)

Gerar o instalador localmente, em clone isolado, somente após publicar o código
aprovado no destino correto (etapa separada). Fixar o checkout no SHA completo
de 40 caracteres aprovado e conferir `git rev-parse HEAD` e árvore limpa.
A versão do pacote e lockfile deve ser `1.0.0-beta.1`. A tag prevista é
`v1.0.0-beta.1`. Antes do envio, conferir destino, permissões, tags e releases
existentes, inclusive rascunhos. Se a tag ou release já existir, interromper e
revisar o estado; não substituir anexos nem publicar automaticamente.

Em Linux x64, instalar dependências do lockfile, executar as verificações e
gerar o deb. O empacotador usa `--publish never`; o envio é uma etapa separada:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm test
npm run dist:linux
```

Preservar o nome gerado: `meu-dinheiro-1.0.0-beta.1-linux-x64.deb`. Para preparar
notas localmente, copiar somente esse arquivo para `release-assets/` em clone
privado. Depois de conferir que HEAD corresponde ao commit aprovado:

```sh
export RELEASE_COMMIT="$(git rev-parse HEAD)"
node scripts/prepare-release.mjs
```

Não versionar candidatos, perfis, logs nem dados de ensaio.

Revisar as notas geradas em português, incluindo mudanças verificadas,
limitações, ausência de assinatura e ensaios pendentes. Após inspecionar o
candidato conforme abaixo, enviar somente os três arquivos ao GitHub usando
o SHA aprovado em `RELEASE_COMMIT`:

```sh
gh release create v1.0.0-beta.1 \
  release-assets/meu-dinheiro-1.0.0-beta.1-linux-x64.deb \
  release-assets/SHA256SUMS \
  release-assets/RELEASE-NOTES.md \
  --repo kvojps/meu-dinheiro-app \
  --target "$RELEASE_COMMIT" \
  --title 'Meu Dinheiro v1.0.0-beta.1' \
  --notes-file release-assets/RELEASE-NOTES.md \
  --draft --prerelease
```

Conferir pela API `draft: true`, `prerelease: true`, `target_commitish` no SHA
aprovado, tag prevista e corpo igual às notas anexadas. Conferir nomes,
tamanhos e digests dos três anexos, baixá-los em diretório separado e comparar
os bytes aos locais; executar `sha256sum -c SHA256SUMS` nesse download.
Falha no envio pode deixar rascunho incompleto: registrar e revisar seu estado
antes de qualquer nova tentativa. Manter o rascunho sem publicação até concluir
os ensaios Linux e obter aceite específico da release.

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
a versão exata do sistema, das ferramentas e dependências em cada execução.
Ambientes e ferramentas transitivas podem variar; não há garantia de bytes
idênticos em reconstruções. Verificar os hashes dos arquivos efetivamente
entregues. Publicar código e publicar a release exigem aceites explícitos
separados; concluir o rascunho não autoriza publicar.

Referências: [electron-builder](https://www.electron.build/configuration/),
[NSIS](https://www.electron.build/docs/nsis/) e
[API de releases](https://docs.github.com/en/rest/releases/releases).

## Windows fora desta pré-release

Por decisão do mantenedor, esta entrega inclui apenas Linux x64 e não exige
candidato Windows. A configuração `dist:win` existente
é experimental, sem instalador independente oferecido ou suporte validado.
Qualquer entrega Windows futura exige build nativo e inspeção, instalação,
atualização e backup/restauração em Windows x64. O NSIS anterior apresentou
módulo SQLite Linux em inspeção privada; reavaliar sua compatibilidade antes de
planejar uma atualização nesse sistema.

O [roteiro Windows](windows-validation.md) detalha ambiente nativo, inspeção do
SQLite e critérios de instalação, continuidade e recuperação para uma entrega futura.
