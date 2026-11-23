# ARTEFATO 13-02 — ESTRUTURA DA COLEÇÃO HTTP

## 1. Visão Geral da Árvore de Diretórios
A coleção versionada de requisições HTTP foi estruturada na raiz do backend em `http-rest-client/`, atendendo às convenções do Material 13 e separando os cenários por finalidade operacional e de desenvolvimento:

```text
http-rest-client/
├── tests/
│   └── hello-world.http
├── products/
│   ├── uc12-cadastrar-produto/
│   │   ├── products-controller.http
│   │   └── test-scenarios.http
│   └── uc13-listar-produtos/
│       ├── products-controller.http
│       └── test-scenarios.http
├── orders/
│   ├── orders-controller.http
│   └── test-scenarios.http
└── containerizado/
    ├── README.md
    ├── 00-smoke.http
    ├── 01-products-cadastrar-produto.http
    ├── 02-orders-fronteira.http
    └── run-checks.sh
```

---

## 2. Papel e Responsabilidade de Cada Diretório e Arquivo

| Diretório / Arquivo | Papel Técnico | Comportamento Verificado |
|---|---|---|
| `tests/hello-world.http` | Sanidade mínima (smoke test básico) | Valida rota raiz (`GET /` → 200) e roteamento de erro (`GET /not-found-endpoint` → 404). |
| `products/uc12-cadastrar-produto/products-controller.http` | Desenvolvimento do Controller do UC12 | Exemplos de requisições utilizadas no ciclo iterativo de implementação do caso de uso. |
| `products/uc12-cadastrar-produto/test-scenarios.http` | Matriz de cenários do caso de uso | Cobertura sistemática de casos de aceite, campos vazios, ausentes, tipos inválidos e descarte de campos extras. |
| `products/uc13-listar-produtos/` | Requisições e cenários do UC13 (Listar Produtos), mesma divisão em `products-controller.http` e `test-scenarios.http` | `GET /products` com paginação, página além do fim e parâmetros inválidos (200, 400, 404). |
| `orders/orders-controller.http` | Recurso de apoio (desenvolvimento) | Requisições pontuais para a rota `POST /orders/:id/confirm`. |
| `orders/test-scenarios.http` | Cenários do recurso de apoio | Separação entre Grupo A (fronteira HTTP sem dados) e Grupo B (dependentes de seed). |
| `containerizado/00-smoke.http` | Sanidade no contêiner | Verificação de disponibilidade da API após subida da stack Docker Compose. |
| `containerizado/01-products-cadastrar-produto.http` | Caso de uso principal no contêiner | Execução do UC12 com encadeamento de resposta (`# @name` e variável `@produtoId`) para consulta SQL direta. |
| `containerizado/02-orders-fronteira.http` | Fronteira de apoio no contêiner | Validação de pipe (`ParseUUIDPipe`) e exceção de domínio (`OrderNotFoundException`). |
| `containerizado/README.md` | Documentação operacional | Manual com pré-requisitos, regras de segurança, comandos SQL de auditoria e escopo de execução. |
| `containerizado/run-checks.sh` | Verificação automatizada | Script bash com asserções, contadores `pass`/`fail`, teste de durabilidade e código de saída semântico. |

---

## 3. Convenções Adotadas nos Arquivos `.http`

1. **Variável de Base URL:** Todo arquivo `.http` define explicitamente no topo `@baseUrl = http://localhost:3200`, garantindo portabilidade entre ambientes locais e de contêiner.
2. **Separador e Nomenclatura:** Requisições são delimitadas por `###` seguidas de títulos padronizados no formato:
   `### <descrição do cenário> → esperado: <código> <status> (<mecanismo gerador>)`
   Exemplo: `### Cadastrar produto com nome vazio → esperado: 400 Bad Request (@IsNotEmpty)`.
3. **Mecanismo Gerador Documentado:** Cada título documenta a regra responsável pela resposta (ex.: `@IsString`, `@IsNotEmpty`, `whitelist`, `ParseUUIDPipe`, `OrderNotFoundException`).
4. **Cabeçalhos HTTP:** Todas as requisições com payload JSON enviam `Content-Type: application/json`.
5. **Encadeamento Dinâmico:** No arquivo containerizado `01-products-cadastrar-produto.http`, a resposta do cenário de cadastro válido é capturada via `# @name criarProduto` e atribuída à variável `@produtoId = {{criarProduto.response.body.productId}}`.
6. **Segurança e Higiene:** Nenhum arquivo contém credenciais, senhas, tokens ou dados sensíveis.
7. **Ausência de Asserções nos `.http`:** Os arquivos `.http` destinam-se à inspeção manual com a extensão REST Client, cabendo ao desenvolvedor conferir a resposta contra o esperado do título.
