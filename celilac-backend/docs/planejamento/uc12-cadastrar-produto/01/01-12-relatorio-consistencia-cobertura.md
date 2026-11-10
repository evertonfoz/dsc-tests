# Artefato 12 — Relatório de Consistência e Cobertura

## 1. Visão Geral e Síntese Numérica
Este relatório consolida a auditoria final do planejamento técnico de implementação para o **UC12 — Cadastrar Produto** da plataforma CeliLac. O planejamento estruturou a demanda em um modelo pronto para ser operacionalizado no GitHub, garantindo alinhamento entre os requisitos funcionais e as camadas de arquitetura do backend.

- **Total de Issues Principais (Épicos):** 1 (`[UC12] Cadastrar Produto`)
- **Total de Sub-Issues Técnicas:** 6 (`SUB-01` a `SUB-06`)
- **Total de Estados no GitHub Project:** 5 (`Backlog`, `Ready`, `In Progress`, `In Review`, `Done`)
- **Total de Labels Estruturadas:** 10 (cobrindo módulo, tipos, camadas e prioridades)
- **Status da Fase Atual:** Planejamento concluído — 0 linhas de código de produção implementadas (conforme restrição metodológica).

---

## 2. Cobertura de Requisitos, Regras e Fluxos

| Elemento da Especificação | Total Especificado | Itens Cobertos | % de Cobertura | Avaliação |
| :--- | :---: | :---: | :---: | :--- |
| **Requisitos Funcionais (RF)** | 5 (RF01 a RF05) | 5 | 100% | Totalmente mapeados em DTOs, Entidade, Serviço, Repositório e Controller. |
| **Regras de Negócio (RN)** | 4 (RN01 a RN04) | 4 | 100% | Validação de nome obrigatório, preço positivo, integridade e atomicidade garantidas. |
| **Fluxos de Execução** | 4 (Principal, FA01, FA02, FE01) | 4 | 100% | Caminho feliz e caminhos alternativos/exceção contemplados com códigos de status HTTP e testes. |
| **Critérios de Aceite (CA)** | 4 (CA01 a CA04) | 4 | 100% | Vinculados à suíte de testes automatizados e critérios de conclusão das Sub-Issues. |

---

## 3. Mapeamento de Dependências Críticas e Caminho Crítico
A análise do grafo de dependências identificou o seguinte caminho crítico para a execução:
$$\text{SUB-01 (Domínio)} \longrightarrow \text{SUB-03 (Persistência)} \longrightarrow \text{SUB-04 (Serviço)} \longrightarrow \text{SUB-05 (HTTP)} \longrightarrow \text{SUB-06 (Testes E2E)}$$

- **Gargalo Identificado:** `SUB-04` (Serviço de Aplicação) atua como nó integrador. Nenhuma rota ou teste de integração poderá ser fechado antes de sua estabilização.
- **Janela de Paralelismo:** A equipe pode trabalhar simultaneamente nas tarefas `SUB-01` (Domínio) e `SUB-02` (DTOs) na primeira iteração de desenvolvimento, pois ambas iniciam no estado `Ready`.

---

## 4. Decisões Técnicas e Arquiteturais que Dependem de Confirmação
Durante a análise do caso de uso, foram levantados os seguintes pontos que demandam alinhamento da equipe com o professor ou responsável de requisitos:
1. **Unicidade do Nome do Produto:** Não foi especificado se é permitido cadastrar produtos com nomes idênticos no catálogo. Caso a unicidade seja obrigatória, será necessário criar um índice único na coluna `name` e uma verificação no repositório/serviço.
2. **Atributos Adicionais do Produto:** A documentação fornecida concentrou-se em `nome` e `preço`. Caso produtos demandem atributos como `descrição`, `categoria`, `estoque` ou `alérgenos` (essencial para o contexto CeliLac de celíacos e intolerantes à lactose), os DTOs e entidades deverão ser estendidos.
3. **Escala e Precisão Monetária:** Foi proposta a utilização de `decimal(10,2)` no banco PostgreSQL ou armazenamento em centavos para evitar imprecisões de ponto flutuante em JavaScript/TypeScript.
4. **Mecanismos de Segurança / Autenticação:** A pré-condição exige "usuário autorizado". Deve ser confirmado se o endpoint `POST /products` será protegido imediatamente por um Guard JWT (ex.: `@UseGuards(JwtAuthGuard, RolesGuard)`) ou se a autenticação será acoplada em etapa posterior.

---

## 5. Riscos Técnicos Mapeados e Recomendações
1. **Risco de Corrupção em Falhas de Infraestrutura (FE01):**
   - *Mitigação:* Assegurar que operações que envolvam persistência sejam transacionais ou isoladas, garantindo que o banco rejeite operações parciais.
2. **Risco de Divergência entre DTO e Entidade:**
   - *Mitigação:* Manter validação em duas etapas: sintática rápida no DTO (com `class-validator`) e semântica/invariantes na criação da entidade de domínio.
3. **Recomendação para o Início da Implementação:**
   - Iniciar imediatamente pela criação das Issues e Labels no GitHub seguindo o **Artefato 10**.
   - Alocar os responsáveis nas Sub-Issues `SUB-01` e `SUB-02` e puxá-las para `In Progress` como primeiro ciclo de desenvolvimento.

