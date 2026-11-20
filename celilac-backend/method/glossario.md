# Glossário do Método

| Termo | Significado neste método |
|---|---|
| **Caso de uso (UC)** | Especificação de um comportamento do sistema do ponto de vista de um ator (ex.: UC12 — Cadastrar Produto). |
| **Epic** | Issue principal que representa o UC no GitHub. Fecha por último, por decisão humana. |
| **Sub-Issue** | Unidade de trabalho do UC. Neste método, uma **fatia**. |
| **Fatia** | Comportamento observável do caso de uso (ex.: "rejeitar cadastro sem nome"), com regra, critério de aceite e teste RED nomeado. Não é uma camada técnica nem uma etapa do TDD. Entregue no núcleo na Fase B; adaptadores na Fase C (ADR-003). |
| **Esqueleto andante** | Variação avançada: a primeira fatia atravessa todas as camadas desde o início. |
| **Camada 0 (Fundação)** | Trabalho feito uma vez por repositório: perfil, Docker/Compose, CI, estrutura de verificação HTTP, convenções. |
| **Camada 1 (Ciclo do UC)** | As 6 fases (A–F) repetidas em cada caso de uso. |
| **Fase** | Etapa do ciclo, com entradas, passos, artefatos e **gate de saída**. |
| **Playbook** | Documento curto que descreve uma fase (`method/playbooks/`). |
| **Gate de saída** | Condição **verificável** (comando, CI, documento) para considerar a fase concluída. |
| **Perfil do projeto** | Arquivo `project-profile.md` com stack, comandos, portas e nomes reais. Os playbooks leem dele. |
| **Perfil de stack** | Conjunto reutilizável de comandos e convenções de uma stack (ex.: `celilac-nest`). |
| **`state.yaml`** | Arquivo por UC que mapeia Sub-Issue → issue → branch → PR → fase → evidência. Fonte da verdade. |
| **Evidência** | Saída real de um comando, log, consulta SQL, resposta HTTP ou resultado de CI, guardada em `evidencias/`. |
| **RED / GREEN / REFACTOR** | Ciclo de TDD: teste falhando → implementação mínima → melhoria sem mudar comportamento. |
| **DoR (Definition of Ready)** | Critérios para uma issue poder começar (objetivo, escopo, aceite, dependências, responsável). |
| **WIP** | Work in progress: limite de itens simultâneos em andamento. |
| **ADR** | Architecture Decision Record: registro curto de uma decisão, contexto e consequências. |
| **Stacked PR** | PR cuja base é outro branch de feature. Evitado neste método por padrão. |
| **Arquétipo de UC** | Tipo do caso de uso: criar, consultar, atualizar, excluir, autenticar. Define quais fases/testes se aplicam. |
| **Modo solo** | Quando a equipe tem uma só pessoa: papéis (autor, revisor) são nomeados como papéis, sem personas fictícias. |
