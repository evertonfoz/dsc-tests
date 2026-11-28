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
```bash
pnpm test
pnpm build
pnpm lint
method/scripts/check-state.sh docs/uc/uc17/state.yaml
node method/scripts/check-links.mjs method docs project-profile.md prompts README.md
```

## Onde está cada coisa
| Pasta | Conteúdo |
|---|---|
| `src/` | código da aplicação |
| `docs/` | especificação, decisões, estado e evidências |
| `method/` | método de trabalho |
| `prompts/` | materiais da execução |
