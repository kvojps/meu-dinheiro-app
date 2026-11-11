# Preparação do aceite da pré-release

## Proposta concreta

Release `441089918`, tag prevista `v1.0.0-beta.1`, nome
`Meu Dinheiro v1.0.0-beta.1`, destino `kvojps/meu-dinheiro-app`.
[Rascunho revisado](https://github.com/kvojps/meu-dinheiro-app/releases/tag/untagged-30e08bf6e20a661acf65).
A API confirma `draft: true`, `prerelease: true`, `published_at: null`.
Commit do instalador e destino da tag:
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`.

Anexos e digests conferidos na API após revisão das notas:

| Arquivo | Bytes | SHA-256 |
| --- | ---: | --- |
| `meu-dinheiro-1.0.0-beta.1-linux-x64.deb` | 116234356 | `364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547` |
| `RELEASE-NOTES.md` | 3634 | `725e1c3f93fdf9193f44f32db2d76cc7648e992559783a079224d68fd1c3ac8b` |
| `SHA256SUMS` | 106 | `984545acba41f971fcfc1be388bce744fde6ccb3e50746d5599516f34bdcd642` |

[Notas propostas](11-release-notes.md) aplicadas ao corpo e ao anexo do rascunho.
Somente as notas foram substituídas; instalador e SHA256SUMS preservados.
Nenhum rebuild: as evidências do [08](08-draft-release.md) e os ensaios do
[09](09-linux-validation.md) identificam exatamente o mesmo deb.

## Consolidação e documentação

O 09 foi encerrado pelo mantenedor com limitações aceitas. Passaram versão,
comparação dos arquivos instalados, abertura direta, navegação, persistência
e backup/restauração com caminhos de diálogo automatizados. Permanecem sem
ensaio instalação limpa, continuidade de perfil anterior, seletores completos,
abertura pelo menu e comprovante válido em leitor externo. Notas e documentação
revisadas distinguem esses resultados, sem certificar sandbox ou downgrade.
Windows permanece excluído. Não foram identificadas novas falhas funcionais.

Correções do changelog, instalação, armazenamento e desenvolvimento preparadas no clone
independente `/tmp/meu-dinheiro-public-docs-11`, commit
`3a9ec98f9119b1bbf97c7a7065b241e2e182589f`, descendente direto do main remoto observado
`dff300230e4c8167aab09f9d2476d49ba6431ee7`. Apenas quatro documentos; corrige botão inexistente e registra resultados,
limitações, avisos e hash. Identidades noreply preservadas; árvore limpa após commit.
Esse commit ainda não foi enviado. A tag continua no commit do instalador.
O aceite de código deve autorizar esse avanço documental de main, separadamente
do aceite de publicar a release. Não há reescrita pública proposta.

## Verificação

No clone independente passaram typecheck, lint, teste isolado de IPC (5 testes)
e suíte completa (10 arquivos, 80 testes). Os três documentos iniciais passaram Prettier. O changelog foi alinhado após
revisão Spec identificar afirmações históricas de pendência.
TDD não se aplica: alterações documentais e operação sobre candidato existente,
sem novo comportamento de código ou seam de implementação acordado.

## Próximas ações dependentes do aceite

Obter aceite explícito do envio documental e, separadamente, da release acima.
Antes de executar, reconferir main, rascunho, anexos e ausência de tag conflitante.
Enviar somente o avanço documental aprovado, publicar como pré-release e conferir
tag/commit, corpo, três anexos e SHA-256 dos downloads públicos. Se houver mudança
inesperada, interromper a ação dependente e registrar a divergência.

Origem, releases antigas e backups privados preservados. O 11 permanece aberto;
publicação e downloads públicos ainda não conferidos. O 12 continua bloqueado.

## Revisão

Skill code-review aplicada em dois agentes independentes, base de coordenação
`dff3002`. Standards: zero achados. Spec: um achado no changelog desatualizado,
corrigido na proposta documental final. A primeira proposta `59d3216` foi
substituída pela proposta acima, baseada no main remoto observado para evitar
qualquer reescrita. Aceites continuam pendentes.

## Conferência final da preparação

Download dos três anexos concluído em `/tmp/meu-dinheiro-release-11/downloaded`.
`sha256sum -c SHA256SUMS` passou; notas baixadas idênticas às propostas,
e SHA-256 das notas e do manifesto coincidem com a tabela. Duas verificações
prematuras, enquanto o download do deb ainda estava em andamento, falharam;
foram descartadas e a conferência integral foi repetida após o processo terminar.
O corpo remoto foi conferido contra as notas e contém o mesmo texto.

Revisão renovada da proposta `3a9ec98`: Standards 0 achados; Spec 0 achados
remanescentes. Os quatro documentos passaram Prettier no ambiente do clone
independente. A tentativa de usar esse binário no checkout de coordenação não
resolveu o plugin de formatação, por ausência de dependências locais; a execução
no ambiente instalado passou. `git diff --check` passou.
Manifesto privado do 08 revalidado: 11 arquivos coincidem. Nenhum backup removido.

A API de refs apresentou somente main em `dff3002`, sem tag. Esse estado deve
ser reconferido após aceite. A proposta é enviar apenas o commit documental
`3a9ec98` como avanço de main, sem enviar os registros novos de coordenação,
e publicar a tag no commit original do instalador `9e348bd`. A conferência
pública só pode ocorrer depois da autorização e publicação.

## Aceite e publicação executados

O mantenedor respondeu “AUtorizo, verifique o readme também se está atualizado
com essa instalação”, após esclarecimento de que a autorização abrangia envio
documental e publicação da pré-release. Não foi exigida ação manual no GitHub.

README estava desatualizado. Atualizado com link público estável, nomes exatos,
`sha256sum -c SHA256SUMS`, comando apt, backup antes da atualização, ausência de
assinatura e limitações Linux aceitas. Guia de instalação agora aponta para a
release disponível. Commit `9f0e29b221bcdebe902ba8beea4d2976dd35c655`.

A reconferência remota mostrou main em `fa59296`, contendo as correções
anteriores da coordenação. Por isso a proposta alternativa `3a9ec98` não foi
enviada: bastou avanço normal `fa59296..9f0e29b` com README/guia, usando
`git push --no-follow-tags`, sem force. Nenhum instalador reconstruído.

Verificações renovadas: typecheck, 5 testes IPC, suíte completa de 80 testes
e Prettier dos dois documentos passaram no clone com dependências instaladas.
Revisão code-review em dois agentes: Standards 0 achados; Spec 0 achados.
TDD permanece inaplicável à alteração documental.

Publicação via API da release `441089918`, mantendo `prerelease: true` e
`make_latest: false`, alterando apenas `draft: false`.
Publicada em `2026-11-11T01:15:12Z` (2026-11-10, 22:15:12, America/Recife).
[Pré-release pública](https://github.com/kvojps/meu-dinheiro-app/releases/tag/v1.0.0-beta.1).
API confirmou `draft: false`, `prerelease: true`, os mesmos três anexos,
tamanhos e digests da tabela. Ref da tag confirmada diretamente em
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`; main confirmado em `9f0e29b`.
Origem e releases antigas não foram alteradas. Backup privado permanece retido.

## Conferência dos downloads públicos e encerramento

Os três anexos foram obtidos via curl pelas URLs públicas estáveis, sem token
nem autenticação, em `/tmp/meu-dinheiro-release-11/public`. Processo concluído
antes da conferência. `sha256sum -c SHA256SUMS` passou; deb público idêntico
byte a byte ao candidato ensaiado e baixado do rascunho. Notas e manifesto
mantêm os hashes da tabela; notas idênticas ao arquivo revisado e ao corpo
publicado (desconsiderando apenas newline adicional da CLI). README obtido
pela URL raw pública é idêntico ao commit revisado.

Ticket 11 resolvido: aceites explícitos, documentação atualizada, pré-release
publicada e tag/commit/notas/anexos/downloads conferidos. A instalação a partir
da publicação e a retirada da origem pertencem ao 12; nenhuma retirada foi
executada. Limitações aceitas do 09 permanecem documentadas. Origem e releases
antigas preservadas; backup privado permanece retido até aceite final do 12.
