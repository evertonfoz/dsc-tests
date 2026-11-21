// Todos os textos da interface num só arquivo, para revisão de tom sem ler código (E7, seção 8.2).
export const textos = {
  nomeDoSite: 'Curso: implementando um caso de uso com evidência',
  pularParaConteudo: 'Pular para o conteúdo',
  navegacao: 'Navegação principal',
  linkIndice: 'Índice do curso',
  linkMapa: 'Mapa dos módulos',
  linkUc12: 'Caso real UC12',
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
  pratica: 'Prática deste módulo',

  // Prática (só leitura no M1).
  notaDaPratica:
    'Nesta versão, a prática é só para leitura. Os campos para suas respostas, os dados do seu projeto no lugar de {{variavel}} e o botão de copiar chegam numa próxima versão.',
  voltarAoModulo: (titulo: string) => `Voltar a: ${titulo}`,

  // Navegação no fim da página.
  sequencia: 'Sequência do curso',
  anterior: 'Anterior',
  proximo: 'Próximo',

  // Mapa.
  tituloMapa: 'Mapa dos módulos',
  introducaoMapa:
    'Os módulos e apoios na ordem sugerida. "Pede antes" lista o que convém ter estudado; "se precisar" é o que vale estudar só se faltar a base.',
  tituloGrafo: 'Grafo de pré-requisitos',
  legendaObrigatorio: 'Linha contínua: pré-requisito recomendado.',
  legendaCondicional: 'Linha tracejada: conteúdo para estudar se precisar.',
  descricaoGrafo: 'Desenho dos pré-requisitos. A lista completa abaixo também funciona com teclado e leitor de tela.',
  tituloListaMapa: 'Lista detalhada dos módulos e pré-requisitos',

  // Conversão do conteúdo.
  rotuloDaTabela: (n: number) => `Tabela ${n} (role para os lados se não couber)`,
  abreNoGithub: 'abre em nova guia no GitHub, fora desta aplicação',

  // UC12 navegável (M2, E7).
  uc12Titulo: 'UC12 — Cadastrar Produto',
  uc12Resumo: 'Registro do caso de uso de referência do curso. Os relatórios preservam o momento de cada fase; o estado atual está no arquivo',
  uc12Documentos: 'Documentos principais',
  uc12RelatoriosEvidencias: 'Relatórios e evidências por fase',
  uc12DocumentosNav: 'Documentos do UC12',
  uc12Navegacao: 'Navegação do UC12',
  uc12ModulosH: 'Módulos relacionados',
  uc12Home: 'UC12 — Cadastrar Produto',
  uc12Estado: 'Estado atual',
  uc12ArquivosDoEstado: 'Arquivos citados no estado do UC12',
  uc12ArquivosTitulo: 'Arquivos deste estado',
  uc12ModulosRelacionados: 'Módulos que citam este arquivo',
  uc12Arquivo: 'Arquivo',
  uc12Fase: 'Fase',
} as const;
