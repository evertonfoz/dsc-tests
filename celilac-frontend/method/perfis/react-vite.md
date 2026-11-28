# Perfil de stack — React com Vite e TypeScript

> Complementa o `project-profile.md`. Valores marcados `<...>` vêm do seu projeto.
> Criado para o frontend do CeliLac (UC17, caso de uso 17). **Ainda não validado** em um caso de uso concluído.

## Onde ficam as coisas
| Responsabilidade | Pasta |
|---|---|
| Comunicação com a API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema) | `<src/api>` |
| Telas | `<src/pages>` |
| Rotas | `<src/routes>` |
| Estilos globais | `<src/styles>` |

## Como ler as fases neste tipo de projeto
Os playbooks de `method/playbooks/` foram escritos para um backend. No frontend:

| Fase | Equivalente no frontend | Situação |
|---|---|---|
| A Planejar e publicar | igual | em uso |
| B Fatias no núcleo | comportamento visível da tela, provado por teste de componente | hipótese |
| C Adaptadores | chamadas reais à API e armazenamento no navegador | a confirmar |
| D Contrato | o que o frontend espera da API | a confirmar |
| E Verificação reprodutível | verificação do zero e rotas no navegador | a confirmar |
| F Auditoria e encerramento | igual | a confirmar |

## Testes
- Ferramentas: Vitest, Testing Library e `jsdom` (um navegador simulado, que roda sem tela).
- O teste descreve o que a pessoa usuária vê ou faz, não a estrutura interna do componente.
- TDD (*Test-Driven Development*, desenvolvimento guiado por testes): o teste precisa falhar pelo **comportamento ausente**. Erro de importação ou de configuração não conta como falha válida.

## Proteções
- Toda variável com prefixo `VITE_` vai para o código entregue ao navegador: **nunca** coloque segredo nela.
- `.env` não é versionado; `.env.example` é.
