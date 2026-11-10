# Publicar Meu Dinheiro como repositório independente

Labels: wayfinder:map
Status: resolved

## Destination

Definir uma rota executável para extrair Meu Dinheiro de `../my-desktop-apps` para este repositório, preservar seu histórico com identidade noreply, revisar exposição de dados privados e preparar documentação MIT com screenshots e releases próprias no padrão dos repositórios públicos do autor.

O mapa termina quando as decisões necessárias estiverem resolvidas e a implementação puder começar com critérios de aceite claros.

## Notes

- Planejamento concluído em 2026-11-10; todos os tickets resolvidos. A rota e as contingências da execução estão na decisão de consolidação abaixo. A migração ainda não foi executada.
- Planejamento primeiro, confirmado pelo usuário em 2026-11-10. A execução da migração pertence à etapa posterior.
- Preservar o histórico relevante do app, substituindo e-mails pessoais por noreply. Após validar o destino, remover apenas o app da origem e deixar um link no README; os outros apps permanecem na origem.
- MIT e screenshots reais com dados fictícios são requisitos. Manter documentação em português, tomando os repositórios públicos do autor como referência a investigar.
- Usar wayfinder; tickets de conversa consultam grilling e domain-modeling. Auditoria não deve copiar valores sensíveis para tickets, logs ou documentação pública.
- Tracker: Markdown local, conforme `.agents/skills/setup-matt-pocock-skills/issue-tracker-local.md`. Filhos em `issues/`, com Type, Status, Assignee, Parent e Blocked by. Claim: preencher Assignee e Status: claimed antes de trabalhar. Resolução: Status: resolved e resposta em `## Answer`; indexar aqui.
- Retomar pelo primeiro filho aberto, sem assignee e com todos os bloqueadores resolvidos. Resolver no máximo um ticket por sessão, exceto research.
- Inspeção inicial somente leitura: origem em `apps/meu-dinheiro-app`; dependências de ferramentas e arquivos da raiz precisam ser consideradas. Destino sem código do app; inspeção posterior confirmou Git utilizável com um commit de preparação (`chore: start project migration`). Build existente suporta NSIS e deb. Package declara `1.0.0-beta`, mas há tag local `meu-dinheiro-app-v2.0.0-beta`. README contém placeholder de screenshot. Esses fatos não substituem auditoria nem decisões.
- Identidade noreply confirmada pelo usuário: `62623689+kvojps@users.noreply.github.com`; detalhes da normalização no ticket de extração.

## Decisions so far

- [Definir os limites da extração e a preservação do histórico](issues/01-limites-extracao.md): histórico filtrado com app na raiz e suporte selecionado, sem importar tags/releases; backup privado e validação da publicação e instalação antes da retirada da origem.

- [Inventariar a exposição de dados antes de definir a sanitização](issues/02-auditoria-privacidade.md): inventário local e de releases registra identidade Git pessoal, créditos de terceiros, equivalência dos instaladores das releases da origem privada e lacunas de auditoria para a decisão de sanitização.

- [Definir a sanitização e os critérios para publicação segura](issues/03-sanitizacao.md): preservar atribuições legítimas, exigir revisão do material publicável e dos instaladores, manter releases na origem privada e reavaliar exposições concretas.

- [Definir o padrão público de documentação e screenshots](issues/04-documentacao.md): README voltado a instalação e uso, guias separados, MIT e avisos de terceiros; quatro telas em tema claro e uma captura adicional no escuro, com dados fictícios e validação posterior.

- [Definir a versão inicial e o processo de release independente](issues/05-releases.md): pré-release `1.0.0-beta.1` condicionada aos metadados anteriores, Windows/Linux x64, rascunho por workflow manual e publicação após aceite, com validação de instalação, atualização e restauração.

- [Consolidar a sequência de migração e os critérios de conclusão](issues/06-plano-execucao.md): rota em oito marcos, aceites distintos para código e release, recuperação e bloqueios definidos; planejamento concluído e contingências encaminhadas à execução.

## Not yet specified

Nenhuma decisão pendente conhecida. Hipóteses de remediação foram tratadas como contingências da execução em [Consolidar a sequência de migração e os critérios de conclusão](issues/06-plano-execucao.md).

## Out of scope

- Migrar os demais apps do monorepo ou arquivar todo `my-desktop-apps`.
- Criar funcionalidades financeiras ou redesenhar a interface sem necessidade para esta publicação.
- Publicar releases, reescrever o histórico ou remover arquivos da origem durante a criação deste mapa.
