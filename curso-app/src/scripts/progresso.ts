import {
  CHAVE_DADOS,
  dadosVazios,
  chaveChecklist,
  separarIdsLegados,
  validarDados,
  type DadosCurso,
  type ProgressoConteudo,
} from '../dados/modelo';

const ids = new Set((document.body.dataset.idsConteudo ?? '').split(',').filter(Boolean));
const commit = document.querySelector('[data-origem-commit]')?.getAttribute('data-origem-commit') ?? 'a-confirmar';
const mensagem = document.querySelector<HTMLElement>('[data-mensagem-progresso]');
let dados = dadosVazios(commit);

function avisar(texto: string) {
  if (!mensagem) return;
  mensagem.textContent = texto;
  mensagem.hidden = false;
}

function ler(): DadosCurso {
  const bruto = localStorage.getItem(CHAVE_DADOS);
  if (!bruto) return dadosVazios(commit);
  try {
    return separarIdsLegados(validarDados(JSON.parse(bruto)), ids);
  } catch (erro) {
    avisar(`Não consegui ler os dados salvos: ${erro instanceof Error ? erro.message : 'formato inválido'}. Exporte uma cópia do navegador antes de limpar o armazenamento.`);
    return dadosVazios(commit);
  }
}

function salvar() {
  dados.meta.atualizadoEm = new Date().toISOString();
  dados.meta.commitConteudoUltimaGravacao = commit;
  try {
    localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
    if (!dados.meta.avisoArmazenamentoMostrado) {
      dados.meta.avisoArmazenamentoMostrado = true;
      localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
      avisar('Seu progresso fica neste navegador e endereço. Exporte uma cópia; em computador compartilhado, apague seus dados ao sair.');
    }
    atualizarResumo();
    return true;
  } catch {
    avisar('O navegador não conseguiu gravar os dados. Nada foi descartado; exporte uma cópia e libere espaço antes de tentar novamente.');
    return false;
  }
}

function registro(id: string): ProgressoConteudo {
  return (dados.conteudos[id] ??= {});
}

function gabaritoLiberado(associados: string[]): boolean {
  return associados.some((associado) => Boolean(dados.conteudos[associado]?.gabarito));
}

function atualizarResumo() {
  const todos = [...ids];
  const lidos = todos.filter((id) => dados.conteudos[id]?.lido).length;
  const tentativas = todos.filter((id) => dados.conteudos[id]?.tentativa?.texto.trim()).length;
  const declaracoes = todos.reduce((soma, id) => soma + Object.values(dados.conteudos[id]?.checklist ?? {}).filter((item) => item.marcado).length, 0);
  const textoResumo = `${lidos} conteúdos declarados como lidos; ${tentativas} tentativas registradas; ${declaracoes} itens declarados por você.`;
  for (const resumo of document.querySelectorAll<HTMLElement>('[data-resumo-progresso-global], [data-resumo-progresso-pagina]')) resumo.textContent = textoResumo;
  const legado = document.querySelector<HTMLElement>('[data-legado]');
  if (legado && Object.keys(dados.legado).length) legado.textContent = JSON.stringify(dados.legado, null, 2);

  for (const item of document.querySelectorAll<HTMLElement>('[data-progresso-para]')) {
    const id = item.dataset.progressoPara!;
    const registroAtual = dados.conteudos[id];
    item.textContent = registroAtual?.lido ? 'Leitura declarada por você' : 'Ainda não declarado como lido';
    item.dataset.declarado = registroAtual?.lido ? 'true' : 'false';
    item.classList.toggle('declarado', Boolean(registroAtual?.lido));
  }

  for (const no of document.querySelectorAll<SVGElement>('[data-no]')) {
    const requisitos = [...(no.dataset.prerequisitos ?? '').split(','), ...(no.dataset.condicionais ?? '').split(',')].filter(Boolean);
    const falta = requisitos.filter((dep) => !dados.conteudos[dep]?.lido);
    no.dataset.falta = falta.join(',');
    no.classList.toggle('com-pendencias', falta.length > 0);
    const titulo = no.querySelector('title');
    if (titulo) titulo.textContent = falta.length ? `Ainda não declarado: ${falta.join(', ')}` : 'Pré-requisitos declarados por você';
  }
}

function inserirProgressoDaPagina() {
  const alvo = document.querySelector<HTMLElement>('[data-conteudo-id]');
  if (!alvo) return;
  const id = alvo.dataset.conteudoId!;
  const associadosDoLink = (alvo.dataset.gabaritoAssociados ?? id).split(',').filter(Boolean);
  const secao = alvo.querySelector<HTMLElement>('[data-progresso-pagina]');
  if (!secao) return;
  if (secao.dataset.tipo === 'gabarito') {
    const associados = (secao.dataset.idsAssociados ?? '').split(',').filter(Boolean);
    const aberto = gabaritoLiberado(associados);
    const conteudo = alvo.querySelector<HTMLElement>('[data-corpo-gabarito]');
    if (conteudo) conteudo.hidden = !aberto;
    if (aberto && conteudo) {
      const associado = associados.find((item) => dados.conteudos[item]?.gabarito);
      if (associado) {
        const progresso = dados.conteudos[associado]!;
        const tentativa = document.createElement('aside');
        tentativa.className = 'aviso';
        const titulo = document.createElement('h2');
        titulo.textContent = progresso.tentativa ? 'Sua tentativa registrada' : 'Gabarito aberto antecipadamente';
        tentativa.append(titulo);
        if (progresso.tentativa) {
          const texto = document.createElement('pre');
          texto.textContent = progresso.tentativa.texto;
          tentativa.append(texto);
        } else {
          const texto = document.createElement('p');
          texto.textContent = 'Você escolheu ver o gabarito antes de registrar uma tentativa.';
          tentativa.append(texto);
        }
        conteudo.prepend(tentativa);
      }
    }
    if (!aberto) {
      const trava = document.createElement('p');
      trava.className = 'aviso';
      trava.setAttribute('role', 'status');
      trava.textContent = 'Este gabarito ainda não foi liberado neste navegador. Abra-o a partir do módulo depois de registrar uma tentativa ou escolha a abertura antecipada.';
      secao.append(trava);
    }
    return;
  }

  const atual = registro(id);
  const acoes = document.createElement('section');
  acoes.className = 'progresso';
  acoes.setAttribute('aria-label', 'Seu registro pessoal neste conteúdo');
  const lido = document.createElement('button');
  lido.type = 'button';
  lido.textContent = atual.lido ? 'Atualizar data de leitura declarada' : 'Declarar que li este conteúdo';
  lido.addEventListener('click', () => {
    registro(id).lido = { em: new Date().toISOString() };
    if (salvar()) lido.textContent = 'Atualizar data de leitura declarada';
  });
  const nota = document.createElement('p');
  nota.className = 'nota';
  nota.textContent = 'Registro pessoal declarado por você; a aplicação não confere se o conteúdo foi lido.';
  acoes.append(lido, nota);
  secao.prepend(acoes);

  for (const titulo of alvo.querySelectorAll<HTMLHeadingElement>('h2')) {
    const tituloNormalizado = titulo.textContent?.normalize('NFKC').toLocaleLowerCase('pt-BR') ?? '';
    if (!/antes de ler a solução/.test(tituloNormalizado)) continue;
    const bloco = document.createElement('section');
    bloco.className = 'tentativa';
    const rotulo = document.createElement('label');
    const area = document.createElement('textarea');
    area.rows = 5;
    area.maxLength = 20_000;
    area.id = `tentativa-${id}`;
    rotulo.htmlFor = area.id;
    rotulo.textContent = 'Minha tentativa (a aplicação não avalia o texto)';
    area.value = registro(id).tentativa?.texto ?? '';
    const privacidade = document.createElement('p');
    privacidade.className = 'nota';
    privacidade.textContent = 'Não inclua senhas, tokens nem dados pessoais de outras pessoas. O texto fica neste navegador.';
    const salvarTentativa = document.createElement('button');
    salvarTentativa.type = 'button';
    salvarTentativa.textContent = 'Registrar tentativa e liberar gabarito';
    salvarTentativa.addEventListener('click', () => {
      const texto = area.value.trim();
      if (!texto) {
        avisar('Escreva alguma coisa na tentativa ou use a abertura antecipada do gabarito.');
        area.focus();
        return;
      }
      const item = registro(id);
      item.tentativa = { texto, em: new Date().toISOString() };
      if (entrada.gabarito) item.gabarito = { liberadoEm: new Date().toISOString(), motivo: 'tentativa' };
      if (salvar()) {
        salvarTentativa.textContent = 'Tentativa registrada';
        linkGabarito.hidden = !entrada.gabarito || !gabaritoLiberado(associadosDoLink);
      }
    });
    const linkGabarito = document.createElement('a');
    linkGabarito.href = entrada.gabarito ? `/${entrada.gabarito}/` : '#';
    linkGabarito.textContent = 'Abrir o gabarito deste conteúdo';
    linkGabarito.hidden = !entrada.gabarito || !gabaritoLiberado(associadosDoLink);
    const antecipado = document.createElement('button');
    antecipado.type = 'button';
    antecipado.textContent = 'Abrir gabarito antes da tentativa';
    antecipado.hidden = !entrada.gabarito;
    antecipado.addEventListener('click', () => {
      if (!confirm('Abrir agora revela a solução e você perde a atividade “Antes de ler a solução”. Registrar essa decisão?')) return;
      registro(id).gabarito = { liberadoEm: new Date().toISOString(), motivo: 'antecipado' };
      if (salvar()) linkGabarito.hidden = !gabaritoLiberado(associadosDoLink);
    });
    if (registro(id).gabarito?.motivo === 'antecipado') {
      const avisoAntecipado = document.createElement('p');
      avisoAntecipado.className = 'nota';
      avisoAntecipado.textContent = 'Este gabarito foi aberto antes da tentativa, por decisão registrada por você.';
      bloco.append(avisoAntecipado);
    }
    bloco.append(rotulo, area, privacidade, salvarTentativa, linkGabarito, antecipado);
    titulo.after(bloco);
  }

  const headings = [...alvo.querySelectorAll<HTMLHeadingElement>('h2')];
  for (const checkbox of alvo.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')) {
    const heading = headings.filter((h) => Boolean(h.compareDocumentPosition(checkbox) & Node.DOCUMENT_POSITION_FOLLOWING)).at(-1);
    if (!heading || !/como saber que funcionou/i.test(heading.textContent ?? '')) continue;
    const item = checkbox.closest('li');
    if (!item) continue;
    checkbox.removeAttribute('aria-hidden');
    checkbox.disabled = false;
    const texto = (item.textContent ?? '').replace(/\s+/g, ' ').trim();
    const chave = chaveChecklist(texto);
    const antigos = Object.values(registro(id).checklist ?? {});
    const antigo = registro(id).checklist?.[chave];
    const corresponde = antigo?.texto === texto;
    checkbox.checked = corresponde && antigo.marcado;
    checkbox.setAttribute('aria-label', `Declarado por você: ${texto}`);
    const estado = document.createElement('span');
    estado.className = 'nota checklist-estado';
    estado.textContent = corresponde && antigo.marcado ? 'declarado por você' : 'não declarado';
    item.append(estado);
    const itemAlterado = antigos.find((anterior) => anterior.marcado && anterior.texto !== texto);
    if ((antigo && !corresponde) || itemAlterado) {
      const mudou = document.createElement('span');
      mudou.className = 'nota';
      mudou.textContent = ` — não marcado: o texto deste item mudou desde a marcação anterior${itemAlterado ? ` (“${itemAlterado.texto}”)` : ''}.`;
      item.append(mudou);
    }
    checkbox.addEventListener('change', () => {
      registro(id).checklist ??= {};
      registro(id).checklist![chave] = { texto, marcado: checkbox.checked, em: new Date().toISOString() };
      estado.textContent = checkbox.checked ? 'declarado por você' : 'não declarado';
      salvar();
    });
  }

  if (entrada.gabarito) {
    const aviso = document.createElement('p');
    aviso.className = 'nota';
    aviso.textContent = `O gabarito ${entrada.gabarito} fica disponível neste navegador após registrar uma tentativa não vazia ou confirmar abertura antecipada.`;
    const heading = alvo.querySelector('h1');
    heading?.after(aviso);
  }
}

// O atributo é preenchido no HTML estático pelo gerador; sem HTML executável vindo dos dados.
const entrada = document.querySelector<HTMLElement>('[data-conteudo-id]')?.dataset ?? {};

function nomeArquivo() {
  const data = new Date().toISOString().slice(0, 10);
  return `curso-app-dados-${data}.json`;
}

function baixar(conteudo: string, nome: string) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

function configurarTelaDeDados() {
  const exportar = document.querySelector<HTMLButtonElement>('[data-exportar-tudo]');
  exportar?.addEventListener('click', () => baixar(JSON.stringify(dados, null, 2), nomeArquivo()));

  const importar = document.querySelector<HTMLInputElement>('[data-importar-arquivo]');
  importar?.addEventListener('change', async () => {
    const arquivo = importar.files?.[0];
    if (!arquivo) return;
    try {
      if (arquivo.size > 2 * 1024 * 1024) throw new Error('O arquivo ultrapassa o limite de 2 MiB.');
      const importados = separarIdsLegados(validarDados(JSON.parse(await arquivo.text())), ids);
      if (!confirm('Importar “tudo” substituirá os dados atuais. Antes da troca, será baixada uma cópia do estado atual. Continuar?')) return;
      baixar(JSON.stringify(dados, null, 2), `curso-app-backup-antes-de-importar-${new Date().toISOString().replaceAll(':', '-')}.json`);
      await new Promise((resolver) => setTimeout(resolver, 250));
      dados = importados;
      try {
        localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
      } catch {
        dados = ler();
        throw new Error('O navegador não conseguiu gravar o arquivo importado; os dados anteriores foram mantidos.');
      }
      location.reload();
    } catch (erro) {
      avisar(`Importação recusada: ${erro instanceof Error ? erro.message : 'arquivo inválido'}. Nenhum dado foi substituído.`);
    } finally {
      importar.value = '';
    }
  });

  document.querySelector<HTMLButtonElement>('[data-apagar-dados]')?.addEventListener('click', () => {
    if (!confirm('Apagar todo o progresso salvo neste navegador? Esta ação não pode ser desfeita sem uma cópia exportada.')) return;
    localStorage.removeItem(CHAVE_DADOS);
    location.reload();
  });

  document.querySelector<HTMLButtonElement>('[data-pedir-persistencia]')?.addEventListener('click', async () => {
    if (!navigator.storage?.persist) return avisar('Este navegador não oferece pedido de armazenamento persistente.');
    const concedido = await navigator.storage.persist();
    avisar(concedido ? 'O navegador concedeu armazenamento persistente. Isso reduz a chance de limpeza automática, mas não substitui uma cópia exportada.' : 'O navegador não concedeu armazenamento persistente. Exporte seus dados com frequência.');
  });
}

dados = ler();
for (const link of document.querySelectorAll<HTMLAnchorElement>('a.externo[href^="https://github.com/"]')) {
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
}
inserirProgressoDaPagina();
configurarTelaDeDados();
atualizarResumo();
