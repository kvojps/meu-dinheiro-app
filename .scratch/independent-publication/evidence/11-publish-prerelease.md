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

Correções de instalação, armazenamento e desenvolvimento preparadas no clone
independente `/tmp/meu-dinheiro-remediation-07`, commit
`59d32167532d5cf9cabb7e1b77985476b2eed193`, descendente direto do código
aprovado. Apenas três documentos; corrige botão inexistente e registra resultados,
limitações, avisos e hash. Identidades noreply preservadas; árvore limpa após commit.
Esse commit ainda não foi enviado. A tag continua no commit do instalador.
O aceite de código deve autorizar esse avanço documental de main, separadamente
do aceite de publicar a release. Não há reescrita pública proposta.

## Verificação

No clone independente passaram typecheck, lint, teste isolado de IPC (5 testes)
e suíte completa (10 arquivos, 80 testes). Os três documentos passaram Prettier.
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
