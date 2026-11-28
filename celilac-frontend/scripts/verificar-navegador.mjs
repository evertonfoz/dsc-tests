#!/usr/bin/env node
// Conferência das rotas em um Google Chrome sem janela (headless), sem dependências do projeto.
// Usa o protocolo de depuração do Chrome com o WebSocket do próprio Node.
//
// Uso (com o servidor de desenvolvimento já no ar):
//   node scripts/verificar-navegador.mjs http://localhost:5173 [pasta-das-capturas]
// Variável opcional: CHROME_PATH, quando o Chrome está em outro lugar.
// Saída: 0 se as conferências passaram; 1 se alguma falhou; 2 uso incorreto.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as esperar } from 'node:timers/promises';

const base = process.argv[2]?.replace(/\/$/, '');
const pasta = process.argv[3];
if (!base) {
  console.error('Uso: node scripts/verificar-navegador.mjs <endereço> [pasta-das-capturas]');
  process.exit(2);
}
const chrome =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const perfil = mkdtempSync(join(tmpdir(), 'chrome-verificacao-'));
const processo = spawn(
  chrome,
  [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${perfil}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--window-size=1280,800',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let falhas = 0;
function conferir(descricao, passou, obtido) {
  if (!passou) falhas += 1;
  console.log(`  ${passou ? 'OK    ' : 'FALHOU'} ${descricao}${passou ? '' : ` — obtido: ${JSON.stringify(obtido)}`}`);
}

async function portaDeDepuracao() {
  const arquivo = join(perfil, 'DevToolsActivePort');
  for (let i = 0; i < 100; i += 1) {
    if (existsSync(arquivo)) {
      const porta = readFileSync(arquivo, 'utf8').split('\n')[0];
      if (porta) return porta;
    }
    await esperar(100);
  }
  throw new Error('o Chrome não abriu a porta de depuração');
}

async function conectar() {
  const porta = await portaDeDepuracao();
  const alvos = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json();
  const pagina = alvos.find((alvo) => alvo.type === 'page');
  const socket = new WebSocket(pagina.webSocketDebuggerUrl);
  await new Promise((resolver, rejeitar) => {
    socket.onopen = resolver;
    socket.onerror = rejeitar;
  });
  const pendentes = new Map();
  const eventos = [];
  let proximo = 0;
  socket.onmessage = ({ data }) => {
    const mensagem = JSON.parse(data);
    if (!mensagem.id) return eventos.push(mensagem);
    const { resolver, rejeitar } = pendentes.get(mensagem.id);
    pendentes.delete(mensagem.id);
    return mensagem.error ? rejeitar(new Error(mensagem.error.message)) : resolver(mensagem.result);
  };
  const enviar = (method, params = {}) =>
    new Promise((resolver, rejeitar) => {
      proximo += 1;
      pendentes.set(proximo, { resolver, rejeitar });
      socket.send(JSON.stringify({ id: proximo, method, params }));
    });
  return { enviar, eventos, fechar: () => socket.close() };
}

try {
  const { enviar, eventos, fechar } = await conectar();
  const avaliar = async (expression) =>
    (await enviar('Runtime.evaluate', { expression, returnByValue: true })).result.value;
  for (const dominio of ['Page', 'Runtime', 'Network', 'Log']) await enviar(`${dominio}.enable`);
  await enviar('Emulation.setDeviceMetricsOverride', {
    width: 1280, height: 800, deviceScaleFactor: 1, mobile: false,
  });

  const abrir = async (caminho) => {
    eventos.length = 0;
    await enviar('Page.navigate', { url: base + caminho });
    await esperar(1500);
  };
  const capturar = async (nome) => {
    if (!pasta) return;
    const { data } = await enviar('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(pasta, nome), Buffer.from(data, 'base64'));
    console.log(`  captura: ${nome}`);
  };
  const erros = () =>
    eventos.flatMap(({ method, params }) => {
      if (method === 'Runtime.exceptionThrown') return [params.exceptionDetails.text];
      if (method === 'Runtime.consoleAPICalled' && params.type === 'error') {
        return [params.args.map((a) => a.value ?? a.description).join(' ')];
      }
      if (method === 'Log.entryAdded' && params.entry.level === 'error') return [params.entry.text];
      return [];
    });
  const tela = () =>
    avaliar(`(() => {
      const estilo = (seletor) => {
        const el = document.querySelector(seletor);
        return el ? getComputedStyle(el) : null;
      };
      return {
        caminho: location.pathname,
        titulo: document.querySelector('h1')?.textContent ?? null,
        texto: document.querySelector('.card')?.innerText.replace(/\\s+/g, ' ') ?? null,
        fundo: estilo('body')?.backgroundColor,
        fonte: estilo('body')?.fontFamily,
        cartaoLargura: estilo('.card')?.maxWidth ?? null,
        cartaoFundo: estilo('.card')?.backgroundColor ?? null,
        botaoFundo: estilo('.form button')?.backgroundColor ?? null,
      };
    })()`);

  console.log(`Navegador: ${(await enviar('Browser.getVersion')).product}, sem janela, 1280x800`);

  const rotas = [
    { pedido: '/', caminho: '/login', titulo: 'Login', trecho: 'E-mail', captura: null },
    { pedido: '/login', caminho: '/login', titulo: 'Login', trecho: 'Senha', captura: 'conf-navegador-login.png' },
    { pedido: '/dashboard', caminho: '/dashboard', titulo: 'Dashboard', trecho: 'área autenticada', captura: 'conf-navegador-dashboard.png' },
    { pedido: '/unauthorized', caminho: '/unauthorized', titulo: 'Acesso negado', trecho: 'não possui permissão', captura: 'conf-navegador-unauthorized.png' },
  ];
  for (const rota of rotas) {
    console.log(`\nRota ${rota.pedido}`);
    await abrir(rota.pedido);
    const t = await tela();
    conferir(`endereço final ${rota.caminho}`, t.caminho === rota.caminho, t.caminho);
    conferir(`título "${rota.titulo}"`, t.titulo === rota.titulo, t.titulo);
    conferir(`texto contém "${rota.trecho}"`, t.texto?.includes(rota.trecho), t.texto);
    conferir('CSS: fundo da página #f3f4f6', t.fundo === 'rgb(243, 244, 246)', t.fundo);
    conferir('CSS: fonte Arial', t.fonte?.startsWith('Arial'), t.fonte);
    conferir('CSS: cartão branco com largura máxima de 420px',
      t.cartaoLargura === '420px' && t.cartaoFundo === 'rgb(255, 255, 255)', [t.cartaoLargura, t.cartaoFundo]);
    if (t.botaoFundo) conferir('CSS: botão azul #2563eb', t.botaoFundo === 'rgb(37, 99, 235)', t.botaoFundo);
    conferir('sem erros no console', erros().length === 0, erros());
    if (rota.pedido === '/') {
      const { entries } = await enviar('Page.getNavigationHistory');
      const urls = entries.map((e) => e.url);
      conferir('a raiz não fica no histórico (replace)', !urls.includes(`${base}/`), urls);
    }
    if (rota.captura) await capturar(rota.captura);
  }

  console.log('\nEnvio do formulário (RN02, CA07 e observação da pendência P3)');
  await abrir('/login');
  await avaliar('window.__marca = 1');
  const digitar = async (seletor, texto) => {
    await avaliar(`document.querySelector('${seletor}').focus()`);
    await enviar('Input.insertText', { text: texto });
  };
  await digitar('input[type=email]', 'pessoa@exemplo.com');
  await digitar('input[type=password]', 'senha-de-teste');
  const preenchido = await avaliar(`[...document.querySelectorAll('input')].map((i) => i.value)`);
  conferir('campos preenchidos antes do envio', preenchido.every(Boolean), preenchido);
  const ponto = await avaliar(`(() => {
    const r = document.querySelector('button[type=submit]').getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);
  eventos.length = 0;
  for (const type of ['mousePressed', 'mouseReleased']) {
    await enviar('Input.dispatchMouseEvent', { type, ...ponto, button: 'left', clickCount: 1 });
  }
  await esperar(2000);
  const pedidos = eventos
    .filter((e) => e.method === 'Network.requestWillBeSent')
    .map(({ params }) => ({ metodo: params.request.method, url: params.request.url, tipo: params.type }));
  const fora = pedidos.filter((p) => !p.url.startsWith(`${base}/`));
  const porCodigo = pedidos.filter((p) => p.tipo === 'XHR' || p.tipo === 'Fetch');
  conferir('nenhuma requisição fora do servidor da própria interface (a API não é chamada)', fora.length === 0, fora);
  conferir('nenhuma requisição por fetch ou XMLHttpRequest', porCodigo.length === 0, porCodigo);
  conferir('os dados digitados não aparecem em nenhum endereço pedido',
    !pedidos.some((p) => /pessoa|senha-de-teste/.test(p.url)), pedidos);
  const depois = await avaliar(`({
    endereco: location.pathname + location.search + (location.href.endsWith('?') ? '?' : ''),
    marca: window.__marca ?? null,
    campos: [...document.querySelectorAll('input')].map((i) => i.value),
  })`);
  console.log('  Observado depois do clique em "Entrar":');
  for (const p of pedidos.filter((q) => q.tipo === 'Document')) {
    console.log(`    pedido de página: ${p.metodo} ${p.url.replace(base, '')}`);
  }
  console.log(`    total de pedidos ao servidor da interface: ${pedidos.length}`);
  console.log(`    endereço: ${depois.endereco}`);
  console.log(`    página recarregada: ${depois.marca === null ? 'sim' : 'não'}`);
  console.log(`    campos: ${depois.campos.every((v) => v === '') ? 'vazios' : 'preenchidos'}`);

  console.log('\nObservação da pendência P1 (endereço inexistente), sem critério de aceite');
  await abrir('/endereco-inexistente');
  const vazio = await avaliar(`({ caminho: location.pathname, conteudo: document.getElementById('root').innerHTML.length })`);
  console.log(`    endereço: ${vazio.caminho}; conteúdo exibido: ${vazio.conteudo === 0 ? 'nenhum (tela em branco)' : 'há conteúdo'}`);
  const avisos = eventos
    .filter((e) => e.method === 'Runtime.consoleAPICalled' && e.params.type === 'warning')
    .map((e) => e.params.args.map((a) => a.value ?? a.description).join(' '));
  for (const aviso of new Set(avisos)) console.log(`    aviso no console: ${aviso}`);

  fechar();
} catch (erro) {
  falhas += 1;
  console.error(`ERRO: ${erro.message}`);
} finally {
  const encerrado = new Promise((resolver) => processo.once('exit', resolver));
  processo.kill();
  await Promise.race([encerrado, esperar(5000)]);
  rmSync(perfil, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
}

console.log(`\nRESULTADO: ${falhas === 0 ? 'todas as conferências passaram.' : `${falhas} conferência(s) falharam.`}`);
process.exit(falhas === 0 ? 0 : 1);
