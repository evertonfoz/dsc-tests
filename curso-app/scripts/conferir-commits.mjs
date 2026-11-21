#!/usr/bin/env node
// Confere que os commits citados no curso existem no histórico do git (E8, P7; plano do M1, seção 9).
// Roda fora do Docker (a construção da imagem não recebe o histórico): em construir.sh e no CI.
//
// Uso: node curso-app/scripts/conferir-commits.mjs [pasta-do-curso]
// Cita como commit: trecho entre crases com 7 a 40 caracteres hexadecimais, com pelo menos um dígito
// e uma letra. Para citar de propósito um hexadecimal que não é commit, termine a linha com
// <!-- commits:ignore -->.
// Saída: 0 se todos existem; 1 se algum não existe; 2 se não for possível consultar o git.
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export function commitsCitados(texto) {
  const achados = [];
  texto.split(/\r?\n/).forEach((linha, i) => {
    if (linha.includes('<!-- commits:ignore -->')) return;
    for (const m of linha.matchAll(/`([0-9a-f]{7,40})`/g)) {
      const h = m[1];
      if (/[0-9]/.test(h) && /[a-f]/.test(h)) achados.push({ linha: i + 1, commit: h });
    }
  });
  return achados;
}

function principal() {
  const aqui = dirname(fileURLToPath(import.meta.url));
  const pasta = resolve(process.argv[2] ?? join(aqui, '../../celilac-backend/method/didatico/curso'));
  let raiz;
  try {
    raiz = execFileSync('git', ['-C', pasta, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  } catch {
    console.error(`conferir-commits: não foi possível consultar o git em ${pasta}`);
    process.exit(2);
  }
  const arquivos = readdirSync(pasta).filter((f) => f.endsWith('.md')).sort();
  const faltando = [];
  let total = 0;
  for (const arquivo of arquivos) {
    for (const { linha, commit } of commitsCitados(readFileSync(join(pasta, arquivo), 'utf8'))) {
      total += 1;
      try {
        execFileSync('git', ['-C', raiz, 'cat-file', '-e', `${commit}^{commit}`], { stdio: 'ignore' });
      } catch {
        faltando.push(`commit citado não existe: ${arquivo}:${linha}: ${commit}`);
      }
    }
  }
  if (faltando.length > 0) {
    console.error(faltando.join('\n'));
    console.error(`${faltando.length} de ${total} citação(ões) de commit sem commit no histórico; a imagem não deve ser construída.`);
    console.error('(Clone raso? No CI, use actions/checkout com fetch-depth: 0.)');
    process.exit(1);
  }
  console.log(`OK: ${total} citação(ões) de commit em ${arquivos.length} arquivo(s), todas no histórico.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) principal();
