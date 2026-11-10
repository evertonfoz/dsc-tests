# ARTEFATO 04-05 — EVIDÊNCIAS DE EXECUÇÃO E VALIDAÇÃO DA FASE RED DO TDD

> **Material 04 — Desenvolvimento Colaborativo: Branches, Pull Requests e Revisão Técnica**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API)  
> **Data de Emissão:** 10/11/2026

---

## 1. Execução do Teste Automatizado

Para comprovar formalmente a fase RED do TDD, a suíte de testes unitários foi executada por meio do Vitest no runner oficial do projeto.

- **Comando Executado:**
  ```bash
  pnpm test src/modules/products/services/products.service.spec.ts
  ```

---

## 2. Saída do Terminal e Evidência da Falha Controlada

```text
 FAIL  src/modules/products/services/products.service.spec.ts > ProductsService > should register and save a product when valid data is provided (CA01)
Error: Not implemented: createProduct
 ❯ ProductsService.createProduct src/modules/products/services/products.service.ts:16:11
     14| 
     15|   async createProduct(_name: string): Promise<Product> {
     16|     throw new Error('Not implemented: createProduct');
       |           ^
     17|   }
     18| }
 ❯ src/modules/products/services/products.service.spec.ts:32:26
     30|     productsRepository.save.mockImplementation(async (input) => input);
     31| 
     32|     const result = await service.createProduct('Celular XYZ');
       |                          ^
     33| 
     34|     expect(productsRepository.save).toHaveBeenCalledTimes(1);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: {
  "message": "Not implemented: createProduct",
}
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  11:12:30
   Duration  482ms (transform 45ms, setup 164ms, collect 42ms, tests 8ms, environment 0ms, prepare 78ms)
```

---

## 3. Análise Crítica e Justificativa Técnica da Falha

### 3.1 Avaliação das Condições de Validade do RED
1. **O ambiente iniciou corretamente?**  
   **Sim.** O runtime Node.js, os compiladores do TypeScript e o framework Vitest executaram com sucesso sem problemas de infraestrutura.
2. **O contêiner de Injeção de Dependências funcionou?**  
   **Sim.** O `TestingModule` do NestJS inicializou, instanciou o `ProductsService` e injetou o dublê de repositório (`PRODUCTS_REPOSITORY`) normalmente.
3. **O teste falhou por problema de ambiente ou compilação?**  
   **Não.** A falha não é decorrente de importações incorretas, dependências faltantes, sintaxe inválida ou erro de tipagem.
4. **Qual a causa raiz exata da falha?**  
   O teste invocou intencionalmente `service.createProduct('Celular XYZ')`, que lançou a exceção explícita `Error: Not implemented: createProduct`.
5. **A falha comprova o estado do requisito `CA01`?**  
   **Sim.** Comprova que o comportamento de criação de produto e persistência ainda não existe na aplicação de produção, tornando o teste um instrumento confiável para guiar a futura fase GREEN.

---

## 4. Conclusão Metodológica

A fase **RED** está cabalmente demonstrada e documentada com evidências reais do ambiente de execução. Nenhuma alteração adicional deve ser feita para tentar resolver o teste nesta etapa.

