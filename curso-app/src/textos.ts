// Todos os textos da interface num só arquivo, para revisão de tom sem ler código (E7, seção 8.2).
export const textos = {
  nomeDoSite: 'Curso: implementando um caso de uso com evidência',
  pularParaConteudo: 'Pular para o conteúdo',
  navegacao: 'Navegação principal',
  linkIndice: 'Índice do curso',
  linkM00: 'Módulo 0',
  avisoEmConstrucao:
    'Versão em construção: só o índice e o módulo 0 estão disponíveis. Os links para outros arquivos do curso ainda não funcionam nesta aplicação; leia-os no repositório.',
  rodapeOrigem: (commitCurto: string, data: string) => `Conteúdo do commit ${commitCurto} (${data}).`,
  rodapeSemOrigem: 'Conteúdo de commit a confirmar (construção sem commit de origem informado).',
  rodapeNota: 'A aplicação não tem acesso à internet e não sabe se existe versão mais nova.',
} as const;
