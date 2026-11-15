# Artefato 1 — Análise Técnica do Caso de Uso

## 1. Identificação do Caso de Uso
- **Código:** UC12
- **Nome:** Cadastrar Produto
- **Sistema:** CeliLac
- **Módulo:** Gerenciamento de Produtos
- **Tipo:** Caso de uso funcional

---

## 2. Objetivo e Escopo
- **Objetivo:** Permitir o cadastro de novos produtos na plataforma CeliLac, recebendo, validando e persistindo as informações necessárias à criação do produto. O processo deve assegurar que dados inválidos ou incompletos sejam rejeitados, mantendo a integridade da base de dados.
- **Escopo Funcional:**
  - Recepção de dados para novo produto via requisição da aplicação.
  - Validação sintática e semântica dos dados de entrada (campos obrigatórios e conformidade de valores).
  - Execução das regras de negócio aplicáveis ao domínio de produtos.
  - Persistência das informações do produto em meio de armazenamento seguro.
  - Retorno de resposta estruturada indicando sucesso (com os dados do produto cadastrado) ou falha (com mensagens explicativas de erro).
  - Prevenção rigorosa da persistência de entidades inconsistentes ou incompletas.

---

## 3. Atores Envolvidos e Papéis
- **Ator Principal:** Usuário autorizado a cadastrar produtos (ex.: administrador do catálogo ou operador do sistema).
- **Papel:** Iniciar a solicitação de cadastro fornecendo os dados requeridos do produto e receber o retorno da operação.
- *Nota de Especificação:* A definição detalhada dos perfis de controle de acesso (RBAC/permissões) permanece sujeita à confirmação formal nos requisitos globais de segurança da plataforma.

---

## 4. Pré-condições e Pós-condições

### 4.1 Pré-condições
1. O sistema CeliLac deve estar operacional e com os serviços de infraestrutura (banco de dados e API) disponíveis.
2. O ator deve possuir autorização prévia e permissão concedida para operar o cadastro de produtos.
3. Os serviços necessários para o processamento de regras e persistência devem estar ativos.

### 4.2 Pós-condições
- **Em caso de sucesso:**
  1. A nova entidade `Product` é criada e persistida com identificador único.
  2. As informações válidas são consolidadas na base de dados.
  3. O sistema retorna o recurso criado acompanhado do status correspondente de sucesso (ex.: HTTP 201 Created).
- **Em caso de falha:**
  1. O cadastro é cancelado e nenhuma alteração no banco de dados é mantida (garantia de atomicidade).
  2. Nenhum registro inconsistente ou parcial é persistido.
  3. O sistema devolve uma resposta de erro clara e padronizada (ex.: HTTP 400 Bad Request ou HTTP 422 Unprocessable Entity), informando os motivos do impedimento.

---

## 5. Síntese dos Fluxos de Execução

### 5.1 Fluxo Principal (Caminho Feliz)
1. O ator envia uma solicitação de cadastro com os dados do novo produto.
2. O sistema intercepta e recepciona os dados no ponto de entrada da API.
3. A camada de validação verifica os atributos recebidos (presença de campos obrigatórios e formatos).
4. O serviço de aplicação processa a operação aplicando as regras de negócio do domínio.
5. A entidade de domínio é instanciada e validada internamente.
6. O repositório realiza a persistência da entidade no banco de dados.
7. O sistema retorna a resposta confirmando o sucesso do cadastro, incluindo o identificador e os dados consolidados do produto.

### 5.2 Fluxos Alternativos e de Exceção
- **FA01 — Nome obrigatório não informado:**
  - O sistema recebe a requisição sem o campo nome (ou com valor nulo/vazio).
  - A validação identifica a violação da regra RN01.
  - A operação é interrompida, retornando mensagem de erro de validação.
  - Nenhum produto é persistido.
- **FA02 — Preço inválido:**
  - O sistema recebe a requisição com preço menor ou igual a zero (ou em formato numérico incoerente).
  - A validação identifica a não conformidade com a RN02.
  - A operação é rejeitada com mensagem de erro descritiva.
  - Nenhum produto é persistido.
- **FE01 — Falha na persistência:**
  - Durante a tentativa de gravação pelo repositório, ocorre indisponibilidade ou falha de infraestrutura no banco de dados.
  - A exceção é capturada e tratada pela camada de tratamento de erros da aplicação.
  - O sistema retorna status de erro de infraestrutura (ex.: HTTP 500 Internal Server Error) sem expor detalhes sensíveis.

---

## 6. Regras de Negócio e Validações

| Identificador | Regra de Negócio | Descrição / Comportamento |
| :--- | :--- | :--- |
| **RN01** | Nome obrigatório | O produto deve obrigatoriamente possuir um nome válido (não nulo, não vazio e com tamanho mínimo coerente). |
| **RN02** | Validação do preço | O preço deve atender às restrições definidas pelo domínio (valor numérico positivo). |
| **RN03** | Integridade do cadastro | Produtos com qualquer atributo inválido ou ausente não podem, em hipótese alguma, ser persistidos. |
| **RN04** | Persistência após validação | A gravação em repositório só pode ocorrer após todas as validações de domínio e contrato terem sido satisfeitas com sucesso. |

---

## 7. Componentes e Camadas Arquiteturais Envolvidas
Considerando a arquitetura modular com TypeScript e NestJS adotada no repositório:
1. **Camada de Apresentação / Interface HTTP (`modules/products/controllers`):**
   - Responsável por expor a rota `POST /products`, deserializar o payload HTTP e delegar para a camada de aplicação.
2. **Camada de Contratos e DTOs (`modules/products/dtos`):**
   - Estruturas de transferência de dados (`CreateProductDto`, `ProductResponseDto`) com decorators de validação (ex.: `class-validator`).
3. **Camada de Aplicação / Casos de Uso (`modules/products/services`):**
   - Orquestra a execução da operação, converte DTO para entidade de domínio, invoca regras de negócio e aciona o repositório.
4. **Camada de Domínio (`modules/products/entities`):**
   - Define a entidade `Product`, seus atributos fundamentais, invariantes e regras intrínsecas de consistência.
5. **Camada de Persistência / Infraestrutura (`infrastructure/persistence/products` e `modules/products/repositories`):**
   - Interface do repositório (`ProductRepository`) e sua implementação ORM (ex.: TypeORM com PostgreSQL), além do schema de banco e migração correspondente.

---

## 8. Considerações Arquiteturais Preliminares e Propostas Técnicas
- **Proposta Técnica 1 (Identificador):** Uso de UUID v4 como chave primária para a entidade `Product`, alinhado às boas práticas de desacoplamento e consistência do backend.
- **Proposta Técnica 2 (Tipagem e Escala de Preço):** Representação do preço em formato numérico decimal (`decimal`/`numeric(10,2)` no banco de dados) ou inteiro em centavos, evitando erros de arredondamento de ponto flutuante.
- **Proposta Técnica 3 (Controle de Transação):** A persistência deve ser atômica; caso surjam dependências secundárias futuras (ex.: estoque ou logs de auditoria), o serviço deve operar sob transação de banco de dados.

---

## 9. Restrições e Dúvidas Técnicas para Confirmação
1. **Regra de Unicidade do Nome:** Não está documentado se o nome do produto deve ser estritamente único no catálogo ou se são permitidos produtos homônimos. *(Pendente de definição de negócio)*.
2. **Atributos Adicionais:** A especificação do caso de uso foca em `nome` e `preço`. Atributos complementares típicos (descrição, categoria, SKU, alérgenos para CeliLac) devem ser confirmados com o time de produto antes da expansão do contrato.
3. **Mecanismo de Autenticação/Autorização:** A pré-condição cita "usuário autorizado", porém os Guards específicos (ex.: JWT, papéis de ADMIN) dependem do módulo global de segurança.

