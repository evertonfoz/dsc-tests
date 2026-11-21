import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const RAIZ_REPO = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const RAIZ_CELILAC = resolve(RAIZ_REPO, 'celilac-backend');
const RAIZ_DOCS = resolve(RAIZ_CELILAC, 'docs');
const PASTA_UC12 = resolve(RAIZ_DOCS, 'uc/uc12');
const ARQUIVOS_DO_ESTADO = resolve(PASTA_UC12, 'state.yaml');
const EXTENSOES = new Set(['.md', '.txt', '.yaml']);

export interface ArquivoUc12 {
  arquivo: string;
  rota: string;
  formato: 'markdown' | 'texto' | 'yaml';
  categoria: 'estado' | 'contrato' | 'relatorio' | 'evidencia' | 'documento';
  fase?: string;
  titulo: string;
  idMarkdown?: string;
}

function registro(valor: unknown, nome: string): Record<string, unknown> {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
    throw new Error(`state.yaml inválido: ${nome} precisa ser um objeto`);
  }
  return valor as Record<string, unknown>;
}

function texto(valor: unknown, nome: string): string {
  if (typeof valor !== 'string' || !valor.trim()) throw new Error(`state.yaml inválido: ${nome} precisa ser texto`);
  return valor.trim();
}

function caminhosDoEstado(estado: unknown): Array<{ arquivo: string; categoria: ArquivoUc12['categoria']; fase?: string }> {
  const root = registro(estado, 'raiz');
  const refs: Array<{ arquivo: string; categoria: ArquivoUc12['categoria']; fase?: string }> = [
    { arquivo: 'docs/uc/uc12/state.yaml', categoria: 'estado' },
    { arquivo: 'docs/uc/uc12/contrato.md', categoria: 'contrato' },
  ];

  const fases = registro(root.fases, 'fases');
  for (const [fase, valor] of Object.entries(fases)) {
    const dados = registro(valor, `fases.${fase}`);
    if (dados.relatorio !== undefined) {
      const relatorio = texto(dados.relatorio, `fases.${fase}.relatorio`);
      refs.push({ arquivo: `docs/uc/uc12/${relatorio}`, categoria: 'relatorio', fase });
    }
    if (dados.evidencias !== undefined) {
      if (!Array.isArray(dados.evidencias)) throw new Error(`state.yaml inválido: fases.${fase}.evidencias precisa ser uma lista`);
      for (const [i, evidencia] of dados.evidencias.entries()) {
        refs.push({ arquivo: `docs/uc/uc12/${texto(evidencia, `fases.${fase}.evidencias[${i}]`)}`, categoria: 'evidencia', fase });
      }
    }
  }

  const documento = texto(root.documento, 'documento');
  if (isAbsolute(documento) || /^[A-Za-z]:[\\/]/.test(documento)) throw new Error('state.yaml inválido: documento precisa ser relativo');
  const documentoCanonico = posix.normalize(posix.join('docs/uc/uc12', documento.replaceAll('\\', '/')));
  refs.push({ arquivo: documentoCanonico, categoria: 'documento' });
  return refs;
}

function caminhosCitadosNoCurso(): string[] {
  const pasta = resolve(RAIZ_REPO, 'celilac-backend/method/didatico/curso');
  const arquivos = readdirSync(pasta).filter((arquivo) => arquivo.endsWith('.md') && !arquivo.endsWith('-gabarito.md'));
  const citados = new Set<string>();
  for (const arquivo of arquivos) {
    let dentroDeBloco = false;
    for (const linha of readFileSync(join(pasta, arquivo), 'utf8').split(/\r?\n/)) {
      if (/^\s*```/.test(linha)) { dentroDeBloco = !dentroDeBloco; continue; }
      if (dentroDeBloco) continue;
      for (const [, ref] of linha.matchAll(/`([^`\r\n]+)`/g)) {
        if (ref.startsWith('docs/uc/uc12/') && EXTENSOES.has(extname(ref).toLowerCase())) citados.add(ref);
      }
    }
  }
  return [...citados];
}

function canonizarArquivo(caminho: string): string {
  const normalizado = posix.normalize(caminho.replaceAll('\\', '/'));
  if (normalizado.startsWith('../') || normalizado === '..' || normalizado.startsWith('/') || !normalizado.startsWith('docs/')) {
    throw new Error(`state.yaml inválido: caminho fora de docs/: ${caminho}`);
  }
  const ext = extname(normalizado).toLowerCase();
  if (!EXTENSOES.has(ext)) throw new Error(`state.yaml inválido: extensão não suportada em ${caminho}`);
  return normalizado;
}

function rotaPara(ref: { arquivo: string; categoria: ArquivoUc12['categoria']; fase?: string }): string {
  switch (ref.categoria) {
    case 'estado': return '/uc12/state/';
    case 'contrato': return '/uc12/contrato/';
    case 'documento': return '/uc12/documento/';
    case 'relatorio': return `/uc12/relatorios/${basename(ref.arquivo, extname(ref.arquivo))}/`;
    case 'evidencia': {
      const subcaminho = relative('docs/uc/uc12/evidencias', ref.arquivo).replaceAll(sep, '/');
      const pasta = dirname(subcaminho) === '.' ? '' : `${dirname(subcaminho)}/`;
      return `/uc12/evidencias/${pasta}${basename(subcaminho, extname(subcaminho))}/`;
    }
  }
}

export function inventariarUc12(estado: unknown, arquivosExistentes: ReadonlySet<string>, referenciasCurso: readonly string[] = []): ArquivoUc12[] {
  const rotas = new Set<string>();
  const arquivos = new Set<string>();
  const refs = caminhosDoEstado(estado);
  const citadosNoEstado = new Set(refs.map((ref) => ref.arquivo));
  for (const citado of referenciasCurso) {
    const arquivo = canonizarArquivo(citado);
    if (citadosNoEstado.has(arquivo)) continue;
    const fase = arquivo.match(/^docs\/uc\/uc12\/evidencias\/([^/]+)\//)?.[1];
    if (!fase) throw new Error(`referência de módulo fora do UC12 permitido: ${arquivo}`);
    refs.push({ arquivo, categoria: 'evidencia', fase });
    citadosNoEstado.add(arquivo);
  }
  return refs.map((ref) => {
    const arquivo = canonizarArquivo(ref.arquivo);
    if (arquivos.has(arquivo)) throw new Error(`state.yaml inválido: caminho repetido ${arquivo}`);
    arquivos.add(arquivo);
    if (!arquivosExistentes.has(arquivo)) throw new Error(`state.yaml cita arquivo inexistente: ${arquivo}`);
    const rota = rotaPara({ ...ref, arquivo });
    if (rotas.has(rota)) throw new Error(`state.yaml inválido: duas fontes apontam para a rota ${rota}`);
    rotas.add(rota);
    const ext = extname(arquivo).toLowerCase();
    return {
      arquivo,
      rota,
      formato: ext === '.md' ? 'markdown' : ext === '.yaml' ? 'yaml' : 'texto',
      categoria: ref.categoria,
      ...(ref.fase ? { fase: ref.fase } : {}),
      titulo: ref.categoria === 'estado' ? 'Estado do UC12'
        : ref.categoria === 'contrato' ? 'Contrato do UC12'
          : ref.categoria === 'documento' ? 'Documento do UC12 — Cadastrar Produto'
            : ref.categoria === 'relatorio' ? `Relatório da fase ${ref.fase}`
              : `Evidência da fase ${ref.fase}: ${basename(arquivo, extname(arquivo))}`,
      ...(ext === '.md' ? { idMarkdown: arquivo.slice('docs/'.length) } : {}),
    };
  });
}

function arquivosDeDocs(diretorio: string): string[] {
  return readdirSync(diretorio, { withFileTypes: true }).flatMap((entrada) => {
    const caminho = join(diretorio, entrada.name);
    if (entrada.isSymbolicLink()) throw new Error(`link simbólico não permitido no conteúdo UC12: ${caminho}`);
    return entrada.isDirectory() ? arquivosDeDocs(caminho) : [caminho];
  });
}

export function carregarInventarioUc12(): ArquivoUc12[] {
  const estado = parse(readFileSync(ARQUIVOS_DO_ESTADO, 'utf8')) as unknown;
  const existentes = new Set(
    arquivosDeDocs(RAIZ_DOCS).filter((caminho) => statSync(caminho).isFile())
      .map((caminho) => relative(RAIZ_CELILAC, caminho).replaceAll(sep, '/')),
  );
  return inventariarUc12(estado, existentes, caminhosCitadosNoCurso());
}

export interface PaginaDeCursoUc12 {
  dados: { id: string; tipo: string; titulo: string };
  body?: string;
}

export function modulosQueCitam(arquivo: string, paginas: readonly PaginaDeCursoUc12[], inventario: readonly ArquivoUc12[]) {
  const rotaAlvo = inventario.find((item) => item.arquivo === arquivo)?.rota;
  if (!rotaAlvo) return [];
  return paginas
    .filter((pagina) => ['modulo', 'apoio', 'projeto'].includes(pagina.dados.tipo))
    .filter((pagina) => [...(pagina.body ?? '').matchAll(/`([^`\r\n]+)`/g)].some(([, ref]) => {
      const item = inventario.find((destino) => destino.arquivo === ref);
      return item?.rota === rotaAlvo;
    }))
    .map((pagina) => ({ id: pagina.dados.id, titulo: pagina.dados.titulo, rota: `/${pagina.dados.id}/` }));
}

export function arquivosDeMarkdownDoInventario(inventario: readonly ArquivoUc12[]): Set<string> {
  return new Set(inventario.flatMap((item) => item.idMarkdown ? [item.idMarkdown] : []));
}

export function raizDoConteudoUc12() {
  return RAIZ_DOCS;
}

export function conteudoTextoUc12(arquivo: string): string {
  const canonico = canonizarArquivo(arquivo);
  const absoluto = resolve(RAIZ_CELILAC, canonico);
  const caminhoReal = realpathSync(absoluto);
  const relativo = relative(RAIZ_DOCS, caminhoReal);
  if (relativo.startsWith(`..${sep}`) || relativo === '..' || isAbsolute(relativo)) throw new Error('caminho fora de docs/');
  if (!existsSync(absoluto) || !statSync(absoluto).isFile()) throw new Error(`arquivo UC12 inexistente: ${canonico}`);
  return readFileSync(absoluto, 'utf8');
}
