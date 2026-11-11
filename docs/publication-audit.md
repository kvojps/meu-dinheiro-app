# Auditoria antes da publicação

[Release](release.md) · [Desenvolvimento](development.md)

Execute a revisão sobre um commit fixado e sobre os bytes dos instaladores que
serão entregues. Registre escopo, ferramentas, achados classificados, correções
e limites; a revisão é uma evidência distinta do aceite de publicação.

## Código, histórico e atribuições

Inspecione a árvore atual e todos os commits alcançáveis pelas refs destinadas
à publicação, incluindo mensagens e blobs de arquivos removidos. Inventarie
refs e confira autoria/committer, credenciais, URLs com autenticação, caminhos
pessoais, bancos, backups, comprovantes e trailers de sessões pessoais.
`git rev-list`, `git ls-tree -rz` e `git cat-file` permitem percorrer o histórico.

Classifique cada ocorrência antes de corrigir. Preserve licenças, coautorias,
contatos legítimos de terceiros e proveniência de recursos. Uma busca por e-mail
não justifica substituir atribuições indiscriminadamente. Revise também skills,
instruções e documentos incluídos no repositório publicável.

## Imagens e documentação

Confira visualmente capturas, ícones e frames de ICO. Use dados fictícios
consistentes com o cenário documentado. Inspecione metadados de imagens para
identificar dados pessoais; preserve proveniência legítima, como C2PA, quando
não representar segredo ou informação pessoal indevida.

Confira links relativos e coerência das instruções com o aplicativo. Distingua
versões das capturas, do instalador e de revisões posteriores dos documentos.

## Pacote e dependências

Extraia o instalador e inspecione ASAR, recursos externos e módulos nativos
inclusive os desempacotados. Confira plataforma/ABI, identidade do aplicativo,
homepage, ícones, MIT, avisos de terceiros e licenças Electron/Chromium contra
o commit. Revise conteúdo além dos nomes dos arquivos; exclusões de Git e
empacotamento não demonstram ausência de dados privados.

Execute auditorias npm completa e de produção e classifique o que chega ao
produto. Electron é runtime distribuído mesmo declarado em `devDependencies`.
Verifique o alcance de alertas nos fluxos reais, especialmente importação e
exportação de backups. Correções de dependências exigem reconstruir e renovar
as verificações afetadas; conferir API compatível, ASAR e arquivos externos.

## Encerramento

Registre o hash do candidato final e resultados de instalação, continuidade e
recuperação. Após upload, baixe os anexos e compare bytes, hashes, notas e commit
da tag. Diferencie testes aprovados, pendências e limitações aceitas.

Buscas heurísticas, leitura dirigida e inspeção de imagens não garantem ausência
absoluta de segredos ofuscados ou vulnerabilidades. Registre se faltaram scanner
especializado, OCR ou outras coberturas. Não reproduza valores sensíveis em
relatórios públicos. Mudanças no commit ou instalador exigem revisão do escopo
afetado; hashes de candidatos anteriores não certificam os novos bytes.
