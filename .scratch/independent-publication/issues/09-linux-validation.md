# 09: Validar instalação e continuidade no Linux

**What to build:** Comprovar instalação, atualização e recuperação de dados no Linux x64.

**Blocked by:** 08 — Gerar a release candidata em rascunho

**Status:** resolved

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria originais

Preservados abaixo como registro do que foi efetivamente ensaiado. Os itens
não marcados têm execução parcial ou não realizada; a decisão de encerramento
em `Answer` aceita essas limitações e substitui sua exigência para este ticket.

- [x] Usar Linux x64 com interface gráfica, perfil isolado e dados fictícios; registrar versão e checksum do deb testado.
- [ ] Validar instalação limpa, abertura, navegação pelas telas demonstradas e persistência após reabrir.
- [ ] Criar perfil fictício no instalador anterior e atualizar para o candidato, comprovando preservação de dados, comprovantes e localização de armazenamento.
- [ ] Exportar e restaurar backup com dados e comprovantes, conferir substituição esperada e persistência após reabrir.
- [ ] Conferir instruções Linux, armazenamento, backup/restauração e avisos observados; registrar evidências sem dados privados.
- [ ] Ambiente indisponível ou incompatibilidades impedem conclusão; abrir decisão específica quando necessário, sem prometer downgrade. Correções exigem renovar revisões e testes afetados.

## Answer

2026-11-10 — Resolvido por orientação explícita do mantenedor: “Pode marcar
como resolvido”, após apresentação dos resultados e das lacunas. Aceitos os
ensaios do candidato instalado: versão e checksum, navegação, dados fictícios,
backup/restauração com caminhos de diálogo automatizados e persistência após
reabrir. Ver [evidências](../evidence/09-linux-validation.md).

Instalação limpa, continuidade de perfil fictício preparado na versão anterior,
seleção nativa completa dos backups, abertura pelo menu e abertura de comprovante
válido em leitor externo não são declaradas testadas. Permanecem limitações
aceitas no encerramento, sem promessa de downgrade. Esta decisão supera as
orientações anteriores de manter o 09 aberto até esses ensaios. Nenhum novo
teste ou artefato foi produzido para marcar a resolução.

O 09 deixa de bloquear o 11. A conferência documental e o aceite explícito
da publicação continuam no ticket 11; encerrar o 09 não autoriza publicar.

## Comments

2026-11-10 — Encerramento autorizado pelo mantenedor, com limitações registradas
em `Answer`. Status alterado para `resolved`; índice e ticket 11 atualizados.

2026-11-10 — Retomada após instalação manual pelo mantenedor: dpkg confirma
`1.0.0~beta.1`; checksum do download e 132 arquivos instalados coincidem com o
candidato do 08. Abertura gráfica sem `--no-sandbox`, navegação, gravação e
persistência após reabrir passaram com perfil fictício. Exportação/restauração
passaram pelo IPC real, com substituição de cadastro e comprovante idêntico ao
ZIP; os caminhos dos diálogos foram automatizados. O seletor nativo abriu, mas
a automação não concluiu sua interação. Corrigida a documentação que indicava
botão inexistente em Backup. Ainda faltam instalação limpa, perfil fictício
criado na versão anterior antes da atualização e interação completa dos
seletores nativos. Não resolver sem essas evidências. Ver
[resultados instalados e limites](../evidence/09-linux-validation.md#retomada-após-instalação-manual).

2026-11-10 — Candidato conferido por SHA-256; simulação apt planeja atualização
de `1.0.0~beta` para `1.0.0~beta.1`. Instalação real bloqueada: `sudo` exige
autenticação interativa mesmo fora do sandbox. Necessário ambiente de ensaio
com acesso administrativo, instalação limpa separada e perfil anterior fictício
antes da atualização. Nenhum critério concluído, pacote instalado ou perfil
pessoal alterado. Ver [tentativa e roteiro de retomada](../evidence/09-linux-validation.md).

2026-11-10 — Ticket 08 resolvido após autorização de geração local e upload,
dispensando Actions. Rascunho `441089918`, versão `1.0.0-beta.1`, commit
`9e348bdc6d5cdee0abea0d6c328232d8cb97da1f`. Usar exclusivamente o deb
`meu-dinheiro-1.0.0-beta.1-linux-x64.deb`, SHA-256
`364673bb22512dbc09584d20706cc868926b38d05d5996ae1ac5cafc9a37a547`,
conferido após download do GitHub. Build e inspeção não comprovam instalação.
Bloqueio por cobrança superado pelo método local; ensaios deste ticket
permanecem pendentes. Ver [evidências do 08](../evidence/08-draft-release.md).

2026-11-10 — O workflow do 08 falhou antes do build por bloqueio de cobrança
da conta GitHub. Nenhum artefato ou rascunho criado; aguardar regularização e
conclusão do 08 para identificar por checksum o deb efetivo a ensaiar.
Ver [tentativa do 08](../evidence/08-draft-release.md).

2026-11-10 — O ticket 04 preparou `docs/installation.md` e `docs/storage.md`
no clone extraído, com roteiro Linux e limites explícitos. Conferir comandos,
nomes, hashes, avisos, sandbox e restauração no deb candidato; o ensaio via
bundle e diálogos com caminhos automatizados não conclui estes critérios.
Ver [evidências documentais](../evidence/04-usage-documentation.md).

2026-11-10 — O 06 concluiu auditoria de build/conteúdo, sem ensaiar instalação.
A configuração herdada do BrowserWindow usa `sandbox: false`; o helper SUID e
o funcionamento do aplicativo instalado precisam ser conferidos. Não usar
`--no-sandbox` como substituto do critério. Registrar o resultado efetivo e
abrir decisão específica se exigir alteração funcional. Alertas bloqueiam o 07;
qualquer novo candidato exige renovar os checks do conjunto. Ver
[evidências](../evidence/06-publication-audit.md).
