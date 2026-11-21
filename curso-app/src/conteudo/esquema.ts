// Esquema do front matter dos arquivos do curso (E2, seção 3; campos acrescentados na E3, parte 1).
// Objetos estritos: campo desconhecido falha (pega erro de digitação como "prerequisito").
import { z } from 'astro/zod';

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'use só letras minúsculas, números e hífen');
const listaDeIds = z.array(id);

const percurso = z.strictObject({
  id,
  tipo: z.enum(['modulo', 'apoio', 'projeto']),
  titulo: z.string().min(1),
  ordem: z.number().int().min(1),
  prerequisitos: listaDeIds,
  prerequisitos_se_precisar: listaDeIds.optional(),
  duracao: z.string().min(1),
  gabarito: id.optional(),
  pratica: id.optional(),
  substitui: listaDeIds.optional(),
});

const gabarito = z.strictObject({
  id,
  tipo: z.literal('gabarito'),
  titulo: z.string().min(1),
  gabarito_de: listaDeIds.min(1),
});

const pratica = z.strictObject({
  id,
  tipo: z.literal('pratica'),
  titulo: z.string().min(1),
  pratica_de: id,
});

export const esquemaFrontMatter = z.discriminatedUnion('tipo', [percurso, gabarito, pratica]);

export type FrontMatter = z.infer<typeof esquemaFrontMatter>;
export type FrontMatterPercurso = z.infer<typeof percurso>;
