# ARTEFATO 06 — PLANEJAMENTO DA REUNIÃO TÉCNICA DE COORDENAÇÃO

> **Aviso de Rastreabilidade e Governança:**
> - **Caso de Uso:** `UC12 — Cadastrar Produto` (Backend CeliLac).
> - **Rigor de Governança:** Este documento é um **plano preparatório e proposta de pauta** para orientar a reunião dos estudantes. A reunião **ainda não aconteceu**. Nenhuma decisão aqui listada deve ser considerada como "aprovada pela equipe" até que os integrantes se reúnam, debatam e registrem formalmente o resultado.
> - **Distinção de Status:**
>   - *Pauta preparada:* Concluída pela IA neste documento.
>   - *Decisão proposta:* Recomendações técnicas estruturadas pela IA para deliberação.
>   - *Decisão efetivamente validada:* Pendente de discussão e consenso entre os estudantes.
>   - *Decisão registrada no GitHub:* Pendente de edição manual nas Issues pela equipe.

---

## 6.1 Pauta Objetiva da Reunião Técnica (Duração Estimada: 30 a 40 minutos)

1. **Abertura e Alinhamento de Papéis (3 min):** Confirmação dos dados reais da equipe e validação dos papéis funcionais (Coordenador, Responsável Técnica, Desenvolvedores e Revisores).
2. **Diagnóstico da Situação Atual das Issues (4 min):** Confirmação de que as 8 Sub-Issues (`SUB-01` a `SUB-08`) estão documentadas e por que devem permanecer em `Backlog` neste momento.
3. **Resolução de Pendências da Definition of Ready (DoR) (8 min):** Análise dos critérios `DoR-05` (especificação de requisitos) e `DoR-07` (conclusão da revisão cruzada humana).
4. **Alinhamento da Priorização Técnica (4 min):** Apresentação da matriz de priorização, focando a atenção inicial em `SUB-01`, `SUB-02` e `SUB-03`.
5. **Mapeamento de Dependências Técnicas (4 min):** Diferenciação entre dependências de contrato (desacopladas) e de integração para viabilizar o fluxo.
6. **Oportunidades e Cuidados com o Paralelismo (4 min):** Apresentação do Grupo 1 (`SUB-01` e `SUB-02`) e Grupo 4 (`SUB-05` e `SUB-07` unitário).
7. **Identificação de Impedimentos e Gargalos (3 min):** Gestão da carga concentrada em Bruno (`SUB-03` e `SUB-04`) e prevenção de testes tardios.
8. **Compromisso com a Política de WIP (3 min):** Acordo sobre o limite de $WIP = 1$ por integrante e no máximo 3 atividades em `In Progress` no board.
9. **Apresentação do Roteiro Inicial de Execução (4 min):** Apresentação das 4 ondas lógicas de desenvolvimento.
10. **Definição de Responsáveis pelas Próximas Ações Imediatas (3 min):** Atribuição de prazos para atualização das descrições das Issues no GitHub.

---

## 6.2 Matriz de Registro de Decisões Técnicas Propostas

A tabela a seguir consolida as deliberações técnicas propostas pela IA, servindo como guia para discussão da equipe:

| Assunto em Discussão | Informações Disponíveis no Projeto | Decisão Técnica Proposta pela IA | Justificativa Técnica | Responsável Sugerido | Próxima Ação Imediata | Necessidade de Validação pela Equipe? |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Atributos de `Product`** | Documento UC12 possui fluxos genéricos sem dicionário formal de dados. | Adotar campos: `id` (UUID), `name` (string), `description` (string), `sku` (string única), `price` (inteiro em centavos), `category` (enum), `isActive` (boolean). | Garante tipos primitivos precisos no TypeScript, evita ponto flutuante em moeda e padroniza identificadores. | `Ana Clara` (Resp. Técnica) | Validar com o Professor/PO e documentar no corpo da Issue `SUB-01`. | **Sim, Obrigatória** |
| **Padrão de Resposta HTTP do POST** | Boas práticas de REST no NestJS e critério `CA01`. | Retornar código HTTP `201 Created` acompanhado do objeto criado no body (`ProductResponseDto`). | Padrão semântico RESTful com facilidade de consumo pelo frontend sem necessidade de requisição extra. | `Carla` (Coordenadora / API) | Documentar na Issue `SUB-06` e padronizar com DTO da `SUB-02`. | **Sim, Obrigatória** |
| **Camada de Validação de Regras** | Regras `RN01` a `RN04` e validações sintáticas de entrada. | Validações sintáticas no DTO (`class-validator`) e regras de domínio/integridade em métodos de entidade/serviço. | Separação limpa de responsabilidades (*Clean Architecture*): DTO valida payload HTTP; Domínio valida invariantes de negócio. | `Bruno` e `Ana Clara` | Refinar comentários nas Issues `SUB-02` e `SUB-03`. | **Sim, Obrigatória** |
| **Tratamento de Falha no Banco (`FE01`)** | PostgreSQL pode lançar erros de constraint única (`23505`) ou indisponibilidade de I/O. | Interceptar erros no repositório, relançar como exceções semânticas de domínio/aplicação e mapear em HTTP 409 ou 500 amigável. | Atende ao critério de aceite `CA04`, mantendo o isolamento de infraestrutura e evitando vazamento de stack traces sensíveis. | `Bruno` e `Ana Clara` | Formalizar a estratégia de tratamento na Issue `SUB-04` e `SUB-05`. | **Sim, Obrigatória** |
| **Sequenciamento das Tarefas de Bruno** | Bruno é o executor de `SUB-03` (Validação) e `SUB-04` (Persistência). | Bruno implementa primeiro `SUB-04` (definindo o contrato `IProductRepository` e mapeamento) e depois `SUB-03`. | Desbloqueia mais rápido a interface de banco necessária para o Service `SUB-05`, respeitando o limite $WIP=1$. | `Carla` (Coordenação) | Atualizar a prioridade e ordem de atenção no backlog. | **Sim, Recomendada** |
| **Momento de Início dos Testes** | Risco de empurrar a suíte de testes (`SUB-07`) para o fim do épico. | Diego inicia os testes unitários concomitantemente à entrega de cada componente base (`SUB-01` a `SUB-05`), reservando apenas E2E para o final. | Garante feedback contínuo (*fail fast*), previne regressão e assegura cumprimento real do critério `CA03`. | `Diego` (Qualidade) | Criar estrutura de testes no Vitest assim que os primeiros contratos forem fechados. | **Sim, Obrigatória** |

---

## 6.3 Modelo de Ata Breve de Reunião Técnica (Template para Uso dos Estudantes)

Após a realização prática da reunião, os estudantes devem preencher o modelo abaixo e arquivá-lo no repositório ou no comentário de governança do projeto:

```markdown
# ATA DA REUNIÃO TÉCNICA DE COORDENAÇÃO — CASO DE USO UC12

- **Data e Horário:** DD/MM/AAAA das HH:MM às HH:MM
- **Local / Ferramenta:** [Discord / Google Meet / Presencial]
- **Participantes Presentes:**
  - Integrante 1 (Nome / @user_github) — Papel: [Responsável Técnica]
  - Integrante 2 (Nome / @user_github) — Papel: [Desenvolvedor / Admin]
  - Integrante 3 (Nome / @user_github) — Papel: [Coordenadora]
  - Integrante 4 (Nome / @user_github) — Papel: [Desenvolvedor / Qualidade]

---

### 1. Pautas Discutidas e Consensos Alcançados
- **Validação dos Atributos de Domínio (`SUB-01`):** [Registrar os campos e tipos formalmente aprovados pela equipe]
- **Padronização dos Contratos de Entrada/Saída (`SUB-02`):** [Registrar a estrutura dos DTOs aprovada]
- **Critérios Objetivos de Validação (`SUB-03`):** [Registrar os limites de caracteres e regras acordadas]
- **Padronização HTTP (`SUB-06`):** [Status code de sucesso (201) e formato de resposta confirmados]
- **Acordo da Política de WIP:** [Confirmado o limite de 1 tarefa em progresso por integrante]

---

### 2. Plano de Ação Imediato no GitHub
| Issue | Ação a Realizar no GitHub | Responsável | Prazo |
| :---: | :--- | :--- | :---: |
| `SUB-01` | Atualizar descrição com atributos confirmados e postar comentário de conclusão de DoR. | @user | DD/MM |
| `SUB-02` | Atualizar contratos de DTOs e postar comentário de DoR. | @user | DD/MM |
| `SUB-03` | Registrar limites exatos das regras de negócio. | @user | DD/MM |
| `Board` | Mover SUB-01 e SUB-02 de Backlog para Ready após saneamento das pendências. | @user_coord | DD/MM |

---

### 3. Declaração de Prontidão
Declaramos que as pendências impeditivas foram esclarecidas em consenso de equipe e que as tarefas da Onda 1 estão aptas a transicionar para o estado `Ready` no GitHub Project após as edições documentais cabíveis.

**Assinaturas / Confirmações:**
- [x] Integrante 1: _______________________
- [x] Integrante 2: _______________________
- [x] Integrante 3: _______________________
- [x] Integrante 4: _______________________
```

