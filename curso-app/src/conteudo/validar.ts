// Regras entre arquivos do curso (plano do M0, seção 4.2). Função pura: não lê disco.
// Devolve todos os problemas de uma vez, uma mensagem por problema, com o arquivo e o campo.
import { esquemaFrontMatter, type FrontMatter } from './esquema';

export interface ArquivoDoCurso {
  /** Nome do arquivo, por exemplo "m00-o-caso-pronto.md". */
  arquivo: string;
  /** Front matter ainda não validado. */
  dados: unknown;
}

const PREFIXO = 'conteúdo inválido';

function msg(arquivo: string, campo: string, motivo: string): string {
  return `${PREFIXO}: ${arquivo}: ${campo}: ${motivo}`;
}

/** Valida cada arquivo pelo esquema (seção 4.1). */
export function validarEsquema(arquivos: ArquivoDoCurso[]): { erros: string[]; validos: Array<{ arquivo: string; dados: FrontMatter }> } {
  const erros: string[] = [];
  const validos: Array<{ arquivo: string; dados: FrontMatter }> = [];
  for (const { arquivo, dados } of arquivos) {
    const r = esquemaFrontMatter.safeParse(dados);
    if (r.success) {
      validos.push({ arquivo, dados: r.data });
      continue;
    }
    for (const issue of r.error.issues) {
      const campo = issue.path.length ? issue.path.join('.') : '(front matter)';
      if (issue.code === 'unrecognized_keys') {
        for (const chave of issue.keys) erros.push(msg(arquivo, chave, 'campo desconhecido'));
      } else if (issue.code === 'invalid_type' && issue.input === undefined) {
        erros.push(msg(arquivo, campo, 'campo obrigatório ausente'));
      } else {
        erros.push(msg(arquivo, campo, issue.message));
      }
    }
  }
  return { erros, validos };
}

/** Regras entre arquivos (seção 4.2), sobre arquivos que já passaram no esquema. */
export function validarRelacoes(
  validos: Array<{ arquivo: string; dados: FrontMatter }>,
  /** ids de arquivos que falharam no esquema: existem, mas não entram nas demais regras (evita erro em cascata). */
  idsInvalidos: ReadonlySet<string> = new Set(),
): string[] {
  const erros: string[] = [];
  const porId = new Map<string, { arquivo: string; dados: FrontMatter }>();

  // 1. id único e igual ao início do nome do arquivo.
  for (const v of validos) {
    const nome = v.arquivo.replace(/\.md$/, '');
    if (nome !== v.dados.id && !nome.startsWith(`${v.dados.id}-`)) {
      erros.push(msg(v.arquivo, 'id', `"${v.dados.id}" não corresponde ao nome do arquivo`));
    }
    const outro = porId.get(v.dados.id);
    if (outro) erros.push(msg(v.arquivo, 'id', `"${v.dados.id}" repetido (também em ${outro.arquivo})`));
    else porId.set(v.dados.id, v);
  }

  // 2. ordem única entre módulos, apoios e projeto.
  const porOrdem = new Map<number, string>();
  for (const v of validos) {
    if (!('ordem' in v.dados)) continue;
    const outro = porOrdem.get(v.dados.ordem);
    if (outro) erros.push(msg(v.arquivo, 'ordem', `${v.dados.ordem} repetida (também em ${outro})`));
    else porOrdem.set(v.dados.ordem, v.arquivo);
  }

  // 3. referências existem; substitui aponta para id que não existe mais.
  const existe = (alvo: string) => porId.has(alvo) || idsInvalidos.has(alvo);
  const conferir = (v: { arquivo: string }, campo: string, alvos: string[] | undefined) => {
    for (const alvo of alvos ?? []) if (!existe(alvo)) erros.push(msg(v.arquivo, campo, `"${alvo}" não existe`));
  };
  for (const v of validos) {
    const d = v.dados;
    if (d.tipo === 'gabarito') {
      conferir(v, 'gabarito_de', d.gabarito_de);
    } else if (d.tipo === 'pratica') {
      conferir(v, 'pratica_de', [d.pratica_de]);
    } else {
      conferir(v, 'prerequisitos', d.prerequisitos);
      conferir(v, 'prerequisitos_se_precisar', d.prerequisitos_se_precisar);
      conferir(v, 'gabarito', d.gabarito ? [d.gabarito] : undefined);
      conferir(v, 'pratica', d.pratica ? [d.pratica] : undefined);
      for (const antigo of d.substitui ?? []) {
        if (existe(antigo)) erros.push(msg(v.arquivo, 'substitui', `"${antigo}" ainda existe; substitui só vale para id renomeado`));
      }
    }
  }

  // 4. reciprocidade gabarito ↔ gabarito_de e pratica ↔ pratica_de.
  for (const v of validos) {
    const d = v.dados;
    if (d.tipo === 'gabarito') {
      for (const alvo of d.gabarito_de) {
        const a = porId.get(alvo)?.dados;
        if (a && (a.tipo === 'gabarito' || a.tipo === 'pratica' || a.gabarito !== d.id)) {
          erros.push(msg(v.arquivo, 'gabarito_de', `"${alvo}" não declara gabarito: ${d.id}`));
        }
      }
    } else if (d.tipo === 'pratica') {
      const a = porId.get(d.pratica_de)?.dados;
      if (a && (a.tipo === 'gabarito' || a.tipo === 'pratica' || a.pratica !== d.id)) {
        erros.push(msg(v.arquivo, 'pratica_de', `"${d.pratica_de}" não declara pratica: ${d.id}`));
      }
    } else {
      if (d.gabarito) {
        const g = porId.get(d.gabarito)?.dados;
        if (g && (g.tipo !== 'gabarito' || !g.gabarito_de.includes(d.id))) {
          erros.push(msg(v.arquivo, 'gabarito', `"${d.gabarito}" não declara gabarito_de: ${d.id}`));
        }
      }
      if (d.pratica) {
        const p = porId.get(d.pratica)?.dados;
        if (p && (p.tipo !== 'pratica' || p.pratica_de !== d.id)) {
          erros.push(msg(v.arquivo, 'pratica', `"${d.pratica}" não declara pratica_de: ${d.id}`));
        }
      }
    }
  }

  // 5. sem ciclo no grafo de pré-requisitos (os condicionais entram também).
  const arestas = new Map<string, string[]>();
  for (const v of validos) {
    const d = v.dados;
    if (d.tipo === 'gabarito' || d.tipo === 'pratica') continue;
    arestas.set(d.id, [...d.prerequisitos, ...(d.prerequisitos_se_precisar ?? [])].filter(existe));
  }
  const estado = new Map<string, 'visitando' | 'feito'>();
  const ciclos = new Set<string>();
  const visitar = (no: string, caminho: string[]) => {
    estado.set(no, 'visitando');
    for (const prox of arestas.get(no) ?? []) {
      if (estado.get(prox) === 'visitando') {
        // Gira o ciclo para começar pelo menor id: o mesmo ciclo é relatado uma só vez.
        const nos = caminho.slice(caminho.indexOf(prox));
        const inicio = nos.indexOf([...nos].sort()[0]!);
        const girado = [...nos.slice(inicio), ...nos.slice(0, inicio)];
        ciclos.add(`${PREFIXO}: ciclo em prerequisitos: ${[...girado, girado[0]].join(' → ')}`);
      } else if (!estado.has(prox)) {
        visitar(prox, [...caminho, prox]);
      }
    }
    estado.set(no, 'feito');
  };
  for (const no of [...arestas.keys()].sort()) if (!estado.has(no)) visitar(no, [no]);
  erros.push(...ciclos);

  return erros;
}

/** Validação completa: esquema por arquivo e, se possível, relações entre arquivos. */
export function validarConteudo(arquivos: ArquivoDoCurso[]): string[] {
  const { erros, validos } = validarEsquema(arquivos);
  const idsValidos = new Set(validos.map((v) => v.dados.id));
  const idsInvalidos = new Set(
    arquivos
      .map((a) => (a.dados as { id?: unknown } | null)?.id)
      .filter((id): id is string => typeof id === 'string' && !idsValidos.has(id)),
  );
  return [...erros, ...validarRelacoes(validos, idsInvalidos)];
}
