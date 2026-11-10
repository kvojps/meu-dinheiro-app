# Consolidar a sequência de migração e os critérios de conclusão

Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: kvojps
Parent: ../map.md
Blocked by: 03, 04, 05

## Question

As decisões anteriores bastam para executar a migração, validar a publicação e retirar o app da origem sem interromper os demais aplicativos?

Definir sequência executável, validações de histórico e privacidade, typecheck, lint, testes, build e instalação, revisão dos screenshots e documentação, criação ou configuração do remote, publicação de release e atualização da origem. Referenciar as decisões nos respectivos tickets, sem duplicá-las. Explicitar acessos e ambientes ausentes, rollback e critérios de pronto. Se ainda houver decisões, criar tickets e dependências antes de declarar o mapa concluído.

## Comments

### Confirmação final — 2026-11-10

Usuário respondeu “sim para todas” à sequência de oito marcos, aos critérios de interrupção e recuperação e à distinção entre conclusão do planejamento e conclusão da migração.

## Answer

Rota confirmada pelo usuário em 2026-11-10. As decisões anteriores bastam para iniciar a execução; não restam decisões conhecidas que exijam outro ticket de planejamento. Esta resolução não executa a migração nem substitui os aceites de publicação abaixo.

### Sequência e condições de avanço

1. **Preparar recuperação e ponto de corte.** Criar backup privado da origem e do destino, comprovar restauração e registrar refs e caminhos selecionados, conforme [Definir os limites da extração e a preservação do histórico](01-limites-extracao.md).
2. **Extrair em clone descartável.** Filtrar o histórico e normalizar as identidades; conferir equivalência da árvore antes das adaptações, correspondência dos commits e atribuições segundo a decisão de extração. Guardar os registros de correspondência em local privado.
3. **Preparar o repositório independente.** Adaptar ferramentas, configurações e lockfile, preservar a preparação revisada e produzir documentação, screenshots e workflow conforme [Definir o padrão público de documentação e screenshots](04-documentacao.md) e [Definir a versão inicial e o processo de release independente](05-releases.md).
4. **Validar localmente e liberar o material publicável.** Em clone isolado, executar instalação de dependências, typecheck, lint, testes e build, incluindo geração e conferência de licenças e avisos. Revisar histórico, imagens, documentação e conteúdo dos instaladores, incluindo a inspeção complementar do Windows anterior, conforme [Definir a sanitização e os critérios para publicação segura](03-sanitizacao.md). Conferir os metadados anteriores antes de fechar a versão. Registrar resultados e limitações sem dados sensíveis; falhas, achados sem classificação ou verificações pendentes bloqueiam avanço.
5. **Publicar o código após aceite.** Conferir repositório de destino, remote, visibilidade, refs e permissões; preparar a configuração necessária. Apresentar o resultado concreto para aceite explícito do usuário antes de enviar o código ao destino público. Esse aceite é distinto do aceite da release.
6. **Preparar e validar a release em rascunho.** Executar o workflow manual sobre commit fixado e conferir instaladores, notas e checksums. Validar instalação limpa, atualização com perfil fictício anterior e backup/restauração em Windows e Linux, conforme a decisão de release. Revisar as instruções contra o comportamento observado e inspecionar os artefatos finais efetivamente candidatos à publicação; repetir verificações afetadas se eles mudarem.
7. **Publicar a release após aceite.** Apresentar rascunho e evidências completas ao usuário; publicar somente após seu aceite explícito, conforme a decisão de release.
8. **Concluir a retirada da origem.** Conferir o repositório e a release publicados e a instalação a partir dos artefatos publicados. Somente então retirar o app da origem e deixar o link no README, preservando os demais aplicativos e verificando os comandos e referências afetados pela retirada, conforme a decisão de extração.

### Acessos e ambientes necessários

- A execução precisa de leitura da origem e do destino, espaço privado para backup e clone descartável, ferramentas de filtragem e ambiente de desenvolvimento compatível com os scripts do projeto. A disponibilidade deve ser conferida no início; este planejamento não comprova esses recursos.
- Conferir acesso autenticado aos instaladores anteriores da origem privada e permissão para configurar e enviar ao destino, executar Actions e preparar/publicar releases. Não colocar credenciais no tracker nem no material público.
- Exigir ambientes Windows x64 e Linux x64 para os builds e testes previstos, com interface gráfica para percorrer os fluxos e produzir capturas. Runners de build não comprovam por si os testes de instalação e uso. A disponibilidade desses ambientes e a cobertura dos testes ainda não foram demonstradas; lacunas devem ser registradas e as validações dependentes permanecem bloqueadas até sua obtenção.
- A falta de acesso ou ambiente não autoriza dispensar um critério. Executar as etapas independentes e apresentar a necessidade concreta ao usuário quando houver uma ação exclusivamente humana.

### Interrupção e recuperação

- Uma falha bloqueia os marcos seguintes; a origem permanece intacta até a conferência final do destino publicado.
- Antes da publicação, reconstruir o clone de trabalho a partir do backup e do ponto de corte quando necessário. Manter o backup privado até o aceite final do usuário.
- Depois da publicação, qualquer recuperação deve preservar os dados dos usuários e passar por decisão específica. Não presumir segurança de downgrade nem autorização para reescrever o histórico público. Usar o registro do ponto de corte e o backup para planejar a recuperação pertinente.

### Critérios de conclusão e contingências

- **Planejamento concluído:** sequência, dependências, aceites, recuperação e critérios verificáveis estão definidos; todos os filhos do mapa estão resolvidos. A implementação pode começar em etapa posterior.
- **Migração concluída:** os oito marcos foram cumpridos, as evidências exigidas pelos tickets anteriores foram registradas, os aceites de publicação foram obtidos e a retirada restrita do app da origem foi validada. Concluir este mapa não comprova essas condições.
- Remediações adicionais de privacidade, credenciais ou cópias distribuídas, incompatibilidades de versão/dados e ajustes de instalação/publicação são contingências da execução. Se uma verificação revelar um problema concreto, abrir uma decisão específica, registrar o contexto sem valores sensíveis e bloquear o marco afetado até resolvê-la. Não manter essas hipóteses como névoa pendente deste mapa nem antecipar remediações sem evidência.
