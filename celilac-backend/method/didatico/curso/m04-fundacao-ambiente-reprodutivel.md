---
id: m04
tipo: modulo
titulo: 'Módulo 4 — Por que "na minha máquina funciona" não basta?'
ordem: 9
prerequisitos: [apoio-c, apoio-d, m03]
duracao: '2 aulas'
gabarito: m04-gabarito
---

# Módulo 4 — Por que "na minha máquina funciona" não basta?

> **Pré-requisito:** apoios C e D e o módulo 3. Duração sugerida: 2 aulas.
> **Você vai:** separar o que se resolve **uma vez por projeto** (a Fundação) do que se repete **a cada caso de uso**, e montar a Fundação do seu projeto.

---

## 1. O problema
No UC12 (UC, *Use Case*: caso de uso de cadastrar produto), a containerização, o banco de testes, a verificação automática e a coleção de requisições nasceram **dentro do caso de uso**. Isso causou dois efeitos:
1. O primeiro caso de uso carregava trabalho que **não era dele**.
2. O segundo caso de uso não teria como saber se o ambiente já estava pronto, e o refaria ou o esqueceria.

E o ambiente tinha falhas que só apareciam fora da máquina de quem o montou. Três delas, registradas na Fundação do CeliLac (PR, *pull request*, nº 22):

| O que aconteceu | Por que só apareceu fora da máquina |
|---|---|
| Um banco **novo** não conseguia criar pedidos: faltava a extensão `uuid-ossp` (que gera identificadores únicos no banco) | o banco antigo, já existente, tinha sido criado antes (o texto da Fundação registra a falha em banco novo e a verificação em banco legado) |
| O CI (integração contínua, o robô que roda as verificações) falhou porque uma pasta vazia, `method/exemplos/`, **não existia no clone** | o Git não versiona pasta vazia, e a máquina local a tinha |
| O arquivo de configuração do CI foi recusado inteiro por um `: ` sem aspas no nome de um passo | só o servidor leu o arquivo |

## 2. Antes de ler a solução
Faça este teste no **seu** projeto, agora:
1. Clone o repositório em uma pasta **nova** (`git clone <endereço> teste-limpo`).
2. Tente rodar **só** com o que o README e os arquivos do repositório dizem.
3. Anote cada ponto em que travou ou precisou de algo que só existia na sua máquina.

Esse resultado é o seu problema real deste módulo.

## 3. A tentativa ingênua
**"Documentar o passo a passo no README."** Falha porque o README envelhece, ninguém o executa a cada mudança, e ele não impede que o ambiente do aluno A seja diferente do ambiente do aluno B.

## 4. A solução: a Fundação
**Fundação** (Camada 0) é tudo o que se resolve **uma vez por repositório**, antes do primeiro caso de uso. **Caso de uso** (Camada 1) é o que se repete.

| Pergunta | Fundação | Caso de uso |
|---|---|---|
| Quantas vezes? | uma por repositório | uma por caso de uso |
| Exemplo | CI, Compose, banco de testes, `verify.sh` | cadastrar produto |
| Branch | `chore/<resumo>` | `feature/<uc>-<fatia>-...` |
| Gate (condição de conclusão) | CI verde e revisão humana | os gates das fases A a F do `state.yaml` |

### 4.1. O que a Fundação do CeliLac contém
1. **Perfil do projeto** (`project-profile.md`): comandos, portas, versões e proteções, num lugar só. Os playbooks leem dele.
2. **Compose sem senhas padrão** e `.env.example` sem segredos (apoio D).
3. **Banco de testes isolado**, separado do de desenvolvimento, com **três travas**:
   - a variável `TEST_DB_ALLOW_DESTRUCTIVE=true` precisa ser definida de propósito;
   - o nome do banco de testes **termina em `_test`**;
   - usuário e porta são **diferentes** dos do banco de desenvolvimento.
   Se alguma trava falhar, os testes que gravam dados **abortam antes de tocar o banco**.
4. **Script `verify.sh`**: roda os mesmos passos que o CI (lint, build, testes, validadores), na sua máquina. Com `--completo`, inclui o banco de testes.
5. **CI** com três jobs (apoio C).
6. **Validadores de documentos**: o `check-state` (o `state.yaml`, módulo 2) e o `check-links` (os caminhos citados nos documentos existem).
7. **Modelos do GitHub**: formulários de issue (de fatia e de fase) e modelo de PR.
8. **Falhas conhecidas com dono**: o módulo `orders` traz 5 testes que falham de propósito (exercício de aula). Em vez de escondê-los, a ADR-001 (ADR, *Architecture Decision Record*, registro de decisão) explica a decisão e `scripts/known-failures.env` guarda a lista num lugar só. O CI os exclui; quem roda `pnpm test` localmente ainda os vê.

### 4.2. Por que o `verify.sh` e o CI devem fazer o mesmo
Se o CI fizer uma coisa e você outra, "passou na minha máquina" deixa de significar "vai passar no CI". Um único roteiro, usado pelos dois, elimina essa classe de surpresa. No CeliLac, o job de qualidade do CI **chama** o `verify.sh`.

### 4.3. Prove no ambiente limpo
A pergunta decisiva não é "funciona?", e sim "**funciona numa cópia limpa?**". No piloto, a pasta vazia foi descoberta justamente porque o CI parte do zero. Para antecipar isso, gere uma cópia só com o que o Git versiona:
```bash
git archive HEAD --prefix=copia-limpa/ | tar -x -C /tmp
```
e rode a verificação lá.

## 5. Erros reais e lições
- **Lista duplicada.** A lista de falhas conhecidas estava copiada no fluxo de CI. Ao centralizar, um filtro `[A-Z]+` não reconheceu `KNOWN_FAILURES_E2E` (tem um dígito) e foi corrigido para `[A-Z0-9_]+`. Uma lista, um lugar.
- **Falha não reproduzida não é falha resolvida.** Uma execução inicial dos testes de ponta a ponta mostrou 2 falhas; uma não foi capturada e não voltou em mais de 9 execuções. Ficou registrada como "não reproduzida".
- **Proibições valem para quem executa.** Nada de `docker compose down -v`, `DROP`, `TRUNCATE` ou reverter migrations sem autorização, inclusive para o assistente de IA (inteligência artificial).

## 6. Pratique no seu domínio
Nesta ordem (a ordem importa):
1. Abra uma issue de fundação e uma branch `chore/<resumo>`.
2. **Perfil do projeto:** copie `method/templates/project-profile.md` e preencha com os comandos reais.
3. **Compose sem segredos**, com `.env.example` (apoio D).
4. **Banco de testes isolado**, com as três travas, e um teste que prove que ele **recusa** rodar contra o banco de desenvolvimento.
5. **Script de verificação** que roda lint, build e testes.
6. **CI** que chama o script (apoio C).
7. **Valide em cópia limpa** (seção 4.3) e só então abra o PR.

## 7. Como saber que funcionou
- [ ] Um colega, numa pasta nova, sobe tudo seguindo só o repositório.
- [ ] O script local e o CI fazem os mesmos passos.
- [ ] Tentar rodar os testes que gravam dados contra o banco de desenvolvimento **falha antes de tocar nele**.
- [ ] Não há senha real em arquivo versionado.
- [ ] As falhas conhecidas, se houver, têm ADR e lista única.

## 8. Armadilhas comuns
- **Misturar Fundação com o primeiro caso de uso** no mesmo PR.
- **Testar só na sua máquina.** O ambiente limpo é o juiz.
- **Excluir testes do CI sem registro.**
- **Travas de segurança "para depois".** O banco de testes sem travas é um acidente à espera de acontecer.

## 9. Como lidar com a IA (inteligência artificial) neste módulo
A IA monta a Fundação rapidamente, e é por isso que **você** precisa conferir:
1. **Rode o teste da cópia limpa** você mesmo.
2. **Teste as travas:** peça que ela rode os testes com o banco errado configurado e confirme que **aborta**.
3. **Revise cada comando destrutivo** que ela sugerir ou executar. A regra "nada de `down -v`, `DROP`, `TRUNCATE`" vale também para ela, e deve constar no arquivo de regras que o assistente lê (o `AGENTS.md`, módulo 12).

Próximo: módulo 5, onde mora a regra de negócio.
