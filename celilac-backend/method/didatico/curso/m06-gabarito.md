# Gabarito do professor — Módulo 6

> Uso exclusivo do professor.

## Atividade da seção 2
| Pergunta | Resposta esperada |
|---|---|
| O que a mensagem revela? | endereço IP do servidor (10.0.0.5), a porta do banco (5432), o nome da tabela (`products`), que o banco é PostgreSQL (convenção da porta), que a tabela nem foi criada (falta de migration) |
| Quem se beneficia / quem é prejudicado? | beneficia quem depura; prejudica a segurança: orienta um atacante sobre a infraestrutura |
| Código HTTP | 500 (falha do servidor). Aceitar 503 com justificativa de indisponibilidade temporária |

## Respostas esperadas
- **Exercício 1:** ajuda o cliente dizer "tente novamente" e indicar um identificador de correlação (código de rastreio) que a equipe usa para achar o log, sem expor dados internos.
- **Exercício 2:** hoje, em lugar nenhum: o filtro responde e não registra. O teste deve afirmar que o serviço de log foi chamado com a causa; correção mínima: injetar o logger no filtro e chamá-lo antes de responder, sem incluir a causa no corpo.
- **Exercício 3:** 503 quando a falha é temporária (banco indisponível) e o cliente deve tentar de novo; o caso de uso precisaria definir retentativa e, possivelmente, o cabeçalho de espera.
- **Exercício 4:** códigos HTTP pertencem à fronteira; uma tarefa agendada não tem "resposta HTTP". O núcleo lança a exceção de domínio e cada borda a traduz do seu jeito.

## Achados reais para o professor
1. A ADR-003 afirma registro da causa em log, e o código não o faz.
2. A intermitência #27 apareceu também em `products.error-mapping.spec.ts` (registrado na issue).

## Pontos para discussão
1. Segurança por obscuridade? (não: o objetivo é não ajudar um atacante, sem impedir a equipe de diagnosticar por canais internos)
2. Onde termina a responsabilidade do núcleo e começa a da borda?
3. Quem decide um código de resposta quando o caso de uso não o define?

## Critérios de avaliação sugeridos
| Critério | Peso |
|---|---|
| Teste afirma a exceção e a ausência de detalhes | 25% |
| Mapeamento exceção para status testado pela API | 20% |
| ADR com tabela e consequência negativa | 20% |
| Falha real no banco de testes e mutação documentada | 20% |
| Log da causa, testado e fora da resposta | 15% |
