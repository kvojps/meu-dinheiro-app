# Meu Dinheiro 1.0.0-beta.1

Pré-release candidata; publicação depende de aceite separado.

- Extração do aplicativo com histórico relevante preservado e ferramentas próprias.
- Instalação de dependências, typecheck, lint, 80 testes existentes e build verificados em Linux x64.
- Documentação em português e capturas reais com dados fictícios.
- Instaladores NSIS Windows x64 e deb Linux x64, com MIT e avisos de terceiros.
- Identidades do aplicativo e armazenamento sob `userData` preservados; sem mudança planejada de esquema.

## Limitações

Instalação limpa, atualização, sandbox Linux e backup/restauração dos instaladores
continuam sujeitos aos ensaios dos tickets de validação em cada sistema.
Não há comprovação de execução Windows nesta preparação. Alertas de dependências
estão sob avaliação antes da publicação; não foi aplicada atualização automática.

Os candidatos podem ser distribuídos sem assinatura digital. SHA-256 verifica
integridade dos bytes comparados, não autentica o autor. Avisos do Windows e do
Linux devem ser registrados nos ensaios, sem presumir que não ocorrerão.
Builds usam lockfile, commit e ferramentas registrados; não há promessa de
identidade binária entre reconstruções ou sistemas.
