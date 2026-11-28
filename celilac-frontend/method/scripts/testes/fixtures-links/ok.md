# Documento sem referências quebradas (fixture)

Link relativo existente: [alvo](alvo.md) e com âncora: [seção](alvo.md#secao).
Link externo e âncora pura são ignorados: [site](https://example.com) e [topo](#topo).
Caminho citado existente (relativo à raiz do projeto): `method/scripts/check-links.mjs`.
Caminho com sufixo de linha: `method/scripts/check-links.mjs:10`.
Modelo com placeholder é ignorado: `docs/uc/<uc>/state.yaml` e `src/modules/*/x.ts`.
Nome solto é conceito, não caminho: `state.yaml`.
Exemplo deliberado de caminho quebrado: `prompts/uc-12.md` <!-- links:ignore -->

```
bloco de código com caminho inexistente: `src/nao/existe.ts` e [x](nao-existe.md)
```
