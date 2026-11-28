# project-profile.md — CeliLac (celilac-frontend)

> Perfil real deste projeto. Itens `a confirmar` precisam de validação humana ou de uma etapa que ainda não aconteceu. Só nomes de variáveis, nunca valores secretos.
> Siglas: UC (caso de uso), API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema), CI (*Continuous Integration*, integração contínua), ADR (*Architecture Decision Record*, registro de decisão arquitetural), PR (*Pull Request*, proposta de mudança no GitHub), E2E (*End-to-End*, de ponta a ponta).

## 1. Identidade
| Campo | Valor |
|---|---|
| Projeto | CeliLac (frontend) |
| Repositório | `evertonfoz/dsc-tests` (raiz do git: `dsc-tests/`). Este projeto: pasta `celilac-frontend/` |
| Branch principal | `main` |
| GitHub Project | #7 — "CeliLac — UC17 Autenticar usuário" (usuário `evertonfoz`) |
| Estados do GitHub Project | `Backlog`, `Ready`, `In Progress`, `In Review`, `Done` (campo `Status`) |
| Perfil de stack base | `method/perfis/react-vite.md` |

## 2. Stack e versões
Política de versões: `docs/adr/ADR-002-versoes-atuais-e-react-router.md` (instalar a versão atual, consultada no momento da instalação).

| Item | Valor | Origem |
|---|---|---|
| Runtime | Node 24.21.0 | `docs/uc/uc17/evidencias/A/base-versoes.txt` |
| Gerenciador de pacotes | pnpm 12.23.0, usado na instalação; o `scripts/verify.sh` usa o `pnpm` do sistema (12.8.1 nesta máquina) | idem; `docs/uc/uc17/evidencias/B/conf-verificacao.txt` |
| Framework | React 19.3.1, Vite 8.4.0, TypeScript 7.0.2 | idem |
| Rotas | `react-router` 8.5.3 | idem; ADR-002 |
| ORM e banco | não se aplica | frontend |
| Testes | Vitest 5.1.2, `jsdom` 31.0.1; Testing Library: `react` 16.3.3, `dom` 10.4.2, `user-event` 14.6.13, `jest-dom` 8.0.0 | `docs/uc/uc17/evidencias/B/preparo-versoes.txt` |
| Lint | oxlint 1.95.0 | `docs/uc/uc17/evidencias/A/base-versoes.txt` |

## 3. Comandos
| Finalidade | Comando |
|---|---|
| Instalar dependências | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Testes rápidos | `pnpm test` |
| Testes de integração / E2E | não se aplica nesta entrega |
| Subir ambiente (desenvolvimento) | `pnpm dev` |
| Validar estado do UC | `method/scripts/check-state.sh docs/uc/uc17/state.yaml` |
| Validar links dos documentos | `node method/scripts/check-links.mjs method docs project-profile.md prompts README.md` |
| Verificação local | `scripts/verify.sh` (com `--remote`, confere o estado no GitHub) |
| Rotas no navegador | com `pnpm dev` no ar: `node scripts/verificar-navegador.mjs http://localhost:5173` (exige o Google Chrome; caminho padrão do macOS ou variável `CHROME_PATH`; use a porta que o `pnpm dev` mostrar) |

## 4. Infraestrutura
| Serviço | Porta | Observação |
|---|---|---|
| Servidor de desenvolvimento do Vite | 5173 (padrão) | na etapa 2 a porta estava ocupada nesta máquina; a verificação usou a 5273. Com a 5173 ocupada, `pnpm dev` escolhe a seguinte livre |
| API do CeliLac (`celilac-backend`) | 3200 | o material cita 3000; vale a porta real do projeto (regra 6 do `AGENTS.md`) |

Sem contêiner, banco ou volume nesta entrega.

## 5. Variáveis de ambiente (somente nomes)
`VITE_API_BASE_URL`. Arquivo versionado de exemplo: `.env.example`.

## 6. Proteções
- Proibidos sem autorização explícita: `git push --force`, `git reset --hard`, apagar branches, merge.
- Variáveis com prefixo `VITE_` ficam visíveis no navegador: nunca guardar segredo nelas.
- `.env` não é versionado.

## 7. Convenções
- Branch: `feature/uc17-<resumo>` (fatias) e `docs/uc17-fase-<letra>-<resumo>` (fases sem fatia).
- Commit: `<tipo>(<escopo>): <resumo> (refs #N)`, com o número real da issue.
- PR: título com UC e fatia; descrição com issue, critérios cobertos e evidência.

## 8. Equipe
| Pessoa | Papel | Observação |
|---|---|---|
| `evertonfoz` | autor e revisor | modo solo: não conta como revisão independente |

## 9. Limites conhecidos
| Limite | Registro |
|---|---|
| A API do CeliLac não tem autenticação | `docs/adr/ADR-001-autenticacao-adiada-uc17.md` |
| Sem CI e sem contêineres | `docs/adr/ADR-003-sem-ci-e-conteineres-uc17.md` |
| O planejamento (fase A) acontece antes da base do projeto existir | `docs/adr/ADR-003-sem-ci-e-conteineres-uc17.md` |
