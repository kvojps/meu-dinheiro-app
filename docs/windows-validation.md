# Validação futura no Windows

[Instalação](installation.md) · [Release](release.md) · [Dados](storage.md)

Windows está fora da pré-release 1.0.0-beta.1. A configuração NSIS é experimental;
não há instalador independente oferecido nem ensaio aprovado nesse sistema.
Este roteiro define o trabalho necessário antes de oferecer suporte.

## Preparar o candidato

Use Windows x64 nativo com interface gráfica e uma conta de sistema descartável.
Wine não atende a esse ensaio. Use somente dados e comprovantes fictícios;
a receita XDG do Linux não isola um perfil Windows.

Fixe o commit, registre Windows, arquitetura, Node/npm/Electron e gere o NSIS
nativamente com `npm ci` e `npm run dist:win`. Inspecione ASAR, arquivos externos,
licenças e o módulo SQLite: ele deve corresponder ao Windows x64 e à ABI do
Electron. Registre nome, versão e SHA-256 do instalador efetivamente testado.
Siga também a [auditoria de publicação](publication-audit.md).

Uma inspeção privada do NSIS anterior encontrou SQLite ELF Linux x86-64.
Isso não demonstra compatibilidade com Windows. Antes de planejar atualização,
confira se a versão anterior funciona e se permite preparar o perfil fictício.
Se não permitir, registre o impedimento e decida uma estratégia própria;
não declare continuidade validada nem apague releases para contornar o problema.

## Ensaios de aceite

- Instalação limpa: instalar, abrir pelo atalho/menu, conferir versão, navegar,
  cadastrar dados e confirmar persistência após fechar e reabrir.
- Armazenamento: observar o caminho efetivo de `userData`, esperado sob
  `%APPDATA%\meu-dinheiro`; conferir a identidade sem mover o perfil manualmente.
- Atualização: preparar dados e comprovantes fictícios na versão anterior
  identificada por checksum; fechar, instalar o candidato e verificar meses,
  saldos, tema, comprovantes e permanência no mesmo diretório após reabrir.
- Recuperação: exportar e restaurar ZIP pelo aplicativo instalado, percorrer
  seletores nativos e confirmação de substituição; conferir dados e comprovantes,
  abrir um documento válido em leitor externo e repetir a conferência após reabrir.
- Instalador sem assinatura: registrar os avisos realmente observados e conferir
  as instruções de instalação. SHA-256 confere bytes, sem autenticar autoria.

Registre resultado por critério, evidência sem dados privados e limitações.
Ambiente indisponível mantém os ensaios pendentes. Alterar o candidato exige
renovar hashes, inspeção e verificações afetadas. Não há promessa de downgrade.
