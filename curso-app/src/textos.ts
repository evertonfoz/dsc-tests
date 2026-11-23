// Todos os textos da interface num só arquivo, para revisão de tom sem ler código (E7, seção 8.2).
export const textos = {
  nomeDoSite: 'Curso: implementando um caso de uso com evidência',
  pularParaConteudo: 'Pular para o conteúdo',
  navegacao: 'Navegação principal',
  linkIndice: 'Apresentação',
  linkSiglas: 'Consultar siglas',
  linkMapa: 'Ver a sequência do curso',
  avisoEmConstrucao:
    'Versão em construção: dá para ler o curso inteiro. Ainda não há registro de progresso, gabaritos, prática guiada com os dados do seu projeto nem o kit inicial; eles chegam nas próximas versões.',
  rodapeOrigem: (commitCurto: string, data: string) => `Conteúdo do commit ${commitCurto} (${data}).`,
  rodapeSemOrigem: 'Conteúdo de commit a confirmar (construção sem commit de origem informado).',
  rodapeNota: 'A aplicação não tem acesso à internet e não sabe se existe versão mais nova.',

  // Avisos de honestidade (plano do M1, seção 8).
  tituloAvisos: 'Antes de começar: limites deste curso',
  avisosDeHonestidade: [
    'Só o tipo de caso de uso "criar" (cadastrar algo) foi validado em um caso real, o UC12 (caso de uso 12 do projeto CeliLac). Para consultar, atualizar, excluir ou autenticar, os guias são esboços.',
    'As durações e o esforço indicados são estimativas do material, ainda não testadas com turmas.',
    'A prática exige Docker instalado na sua máquina.',
  ],

  // Cabeçalho de cada página, gerado do front matter.
  tipo: 'Tipo',
  tipos: { modulo: 'Módulo', apoio: 'Apoio', projeto: 'Projeto final', pratica: 'Prática' } as Record<string, string>,
  duracao: 'Duração sugerida',
  duracaoNota: 'estimativa, não testada com turmas',
  pede: 'Pede antes',
  pedeNada: 'nada; pode começar por aqui',
  sePrecisar: 'Se precisar',
  voltarAoModulo: (titulo: string) => `Voltar a: ${titulo}`,

  // Navegação no fim da página.
  sequencia: 'Sequência do curso',
  anterior: 'Anterior',
  proximo: 'Próximo',

  // Mapa.
  tituloMapa: 'Mapa dos módulos',
  introducaoMapa:
    'Os módulos e apoios na ordem sugerida. "Pede antes" lista o que convém ter estudado; "se precisar" é o que vale estudar só se faltar a base.',

  // Conversão do conteúdo.
  rotuloDaTabela: (n: number) => `Tabela ${n} (role para os lados se não couber)`,
  abreNoGithub: 'abre no GitHub, fora desta aplicação',
} as const;
