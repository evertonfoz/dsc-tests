---
id: m11-gabarito
tipo: gabarito
titulo: 'Gabarito para autoestudo — Módulo 11'
gabarito_de: [m11]
---

# Gabarito para autoestudo — Módulo 11

> Este gabarito é público. Tente primeiro a atividade no seu projeto e use as respostas para comparar o raciocínio. Isso é orientação de estudo, não bloqueio; resultados do CeliLac são referência documentada, não execução no seu projeto.

## Fatos registrados na preparação do material

Os itens abaixo descrevem evidências e observações do projeto de referência registradas quando este gabarito foi escrito. Não são resultados de uma execução sua nem desta revisão.

- `diagnostico.md`: sete linhas do contrato sem cenário nem asserção; as demais já cobertas.
- Controle negativo: `19 ok, 2 falha(s)`, com falhas em "nome só com espaços" (obtido 201) e "121 caracteres" (obtido 500).
- `run-checks.txt` final: 23 verificações OK e 0 falhas (conforme o relatório E; a saída completa está no arquivo).
- `durabilidade.txt`: reinício só do contêiner da API; registro permanece.
- O relatório E admite que a execução foi em banco de desenvolvimento já existente e que a coleção `.http` não é executada por ferramenta.

## Seção 2 (roteiro cruzado)
Ao revisar o roteiro, confira: comandos exatos; pré-requisitos declarados (Docker, portas); resultado esperado visível; critério de sucesso sem ler código; ausência de passos "óbvios" omitidos. O valor está nas **adivinhações anotadas** pelo colega.

## Exercícios
1. Porque mostra que o script distingue o erro específico; falhar em qualquer coisa pode ser falha de ambiente.
2. Reiniciar o banco pode perder dados e não prova que o dado estava no banco; reiniciar só a API prova que o estado não estava na memória dela.
3. "Ambiente limpo": o relatório diz que isso só é exercitado pelo job de smoke do CI.
4. Resposta livre.
5. O CI trata exit code ≠ 0 como falha do job; sem isso o script pode imprimir `[FALHA]` e o CI ficar verde.

## Pontos de atenção
- Pedir o arquivo da execução do controle negativo, com falhas **esperadas**; "falhou" sem especificar não vale.
- Um `[OK]` num script que nunca falha é a principal ilusão do módulo.
- O módulo cita 8 verificações acrescentadas (relatório E); o total do script final é 23.
- A troca com colega acrescenta uma verificação independente. Se você trabalha sozinho, registre que essa revisão não ocorreu.

## Reveja sua resposta se
- Reinicia o banco para provar durabilidade.
- Cola saída sem execução.
- Cria um script novo em vez de ampliar o existente.
