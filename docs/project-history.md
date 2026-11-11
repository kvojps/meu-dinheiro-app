# Histórico da publicação independente

[Início](../README.md) · [Validação da primeira pré-release](validation/v1.0.0-beta.1-linux.md)

Em 10 de novembro de 2026, Meu Dinheiro foi extraído de
`kvojps/my-desktop-apps` para um repositório independente. O corte da origem foi
`17cb66b31d39bd04725ec6708263ea2f3d113df9`. O diretório do aplicativo passou à
raiz, acompanhado somente do suporte selecionado; outros apps, tags e releases
não foram importados.

A extração preservou a ancestralidade selecionada de `main`, com uma única raiz
Git. Os 84 commits sobreviventes foram comparados por caminhos, modos e blobs
com seus correspondentes na origem. Autoria e committer usam a identidade
noreply do mantenedor; trailers pessoais de sessão foram removidos mediante
autorização, preservando mensagens restantes e coautorias legítimas.
Dependências, ferramentas e lockfile foram adaptados para execução independente.

A primeira pré-release independente, `v1.0.0-beta.1`, foi gerada localmente e
publicada para Linux x64 após aceites distintos do código e da release.
Windows foi retirado do escopo, sem validação declarada. O relatório da versão
registra o candidato final e os limites de ensaio aceitos.

O aplicativo foi retirado da origem por commit aditivo
`a6cd3e04f3537239ec983e069c11b8afe3661020`, com link para o destino. Os demais
apps permaneceram intactos; a origem continuou privada, com histórico e releases
antigas preservados. Na verificação da retirada passaram 289 testes, typecheck
e build dos três apps restantes; lint teve zero erros e dois avisos preexistentes.

Após o aceite final, backups privados da migração e o mapa privado de commits
foram excluídos por autorização expressa. Eles não estão disponíveis para
recuperação. Esses registros históricos não autorizam restaurar sobre dados
atuais, fazer downgrade ou reescrever histórico público.
