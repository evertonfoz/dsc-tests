# ADR-002 — Versões atuais das dependências e `react-router`

> Siglas: ADR (*Architecture Decision Record*, registro de decisão arquitetural), UC (caso de uso).

- **Status:** Aceita
- **Data:** 2026-11-28
- **Decisores:** `evertonfoz` (aceita em 2026-11-28)
- **Caso de uso / fase:** UC17, fase A

## Contexto
A pessoa responsável determinou: não forçar versões; instalar sempre a atual. O material manda instalar `react-router-dom`. Na consulta ao registro de pacotes em 2026-11-28, `react-router-dom` estava na linha 7 e `react-router`, na linha 8 (evidência em `docs/uc/uc17/evidencias/A/versoes-publicadas.txt`).

## Decisão
1. Consultar a versão atual **no momento da instalação** e instalá-la, sem fixar versão anterior. O arquivo de travamento do gerenciador registra o que foi instalado.
2. Usar o pacote `react-router`, importando dele o que o material importa de `react-router-dom`.
3. Se duas versões atuais forem incompatíveis, **parar e informar** antes de recorrer a uma versão anterior.

## Condição para retomar
Não se aplica.

## Consequências
- (+) O projeto nasce nas linhas atuais.
- (−) O código diverge do material no nome do pacote.
- (−) Os modelos do Vite podem diferir do que o material descreve (por exemplo, os arquivos a remover).
- (−) `react-router` exige versões recentes do React e do Node; conferir na instalação.

## Alternativas consideradas
- Seguir o material e instalar `react-router-dom` — descartada: instalaria a linha anterior.
- Fixar as versões usadas no backend — descartada: contraria a decisão de usar as atuais.
