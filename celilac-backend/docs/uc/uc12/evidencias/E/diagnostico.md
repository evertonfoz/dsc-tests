# Diagnóstico da Fase E — UC12 (2026-11-20)

O que já existia (Fundação e laboratório): `http-rest-client/containerizado/run-checks.sh` (serviços, smoke, migrations, cadastro, whitelist, orders, SQL direto e `--durability`), a coleção `01-products-cadastrar-produto.http` e o job de smoke do CI que executa o script. Nada foi criado em paralelo (regra 5).

Linhas do `contrato.md` sem cenário ou sem asserção antes desta fase:

| Linha do contrato | Coleção `.http` | `run-checks.sh` |
|---|---|---|
| Nome só com espaços → 400 | faltava | faltava |
| Nome com 121 caracteres → 400 | faltava | faltava |
| Nome com 120 caracteres → 201 | faltava | faltava |
| JSON inválido → 400 | faltava | faltava |
| Formato do 400 (`message` lista, `error`, `statusCode`) | n/a | faltava |
| GET /products → 404 | faltava | faltava |
| Rota inexistente (POST /produtos) → 404 | faltava | faltava |

As demais linhas (sucesso, vazio, ausente, tipo inválido, campo extra, persistência, durabilidade) já estavam cobertas.
