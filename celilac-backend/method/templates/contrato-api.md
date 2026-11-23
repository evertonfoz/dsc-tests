# Modelo — contrato observado da API

> Copie este modelo para `docs/uc/<uc>/contrato.md` durante o M09, fase D. Ele registra o comportamento observado em execução e as decisões sobre o contrato desejado. Não é o documento do caso de uso: `caso-de-uso.md` descreve o domínio; este arquivo descreve requisições e respostas HTTP.
>
> Faça primeiro o inventário em uma configuração identificada e guarde a saída real em `docs/uc/<uc>/evidencias/D/`. Preencha “Observado” somente com comportamento obtido ao executar. Se ainda não executou, escreva `a confirmar`; não deduza do código, de exemplos ou de um gabarito. Submeta as decisões do contrato à pessoa responsável antes de alterar o código.

# Contrato observado — <método e rota> (<UC>)

**Caso de uso:** <código e nome><br>
**Base da observação:** <ambiente/configuração, data e commit da evidência D><br>
**Evidência do inventário:** <caminho relativo ao repositório>

## Requisição

- **Método e rota:** <ex.: a confirmar>
- **Cabeçalhos relevantes:** <a confirmar>
- **Formato e campos:** <a confirmar>
- **Validações que afetam a resposta:** <a confirmar>

## Situações e respostas

| Situação/entrada | Observado em execução (status e corpo) | Decisão do contrato (status e corpo) | Estado | Teste que protege a decisão |
|---|---|---|---|---|
| <cenário identificado> | a confirmar | a confirmar | a confirmar | a confirmar |

Use `Implementado`, `A implementar` ou `Pendente de decisão` em **Estado**. Preserve corpos suficientes para distinguir a resposta, removendo ou anonimizando dados pessoais e segredos. Para respostas com identificadores variáveis, documente o formato, sem inventar valor observado.

## Respostas que não podem expor dados internos

Registre quais dados nunca podem aparecer (por exemplo, segredo, endereço interno, pilha ou detalhe do banco) e a evidência/teste que confere essa ausência. Não copie mensagens reais que revelem segredo ou dado pessoal.

## Diferenças, decisões e limites

| Diferença observada | Decisão (corrigir ou aceitar) | Quem decidiu e quando | Registro (issue/ADR) | Consequência/pendência |
|---|---|---|---|---|
| <a confirmar> | a confirmar | a confirmar | a confirmar | a confirmar |

## Fora do contrato

- <comportamento explicitamente fora do escopo ou ainda não definido; use `a confirmar` quando faltar decisão>

## Conferência final

- [ ] Cada valor em “Observado” aponta para uma execução real na evidência indicada.
- [ ] Cada diferença tem decisão da pessoa responsável ou permanece pendente.
- [ ] Cada resposta decidida tem teste que falha se o contrato mudar.
- [ ] O inventário final foi executado novamente e comparado com este documento.
- [ ] A resposta não expõe detalhes internos.
