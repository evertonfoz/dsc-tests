#!/usr/bin/env node
// Validador do state.yaml de um caso de uso.
// Sem dependências: usa um leitor de subconjunto estrito de YAML (ver didatico/02).
//
// Uso:
//   node method/scripts/check-state.mjs docs/uc/uc12/state.yaml
//   node method/scripts/check-state.mjs docs/uc/uc12/state.yaml --remote
//
// --remote  também consulta o GitHub via `gh` (issues, PRs, Epic). Somente leitura.
// Saída: código 0 se válido; 1 se houver erros; 2 se uso incorreto.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

// ---------------------------------------------------------------- parser YAML (subconjunto)
// Suporta: mapas, listas de mapas/escalares, escalares (string, número, true/false, null),
// listas inline [a, b], mapas inline {k: v}, aspas simples/duplas, comentários com '#'.
// Não suporta: âncoras, tags, blocos multilinha (| >), chaves complexas.

function stripComment(line) {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === q) q = null; }
    else if (c === '"' || c === "'") q = c;
    else if (c === '#' && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}

function splitTop(s) {
  const parts = []; let depth = 0, q = null, cur = '';
  for (const c of s) {
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === '[' || c === '{') depth++;
    if (c === ']' || c === '}') depth--;
    if (c === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim() !== '') parts.push(cur.trim());
  return parts;
}

function findKeyColon(s) {
  let q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '[' || c === '{') return -1;
    if (c === ':' && (i === s.length - 1 || s[i + 1] === ' ')) return i;
  }
  return -1;
}

function parseScalar(raw) {
  const s = raw.trim();
  if (s === '' || s === '~' || s === 'null') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")) ) return s.slice(1, -1);
  if (s.startsWith('[') && s.endsWith(']')) return splitTop(s.slice(1, -1)).map(parseScalar);
  if (s.startsWith('{') && s.endsWith('}')) {
    const o = {};
    for (const p of splitTop(s.slice(1, -1))) {
      const k = findKeyColon(p + ' ');
      const idx = k === -1 ? p.indexOf(':') : k;
      if (idx === -1) throw new Error(`mapa inline inválido: ${s}`);
      o[p.slice(0, idx).trim()] = parseScalar(p.slice(idx + 1));
    }
    return o;
  }
  return s;
}

export function parseYaml(text) {
  const lines = [];
  text.split(/\r?\n/).forEach((l, n) => {
    if (/\t/.test(l.match(/^\s*/)[0])) throw new Error(`linha ${n + 1}: tabulação não permitida na indentação`);
    const t = stripComment(l).replace(/\s+$/, '');
    if (t.trim() === '') return;
    lines.push({ indent: t.match(/^ */)[0].length, text: t.trim(), n: n + 1 });
  });
  let pos = 0;

  function parseBlock(indent) {
    const l = lines[pos];
    if (l.text.startsWith('- ') || l.text === '-') return parseList(indent);
    return parseMap(indent);
  }

  function parseList(indent) {
    const out = [];
    while (pos < lines.length && lines[pos].indent === indent && (lines[pos].text.startsWith('- ') || lines[pos].text === '-')) {
      const l = lines[pos];
      const rest = l.text === '-' ? '' : l.text.slice(2).trim();
      if (rest === '') {
        pos++;
        if (pos < lines.length && lines[pos].indent > indent) out.push(parseBlock(lines[pos].indent));
        else out.push(null);
      } else if (findKeyColon(rest) !== -1) {
        // mapa iniciando na própria linha do hífen
        const childIndent = indent + (l.text.length - l.text.slice(2).trimStart().length);
        lines[pos] = { indent: childIndent, text: rest, n: l.n };
        out.push(parseMap(childIndent));
      } else { pos++; out.push(parseScalar(rest)); }
    }
    return out;
  }

  function parseMap(indent) {
    const out = {};
    while (pos < lines.length && lines[pos].indent === indent && !lines[pos].text.startsWith('- ')) {
      const l = lines[pos];
      const c = findKeyColon(l.text);
      if (c === -1) throw new Error(`linha ${l.n}: esperado "chave: valor", encontrado "${l.text}"`);
      const key = l.text.slice(0, c).trim().replace(/^["']|["']$/g, '');
      const rest = l.text.slice(c + 1).trim();
      if (key in out) throw new Error(`linha ${l.n}: chave duplicada "${key}"`);
      pos++;
      if (rest === '') {
        if (pos < lines.length && lines[pos].indent > indent) out[key] = parseBlock(lines[pos].indent);
        else if (pos < lines.length && lines[pos].indent === indent && lines[pos].text.startsWith('- ')) out[key] = parseList(indent);
        else out[key] = null;
      } else out[key] = parseScalar(rest);
    }
    if (pos < lines.length && lines[pos].indent > indent) {
      throw new Error(`linha ${lines[pos].n}: indentação inesperada`);
    }
    return out;
  }

  if (lines.length === 0) return {};
  const result = parseBlock(lines[0].indent);
  if (pos < lines.length) throw new Error(`linha ${lines[pos].n}: conteúdo fora do lugar`);
  return result;
}

// ---------------------------------------------------------------- validação

const ARQUETIPOS = ['criar', 'consultar', 'atualizar', 'excluir', 'autenticar'];
const FASES = ['A', 'B', 'C', 'D', 'E', 'F'];
const STATUS_FASE = ['pendente', 'em_andamento', 'concluida'];
const STATUS_FATIA = ['planejada', 'em_andamento', 'em_revisao', 'integrada'];
const RESULTADO_GATE = ['pendente', 'aprovado', 'reprovado'];

export function validar(state, baseDir) {
  const erros = [];
  const avisos = [];
  const err = (m) => erros.push(m);
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const filled = (v) => v !== null && v !== undefined && v !== '';
  const arquivo = (rel, ctx) => {
    if (!filled(rel)) return;
    if (!existsSync(resolve(baseDir, rel))) err(`${ctx}: arquivo não encontrado: ${rel}`);
  };

  if (!isObj(state)) { err('state.yaml vazio ou inválido'); return { erros, avisos }; }

  for (const k of ['uc', 'nome', 'arquetipo', 'epic', 'fase_atual', 'fases', 'fatias']) {
    if (!(k in state)) err(`campo obrigatório ausente: ${k}`);
  }
  if ('documento' in state) arquivo(state.documento, 'documento');
  if (filled(state.arquetipo) && !ARQUETIPOS.includes(state.arquetipo)) err(`arquetipo inválido: "${state.arquetipo}" (válidos: ${ARQUETIPOS.join(', ')})`);

  if (isObj(state.epic)) {
    const faseAConcluida = state.fases?.A?.status === 'concluida';
    if (state.epic.issue === null || state.epic.issue === undefined) {
      if (faseAConcluida || (state.fase_atual && state.fase_atual !== 'A')) err('epic.issue é obrigatório depois que a Fase A termina');
    } else if (!Number.isInteger(state.epic.issue)) err('epic.issue deve ser número inteiro ou null (somente na Fase A)');
    if (!['open', 'closed'].includes(state.epic.estado)) err('epic.estado deve ser open ou closed');
  } else err('epic deve ser um mapa com issue e estado');

  if (!FASES.includes(state.fase_atual) && state.fase_atual !== 'concluido') err(`fase_atual inválida: "${state.fase_atual}" (A–F ou concluido)`);

  // fases
  if (isObj(state.fases)) {
    for (const f of FASES) {
      const fase = state.fases[f];
      if (!isObj(fase)) { err(`fases.${f} ausente`); continue; }
      if (!STATUS_FASE.includes(fase.status)) err(`fases.${f}.status inválido: "${fase.status}"`);
      const gate = Array.isArray(fase.gate) ? fase.gate : [];
      gate.forEach((g, i) => {
        if (!isObj(g) || !filled(g.item)) err(`fases.${f}.gate[${i}] precisa de "item"`);
        else if (!RESULTADO_GATE.includes(g.resultado)) err(`fases.${f}.gate[${i}].resultado inválido: "${g.resultado}"`);
        else if (g.resultado === 'aprovado' && !filled(g.por)) err(`fases.${f}.gate[${i}]: "aprovado" exige "por" (quem validou)`);
      });
      if (fase.status === 'concluida') {
        if (gate.length === 0) err(`fases.${f}: concluída exige gate com itens`);
        else if (gate.some((g) => g?.resultado !== 'aprovado')) err(`fases.${f}: concluída exige todos os itens do gate aprovados`);
        if (!filled(fase.relatorio)) err(`fases.${f}: concluída exige relatorio`);
      }
      arquivo(fase.relatorio, `fases.${f}.relatorio`);
      (Array.isArray(fase.evidencias) ? fase.evidencias : []).forEach((e, i) => arquivo(e, `fases.${f}.evidencias[${i}]`));
    }
    // coerência da fase atual
    if (FASES.includes(state.fase_atual)) {
      const idx = FASES.indexOf(state.fase_atual);
      for (let i = 0; i < idx; i++) {
        if (state.fases[FASES[i]]?.status !== 'concluida') err(`fase_atual é ${state.fase_atual}, mas a fase ${FASES[i]} não está concluída`);
      }
      if (state.fases[state.fase_atual]?.status === 'concluida') avisos.push(`fase_atual (${state.fase_atual}) já está concluída: avance fase_atual`);
    }
    if (state.fase_atual === 'concluido') {
      for (const f of FASES) if (state.fases[f]?.status !== 'concluida') err(`fase_atual é concluido, mas a fase ${f} não está concluída`);
    }
  } else err('fases deve ser um mapa A–F');

  // fatias
  const ids = new Set(); const issues = new Map(); const prs = new Map();
  if (Array.isArray(state.fatias)) {
    state.fatias.forEach((s, i) => {
      const c = `fatias[${i}]`;
      if (!isObj(s)) { err(`${c} inválida`); return; }
      if (!filled(s.id)) err(`${c}.id obrigatório`);
      else if (ids.has(s.id)) err(`${c}.id duplicado: ${s.id}`); else ids.add(s.id);
      if (!filled(s.comportamento)) err(`${c}.comportamento obrigatório`);
      if (!Array.isArray(s.criterios) || s.criterios.length === 0) err(`${c}.criterios deve listar ao menos 1 critério de aceite`);
      if (!STATUS_FATIA.includes(s.status)) err(`${c}.status inválido: "${s.status}"`);
      if (!filled(s.responsavel)) err(`${c}.responsavel obrigatório`);
      if (s.issue !== null && s.issue !== undefined && !Number.isInteger(s.issue)) err(`${c}.issue deve ser número ou null`);
      if (s.pr !== null && s.pr !== undefined && !Number.isInteger(s.pr)) err(`${c}.pr deve ser número ou null`);
      if (Number.isInteger(s.issue)) {
        if (issues.has(s.issue)) err(`${c}: issue #${s.issue} já usada pela fatia ${issues.get(s.issue)}`); else issues.set(s.issue, s.id);
      }
      if (Number.isInteger(s.pr)) {
        if (prs.has(s.pr)) err(`${c}: PR #${s.pr} já usado pela fatia ${prs.get(s.pr)}`); else prs.set(s.pr, s.id);
      }
      if (['em_andamento', 'em_revisao', 'integrada'].includes(s.status)) {
        if (!Number.isInteger(s.issue)) err(`${c} (${s.status}) exige issue`);
        if (!filled(s.branch)) err(`${c} (${s.status}) exige branch`);
      }
      if (['em_revisao', 'integrada'].includes(s.status) && !Number.isInteger(s.pr)) err(`${c} (${s.status}) exige pr`);
      if (s.status === 'integrada') {
        if (!Array.isArray(s.evidencias) || s.evidencias.length === 0) err(`${c} (integrada) exige evidencias`);
        if (!filled(s.revisor)) err(`${c} (integrada) exige revisor`);
      }
      if (filled(s.revisor) && s.revisor === s.responsavel) avisos.push(`${c}: revisor igual ao responsável (modo solo?). Registre como papel, não como aprovação independente`);
      (Array.isArray(s.evidencias) ? s.evidencias : []).forEach((e, j) => arquivo(e, `${c}.evidencias[${j}]`));
    });
    if (state.fases?.B?.status === 'concluida' && state.fatias.some((s) => s.status !== 'integrada')) {
      err('fase B concluída, mas há fatias não integradas');
    }
  } else err('fatias deve ser uma lista');

  if (isObj(state.epic) && state.epic.estado === 'closed' && state.fase_atual !== 'concluido') {
    err('Epic fechada, mas fase_atual não é "concluido"');
  }
  return { erros, avisos, issues, prs };
}

// ---------------------------------------------------------------- verificação remota (opcional)

function gh(args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
}

export function validarRemoto(state) {
  const erros = []; const avisos = [];
  try { execFileSync('gh', ['auth', 'status'], { stdio: 'ignore' }); }
  catch { return { erros: ['--remote exige `gh` instalado e autenticado (gh auth status)'], avisos }; }

  const tentar = (fn, ctx) => { try { return fn(); } catch (e) { erros.push(`${ctx}: não encontrado no GitHub (${String(e.stderr || e.message).split('\n')[0]})`); return null; } };

  if (state?.epic?.issue) {
    const e = tentar(() => gh(['issue', 'view', String(state.epic.issue), '--json', 'state,title']), `epic #${state.epic.issue}`);
    if (e && e.state.toLowerCase() !== state.epic.estado) erros.push(`epic #${state.epic.issue}: state.yaml diz ${state.epic.estado}, GitHub diz ${e.state.toLowerCase()}`);
  }
  for (const [i, s] of (state?.fatias ?? []).entries()) {
    const c = `fatias[${i}] (${s.id})`;
    if (Number.isInteger(s.issue)) {
      const is = tentar(() => gh(['issue', 'view', String(s.issue), '--json', 'state']), `${c} issue #${s.issue}`);
      if (is && s.status === 'integrada' && is.state === 'OPEN') avisos.push(`${c}: integrada, mas issue #${s.issue} ainda aberta (fechamento é decisão humana)`);
      if (is && s.status !== 'integrada' && is.state === 'CLOSED') erros.push(`${c}: issue #${s.issue} fechada, mas fatia está "${s.status}"`);
    }
    if (Number.isInteger(s.pr)) {
      const pr = tentar(() => gh(['pr', 'view', String(s.pr), '--json', 'state,isDraft,headRefName']), `${c} PR #${s.pr}`);
      if (pr) {
        if (s.status === 'integrada' && pr.state !== 'MERGED') erros.push(`${c}: integrada, mas PR #${s.pr} está ${pr.state}`);
        if (s.status === 'em_revisao' && (pr.state !== 'OPEN' || pr.isDraft)) erros.push(`${c}: em_revisao, mas PR #${s.pr} está ${pr.state}${pr.isDraft ? ' (draft)' : ''}`);
        if (filled(s.branch) && pr.headRefName !== s.branch) erros.push(`${c}: branch no state.yaml (${s.branch}) difere da do PR (${pr.headRefName})`);
      }
    }
  }
  return { erros, avisos };
  function filled(v) { return v !== null && v !== undefined && v !== ''; }
}

// ---------------------------------------------------------------- CLI

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const remote = args.includes('--remote');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('uso: check-state.mjs <caminho/state.yaml> [--remote]'); process.exit(2); }
  if (!existsSync(file)) { console.error(`arquivo não encontrado: ${file}`); process.exit(2); }

  let state;
  try { state = parseYaml(readFileSync(file, 'utf8')); }
  catch (e) { console.error(`ERRO de leitura: ${e.message}`); process.exit(1); }

  const r = validar(state, dirname(resolve(file)));
  if (remote) { const rr = validarRemoto(state); r.erros.push(...rr.erros); r.avisos.push(...rr.avisos); }

  for (const a of r.avisos) console.log(`AVISO  ${a}`);
  for (const e of r.erros) console.log(`ERRO   ${e}`);
  console.log(r.erros.length === 0 ? `\nOK: ${file} válido${remote ? ' (local + GitHub)' : ' (local)'}.` : `\nFALHOU: ${r.erros.length} erro(s).`);
  process.exit(r.erros.length === 0 ? 0 : 1);
}
