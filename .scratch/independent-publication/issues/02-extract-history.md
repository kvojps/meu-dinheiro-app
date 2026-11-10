# 02: Extrair e verificar o histórico do aplicativo

**What to build:** Obter histórico relevante em clone descartável, com aplicativo na raiz e atribuições preservadas.

**Blocked by:** 01 — Comprovar recuperação e fixar ponto de corte

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Filtrar caminhos selecionados e históricos confirmados, mantendo somente alterações do escopo em commits compartilhados; não importar tags nem releases.
- [ ] Comprovar equivalência da árvore antes das adaptações; justificar suporte incluído e excluído e guardar correspondência dos hashes em registro privado.
- [ ] Preservar datas, mensagens e atribuições, sujeitos à sanitização; normalizar autoria e committer do autor para 62623689+kvojps@users.noreply.github.com.
- [ ] Revisar mensagens e trailers pessoais, preservando créditos, coautorias e contatos legítimos de terceiros. Achados não classificados exigem decisão específica.
- [ ] Preservar preparação revisada do destino em commit posterior e seu commit original no backup, sem unir raízes Git desconectadas; não publicar nem retirar o app da origem.

## Comments

2026-11-10 — Checkpoint 01 comprovado; extração ainda bloqueada pela ausência de
`git-filter-repo` no PATH. Disponibilizar a ferramenta e registrar sua versão
antes de reescrever. Usar o ponto de corte e a seleção documentados nas
[evidências do checkpoint](../evidence/01-recovery-checkpoint.md), conferindo
checksums privados e retenção do backup antes de substituir o checkout.
