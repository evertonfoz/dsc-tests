// Complementa o tooltip por foco e mouse com toque, toque fora e Escape.
// O bundle é emitido em arquivo próprio; a política de segurança não permite script embutido.
function fecharSiglas() {
  document.querySelectorAll<HTMLElement>('abbr.sigla[data-aberta="true"]').forEach((item) => item.removeAttribute('data-aberta'));
}

document.addEventListener('focusin', (evento) => {
  const alvo = evento.target;
  if (alvo instanceof Element && alvo.matches('abbr.sigla')) alvo.removeAttribute('data-fechado');
});

document.addEventListener('click', (evento) => {
  const alvo = evento.target;
  if (!(alvo instanceof Element)) return;
  const sigla = alvo.closest<HTMLElement>('abbr.sigla');
  if (!sigla) {
    fecharSiglas();
    return;
  }
  const estavaAberta = sigla.getAttribute('data-aberta') === 'true';
  fecharSiglas();
  sigla.removeAttribute('data-fechado');
  if (!estavaAberta) sigla.setAttribute('data-aberta', 'true');
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    fecharSiglas();
    const ativa = document.activeElement;
    if (ativa instanceof HTMLElement && ativa.matches('abbr.sigla')) ativa.setAttribute('data-fechado', 'true');
  }
});
