# Publicar Meu Dinheiro como repositório independente

Status: needs-info

Rascunho completo; aguarda confirmação dos pontos de teste exigida pela skill `to-spec` antes da publicação como `ready-for-agent`.

## Alteração de escopo — 2026-11-10

O usuário decidiu concluir o fluxo de publicação apenas com Linux x64 (deb).
Esta decisão substitui as exigências Windows deste documento para esta entrega:
sem candidato NSIS, build, ensaio Windows ou dependência da validação Windows.
Documentar que Windows está fora desta pré-release, sem instalador independente
oferecido ou suporte validado. A configuração experimental pode permanecer.
Todos os demais critérios, auditoria, ensaios Linux, backups e aceites explícitos
separados de código e release permanecem vigentes. A decisão não afirma
validação Windows nem autoriza publicação antecipada.

## Problem Statement

Quem quer instalar ou contribuir com Meu Dinheiro depende de um monorepositório privado com outros aplicativos, ferramentas compartilhadas e releases sem ciclo independente. O mantenedor precisa disponibilizar o aplicativo sem expor dados privados, perder seu histórico relevante ou interromper instalações existentes e os demais aplicativos da origem.

## Solution

Extrair Meu Dinheiro para um repositório independente, com histórico relevante preservado e identidades pessoais do autor normalizadas, ferramentas autônomas, documentação em português, licença MIT e screenshots reais com dados fictícios. Preparar uma pré-release própria para Windows x64 e Linux x64, validando instalação, atualização e backup/restauração. Publicar código e release mediante aceites explícitos distintos; retirar somente o aplicativo da origem após validar o destino publicado.

## User Stories

1. Como usuário, quero encontrar um repositório dedicado ao Meu Dinheiro, para acessar código e instruções do aplicativo.
2. Como usuário, quero entender a finalidade do aplicativo no README, para decidir se atende às minhas necessidades.
3. Como usuário Windows x64, quero instalar o aplicativo por NSIS, para utilizá-lo no meu computador.
4. Como usuário Linux x64, quero instalar o pacote deb, para utilizá-lo no meu computador.
5. Como usuário, quero identificar versão, sistema e arquitetura nos instaladores, para escolher o arquivo adequado.
6. Como usuário, quero consultar primeiros passos e manual em português, para aprender os fluxos disponíveis.
7. Como usuário, quero ver screenshots de Visão Geral, mês, Histórico e Configurações, para conhecer a interface.
8. Como usuário, quero ver os temas claro e escuro com dados identificados como demonstração, para avaliar a apresentação do produto.
9. Como usuário existente, quero atualizar mantendo meus dados e comprovantes, para continuar meu controle financeiro.
10. Como usuário, quero instruções verificadas sobre armazenamento, para localizar e proteger meus dados.
11. Como usuário, quero exportar e restaurar um backup com comprovantes, para recuperar minhas informações.
12. Como usuário, quero compreender que a restauração substitui dados, para decidir antes de executá-la.
13. Como usuário, quero consultar mudanças e limitações conhecidas, para avaliar a pré-release.
14. Como usuário, quero conferir o SHA-256 do instalador, para verificar sua integridade.
15. Como usuário, quero conhecer a ausência de assinatura digital e os avisos observados na instalação, para tomar uma decisão informada.
16. Como contribuidor, quero instalar dependências e executar verificações em clone isolado, para trabalhar sem acesso ao monorepositório.
17. Como contribuidor, quero guias separados de desenvolvimento e arquitetura, para compreender a organização do aplicativo.
18. Como contribuidor, quero consultar o histórico relevante, para entender a evolução do código.
19. Como autor, quero usar minha identidade noreply no material publicável, para reduzir exposição pessoal.
20. Como terceiro creditado, quero manter minha atribuição legítima, para preservar o reconhecimento da contribuição e as obrigações de licença.
21. Como mantenedor, quero revisar árvore, histórico, imagens e instaladores, para impedir publicação de dados privados identificados.
22. Como mantenedor, quero um backup privado restaurável da origem e do destino, para recuperar o trabalho antes da publicação.
23. Como mantenedor, quero rastrear a correspondência dos commits em registro privado, para verificar a extração.
24. Como mantenedor, quero preservar a preparação revisada do destino, para manter as instruções úteis existentes.
25. Como mantenedor, quero gerar uma release em rascunho por workflow manual, para revisar artefatos e evidências antes de publicar.
26. Como mantenedor, quero aprovar separadamente código público e release, para controlar cada publicação.
27. Como mantenedor, quero bloquear etapas dependentes de verificações falhas ou pendentes, para evitar uma conclusão sem evidências.
28. Como usuário dos demais aplicativos, quero que permaneçam na origem com seus comandos funcionais, para continuar utilizando-os.
29. Como visitante da origem, quero um link para o novo repositório após a retirada do aplicativo, para encontrar sua manutenção atual.
30. Como mantenedor, quero manter as releases antigas na origem privada, para preservar a referência anterior sem importá-las para o novo ciclo.
31. Como mantenedor, quero registrar cobertura e limitações sem valores sensíveis, para tornar o aceite verificável sem ampliar exposição.

## Implementation Decisions

- Executar em oito marcos ordenados: recuperação e ponto de corte; extração; autonomia e documentação; validação local e de privacidade; publicação do código após aceite; rascunho e testes da release; publicação da release após aceite; retirada restrita da origem.
- Antes de reescrever, criar backup privado completo do Git, incluindo refs, e dos arquivos necessários da origem e destino. Comprovar restauração e manter o backup fora do repositório público até o aceite final.
- Filtrar em clone descartável os caminhos do aplicativo e suporte explicitamente selecionado, incluindo caminhos históricos anteriores se encontrados. Promover o aplicativo à raiz; commits compartilhados conservam somente alterações selecionadas. Preservar datas, mensagens e atribuições, sujeitos à sanitização; registrar privadamente a correspondência de hashes.
- Comparar a árvore extraída com a origem antes das adaptações. Selecionar configurações TypeScript, lint, formatação, testes, rebuild do Electron, licença e geração de avisos necessários, sem importar outros aplicativos ou indiscriminadamente o material de planejamento.
- Normalizar autores e committers do autor para `62623689+kvojps@users.noreply.github.com` e revisar mensagens e trailers. Preservar coautorias, créditos e contatos legítimos de terceiros. Achados não classificados ou conflitos entre privacidade e preservação exigem decisão específica antes da publicação.
- Preservar a preparação revisada do destino em commit posterior à extração; guardar seu commit original no backup privado, sem juntar raízes Git desconectadas. Não importar tags ou releases da origem.
- Adaptar scripts, configurações, lockfile, caminhos de recursos e empacotamento em commits identificáveis, permitindo instalação, checks e build sem acesso relativo à origem.
- Revisar árvore final, histórico publicável, suporte, preparação, mensagens, atribuições, imagens e instaladores. Inspecionar ASAR, recursos externos, dependências e metadados, além do interior do NSIS anterior cuja cobertura está pendente. Registrar cobertura e limites sem reproduzir dados sensíveis.
- Usar somente perfis e dados fictícios em testes e screenshots. Conferir exclusões do Git e do empacotamento; exclusões não substituem auditoria histórica. Exposição concreta exige reavaliação específica; não há autorização genérica para apagar releases antigas, mudar visibilidade da origem ou revogar credenciais sem achado.
- Produzir README voltado a instalação e uso, manual, guias de desenvolvimento, arquitetura e armazenamento/backup/restauração. Documentação em português e novos nomes de arquivos e diretórios em inglês. Documentar comportamentos efetivamente verificados.
- Produzir quatro screenshots principais em tema claro — Visão Geral, mês com despesas e entradas, Histórico e Configurações — e uma captura adicional em tema escuro. Usar o diretório de recursos da documentação, substituir o placeholder e revisar consistência, legibilidade, conteúdo e metadados.
- Incluir licença MIT e avisos de terceiros aplicáveis, conferindo sua presença nos instaladores. Adotar a organização documental já investigada nos repositórios públicos do autor, conforme a decisão do mapa.
- Adotar inicialmente versão `1.0.0-beta.1`, tag `v1.0.0-beta.1` e pré-release, condicionadas à conferência dos metadados dos instaladores anteriores. Se houver regressão de versão, retornar à decisão com o usuário.
- Entregar NSIS Windows x64 e deb Linux x64; nomes devem identificar aplicativo, versão, sistema e arquitetura. Preservar `appId` `com.meudinheiro.app`, nome em execução `meu-dinheiro`, identidade efetiva dos instaladores e localização dos dados sob `userData`. Não há mudança de esquema ou contrato funcional planejada; incompatibilidades descobertas exigem decisão específica.
- Criar workflow manual com builds nos respectivos sistemas e preparação de release em rascunho sobre commit fixado. Conferir coerência entre pacote, tag, artefatos e notas; incluir SHA-256, changelog em português, limitações e evidências. Não pressupor builds binariamente idênticos.
- A primeira release pode ser sem assinatura digital; documentar a condição e os avisos observados. Checksums não equivalem a assinatura.
- Antes do envio público, conferir destino, remote, visibilidade, refs e permissões e apresentar resultado concreto para aceite explícito do código. A publicação da release exige outro aceite explícito, após revisão do rascunho e das evidências.
- Após validar repositório e release publicados e instalação dos artefatos publicados, retirar somente Meu Dinheiro da origem, deixar link no README e conferir comandos e referências afetados. Manter demais aplicativos e releases antigas na origem privada.
- Falhas bloqueiam marcos dependentes. Antes de publicar, permitir reconstrução pelo backup e ponto de corte. Após publicar, recuperação exige decisão específica que preserve os dados; não presumir autorização para reescrever histórico público ou fazer downgrade.

## Testing Decisions

- Proposta para confirmação: usar como ponto principal de teste o aplicativo instalado, exercitado pela interface em Windows x64 e Linux x64, com perfil fictício isolado. Priorizar comportamento observável, dados e comprovantes preservados e resultado da restauração, sem acoplar os testes a funções internas. Não exigir uma nova camada de mocks ou infraestrutura E2E para esta migração; registrar a execução reproduzível e suas evidências.
- Em cada sistema, verificar instalação limpa, abertura, navegação pelas telas demonstradas, atualização a partir do instalador anterior com dados fictícios e backup/restauração incluindo comprovantes. Conferir persistência após reabrir o aplicativo. Uma compilação em runner não comprova instalação e uso.
- Complementar esse ponto de teste com critérios próprios da migração: restauração do backup privado, equivalência da árvore anterior às adaptações, correspondência de commits e atribuições, normalização de identidades e ausência de refs não selecionadas no conjunto publicável.
- Em clone isolado, instalar com lockfile próprio e executar typecheck, lint, testes existentes, build e geração/conferência de avisos. Verificar suporte às dependências nativas do Electron. A origem tem Vitest compartilhado na raiz, testes de canais IPC, navegação, consultas de Histórico e Visão Geral e auxiliares de interface; preservar sua execução autônoma. Esses testes são precedentes de regressão, sem demonstrar por si compatibilidade de instalação ou restauração.
- Inspecionar o conteúdo efetivo dos instaladores candidatos, licenças, avisos, metadados e ausência de material privado identificado. Conferir checksums dos arquivos entregues, versão, tag, commit e nomes. Repetir verificações afetadas se os candidatos mudarem.
- Revisar screenshots reais e instruções contra o comportamento observado, incluindo substituição de dados na restauração e avisos de instalação sem assinatura. Conferir links e comandos documentados.
- Após a publicação, conferir acesso ao destino e à release e validar instalação a partir dos artefatos publicados antes de retirar o aplicativo da origem. Após a retirada, verificar comandos e referências afetados dos demais aplicativos.
- Ambientes gráficos Windows x64 e Linux x64, acesso aos instaladores anteriores e permissões de publicação são pré-requisitos a conferir. Registrar indisponibilidade e bloquear somente etapas dependentes, sem dispensar critérios ou declarar sucesso sem execução.

## Out of Scope

- Migrar outros aplicativos, arquivar o monorepositório ou mudar a visibilidade da origem.
- Criar funcionalidades financeiras, redesenhar a interface ou modificar o modelo de dados sem necessidade demonstrada pela migração.
- Importar tags/releases antigas, apagar as releases da origem ou copiar dados reais para demonstrações.
- Outras plataformas e arquiteturas, aquisição de certificados e promessa de suporte a downgrade.
- Remediações hipotéticas sem evidência, garantia absoluta de ausência de dados privados ou de reprodutibilidade binária.
- Executar migração, reescrita, publicação ou retirada da origem durante a elaboração desta especificação.

## Further Notes

Fonte: [mapa concluído](map.md) e suas seis decisões resolvidas em 2026-11-10. As decisões distinguem planejamento concluído de migração concluída: esta exige os oito marcos, evidências, aceites e retirada validada.

A inspeção atual confirma destino ainda sem código do aplicativo, ferramentas compartilhadas na origem e testes unitários existentes. Glossário e ADRs não estão presentes no destino; esta especificação usa os termos do mapa e da interface, sem criar novas definições de domínio.

O inventário anterior tem cobertura limitada e não certifica ausência de exposição. A origem foi confirmada privada; acesso autenticado às releases não comprova publicidade anterior nem ausência de distribuição externa. Revalidar estado e ponto de corte na execução.

As contingências de privacidade, versão, dados e instalação tornam-se decisões específicas apenas se as verificações revelarem problemas concretos. Nenhum aceite para publicação está implícito na criação desta especificação.
