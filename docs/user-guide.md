# Manual de uso

[Início](../README.md) · [Dados e backup](storage.md)

## Preparar os cadastros

**Configurações** reúne sete seções: Contas bancárias, Categorias, Despesas padrão,
Entradas padrão, Adicionar Meses, Backup e Sobre. Escolha uma seção na navegação
interna; em janelas estreitas ela vira um seletor.

Contas bancárias têm nome e saldo. O saldo inicial deve refletir o ponto de
partida do seu controle. Categorias classificam despesas; dez vêm prontas e podem
ser ajustadas. Excluir uma categoria deixa suas despesas sem categoria. Excluir
uma conta remove seus vínculos, sem desfazer pagamentos ou recebimentos.

Os padrões definem nome, valor, dia e categoria ou conta de destino. Um valor
variável pode ficar em branco; preencha o valor da despesa antes de pagar.
**Cadastrar um padrão também o lança nos meses existentes.** Editar ou excluir
um padrão afeta as próximas cópias; meses já criados mantêm os lançamentos.

## Criar e acompanhar meses

O mês corrente é garantido ao abrir o app e ao voltar o foco para sua janela.
Em **Adicionar Meses**, escolha De/Até, até 60 meses por lote. Meses já existentes
são ignorados e aparecem no resumo. Cada mês novo copia os padrões atuais.

Na **Visão Geral**, escolha **3 meses**, **Este ano**, **Tudo** ou um intervalo.
Clique no cabeçalho de uma coluna para ordenar e use a paginação (12 meses por
página). Abra o mês pela linha. O saldo em contas soma os saldos cadastrados;
ele não é igual ao saldo do período, que considera somente entradas e despesas.

| Indicador | Cálculo                                   |
| --------- | ----------------------------------------- |
| Realizado | Entradas recebidas menos despesas pagas   |
| Previsto  | Todas as entradas menos todas as despesas |

As projeções até dezembro podem estimar meses ausentes pela média de meses com
movimento; o símbolo ≈ e a explicação do indicador distinguem estimativa de
lançamentos cadastrados. Consulte o detalhamento ao passar o ponteiro ou focar
o indicador.

## Despesas e entradas do mês

O mês tem abas **Despesas** e **Entradas**. Busque pelo nome, filtre por status,
ordene pelas colunas e navegue pelas páginas de 12 itens. Despesas também podem
ser filtradas por categoria. Use **Adicionar Despesa** ou **Adicionar Entrada**
para lançamentos avulsos. Clique numa linha, ou pressione Enter nela, para ver
os detalhes; o menu de ações permite editar e excluir.

**Paga/Recebida** significa quitada; **Pendente**, em aberto; **Vencida**, em
aberto com vencimento anterior a hoje. A coluna de data mostra o vencimento ou
a previsão, não a data da quitação; esta aparece no detalhe/status.

Em **Pagar**, confira primeiro o valor cadastrado. Informe data (até hoje), conta
opcional, observação e, se desejar, comprovante. Uma conta vinculada é debitada;
saldo insuficiente impede o pagamento. **Receber** credita a conta selecionada,
sem anexo. Operações sem conta não alteram saldo bancário.

**Desmarcar** um pagamento devolve o valor à conta vinculada e apaga o comprovante.
Desmarcar um recebimento retira o valor recebido e preserva o vínculo da conta.
Confira os saldos após corrigir lançamentos.

Comprovantes aceitam imagens JPG, PNG, GIF ou PDF, até 10 MB, no pagamento.
**Abrir comprovante**, no detalhe, usa o programa padrão do sistema operacional.
Excluir a despesa também apaga seu comprovante.

Use a seta de voltar do mês para retornar à Visão Geral ou ao Histórico que o
abriu, preservando o recorte e a posição de consulta quando possível. As setas
anterior/próximo percorrem meses. Excluir um mês exige confirmação e remove suas
despesas e entradas. A exclusão intencional do mês corrente é respeitada nas
aberturas seguintes; uma importação pode voltar a criá-lo.

## Histórico e aparência

Escolha o ano no **Histórico**. **Comparativo** mostra entradas, despesas e saldo
previsto de cada mês; **Categorias** agrupa despesas por categoria, incluindo
as sem categoria. Os totais incluem lançamentos pendentes. Não os interprete
como apenas valores já pagos ou recebidos.

Cada aba alterna entre **Gráfico** e **Tabela**. O gráfico de categorias agrupa
as menores em Outras categorias; a tabela mostra todas. Abra um mês no
comparativo pelo ponto da linha ou pela tabela (também acessível pelo teclado).

O botão **Tema claro/Tema escuro**, na lateral, alterna a aparência e salva a
preferência. **Recolher** reduz a lateral. Em **Sobre**, consulte a versão.

## Guardar e recuperar

Em **Configurações → Backup**, **Exportar** cria um ZIP no local escolhido.
**Importar** substitui os dados atuais após confirmação: faça antes um backup do
estado que deseja preservar. Leia o [procedimento de restauração e seus limites](storage.md)
antes de importar. Não há sincronização automática nem serviço de backup remoto.
