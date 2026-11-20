# ARTEFATO 07-02 — PLANEJAMENTO TÉCNICO DA FRONTEIRA HTTP E ESTRATÉGIA DE BRANCH

> **Material 07 — Da Aplicação à API HTTP com NestJS**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 06

---

## 1. Mapeamento de Issues e Planejamento da Atividade

- **Issue Principal (Epic):** `EPIC-UC12 — [UC12] Cadastrar Produto` (GitHub Issue [#1](https://github.com/evertonfoz/dsc-tests/issues/1)).
- **Sub-Issue Responsável pelo Endpoint HTTP:** `SUB-06 — [UC12][HTTP] Criar endpoint POST /products` (GitHub Issue [#9](https://github.com/evertonfoz/dsc-tests/issues/9)).
- **Sub-Issue Coordenada de DTO:** `SUB-02 — [UC12][DTO] Criar DTO para cadastro de produto` (GitHub Issue [#5](https://github.com/evertonfoz/dsc-tests/issues/5)).
- **Sub-Issue Coordenada de Testes:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (GitHub Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10)).

---

## 2. 🌟 Refinamento 2 (Obrigatório) — Planejamento da Cadeia de Branches Dependentes

Em conformidade com a política de Stacked PRs adotada desde o Material 04, a branch de trabalho para a fronteira HTTP não ramifica arbitrariamente da `main` quando os serviços antecedentes ainda estão sob revisão e integração controlada, mas sim da branch que disponibiliza o serviço GREEN:

### Topologia Estruturada da Árvore de Branches

```text
main (Linha tronco estável)
  │
  └── feature/uc12-07-product-registration-test (PR #12 - Testes Unitários RED)
        │
        └── feature/uc12-05-products-service (PR #13 - Serviço de Aplicação GREEN)
              │
              └── feature/uc12-06-products-http (PR #14 - Endpoint HTTP POST /products)
```

### Regras de Governança Aplicadas
1. **Disponibilidade Imediata de Contratos:** Ao encadear sobre `feature/uc12-05-products-service`, o desenvolvedor tem acesso em tempo de compilação à classe `ProductsService`, à entidade `Product` e ao token `PRODUCTS_REPOSITORY`.
2. **Preservação do Histórico Atômico:** Os commits realizados na branch HTTP referenciam especificamente as Sub-Issues `SUB-06`, `SUB-02` e `SUB-07`, sem misturar alterações do serviço com alterações do controller.
3. **Branch-Base de Pull Request:** O PR #14 foi aberto apontando para a base correspondente e consolidado de forma sequencial após a aprovação técnica e formal dos PRs #12 e #13.
4. **Sem Merges Prematuros:** A branch `main` jamais é alterada diretamente.

---

## 3. Matriz Completa de Planejamento Técnico

| Componente | Responsabilidade Arquitetural | Caminho Real do Arquivo | Contrato Associado | Sub-Issue | Alteração Planejada | Dependências Técnicas | Critério de Aceite Focal | Verificação Prevista |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **Controller HTTP** | Receber requisição HTTP, extrair payload e delegar ao serviço | `src/modules/products/controllers/products.controller.ts` | `ProductsService.createProduct` | `SUB-06` | Criar `@Controller('products')` com método `@Post()` | `ProductsService`, `CreateProductDto` | Retornar `201 Created` e payload JSON | Testes unitários com mock e requisições HTTP reais |
| **DTO de Entrada** | Validar formato sintático e tipagem do payload de entrada | `src/modules/products/dtos/create-product.dto.ts` | Contrato do caso de uso (campo `name`) | `SUB-02` | Criar `CreateProductDto` com `@IsString()` e `@IsNotEmpty()` | `class-validator`, `class-transformer` | Barrar payloads sem `name` com `400 Bad Request` | Testes automatizados HTTP de rejeição |
| **ValidationPipe** | Aplicar validação declarativa e sanitização global | `src/main.ts` | Metadados do `class-validator` | `SUB-06` | Configurar globalmente com `whitelist: true` e `transform: true` | `@nestjs/common` | Limpar propriedades extras e rejeitar dados inválidos | Testes de integração HTTP e `curl` |
| **Repositório em Memória** | Permitir inicialização e testes sem dependência de DB real | `src/modules/products/repositories/in-memory-products.repository.ts` | Interface `ProductsRepository` | `SUB-06` | Implementar classe `InMemoryProductsRepository` | `Product`, `ProductsRepository` | Salvar entidade em array em memória | Testes integrados e inicialização do NestJS |
| **Módulo NestJS** | Compor providers, controller e exportar dependências | `src/modules/products/products.module.ts` | Container de DI do NestJS | `SUB-06` | Registrar Controller, Service e bind de `PRODUCTS_REPOSITORY` | `@nestjs/common` | Resolver dependências sem erros no `InstanceLoader` | `pnpm build` e startup do NestJS |
| **Testes HTTP** | Exercitar roteamento, pipes e delegação ao serviço | `src/modules/products/controllers/products.controller.spec.ts` | Rota `POST /products` | `SUB-07` | Implementar cenários 201 (válido) e 400 (inválido) | `vitest`, `supertest`, `@nestjs/testing` | Suíte 100% verde sem acionar serviço em dados inválidos | Execução via `vitest run` |

---

## 4. Gestão de Riscos e Decisões Técnicas da Equipe

- **Risco 1: Vazar regras de negócio para o Controller.**  
  *Mitigação:* O Controller limita-se a extrair `dto.name` e repassar para `this.productsService.createProduct(dto.name)`. Nenhuma checagem adicional ou criação de IDs ocorre no Controller.
- **Risco 2: Dependência prematura de banco de dados relacional.**  
  *Mitigação:* Adotou-se o `InMemoryProductsRepository` resolvendo o token `PRODUCTS_REPOSITORY`, permitindo que o endpoint funcione de forma autônoma e rápida.
- **Risco 3: Confundir rejeição sintática HTTP com regras de domínio.**  
  *Mitigação:* Documentado expressamente que `@IsNotEmpty()` protege a fronteira HTTP, mas o critério `CA02` do domínio permanece pendente para seu próprio ciclo TDD.
