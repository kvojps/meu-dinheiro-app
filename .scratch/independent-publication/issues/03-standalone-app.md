# 03: Executar o aplicativo em clone independente

**What to build:** Instalar dependências, abrir o aplicativo e executar verificações sem acesso ao monorepositório.

**Blocked by:** 02 — Extrair e verificar o histórico do aplicativo

**Status:** ready-for-agent

## Parent

[Especificação de publicação independente](../../dinheiro-publicacao/spec.md).

## Acceptance criteria

- [ ] Adaptar scripts, configurações, lockfile próprio, recursos e rebuild de dependências nativas do Electron em commits posteriores identificáveis.
- [ ] Em clone isolado sem referências relativas à origem, comprovar instalação com lockfile, abertura com perfil fictício, typecheck, lint, testes e build.
- [ ] Preservar execução dos testes existentes de canais IPC, navegação, consultas e auxiliares de interface; testes unitários não comprovam instalação ou restauração.
- [ ] Incluir MIT, geração de avisos de terceiros e recursos necessários, preservando atribuições e adaptando empacotamento.
- [ ] Conferir exclusões de dados privados do Git e pacotes sem substituir auditoria histórica; preservar identidade e armazenamento, sem mudanças funcionais ou de esquema injustificadas.
