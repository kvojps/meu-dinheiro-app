# Meu Dinheiro 1.0.0-beta.1

Pré-release candidata; publicação depende de aceite separado.

- Extração do aplicativo com histórico relevante preservado e ferramentas próprias.
- Instalação de dependências, typecheck, lint, 80 testes existentes e build verificados em Linux x64.
- Documentação em português e capturas reais com dados fictícios.
- Instalador deb Linux x64, com MIT e avisos de terceiros.
- Identidades do aplicativo e armazenamento sob `userData` preservados; sem mudança planejada de esquema.

## Limitações

No deb Linux instalado como atualização, abertura direta, navegação, persistência
e backup/restauração com caminhos de diálogo automatizados passaram em perfil
fictício. Instalação limpa, continuidade de perfil anterior, seletores nativos
completos, abertura pelo menu e comprovante válido em leitor externo não foram
ensaiados; o mantenedor aceitou essas limitações. O renderer usa `sandbox: false`,
sem certificação de isolamento. Consulte [Instalação](docs/installation.md).
Windows está fora desta pré-release: não há instalador independente oferecido
nem validação de instalação, atualização ou backup/restauração nesse sistema.
A configuração NSIS é experimental e não representa suporte validado. As dependências
foram remediadas no commit do instalador. Auditorias npm completa e de produção
na geração não reportaram vulnerabilidades conhecidas; isso não garante ausência
de vulnerabilidades.

Este deb é distribuído sem assinatura digital. SHA-256 verifica
integridade dos bytes comparados, não autentica o autor. Avisos do Windows e do
Linux devem ser registrados nos ensaios, sem presumir que não ocorrerão.
Builds usam lockfile, commit e ferramentas registrados; não há promessa de
identidade binária entre reconstruções ou sistemas.
