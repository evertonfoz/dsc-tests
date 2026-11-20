# AGENTS.md — Regras Permanentes do Método

> Este arquivo é lido por qualquer agente de IA (ou pessoa) que atue neste repositório.
> Copie-o para a **raiz** do seu repositório. Ele vale para **todas** as fases e casos de uso.
> Por que estas regras existem: ver `method/didatico/01-por-que-um-metodo-em-duas-camadas.md`.

## 1. Como o trabalho é organizado

O método tem **duas camadas**:

- **Camada 0 — Fundação** (uma vez por repositório): perfil do projeto, infraestrutura, CI, convenções.
- **Camada 1 — Ciclo do caso de uso** (repetido a cada caso de uso), em 6 fases:
  **A** Planejar e publicar · **B** Fatias (núcleo) · **C** Adaptadores: HTTP e persistência · **D** Contrato · **E** Verificação reprodutível · **F** Auditoria e encerramento.

Os procedimentos de cada fase estão em `method/playbooks/`. O perfil do projeto está em `project-profile.md`. O estado de cada caso de uso está em `docs/uc/<UC>/state.yaml`.

## 2. Regras de conduta (inegociáveis)

1. **Uma fase por vez, com validação humana.** Ao terminar uma fase, apresente o resumo e o gate de saída e **aguarde aprovação explícita** antes da próxima. Nunca encadeie fases por conta própria.
2. **Pergunte antes de cada fase.** Cada playbook lista as "Entradas necessárias". Se algo faltar e não estiver no repositório, pergunte. Não pergunte o que já está no repositório, no `project-profile.md` ou no `state.yaml`.
3. **Nunca invente evidência.** Saídas de terminal, logs, resultados de testes, hashes de commit, números de issue/PR e URLs só entram em documentos se foram **obtidos de fato** nesta execução. Se não foi possível obter, escreva `a confirmar`.
4. **Classifique toda afirmação relevante** com uma destas etiquetas:
   `Documentado` · `Confirmado no código` · `Executado nesta fase` · `Aguardando evidência` · `Pendente de correção`.
5. **Inspecione antes de criar.** Verifique se o arquivo, a issue, a branch ou o serviço já existe. Se existir e estiver adequado, não recrie.
6. **Não imponha nomes de exemplo.** Portas, nomes de container, tabelas, issues e branches vêm do projeto real (`project-profile.md`), nunca de exemplos em `method/exemplos/`.
7. **Não use decisões não documentadas como se fossem requisito.** Se o caso de uso não define algo, registre como *proposta técnica / hipótese* e peça confirmação.
8. **Sem ações destrutivas ou irreversíveis sem autorização explícita e específica:** `docker compose down -v`, `DROP`, `TRUNCATE`, `migration:revert`, `git push --force`, `git reset --hard`, apagar branches, fechar issues/PRs, merge. Em dúvida, pare e pergunte.
9. **Merge e fechamento de Epic são sempre humanos.** O agente prepara; a pessoa decide e executa (ou autoriza explicitamente cada comando).
10. **Segredos nunca entram no repositório, nos documentos ou nos comandos exibidos.** Use `.env` ignorado pelo git e `.env.example` sem valores reais.

## 3. Regras de entrega

11. **Fatia = comportamento.** Cada Sub-Issue entrega um comportamento verificável do caso de uso, com regra, critério de aceite e teste RED nomeado (não "uma camada" nem "só o teste"). Na Fase B a fatia é entregue no núcleo (domínio + serviço); os adaptadores HTTP e de persistência entram na Fase C, um PR por adaptador. RED, GREEN e REFACTOR acontecem **no mesmo branch/PR**, em commits separados. Ver ADR-003.
12. **PR pequeno, `main` sempre verde.** Nenhum PR é integrado com testes falhando.
13. **Rastreabilidade obrigatória.** Todo commit e PR referencia a issue real (`refs #N`). Toda fase que tem trabalho próprio tem issue própria. Uma issue já fechada não é reutilizada para trabalho novo.
14. **Fechar issue exige duas provas:** PR integrado e link para a evidência.
15. **O estado é a fonte da verdade.** Ao final de cada fase, atualize `state.yaml` (fase, issues, branches, PRs, evidências) e valide-o com `method/scripts/check-state.sh`. Divergência entre documento e `state.yaml`: o `state.yaml` vence e o documento é corrigido.

16. **Isolamento de testes.** Testes que gravam dados nunca usam o banco de desenvolvimento por padrão: usam o banco de testes, com a variável de proteção do projeto. Se uma suíte existente violar isso, **registre no perfil como fato** (o que toca e com que escopo) e planeje a correção; não esconda nem proíba sem alternativa.

## 4. Regras de documentação

17. **Um relatório por fase**, no template `method/templates/relatorio-de-fase.md`, com no máximo ~2 páginas. Saídas brutas de comandos vão para `docs/uc/<UC>/evidencias/`, não para o relatório.
18. **Decisões arquiteturais viram ADR** (`method/templates/adr.md`), uma por decisão.
19. **Links e caminhos citados em documentos devem existir.** Verifique antes de entregar com `node method/scripts/check-links.mjs` (o CI também roda). Para citar de propósito um caminho inexistente (como exemplo), termine a linha com `<!-- links:ignore -->`.
20. **Linguagem:** português técnico-acadêmico. Termos consagrados em inglês (Draft PR, DoR, stacked PR, RED/GREEN) permanecem.
21. **O agente não se autoavalia.** O relatório registra fatos e evidências. Veredictos de "aprovado/reprovado" são da pessoa responsável ou do CI.

## 5. Como começar uma sessão

1. Leia este arquivo, `project-profile.md` e `docs/uc/<uc>/state.yaml` (o diretório usa o código do UC em **minúsculas**, ex.: `uc13`). Rode `method/scripts/check-state.sh docs/uc/<uc>/state.yaml` (com `--remote` se `gh` estiver autenticado) e trate qualquer erro **antes** de começar.
2. Informe em uma frase **em que fase o caso de uso está** e **qual é o próximo passo**.
3. Peça as entradas faltantes do playbook da fase.
4. Execute, registre, mostre o gate de saída e **aguarde validação**.
