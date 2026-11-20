# project-profile.md

> Copie para a **raiz** do repositório e preencha com valores **reais**. Os playbooks leem este arquivo.
> Nunca registre valores de segredos: apenas os **nomes** das variáveis.
> Onde não souber, escreva `a confirmar` (não invente).

## 1. Identidade
| Campo | Valor |
|---|---|
| Projeto | |
| Repositório (`dono/nome`) | |
| Branch principal | |
| GitHub Project (número / URL) | |
| Perfil de stack base | <ex.: celilac-nest> |

## 2. Stack e versões
| Item | Valor | Origem |
|---|---|---|
| Runtime | | |
| Gerenciador de pacotes | | |
| Framework | | |
| ORM | | |
| Banco | | |
| Testes | | |
| Lint / formatação | | |

## 3. Comandos
| Finalidade | Comando |
|---|---|
| Instalar dependências | |
| Build | |
| Lint | |
| Testes rápidos | |
| Testes de integração (banco real) | |
| Testes E2E | |
| Subir ambiente | |
| Parar ambiente (sem apagar dados) | |
| Migrations — mostrar / aplicar | |
| Verificação HTTP automatizada | |
| Validar estado do UC | `method/scripts/check-state.sh docs/uc/<uc>/state.yaml` |

## 4. Infraestrutura
| Serviço | Container | Porta host → container | Volume | Observação |
|---|---|---|---|---|
| | | | | |

Schema / tabelas principais: <...>

## 5. Variáveis de ambiente (somente nomes)
`<NOME_1>`, `<NOME_2>` …  Arquivo versionado de exemplo: `.env.example`.

## 6. Proteções
- Comandos proibidos sem autorização explícita: `docker compose down -v`, `DROP`, `TRUNCATE`, `migration:revert`, `git push --force`, `git reset --hard`.
- Testes que apagam dados só rodam contra o banco de **testes** e com a variável de proteção ligada: <nome da variável>.
- Suítes legadas com risco: <quais e por quê>.

## 7. Convenções
- Branch: `<tipo>/<uc>-<fatia>-<resumo>`
- Commit: `<tipo>(<escopo>): <resumo> (refs #N)` — tipos: feat, fix, test, refactor, docs, build, chore.
- PR: título com o UC e a fatia; descrição com issue, critérios cobertos, evidência.

## 8. Equipe
| Pessoa (login GitHub) | Papel | Observação |
|---|---|---|
| | | |
> Modo solo: nomeie os papéis (autor, revisor) sem personas fictícias. Revisor igual ao autor não conta como revisão independente.
