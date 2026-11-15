# Artefato 6 — Matriz de Dependências

## 1. Visão Geral
Este artefato documenta as relações de precedência, bloqueio e possibilidades de paralelismo entre as Sub-Issues do caso de uso **UC12 — Cadastrar Produto**, permitindo o planejamento temporal eficiente da equipe de desenvolvimento.

---

## 2. Matriz de Interdependências Técnicas

| Sub-Issue | Depende de (Pré-requisitos) | Justificativa Técnica da Dependência | Condição de Desbloqueio | Pode Executar em Paralelo? |
| :---: | :---: | :--- | :--- | :---: |
| **SUB-01** (Domínio `Product`) | *Nenhuma* | É o núcleo do domínio. Não depende de infraestrutura ou transporte. | Nenhuma (Pronta para início imediato). | **Sim** (com SUB-02). |
| **SUB-02** (DTOs e Validações) | *Nenhuma* | Define contratos de transferência de dados puros e anotações sintáticas. | Nenhuma (Pronta para início imediato). | **Sim** (com SUB-01). |
| **SUB-03** (Persistência e Repositório) | **SUB-01** | O mapeamento de banco e a assinatura do repositório exigem a entidade `Product` modelada. | Conclusão da modelagem de atributos e tipos de `Product` (`SUB-01`). | **Sim** (pode iniciar após SUB-01, em paralelo com SUB-02). |
| **SUB-04** (Serviço de Aplicação) | **SUB-01**, **SUB-02**, **SUB-03** | O serviço orquestra a entrada (`CreateProductDto`), cria a entidade (`Product`) e salva no repositório (`ProductRepository`). | Conclusão dos contratos e classes das camadas base (`SUB-01`, `SUB-02`, `SUB-03`). | **Não** (Ponto de convergência da lógica de negócio). |
| **SUB-05** (Controlador HTTP) | **SUB-02**, **SUB-04** | O controller precisa do DTO de entrada/saída e do serviço para injetar e invocar o método de cadastro. | Conclusão do DTO (`SUB-02`) e do serviço de aplicação (`SUB-04`). | **Não** (Depende da lógica do serviço pronta). |
| **SUB-06** (Testes Automatizados E2E) | **SUB-01** a **SUB-05** | Embora testes unitários possam acompanhar cada tarefa, a suíte completa e os testes E2E exigem a cadeia funcional finalizada. | Conclusão e integração de todos os componentes da API. | **Não** (Fechamento da suíte integrada). |

---

## 3. Diagrama de Fluxo e Precedência Técnica

```text
[SUB-01: Domínio Product] ──────────────┐
                                         ▼
                               [SUB-03: Persistência & Repo] ──┐
                                                               ▼
[SUB-02: DTOs & Validações] ──────────────────────────► [SUB-04: Serviço de Aplicação]
         │                                                     │
         │                                                     ▼
         └────────────────────────────────────────────► [SUB-05: Controlador HTTP]
                                                               │
                                                               ▼
                                                        [SUB-06: Suíte de Testes E2E]
```

---

## 4. Análise de Paralelismo e Caminho Crítico
- **Fase Inicial (Paralelismo Máximo):** `SUB-01` e `SUB-02` podem ser iniciadas simultaneamente por membros distintos da equipe, pois tratam de abstrações desacopladas (regras de domínio vs. validação de entrada HTTP).
- **Caminho Crítico:**
  $$\text{SUB-01} \longrightarrow \text{SUB-03} \longrightarrow \text{SUB-04} \longrightarrow \text{SUB-05} \longrightarrow \text{SUB-06}$$
- **Gargalo Principal:** `SUB-04` (Serviço de Aplicação), pois exige que o modelo de domínio, os contratos de DTO e a interface de repositório estejam estabilizados.

