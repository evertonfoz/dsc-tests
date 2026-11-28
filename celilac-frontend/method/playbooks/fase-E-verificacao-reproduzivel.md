# Playbook — Fase E: Verificação reprodutível

> Procedimento curto e sem dados de projeto. Nomes, comandos, portas e serviços vêm de `project-profile.md` e de `docs/uc/<uc>/state.yaml`. Regras permanentes: `method/AGENTS.md`.

| Campo | Valor |
|---|---|
| Camada | 1 (Ciclo do UC) |
| Fase | E — Verificação reprodutível |
| Arquétipos | criar *(validado)* · demais *(esboços, ver `matriz-arquetipos.md`)* |
| Depende de | Fase D aprovada; Fundação (Compose, CI) |
| Valida-se com | coleção `.http` · script de verificação (`run-checks`) · job de *smoke* do CI · revisão humana |

## 1. Objetivo
Permitir que **qualquer pessoa** repita, a partir de um clone limpo, a prova de que o caso de uso funciona de ponta a ponta no ambiente containerizado: cenários HTTP versionados, um script que os executa e confere, e (quando aplicável) a prova de **durabilidade**. O CI executa o mesmo script.

## 2. Entradas
### 2.1. Já no repositório (não perguntar)
- `project-profile.md` (porta da API, serviços do Compose, comando de subida e verificação) e `contrato.md` da Fase D.
- Coleção e script de verificação existentes, se a Fundação ou um UC anterior os criou.
### 2.2. A perguntar (somente se faltar)
- **Onde ficam as coleções `.http`** e a convenção de nomes, se o projeto ainda não tem — *evita criar estrutura paralela (regra 5)*.
- **Cenários de borda desejados** além dos do contrato — *o contrato já fixa os essenciais*.

## 3. Gate de entrada
- [ ] Fase D com gate aprovado por pessoa; `check-state.sh --remote` sem erros.
- [ ] Ambiente sobe do zero com o comando do perfil e as migrations aplicam (ver Fase C).
- [ ] Inspecionado o que já existe (coleção, script) **antes** de criar ou duplicar.

## 4. Passos
1. **Diagnóstico:** o que já cobre o UC? Listar rotas do contrato sem cenário. — evidência: `docs/uc/<uc>/evidencias/E/diagnostico.md`.
2. **Coleção `.http` do UC:** um cenário por linha do contrato (sucesso, cada erro, rota inexistente). Valores **de exemplo**, sem segredos; status esperado em comentário. — verificar: cada rota do `contrato.md` tem ao menos um cenário.
3. **Script de verificação** (acrescentar ao existente, não criar outro): confere serviços no ar, *smoke*, migrations sem pendências (somente leitura) e os cenários do UC, imprimindo `[OK]`/`[FALHA]` e saindo com código diferente de zero em falha.
4. **Durabilidade** (se o UC grava dados): reiniciar **somente a API** (nunca o banco) e reler o registro por consulta de **leitura**. — evidência: `docs/uc/<uc>/evidencias/E/durabilidade.txt`.
5. **Executar do zero** em um clone limpo ou ambiente recém-criado (sem estado da sua máquina) e guardar a saída **real**. — evidência: `docs/uc/<uc>/evidencias/E/run-checks.txt`.
6. **CI:** garantir que o job de *smoke* executa o script (com senhas efêmeras) e fica verde.
7. **Relatório da Fase E**, `state.yaml` atualizado, `check-links.mjs`. Mostrar o gate de saída e **aguardar validação**.

> Pare e pergunte antes de qualquer ação destrutiva (regra 8). O script de verificação nunca remove volumes, nunca usa `down -v`, nunca apaga dados e só grava pelo recurso do UC.

## 5. Artefatos
| Artefato | Local | Obrigatório |
|---|---|---|
| Coleção `.http` do UC | diretório de coleções do perfil | sim |
| Script de verificação atualizado | caminho do perfil | sim |
| Evidências (execução, durabilidade) | `docs/uc/<uc>/evidencias/E/` | sim |
| Relatório da fase | `docs/uc/<uc>/relatorios/E.md` | sim |

## 6. Gate de saída
| Verificação | Como | Quem valida |
|---|---|---|
| Cada rota do contrato tem cenário na coleção | `contrato.md` × coleção | pessoa responsável |
| O script termina com 0 falhas em ambiente limpo | `docs/uc/<uc>/evidencias/E/run-checks.txt` | pessoa responsável |
| O mesmo script passa no CI | job de *smoke* | CI |
| Durabilidade provada (se aplicável) | `docs/uc/<uc>/evidencias/E/durabilidade.txt` | pessoa responsável |
| Nenhum segredo nos arquivos versionados | revisão do diff | pessoa responsável |

O agente **não** marca `aprovado` nem faz merge (regras 9 e 21).

## 7. Proibições da fase
- `docker compose down -v`, remoção de volumes, `DROP`, `TRUNCATE`, reiniciar o banco para "provar" durabilidade.
- Cenários que alteram ou apagam dados que não foram criados pelo próprio cenário.
- Segredos, tokens ou senhas em `.http`, scripts ou evidências.
- Colar saída que não foi obtida de fato; marcar `[OK]` à mão.

## 8. Variações por arquétipo
| Arquétipo | O que muda nesta fase | Validação |
|---|---|---|
| criar | cadastro + durabilidade (reiniciar a API e reler) | validado (UC12) |
| consultar | leitura de dado conhecido (semear por rota do UC); sem durabilidade a provar | validado (UC13, UC14) |
| atualizar | alteração + releitura | validado (UC15) |
| excluir | remoção + confirmação de ausência | esboço |
| autenticar | login válido e inválido; sem registrar segredos | esboço |

## 9. Erros comuns
- Funciona só na sua máquina → depende de estado anterior (dados, `.env`) → rodar em clone limpo.
- Script "passa" sem verificar nada → faltam asserções de status → toda chamada compara esperado × obtido.
- Durabilidade provada reiniciando o banco → prova o volume, não a aplicação → reiniciar só a API e reler.
- Dados de teste acumulando → cenário sem limpeza própria → usar valores únicos e limpar apenas o que criou, no banco de testes.

## 10. Para o estudante
- **O que esta fase ensina:** reprodutibilidade, a diferença entre "testei" e "qualquer pessoa consegue repetir".
- **Pergunte-se:** (1) o que prova que o registro sobrevive à reinicialização da API? (2) outra pessoa, num clone limpo, obtém a mesma saída? (3) o que o script faria se a API devolvesse 500?
- **Documento didático relacionado:** `method/didatico/05-as-seis-fases-e-seus-playbooks.md`.
