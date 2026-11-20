# ARTEFATO 06-02 — AVALIAÇÃO DA NECESSIDADE DE REFATORAÇÃO

> **Material 06 — Refatoração, Revisão Técnica e Integração Controlada**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 17/11/2026  
> **Rastreabilidade:** Continuidade dos Materiais 01 a 05

---

## 1. Objetivo da Avaliação Técnica

Com a linha de base dos testes 100% verde revalidada no Artefato 06-01, este documento realiza a inspeção crítica da qualidade estrutural do código implementado na fase GREEN (`ProductsService.createProduct`, entidade `Product` e seus contratos), avaliando se há justificativa técnica real para intervenção na fase **REFACTOR** ou se a implementação deve ser preservada em sua simplicidade original.

---

## 2. Distinção Conceitual Rigorosa

Para garantir o rigor metodológico da Engenharia de Software e do TDD, a equipe diferencia formalmente três categorias de alteração de software:

1. **Refatoração (Refactoring):** Alteração exclusiva na **estrutura interna** do código com o objetivo de aprimorar legibilidade, manutenibilidade, coesão ou acoplamento, **preservando estritamente seu comportamento observável** e todos os testes automatizados já existentes.
2. **Correção de Defeito (Bug Fix):** Alteração motivada por comportamento incorreto, incompleto ou não conforme em relação à especificação já vigente.
3. **Nova Funcionalidade / Evolução Funcional:** Introdução de novas regras de negócio, novos fluxos alternativos ou novos critérios de aceite (ex.: validação de nome obrigatório `CA02`, integridade `CA03`). **Evoluções funcionais exigem obrigatoriamente novos ciclos TDD (RED → GREEN → REFACTOR) e jamais devem ser introduzidas sob o rótulo de refatoração.**

---

## 3. Avaliação Estrutural Baseada em Critérios de Qualidade de Software

Inspecionou-se o código de `ProductsService`, `Product` e `ProductsRepository` segundo os 8 pilares fundamentais da disciplina:

| Pilar de Qualidade | Avaliação Crítica no Código do `ProductsService` | Diagnóstico |
| :--- | :--- | :---: |
| **1. Clareza e Nomenclatura** | Nomes de classes (`ProductsService`, `Product`), métodos (`createProduct`, `save`) e parâmetros (`name`) são autoexplicativos e refletem a linguagem ubíqua do domínio. | **Excelente** |
| **2. Coesão e Responsabilidade (SRP)** | O serviço possui a responsabilidade única e exclusiva de orquestrar o caso de uso: gera a identidade do produto e despacha para persistência. Não acumula regras de infraestrutura ou apresentação. | **Excelente** |
| **3. Duplicação de Código (DRY)** | O método possui apenas duas linhas de corpo. Não existe repetição de trechos lógicos ou duplicação acidental. | **Ausente** |
| **4. Complexidade Desnecessária** | Inexistência de condicionais aninhadas, flags de controle ou abstrações especulativas. O código é minimalista e direto. | **Excelente** |
| **5. Acoplamento e Limites Arquiteturais** | O serviço depende exclusivamente de uma abstração (`ProductsRepository`) injetada via token NestJS (`PRODUCTS_REPOSITORY`), sem conhecer detalhes do PostgreSQL ou TypeORM (DIP respeitado). | **Excelente** |
| **6. Legibilidade e Manutenibilidade** | Código limpo, idiomático em TypeScript moderno (ESM, `node:crypto`), de leitura imediata por qualquer desenvolvedor da equipe. | **Excelente** |
| **7. Testabilidade** | O design desacoplado permite que o teste unitário (`products.service.spec.ts`) execute em milissegundos, isolando completamente a persistência por meio de um dublê de teste leve. | **Excelente** |
| **8. Preservação de Contratos** | As interfaces públicas de `Product` (`productId: string`, `name: string`) e `ProductsService.createProduct(name: string): Promise<Product>` estão consolidadas e estáveis. | **Consistente** |

---

## 4. Classificação das Oportunidades Catalogadas no Material 05

No Artefato 05-06, a equipe havia levantado três pontos de observação preliminares. Abaixo é realizada a reavaliação crítica sob o prisma de engenharia:

### 4.1 OP-01 — Encapsulamento da Geração de Identidade na Entidade (`Product.create`)
- **Descrição:** Extrair a chamada `new Product(randomUUID(), name)` para um método estático `Product.create(name: string): Product`.
- **Classificação:** **Oportunidade Opcional (Melhoria Cosmética).**
- **Avaliação Técnica:** Embora o padrão *Factory Method* no modelo de domínio seja recomendável em entidades complexas com múltiplas invariantes, na situação atual do critério `CA01`, a entidade `Product` possui apenas dois campos imutáveis. Criar uma fábrica estática neste momento geraria uma camada de indireção sem ganho tangível de manutenibilidade, configurando *overengineering* prematuro.

### 4.2 OP-02 — Validação de Invariantes de Negócio (Nome Obrigatório / Não Vazio)
- **Descrição:** Inserir validação para impedir nomes vazios ou strings em branco (`name.trim() === ''`).
- **Classificação:** **Evolução Funcional / Nova Regra de Negócio (Critério `CA02` / `FA01`).**
- **Avaliação Técnica:** Inserir verificações de validação funcional nesta fase violaria frontalmente a Regra de Ouro do TDD: *"nenhum código de produção deve ser escrito sem um teste prévio falhando"*. Essa regra pertence à Sub-Issue `SUB-05` / `SUB-07` para o critério `CA02` e deve ser tratada em um novo ciclo **RED → GREEN**. **Não é refatoração.**

### 4.3 OP-03 — Fortalecimento da Asserção no Teste Unitário
- **Descrição:** Enriquecer `expect(productsRepository.save).toHaveBeenCalledTimes(1)` com `toHaveBeenCalledWith(expect.objectContaining({ name: 'Celular XYZ' }))`.
- **Classificação:** **Oportunidade Opcional (Refinamento de Teste).**
- **Avaliação Técnica:** O teste atual já valida que o objeto retornado possui `name === 'Celular XYZ'` e `productId` do tipo string, e que o dublê de `save` foi invocado exatamente uma vez. O teste é suficiente para o critério `CA01`.

---

## 5. Parecer e Decisão Técnica Fundamentada

### Enquadramento nos Cenários Formais:
- **Cenário A — Refatoração Estrutural Necessária:** Não se aplica. Não foram identificados *code smells*, débitos técnicos críticos, duplicações ou violações arquiteturais no código de produção.
- **Cenário B — Preservação da Implementação Atual (Nenhuma Refatoração Necessária):** **APLICADO.**

### Justificativa da Decisão:
> Conforme estipulado pelas diretrizes da Engenharia de Software e pelas regras de ouro do TDD, **não se deve refatorar código sem necessidade real**. A implementação de `ProductsService.createProduct` alcançada na fase GREEN é simples, coesa, estritamente alinhada aos limites arquiteturais, testável e legível. 
> 
> Intervenções cosméticas neste estágio introduziriam risco desnecessário de quebra ou complexidade artificial sem benefício arquitetural compensatório. A decisão consciente e fundamentada de **preservar o código sem alterações** é a postura técnica mais madura e correta.

---

## 6. Riscos e Planejamento das Próximas Ações

1. **Risco de Overengineering:** Evitado com sucesso pela decisão de não adicionar abstrações artificiais.
2. **Risco de Desvio de Escopo:** Totalmente neutralizado ao rejeitar a inclusão de validações do critério `CA02` nesta fase.
3. **Plano de Ação:** 
   - Formalizar a decisão de preservação no Artefato 06-03.
   - Reconfirmar a suíte de testes de regressão no Artefato 06-04.
   - Avançar para a Revisão Técnica Colaborativa individualizada dos Pull Requests (Fase 7 / Artefato 06-05).
