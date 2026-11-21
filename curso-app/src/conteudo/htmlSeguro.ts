/** Sätteri mantém HTML cru como nós `raw`; convertê-los em texto evita que conteúdo do repositório vire DOM executável. */
export const htmlCruComoTexto = {
  name: 'html-cru-como-texto',
  raw(no: { value?: string }, ctx: { replaceNode(no: unknown, novo: { type: 'text'; value: string }): void }) {
    ctx.replaceNode(no, { type: 'text', value: no.value ?? '' });
  },
};
