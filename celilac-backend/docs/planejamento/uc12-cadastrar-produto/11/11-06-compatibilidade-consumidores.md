# ARTEFATO 11-06 — ANÁLISE DE COMPATIBILIDADE COM CONSUMIDORES

## 1. Importância da Estabilidade de Contratos para Consumidores

Uma API pública ou interna atua como um contrato vinculante entre produtores e consumidores (aplicações frontend web, aplicativos móveis iOS/Android, microsserviços integradores e sistemas de parceiros). 

Qualquer alteração na representação JSON ou no protocolo HTTP pode causar falhas em cascata nos clientes. Este artefato documenta uma análise sistemática de 7 cenários de alterações hipotéticas sobre o contrato público atual do CeliLac:

**Contrato Público Vigente:**
```json
{
  "productId": "string (UUID)",
  "name": "string"
}
```
Status: `201 Created`

---

## 2. Matriz de Análise de Impacto e Compatibilidade

| # | Alteração Hipotética | Contrato Anterior | Contrato Hipotético | Classificação de Compatibilidade | Consumidores Potencialmente Afetados | Justificativa Técnica | Estratégia de Mitigação |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Renomear identificador** (`productId` → `id`) | `{"productId":"...", "name":"..."}` | `{"id":"...", "name":"..."}` | **Potencialmente Incompatível** (Breaking Change) | Todos os clientes que acessam a propriedade `res.productId`. | Desserializadores estritos ou linguagens tipadas (TypeScript, Kotlin, Swift) quebrarão por campo ausente (`undefined`/`KeyNotFoundException`). | Manter ambos os campos durante período de depreciação ou versionar rota (`/v2/products`). |
| **2** | **Renomear campo descritivo** (`name` → `productName`) | `{"productId":"...", "name":"..."}` | `{"productId":"...", "productName":"..."}` | **Potencialmente Incompatível** (Breaking Change) | Telas e listagens que exibem o nome do produto. | A UI exibirá campos em branco ou lançará erros de referência nula. | Manter alias temporário de `name` e emitir aviso de depreciação via cabeçalho HTTP `Sunset`. |
| **3** | **Remover campo** (remover `name`) | `{"productId":"...", "name":"..."}` | `{"productId":"..."}` | **Potencialmente Incompatível** (Breaking Change) | Consumidores que dependem do nome retornado para confirmação de cadastro. | Violação de pós-condição do UC12 e perda de dados na interface do cliente. | Nunca remover propriedades obrigatórias sem migração formal de versão de API. |
| **4** | **Alterar tipo do identificador** (`string` UUID → `number`) | `{"productId":"uuid-v4", ...}` | `{"productId":1234, ...}` | **Potencialmente Incompatível** (Breaking Change) | Parsers de validação de UUID e clientes móveis tipados. | Clientes móveis com esquemas de banco local (Room, CoreData) falharão na conversão de tipos primitivos. | Preservar tipo `string` UUID como padrão corporativo definitivo. |
| **5** | **Encapsular resposta em `data`** | `{"productId":"...", "name":"..."}` | `{"data": {"productId":"...", "name":"..."}}` | **Potencialmente Incompatível** (Breaking Change) | Todos os consumidores HTTP que leem diretamente a raiz da resposta. | `response.body.productId` passará a ser `undefined`, quebrando fluxos subsequentes. | Adotar transformações globais de envelopamento apenas no início do ciclo de vida da API com versão unificada. |
| **6** | **Alterar código de status** (`201` → `200`) | `201 Created` | `200 OK` | **Potencialmente Incompatível** | Clientes com validação estrita de status (`response.status === 201`). | Embora ambos sejam 2xx, clientes que assinalam criação especificamente por `201` reportarão erro de protocolo. | Preservar a semântica RFC 9110 (`201 Created` para criação bem-sucedida). |
| **7** | **Adicionar propriedade opcional** (`createdAt`) | `{"productId":"...", "name":"..."}` | `{"productId":"...", "name":"...", "createdAt":"..."}` | **Dependente do Contrato e dos Consumidores** | Consumidores que validam o payload com esquemas fechados. | Se o cliente usa deserialização permissiva (open schema), a adição é compatível. Se o cliente usa validação fechada estrita (ex.: Zod com `.strict()`), a adição causará erro. | Utilizar arquitetura de schemas abertos (Postel's Law / Robustness Principle: "seja liberal no que aceita, conservador no que envia"). |

---

## 3. Diretrizes de Governança e Evolução do Contrato

1. **Princípio da Robustez (Lei de Postel):** Os serviços devem enviar representações enxutas e estáveis, e os clientes devem ser orientados a ignorar propriedades desconhecidas que venham a ser introduzidas.
2. **Não Proliferação de Versões Prematuras:** Nenhuma versão `/v2` foi criada ou implementada nesta etapa. As alterações realizadas mantiveram o contrato rigorosamente compatível com todos os consumidores da versão atual.
3. **Mapeamento Explícito como Guardião da Compatibilidade:** O uso de `toProductResponse()` garante que qualquer adição de novos atributos na entidade de domínio interna não reflita automaticamente na API pública sem uma decisão explícita de arquitetura.
