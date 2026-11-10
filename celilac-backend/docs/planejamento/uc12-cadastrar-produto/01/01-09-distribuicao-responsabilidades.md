# Artefato 9 — Distribuição de Responsabilidades

## 1. Visão Geral
Este artefato apresenta o modelo de alocação de trabalho para as atividades técnicas decompostas no **UC12 — Cadastrar Produto**. Como os membros nominais da equipe não foram fornecidos previamente, as atribuições foram mantidas com o identificador padrão **`A definir`**, acompanhadas de perfis técnicos recomendados para cada frente.

---

## 2. Matriz de Alocação de Trabalho

| Identificador | Atividade Técnica | Perfil Técnico Sugerido | Responsável Designado | Dependências de Execução | Estado Inicial no Board |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **UC12** | `[UC12] Cadastrar Produto` *(Épico)* | Líder Técnico / Arquiteto | `A definir` | Todas as Sub-Issues | `Backlog` |
| **SUB-01** | Modelagem da Entidade `Product` e Invariantes | Desenvolvedor Backend (Domínio) | `A definir` | Nenhuma | `Ready` |
| **SUB-02** | DTOs e Validações de Entrada/Saída | Desenvolvedor Backend (Contratos/API) | `A definir` | Nenhuma | `Ready` |
| **SUB-03** | Persistência, Migrações e Repositório | Desenvolvedor Backend (Banco de Dados/ORM) | `A definir` | `SUB-01` | `Backlog` |
| **SUB-04** | Serviço de Aplicação de Cadastro | Desenvolvedor Backend (Core/Lógica) | `A definir` | `SUB-01`, `SUB-02`, `SUB-03` | `Backlog` |
| **SUB-05** | Controlador HTTP e Rota `POST /products` | Desenvolvedor Backend (API REST) | `A definir` | `SUB-02`, `SUB-04` | `Backlog` |
| **SUB-06** | Testes Automatizados Unitários e E2E | Engenheiro de Qualidade / Desenvolvedor QA | `A definir` | `SUB-01` a `SUB-05` | `Backlog` |

---

## 3. Diretrizes de Comunicação e Alinhamento da Equipe
Para garantir a harmonia e o fluxo contínuo de trabalho durante a fase de implementação, recomendam-se os seguintes combinados operacionais:

1. **Alinhamento de Contrato Inicial (`SUB-01` e `SUB-02`):**
   - Os responsáveis por `SUB-01` e `SUB-02` devem alinhar previamente a tipagem e os limites de dados (ex.: se o preço será tratado como `number` float ou objeto de valor em centavos), evitando retrabalho nas camadas superiores.
2. **Desbloqueio de Persistência (`SUB-03`):**
   - Assim que a entidade `SUB-01` for finalizada e aprovada em PR, o responsável por `SUB-03` deve ser imediatamente notificado para transitar sua atividade de `Backlog` para `Ready`.
3. **Revisões Cruzadas de Código (Code Review):**
   - Cada Pull Request referente a uma Sub-Issue deve ser revisado por pelo menos um colega da equipe antes de ser integrado na branch principal, assegurando conformidade com as regras de negócio (RN01–RN04).
4. **Resolução de Dúvidas Funcionais:**
   - Dúvidas sobre regras complementares (ex.: se o nome deve ser único na base) devem ser registradas nos comentários da Issue correspondente para validação em conjunto com o professor ou responsável pelo produto.

