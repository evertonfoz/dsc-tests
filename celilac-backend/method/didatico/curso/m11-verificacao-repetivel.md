---
id: m11
tipo: modulo
titulo: 'Módulo 11 — Outra pessoa consegue repetir sua verificação?'
ordem: 16
prerequisitos: [m04, m07, m08, m09, apoio-c, apoio-d]
duracao: '2 aulas'
gabarito: m11-gabarito
---

# Módulo 11 — Outra pessoa consegue repetir sua verificação?

---

## 1. O problema
No UC12 (UC, *Use Case*: caso de uso de cadastrar produto), o contrato da API (módulo 9) estava escrito e testado. Mas a frase "funciona de ponta a ponta" ainda dependia de **alguém** subir o sistema e testar à mão, e de acreditar nessa pessoa.

O diagnóstico da fase E (`docs/uc/uc12/evidencias/E/diagnostico.md`) mostrou que **sete linhas do contrato** não tinham cenário na coleção de requisições nem verificação no script que já existia. Elas estavam "cobertas" só na cabeça de quem escreveu.

Há ainda uma pergunta que um teste comum não responde: **o dado cadastrado sobrevive quando a aplicação reinicia?** (módulo 8: gravar é uma coisa; durar é outra.)

## 2. Antes de ler a solução: o roteiro de quem não é você
Escreva, em 15 minutos, as instruções para que **um colega que nunca viu o seu projeto** confirme, sozinho, que o seu caso de uso funciona. Regras:
- o colega só tem um clone do repositório e o Docker instalado;
- cada passo deve ter um comando exato e **o que deve aparecer** na tela;
- diga como ele saberá, **sem ler código**, se deu certo ou errado.

Troque o roteiro com um colega e **tente seguir o dele**. Anote cada vez que você precisou adivinhar algo.

## 3. A tentativa ingênua
| Atalho | Por que não basta |
|---|---|
| "Testei na minha máquina" | a sua máquina tem estado antigo (banco já com tabelas, variáveis) que esconde falhas |
| "Mandei uma captura de tela" | não dá para repetir nem conferir |
| "Escrevi um script, ele diz `OK`" | um script que **nunca falhou** pode estar sempre dizendo `OK` |
| "Reiniciei tudo e o dado ainda estava lá" | se você reiniciou **o banco** (ou apagou volumes), a prova perde o sentido e arrisca dados |

## 4. A solução: três peças

### 4.1. Peça 1 — Uma linha do contrato, um cenário, uma verificação
Para **cada linha** do `contrato.md` (módulo 9) existe:
- um **cenário** em uma coleção de requisições `.http` (arquivos de texto com pedidos HTTP, *HyperText Transfer Protocol*, que um editor pode executar);
- uma **verificação** no script (`run-checks.sh`), que faz o pedido, confere o status e o corpo e imprime `[OK]` ou `[FALHA]`.

Se **qualquer** verificação falhar, o script termina com um código de saída diferente de zero (um número que o CI, apoio C, interpreta como "falhou"). Regras do método: **acrescentar ao script que já existe** em vez de criar outro paralelo; valores de exemplo, **sem segredos**; só gravar pelo próprio recurso do caso de uso.

No UC12 foram acrescentadas **8 verificações** (nome em branco, 121 e 120 caracteres, JSON inválido, formato do 400, `GET /products`, rota inexistente).

### 4.2. Peça 2 — O controle negativo
Um script que só passou em código correto **não prova que detecta código errado**. É a mesma ideia da mutação (módulo 7), aplicada ao script.

No UC12, o script novo foi executado **contra a API antiga** (anterior à correção do contrato). O resultado, em `docs/uc/uc12/evidencias/E/run-checks-controle-negativo.txt`:
```
[FALHA] Validação: nome só com espaços retorna 400 (esperado: '400', obtido: '201')
[FALHA] Validação: nome com 121 caracteres retorna 400 (esperado: '400', obtido: '500')
Resultado: 19 ok, 2 falha(s)
```
Falhou **exatamente nos dois cenários** que a correção tinha resolvido, e em nenhum outro. Só então o script "verde" (`23 ok, 0 falha(s)`, em `run-checks.txt`) passou a valer.

> **Lição:** um verificador só vale depois de falhar contra o erro que deveria detectar.

### 4.3. Peça 3 — A durabilidade
O script cadastra um produto, **reinicia somente o contêiner da API** (nunca o banco) e relê o registro por **consulta de leitura** (módulo 8). A evidência (`durabilidade.txt`):
```
Reiniciando SOMENTE o contêiner da API...
[OK] Registro do produto permanece íntegro após restart da API
```
Isso prova que o dado está no banco e não na memória da aplicação.

### 4.4. Regras de segurança do script
O script **nunca** usa `docker compose down -v`, nunca apaga volumes, nunca faz `DROP` ou `TRUNCATE`, e nunca reinicia o banco para "provar" durabilidade. Esses comandos podem destruir dados; a prova se faz sem eles.

### 4.5. O mesmo script no CI
O job de *smoke* do CI (apoio C e D) sobe um ambiente **novo** a cada execução e roda o **mesmo script**, com senhas descartáveis. É ele que sustenta a afirmação "em um ambiente limpo", e não a sua máquina.

## 5. O que o relatório admitiu
O relatório da fase E (`docs/uc/uc12/relatorios/E.md`) registra, sem enfeite:
- a execução com 23 `[OK]` foi na máquina de quem escreveu, **com um banco de desenvolvimento já existente**. Um clone realmente limpo só é exercitado pelo job do CI. Logo, o gate "ambiente limpo" **não deve ser lido** como prova de clone limpo sem o CI;
- a coleção `.http` **não é executada por nenhuma ferramenta**: a conferência dela é por leitura;
- o script grava um registro a cada execução (nunca apaga);
- revisão solo ou feita pela IA (inteligência artificial) não é revisão independente.

## 6. Pratique no seu domínio
1. Faça o **diagnóstico**: liste cada linha do seu contrato e marque se tem cenário e verificação. Guarde.
2. Escreva a coleção `.http` e as verificações no script (um só script).
3. Faça o **controle negativo**: rode o script contra uma versão **errada** do seu código (por exemplo, a de antes de uma correção, ou uma mutação do módulo 7). Guarde a saída com os `[FALHA]` esperados.
4. Prove a **durabilidade**: reinicie só a aplicação e releia o registro. Guarde.
5. Troque com um colega (seção 2): ele roda **o seu** roteiro em uma máquina que não é a sua. Anote o que ele precisou adivinhar e corrija o roteiro.
6. Confirme que o script roda no CI e **leia o log** do job.

## 7. Como saber que funcionou
- [ ] Cada linha do contrato tem cenário e verificação.
- [ ] O script sai com código diferente de zero quando algo falha.
- [ ] Existe saída guardada de um controle negativo com as falhas esperadas.
- [ ] A durabilidade foi provada sem reiniciar o banco.
- [ ] Uma pessoa que não é você repetiu a verificação.
- [ ] Nenhum segredo nos arquivos versionados.

## 8. Armadilhas comuns
- **Marcar `[OK]` à mão** ou colar saída que não veio de uma execução.
- **Script que não falha nunca** (esquecer o código de saída).
- **Provar durabilidade reiniciando o banco.**
- **Criar um segundo script** em vez de ampliar o existente.
- **Confundir "rodou na minha máquina" com "ambiente limpo".**
- **Segredos** (senhas, tokens) dentro da coleção ou do script.

## 9. Exercícios
1. Por que o controle negativo precisa falhar em cenários específicos, e não em qualquer um?
2. Por que a durabilidade é provada reiniciando só a API?
3. Qual afirmação o relatório da fase E **não** consegue sustentar sem o CI?
4. Que cenário do seu domínio o seu script ainda não cobre?
5. Como o código de saída diferente de zero ajuda o CI?

## 10. Como lidar com a IA (inteligência artificial) neste módulo
- A IA pode **escrever a saída do script** sem tê-lo executado. Exija o **arquivo gerado por uma execução**, com data.
- Ela pode ajustar o script "para passar" (afrouxar uma conferência). Confira o diff: a verificação **não pode ficar mais fraca**.
- Peça que ela proponha o controle negativo e **rode você**: o resultado esperado é falha.
- Ela não deve executar comandos destrutivos para "provar" algo. Confira cada comando antes.

Próximo: módulo 12, quem aprova e o que a IA pode fazer?
