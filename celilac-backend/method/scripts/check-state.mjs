#!/usr/bin/env node
// Validador do state.yaml de um caso de uso.
// Sem dependências: usa um leitor de subconjunto estrito de YAML (ver didatico/02).
// O leitor e as regras ficam em check-state-core.mjs (sem módulos do Node, usável no navegador);
// este arquivo acrescenta a leitura do disco, a consulta ao GitHub e a linha de comando.
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
import { parseYaml, validar as validarNucleo } from './check-state-core.mjs';

export { parseYaml };

// Mesma assinatura de antes: confere os arquivos citados a partir de baseDir.
export function validar(state, baseDir) {
  return validarNucleo(state, { existe: (rel) => existsSync(resolve(baseDir, rel)) });
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
