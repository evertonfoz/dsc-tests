export const CHAVE_DADOS = 'curso-app.dados';
export const VERSAO_ESQUEMA = 1 as const;
export const TAMANHO_MAXIMO_IMPORTACAO = 2 * 1024 * 1024;

export interface ItemChecklist {
  texto: string;
  marcado: boolean;
  em: string;
}

export interface ProgressoConteudo {
  lido?: { em: string };
  tentativa?: { texto: string; em: string };
  gabarito?: { liberadoEm: string; motivo: 'tentativa' | 'antecipado' };
  checklist?: Record<string, ItemChecklist>;
}

export interface DadosCurso {
  versao: 1;
  meta: {
    commitConteudoCriacao: string;
    commitConteudoUltimaGravacao: string;
    criadoEm: string;
    atualizadoEm: string;
    avisoArmazenamentoMostrado?: boolean;
  };
  conteudos: Record<string, ProgressoConteudo>;
  preferencias: Record<string, unknown>;
  legado: Record<string, unknown>;
}

export function dadosVazios(commit: string, agora = new Date().toISOString()): DadosCurso {
  return {
    versao: VERSAO_ESQUEMA,
    meta: {
      commitConteudoCriacao: commit,
      commitConteudoUltimaGravacao: commit,
      criadoEm: agora,
      atualizadoEm: agora,
    },
    conteudos: {},
    preferencias: {},
    legado: {},
  };
}

export function chaveChecklist(texto: string): string {
  const normalizado = texto.normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR');
  // FNV-1a é só uma chave estável de identidade do texto, não uma assinatura de segurança.
  let hash = 0x811c9dc5;
  for (const caractere of normalizado) {
    hash ^= caractere.codePointAt(0)!;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function validarDados(valor: unknown): DadosCurso {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new Error('O arquivo precisa conter um objeto JSON.');
  const dado = valor as Partial<DadosCurso>;
  if (dado.versao !== VERSAO_ESQUEMA) throw new Error(`Versão de arquivo não reconhecida: ${String(dado.versao ?? 'ausente')}.`);
  if (!dado.meta || typeof dado.meta !== 'object' || Array.isArray(dado.meta)) throw new Error('O arquivo não contém metadados válidos.');
  if (!dado.conteudos || typeof dado.conteudos !== 'object' || Array.isArray(dado.conteudos)) throw new Error('O arquivo não contém progresso válido.');
  if (!dado.preferencias || typeof dado.preferencias !== 'object' || Array.isArray(dado.preferencias)) throw new Error('O arquivo não contém preferências válidas.');
  if (dado.legado !== undefined && (!dado.legado || typeof dado.legado !== 'object' || Array.isArray(dado.legado))) throw new Error('O campo legado precisa ser um objeto.');
  const meta = dado.meta as DadosCurso['meta'];
  if (typeof meta.commitConteudoCriacao !== 'string' || typeof meta.commitConteudoUltimaGravacao !== 'string' || typeof meta.criadoEm !== 'string' || typeof meta.atualizadoEm !== 'string') {
    throw new Error('Os metadados de versão ou data estão incompletos.');
  }
  const texto = JSON.stringify(valor);
  if (new TextEncoder().encode(texto).byteLength > TAMANHO_MAXIMO_IMPORTACAO) throw new Error('O arquivo ultrapassa o limite de 2 MiB.');
  const chaveValida = (chave: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(chave);
  for (const [id, estado] of Object.entries(dado.conteudos)) {
    if (!chaveValida(id) || !estado || typeof estado !== 'object' || Array.isArray(estado)) throw new Error(`Registro de conteúdo inválido: ${id}.`);
    const item = estado as ProgressoConteudo;
    if (item.lido && (typeof item.lido !== 'object' || typeof item.lido.em !== 'string')) throw new Error(`Data de leitura inválida em ${id}.`);
    if (item.tentativa && (typeof item.tentativa !== 'object' || typeof item.tentativa.texto !== 'string' || typeof item.tentativa.em !== 'string')) throw new Error(`Tentativa inválida em ${id}.`);
    if (item.gabarito && (typeof item.gabarito !== 'object' || typeof item.gabarito.liberadoEm !== 'string' || !['tentativa', 'antecipado'].includes(item.gabarito.motivo))) throw new Error(`Liberação de gabarito inválida em ${id}.`);
    if (item.checklist !== undefined) {
      if (!item.checklist || typeof item.checklist !== 'object' || Array.isArray(item.checklist)) throw new Error(`Checklist inválido em ${id}.`);
      for (const [chave, check] of Object.entries(item.checklist)) {
        if (!/^[a-f0-9]{8}$/.test(chave) || !check || typeof check.texto !== 'string' || typeof check.marcado !== 'boolean' || typeof check.em !== 'string') throw new Error(`Item de checklist inválido em ${id}.`);
      }
    }
  }
  for (const chave of Object.keys((dado.legado ?? {}) as Record<string, unknown>)) if (!chaveValida(chave)) throw new Error(`Chave legada inválida: ${chave}.`);
  return {
    versao: 1,
    meta: { ...meta },
    conteudos: structuredClone(dado.conteudos as Record<string, ProgressoConteudo>),
    preferencias: structuredClone(dado.preferencias as Record<string, unknown>),
    legado: structuredClone((dado.legado ?? {}) as Record<string, unknown>),
  };
}

/** Prepara a expansão v1→v2 do M4 sem descartar nenhum campo nem registro. */
export function migrarV1ParaV2(dadosV1: DadosCurso): Omit<DadosCurso, 'versao'> & { versao: 2; projeto: Record<string, unknown>; casoDeUso: Record<string, unknown>; passos: Record<string, unknown>; fases: Record<string, unknown> } {
  return {
    ...structuredClone(dadosV1),
    versao: 2,
    projeto: {},
    casoDeUso: {},
    passos: {},
    fases: {},
  };
}

/** Registros cujo id sumiu do conteúdo atual continuam exportáveis e visíveis ao aluno. */
export function separarIdsLegados(dados: DadosCurso, idsAtuais: ReadonlySet<string>): DadosCurso {
  const saida = structuredClone(dados);
  saida.legado = Object.assign(Object.create(null), saida.legado) as Record<string, unknown>;
  for (const [id, progresso] of Object.entries(saida.conteudos)) {
    if (idsAtuais.has(id)) continue;
    saida.legado[id] = progresso;
    delete saida.conteudos[id];
  }
  return saida;
}
