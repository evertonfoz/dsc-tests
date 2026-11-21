# Modelo — documento do caso de uso

> Copie para o seu repositório (por exemplo, `docs/planejamento/<uc>-<nome-curto>/<uc>.md`) e preencha. O caminho vai no campo `documento` do `state.yaml`.
> Exemplo preenchido: `docs/planejamento/uc12-cadastrar-produto/uc-12.md` (UC12 do CeliLac, no repositório do curso). <!-- links:ignore -->
> **Mantenha os identificadores no formato mostrado** (`RF01`, `RN01`, `FA01`, `FE01`, `CA01`): os playbooks, o `state.yaml` e a aplicação do curso os usam para ligar cada item ao teste que o prova.
> Onde não souber, escreva `a confirmar`. Não invente regra: uma regra que ninguém definiu é uma **pendência**, não um requisito.

Apague as linhas de citação (`>`) depois de preencher.

---

# <UC> — <Nome do caso de uso>

## 1. Identificação
**Código:** <UC>  
**Nome:** <Nome do caso de uso>  
**Sistema:** <nome do seu sistema>  
**Módulo:** <parte do sistema a que pertence>  
**Arquétipo:** criar  <!-- criar | consultar | atualizar | excluir | autenticar; só "criar" foi validado em caso real -->

## 2. Objetivo
<Uma ou duas frases: o que o caso de uso permite fazer e por quê.>

## 3. Atores
**Ator principal:** <quem inicia o caso de uso>

## 4. Pré-condições
1. <O que precisa ser verdade antes de começar.>

## 5. Pós-condições
### Em caso de sucesso
1. <O que passa a ser verdade, por exemplo: o registro está gravado.>

### Em caso de falha
1. <O que **não** pode acontecer, por exemplo: nada inválido é gravado.>

## 6. Fluxo principal
1. O ator <...>.
2. O sistema <...>.
3. O sistema grava <...>.
4. O sistema responde <...>.

## 7. Fluxos alternativos e de exceção

### FA01 — <nome curto>
1. O sistema recebe <entrada que viola uma regra>.
2. O sistema rejeita <...>.
3. Nada é gravado.

### FE01 — <nome curto, por exemplo: falha ao gravar>
1. O sistema tenta gravar <...>.
2. Ocorre uma falha <...>.
3. O sistema informa <...> sem expor detalhes internos.

## 8. Regras de negócio
**RN01 — <nome curto>:** <a regra, de modo verificável: qual entrada a viola e o que acontece>.

**RN02 — <nome curto>:** <...>

## 9. Requisitos funcionais
### RF01 — <nome curto>
<O que o sistema deve fazer.>

## 10. Critérios de aceite
**CA01:** <dado X, quando Y, então Z>.

**CA02:** <...>

## 11. O que ainda não está definido
- <Item vago ou sem decisão, e quem decide. Ex.: "tamanho máximo do nome: a confirmar com o responsável pelo caso de uso".>
