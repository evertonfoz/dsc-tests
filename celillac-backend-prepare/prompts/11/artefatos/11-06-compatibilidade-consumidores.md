# ARTEFATO 11-06 — ANÁLISE DE COMPATIBILIDADE COM CONSUMIDORES

## 1. Contrato Atual de Referência

- **Endpoint:** `POST /products`
- **Status de Sucesso:** `201 Created`
- **Corpo JSON:**
  ```json
  {
    "productId": "UUID",
    "name": "Produto de exemplo"
  }
  ```

Nenhuma das mudanças hipotéticas abaixo foi implementada no código, nem foi criada versão `/v2/products`.

---

## 2. Matriz de Análise de Cenários Hipotéticos

| # | Alteração Hipotética | Contrato Anterior | Contrato Hipotético | Consumidores Afetados | Classificação | Justificativa | Medidas de Mitigação |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Renomear `productId` para `id` | `{"productId":"...","name":"..."}` | `{"id":"...","name":"..."}` | Todos os clientes web/mobile/integrações que leem `response.productId` | **Potencialmente incompatível** *(Breaking change)* | Quebra desserialização tipada e leitura de chave primária nos consumidores | Manter `productId`; em última instância, versionar rota (`/v2/products`) ou período de transição com ambos os campos |
| **2** | Renomear `name` para `productName` | `{"productId":"...","name":"..."}` | `{"productId":"...","productName":"..."}` | Clientes que exibem ou validam `response.name` | **Potencialmente incompatível** *(Breaking change)* | Propriedade esperada passa a ser `undefined` ou falha em validação de schema do cliente | Preservar `name`; se inevitável, adotar versionamento explícito ou fase de depreciação comunicada |
| **3** | Remover `name` | `{"productId":"...","name":"..."}` | `{"productId":"..."}` | Clientes que dependem do eco do nome cadastrado na resposta | **Potencialmente incompatível** *(Breaking change)* | Remove dado garantido pelo contrato anterior | Manter `name` no `ProductResponseDto` ou versionar endpoint |
| **4** | Alterar tipo de `productId` de `string` para `number` | `"productId": "550e..."` | `"productId": 123` | Clientes com tipagem estrita (`string` / UUID), parsers e bancos locais | **Potencialmente incompatível** *(Breaking change)* | Mudança de tipo primitivo quebra validadores de schema (Zod, DTOs, TypeScript) e formato UUID | Manter `string` (UUID); qualquer troca de identificador exige nova versão de API |
| **5** | Encapsular resposta em `data` | `{"productId":"...","name":"..."}` | `{"data":{"productId":"...","name":"..."}}` | Todos os consumidores que acessam propriedades na raiz do JSON | **Potencialmente incompatível** *(Breaking change)* | Altera a estrutura raiz do payload esperado | Não alterar envelope em rotas existentes; aplicar apenas em novos endpoints ou `/v2` |
| **6** | Alterar status `201` para `200` | `HTTP/1.1 201 Created` | `HTTP/1.1 200 OK` | Clientes, SDKs ou testes automatizados que verificam explicitamente `status === 201` | **Potencialmente incompatível** | Embora bibliotecas tolerantes aceitem `2xx`, clientes que validam `201 Created` falharão | Preservar `201 Created` em `POST /products` (semântica REST padrão para criação) |
| **7** | Adicionar propriedade opcional (ex.: `category?: string`) | `{"productId":"...","name":"..."}` | `{"productId":"...","name":"...","category":"..."}` | Consumidores com validação estrita de schema (ex.: `additionalProperties: false`, `.strict()`, ou asserções `toEqual` fechadas) | **Dependente do contrato e dos consumidores** | Consumidores tolerantes ignoram campos extras, mas clientes com validação fechada ou testes estritos de contrato podem falhar | Documentar política de extensibilidade (tolerância a campos opcionais) ou versionar quando o contrato for estritamente fechado |

---

## 3. Conclusões

- Mudanças estruturais, de nomenclatura, tipo ou status HTTP (cenários 1 a 6) são **potencialmente incompatíveis** e não devem ser aplicadas diretamente sobre `POST /products`.
- A adição de campos opcionais (cenário 7) **não é automaticamente compatível** quando há consumidores ou testes com validação fechada (como `toEqual()`).
- A introdução de `ProductResponseDto` + `toProductResponse()` protege os consumidores garantindo que a evolução interna do sistema não gere *breaking changes* acidentais na interface pública.

