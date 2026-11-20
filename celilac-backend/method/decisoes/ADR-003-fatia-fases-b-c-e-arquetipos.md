# ADR-003 — Definição de fatia, divisão entre Fases B e C, e tratamento dos arquétipos

- **Status:** Aceita (confirmada pelo professor em 2026-11-20)
- **Data:** 2026-11-20
- **Decisores:** Professor responsável

## Contexto
Ao escrever o template de playbook, percebeu-se que a expressão "fatia vertical", usada nos documentos 01 e no `AGENTS.md`, era ambígua. Se "vertical" significa atravessar **todas** as camadas técnicas (HTTP, serviço, banco), então a Fase C (fronteira HTTP e persistência) seria redundante com a Fase B. Se a fatia fica só no núcleo, o termo "vertical" engana.

## Decisão
1. **Fatia = comportamento observável do caso de uso**, com regra, critério de aceite e teste RED nomeado. Não é "uma camada" nem "uma etapa do TDD". Passa a ser o termo oficial (o qualificador "vertical" é abandonado).
2. **Fase B** entrega cada fatia **no núcleo** (domínio + serviço, porta de repositório e adaptador em memória): um PR por fatia, RED/GREEN/REFACTOR em commits separados, sem stacked PRs.
3. **Fase C** entrega os **adaptadores**: C1 fronteira HTTP e C2 persistência real, **um PR por adaptador**, cobrindo todas as fatias já integradas. Depende da Camada 0 (Docker/banco de testes).
4. A `main` permanece verde: nenhum comportamento fica exposto pela metade.
5. **Variação avançada** (equipes, projetos maduros): *esqueleto andante* — a primeira fatia atravessa todas as camadas desde o início. Fica documentada como alternativa, não como padrão.
6. **Arquétipos:** só `criar` é declarado **validado** (UC12). Os demais entram como **esboços** explicitamente marcados, a promover após o primeiro UC real de cada tipo.
7. **Cobertura:** todo item do `uc.md` termina a Fase F com um teste que o prove ou uma ADR de adiamento/exclusão. Nada é declarado "coberto" sem teste.

## Consequências
- (+) Coerente com a ordem em que o curso ensina (núcleo → HTTP → persistência) e com o que o UC12 de fato fez.
- (+) Elimina a sobreposição entre B e C e mantém PRs pequenos.
- (+) Esboços honestos evitam repetir "documentação sem evidência".
- (−) Entre o fim da B e o fim da C o comportamento ainda não é acessível por HTTP.
- (−) O esqueleto andante, mais fiel ao fatiamento vertical puro, fica fora do padrão.

## Alternativas descartadas
- **Fatia atravessando todas as camadas desde a Fase B:** elimina a Fase C e exige Docker/banco antes de o aluno dominar o TDD do núcleo.
- **Definir já as variações dos 4 demais arquétipos:** repetiria o problema de planejar sem executar.
