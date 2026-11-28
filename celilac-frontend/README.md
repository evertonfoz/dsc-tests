# CeliLac — frontend

Base da interface do caso de uso UC17, "Autenticar usuário". Ainda **não há login**: veja `docs/adr/ADR-001-autenticacao-adiada-uc17.md`.

> Siglas: UC (caso de uso), API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema), URL (*Uniform Resource Locator*, endereço de um recurso), ADR (*Architecture Decision Record*, registro de decisão arquitetural).

## Como executar
Requer Node e pnpm (gerenciador de pacotes).

```bash
cp .env.example .env
pnpm install
pnpm dev
```

A aplicação abre em `http://localhost:5173`.

## Configuração
| Variável | Para que serve |
|---|---|
| `VITE_API_BASE_URL` | URL base da API |

Variáveis com prefixo `VITE_` ficam visíveis no navegador: não guarde segredos nelas.

## Verificações
Verificação completa (instalação, lint, testes, build, validadores, links e estado):

```bash
scripts/verify.sh
```

Com `--remote`, o estado também é conferido no GitHub (exige o `gh` autenticado).

Rotas no navegador, com `pnpm dev` no ar em outro terminal (exige o Google Chrome; use a porta que o `pnpm dev` mostrar):

```bash
node scripts/verificar-navegador.mjs http://localhost:5173
```

## Onde está cada coisa
| Pasta | Conteúdo |
|---|---|
| `src/` | código da aplicação |
| `scripts/` | verificação local e conferência no navegador |
| `docs/` | especificação, decisões, estado e evidências |
| `method/` | método de trabalho |
| `prompts/` | materiais da execução |
