# 09: Validar instalação e continuidade no Linux

**What to build:** Comprovar instalação, atualização e recuperação de dados no Linux x64.

**Blocked by:** 08 — Gerar a release candidata em rascunho

**Status:** ready-for-human

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Usar Linux x64 com interface gráfica, perfil isolado e dados fictícios; registrar versão e checksum do deb testado.
- [ ] Validar instalação limpa, abertura, navegação pelas telas demonstradas e persistência após reabrir.
- [ ] Criar perfil fictício no instalador anterior e atualizar para o candidato, comprovando preservação de dados, comprovantes e localização de armazenamento.
- [ ] Exportar e restaurar backup com dados e comprovantes, conferir substituição esperada e persistência após reabrir.
- [ ] Conferir instruções Linux, armazenamento, backup/restauração e avisos observados; registrar evidências sem dados privados.
- [ ] Ambiente indisponível ou incompatibilidades impedem conclusão; abrir decisão específica quando necessário, sem prometer downgrade. Correções exigem renovar revisões e testes afetados.

## Comments

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
