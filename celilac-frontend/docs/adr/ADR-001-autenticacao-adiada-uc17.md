# ADR-001 — Autenticação real, proteção de rotas e perfis adiados no UC17

> Siglas: ADR (*Architecture Decision Record*, registro de decisão arquitetural), UC (caso de uso), API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema), JWT (*JSON Web Token*, credencial assinada que identifica a pessoa), RF (requisito funcional).

- **Status:** Aceita
- **Data:** 2026-11-28
- **Decisores:** `evertonfoz` (aceita em 2026-11-28)
- **Caso de uso / fase:** UC17, fase A

## Contexto
O material que origina esta entrega diz que o objetivo **não é implementar o login ainda** e que a API já tem cadastro, login, JWT e controle por perfil. Nas buscas desta execução, **não foi encontrado** mecanismo de autenticação no `celilac-backend` nem no laboratório `celillac-backend-prepare` (evidência em `docs/uc/uc17/evidencias/A/api-sem-autenticacao.txt`). As ADRs 007 e 008 do backend registram operações sem autenticação.

## Decisão
RF06 (autenticar), RF07 (proteger o dashboard) e RF08 (controlar por perfil) ficam **fora desta entrega**. O backend não é alterado por este caso de uso.

## Condição para retomar
A API oferecer login com emissão de token e controle por perfil, com contrato documentado, e a especificação do UC17 receber as regras hoje em aberto (P4).

## Consequências
- (+) A entrega fica pequena e verificável sem depender do backend.
- (−) O UC17 permanece **aberto** ao fim desta entrega.
- (−) O dashboard fica acessível sem autenticação: adequado apenas ao ambiente local didático.
- (−) O próximo material depende de um backend que ainda não existe.

## Alternativas consideradas
- Implementar autenticação no backend agora — descartada: é outro trabalho, em outro projeto.
- Simular o login no frontend — descartada: o material não pede, e a simulação pareceria uma proteção que não existe.
