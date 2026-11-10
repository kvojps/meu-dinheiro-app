# Migrar a interface do Meu Dinheiro para a direção visual inspirada no Orca

> Registro histórico da origem. Evidências e documentos de planejamento citados
> não integram esta extração; os resultados abaixo descrevem os ensaios daquela
> etapa, não uma validação dos instaladores independentes.

Status: accepted

O Meu Dinheiro adotará Geist, Lucide, Tailwind e componentes locais independentes,
seguindo a direção documentada no piloto Git Dlog. Customizar MUI poderia
reproduzir a aparência, mas escolhemos a base já adotada no piloto para a
reformulação integral, aceitando o custo de migrar controles e revisar foco,
teclado, formulários e gráficos. A decisão foi confirmada pelo usuário na
entrevista da spec (referência histórica na origem).

A migração será incremental no app real, com claro e escuro em cada etapa e
coexistência temporária com MUI/Emotion até não haver consumidores. A aprovação
é local ao Meu Dinheiro e não depende de declarar concluída a validação visual
do Git Dlog; não cria código compartilhado nem migra outros apps.

A exceção no design system (referência histórica na origem) permite a
nova base visual e a navegação aprovada, mas preserva contraste, acessibilidade,
feedback e persistência do tema no banco. Valores locais devem ser registrados
antes de mudar UI. Cálculos, contratos IPC, domínio e armazenamento permanecem
vigentes; o glossário não muda por uma decisão de apresentação.
