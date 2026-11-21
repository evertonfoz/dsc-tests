// O que os testes esperam, lido direto dos Markdown do curso (fonte única), sem passar pela aplicação.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { carregarInventarioUc12 } from '../src/conteudo/uc12';

const pasta = fileURLToPath(new URL('../../celilac-backend/method/didatico/curso/', import.meta.url));

export interface Arquivo {
  id: string;
  tipo: string;
  titulo: string;
  ordem?: number;
  prerequisitos: string[];
  prerequisitosSePrecisar: string[];
}

function lista(valor: string | undefined): string[] {
  return (valor ?? '').replace(/^\[|\]$/g, '').split(',').map((s) => s.trim()).filter(Boolean);
}

export const arquivos: Arquivo[] = readdirSync(pasta)
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => {
    const fm = readFileSync(pasta + f, 'utf8').match(/^---\n([\s\S]*?)\n---/)![1]!;
    const campo = (nome: string) => fm.match(new RegExp(`^${nome}:\\s*(.*)$`, 'm'))?.[1]?.trim();
    const titulo = (campo('titulo') ?? '').replace(/^'|'$/g, '').replace(/''/g, "'");
    return {
      id: campo('id')!,
      tipo: campo('tipo')!,
      titulo,
      ordem: campo('ordem') ? Number(campo('ordem')) : undefined,
      prerequisitos: lista(campo('prerequisitos')),
      prerequisitosSePrecisar: lista(campo('prerequisitos_se_precisar')),
    };
  });

/** Módulos, apoios e projeto, na ordem de `ordem`. */
export const percurso = arquivos.filter((a) => a.ordem !== undefined).sort((a, b) => a.ordem! - b.ordem!);
export const gabaritos = arquivos.filter((a) => a.tipo === 'gabarito');
export const praticas = arquivos.filter((a) => a.tipo === 'pratica');

const readme = readFileSync(pasta + 'README.md', 'utf8');
const inicioSiglas = readme.split(/\r?\n/).findIndex((linha) => /^##\s+Siglas usadas no curso\s*$/.test(linha.trim()));
export const siglas = (() => {
  if (inicioSiglas < 0) throw new Error('quadro de siglas ausente no README do curso');
  const linhas = readme.split(/\r?\n/).slice(inicioSiglas + 1);
  const inicioTabela = linhas.findIndex((linha) => linha.trim().startsWith('|'));
  const resultado = new Map<string, string>();
  for (const linha of linhas.slice(inicioTabela)) {
    if (!linha.trim().startsWith('|')) break;
    const colunas = linha.split('|').slice(1, -1).map((s) => s.trim());
    if (colunas.length < 3 || /^-+$/.test(colunas[0]!.replace(/\s/g, ''))) continue;
    const sigla = colunas[0]!.replace(/`|\*|_/g, '');
    const definicao = colunas[1]!.replace(/`|\*|_/g, '').trim();
    if (sigla === 'Sigla' && definicao === 'Significado') continue;
    resultado.set(sigla, definicao);
  }
  return resultado;
})();

/** Todas as páginas que a aplicação deve gerar no M1. */
export const paginas = ['/', '/mapa/', ...percurso.map((a) => `/${a.id}/`), ...praticas.map((a) => `/${a.id}/`)];
export const paginasUc12 = ['/uc12/', ...carregarInventarioUc12().map((item) => item.rota)];
export const paginasGabaritos = gabaritos.map((a) => `/${a.id}/`);
export const paginasPublicadas = [...paginas, ...paginasGabaritos, '/seus-dados/', ...paginasUc12];

export const tituloSimples = (t: string) => t.replace(/`/g, '');
