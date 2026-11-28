# 02 — Descrição prévia do UC17 (módulo 0)

> **Situação:** redigida pelo assistente a partir do material e das decisões desta execução. É **proposta** até a revisão e aprovação do estudante.
> Siglas: UC (caso de uso), API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema), ADR (*Architecture Decision Record*, registro de decisão arquitetural).

## Quem usa
A pessoa usuária do CeliLac, pelo navegador. Nesta entrega, também a pessoa desenvolvedora que configura o endereço da API.

## Caso normal
A pessoa abre a aplicação, é levada à tela de login e vê os campos de e-mail e senha. **Ainda não há autenticação**: o formulário não envia dados.

## Duas regras
1. **Enviar o formulário não autentica nem envia nada à API.**
2. **A configuração local fica fora do repositório:** o `.env` não é versionado; o `.env.example` é.

## Uma situação de falha
O material não define nenhuma. Candidatas, todas **a confirmar**: endereço inexistente (P1) e variável do endereço da API ausente (P2).

## Como eu mostraria
| Item | Como mostro |
|---|---|
| Raiz leva ao login | teste de rota e conferência no navegador |
| Três telas | um teste por tela e conferência no navegador |
| Formulário não envia nada | teste que observa as requisições ao enviar, validado por mutação |
| `.env` fora do repositório | saída real de comando do Git |
