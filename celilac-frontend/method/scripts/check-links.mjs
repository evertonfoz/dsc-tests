#!/usr/bin/env node
// Verifica se links e caminhos citados em documentos Markdown existem.
// Regra 19 do AGENTS.md: "Links e caminhos citados em documentos devem existir."
//
// Uso:
//   node method/scripts/check-links.mjs                      # escopo padrão
//   node method/scripts/check-links.mjs docs/uc method/README.md
//   node method/scripts/check-links.mjs --root <dir> <alvos...>
//
// O que é verificado (fora de blocos de código cercados por ```):
//   1. Links Markdown relativos:  [texto](caminho/arquivo.md#ancora)
//   2. Caminhos citados entre crases que parecem caminhos de arquivo:
//        - começam por uma raiz conhecida (src/, docs/, method/, test/, prompts/, ...)  ou
//        - contêm "/" e terminam em extensão conhecida (.md, .ts, .yaml, .sh, ...)
//      Caminhos com <placeholder>, {chaves}, * ou espaços são ignorados (são modelos).
//   Para ignorar uma linha: termine-a com  <!-- links:ignore -->
//
// Saída: código 0 se tudo existe; 1 se houver referência quebrada; 2 se uso incorreto.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const ROOTS = ['src/', 'docs/', 'method/', 'test/', 'prompts/', 'http-rest-client/', '.github/', 'scripts/'];
const EXTS = /\.(md|ts|mjs|js|json|ya?ml|sh|http|sql|env|example|txt|png|svg)$/i;
const DEFAULT_TARGETS = ['method', 'project-profile.md', 'docs/adr', 'docs/uc'];

export function extrairReferencias(texto) {
  const refs = [];
  let emCodigo = false;
  texto.split(/\r?\n/).forEach((linha, i) => {
    if (/^\s*(```|~~~)/.test(linha)) { emCodigo = !emCodigo; return; }
    if (emCodigo || linha.includes('<!-- links:ignore -->')) return;

    // 1. links Markdown (ignora imagens e links externos/âncoras puras)
    for (const m of linha.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const alvo = m[1];
      if (/^(https?:|mailto:|#|tel:|data:)/i.test(alvo)) continue;
      if (/[<>{}*]/.test(alvo)) continue;
      refs.push({ linha: i + 1, tipo: 'link', alvo: alvo.split('#')[0].split('?')[0], bruto: alvo });
    }

    // 2. caminhos entre crases
    for (const m of linha.matchAll(/`([^`\n]+)`/g)) {
      let t = m[1].trim();
      if (/[\s<>{}*$|;&=()]/.test(t)) continue;            // comando, modelo ou expressão
      if (/^(https?:|@|-|~|\.\.\.)/.test(t)) continue;
      t = t.replace(/:\d+(-\d+)?$/, '').replace(/#.*$/, ''); // sufixo :linha ou #âncora
      if (!t.includes('/')) continue;                        // nome solto (state.yaml) é conceito, não caminho
      const raizConhecida = ROOTS.some((r) => t.startsWith(r) || t.startsWith('./' + r));
      if (!raizConhecida && !EXTS.test(t)) continue;
      refs.push({ linha: i + 1, tipo: 'caminho', alvo: t, bruto: t });
    }
  });
  return refs;
}

function candidatos(alvo, arquivo, raizProjeto) {
  const base = dirname(arquivo);
  const lista = [resolve(base, alvo), resolve(raizProjeto, alvo), resolve(raizProjeto, '..', alvo)];
  return lista;
}

export function verificarArquivo(arquivo, raizProjeto) {
  const quebradas = [];
  for (const r of extrairReferencias(readFileSync(arquivo, 'utf8'))) {
    if (r.alvo === '') continue;
    // links Markdown resolvem só relativo ao arquivo; caminhos citados tentam também a raiz do projeto
    const tentativas = r.tipo === 'link' ? [resolve(dirname(arquivo), r.alvo)] : candidatos(r.alvo, arquivo, raizProjeto);
    if (!tentativas.some((c) => existsSync(c))) quebradas.push(r);
  }
  return quebradas;
}

function listarMarkdown(alvo) {
  if (!existsSync(alvo)) return [];
  const st = statSync(alvo);
  if (st.isFile()) return alvo.endsWith('.md') ? [alvo] : [];
  const out = [];
  for (const nome of readdirSync(alvo)) {
    if (nome === 'node_modules' || nome.startsWith('fixtures') || nome.startsWith('.git')) continue;
    out.push(...listarMarkdown(join(alvo, nome)));
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  let raiz = process.cwd();
  const alvos = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root') raiz = resolve(args[++i]);
    else if (args[i].startsWith('--')) { console.error(`opção desconhecida: ${args[i]}`); process.exit(2); }
    else alvos.push(args[i]);
  }
  const alvosFinais = (alvos.length ? alvos : DEFAULT_TARGETS).map((a) => resolve(raiz, a));
  const arquivos = [...new Set(alvosFinais.flatMap(listarMarkdown))].sort();

  let total = 0; let refs = 0;
  for (const arq of arquivos) {
    refs += extrairReferencias(readFileSync(arq, 'utf8')).length;
    for (const q of verificarArquivo(arq, raiz)) {
      total++;
      console.log(`${relative(raiz, arq).split(sep).join('/')}:${q.linha}: ${q.tipo} inexistente: ${q.bruto}`);
    }
  }
  console.log(total === 0
    ? `\nOK: ${arquivos.length} documento(s), ${refs} referência(s) verificada(s), nenhuma quebrada.`
    : `\nFALHOU: ${total} referência(s) quebrada(s) em ${arquivos.length} documento(s).`);
  process.exit(total === 0 ? 0 : 1);
}
