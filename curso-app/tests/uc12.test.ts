import { describe, expect, it } from 'vitest';
import { carregarInventarioUc12, inventariarUc12, modulosQueCitam } from '../src/conteudo/uc12';

describe('inventário UC12', () => {
  const inventario = carregarInventarioUc12();

  it('publica os 36 destinos do estado e citações diretas de módulos publicados', () => {
    expect(inventario).toHaveLength(39);
    expect(new Set(inventario.map((item) => item.arquivo)).size).toBe(39);
    expect(inventario.find((item) => item.arquivo.endsWith('/state.yaml'))?.rota).toBe('/uc12/state/');
    expect(inventario.find((item) => item.arquivo.endsWith('/relatorios/F.md'))?.rota).toBe('/uc12/relatorios/F/');
    expect(inventario.find((item) => item.arquivo.endsWith('/evidencias/F/cobertura.md'))?.rota).toBe('/uc12/evidencias/F/cobertura/');
    expect(inventario.find((item) => item.arquivo.endsWith('/evidencias/C/c1-red.txt'))?.rota).toBe('/uc12/evidencias/C/c1-red/');
    expect(inventario.find((item) => item.categoria === 'documento')?.arquivo).toBe('docs/planejamento/uc12-cadastrar-produto/uc-12.md');
  });

  it('recusa documento que escapa da pasta docs', () => {
    const estado = { documento: '../../../../segredo.md', fases: {} };
    expect(() => inventariarUc12(estado, new Set(['docs/uc/uc12/state.yaml', 'docs/uc/uc12/contrato.md'])))
      .toThrow(/caminho fora de docs/);
  });

  it('recusa destino citado que não existe', () => {
    const estado = { documento: 'uc12-cadastrar-produto/uc-12.md', fases: {} };
    expect(() => inventariarUc12(estado, new Set(['docs/uc/uc12/state.yaml', 'docs/uc/uc12/contrato.md'])))
      .toThrow(/arquivo citado arquivo inexistente|state.yaml cita arquivo inexistente/);
  });

  it('gera links reversos apenas para páginas de curso publicadas', () => {
    const entrada = inventario.find((item) => item.arquivo === 'docs/uc/uc12/evidencias/F/cobertura.md')!;
    const links = modulosQueCitam(entrada.arquivo, [
      { dados: { id: 'm12', tipo: 'modulo', titulo: 'Módulo 12' }, body: 'Veja `docs/uc/uc12/evidencias/F/cobertura.md`.' },
      { dados: { id: 'm12-gabarito', tipo: 'gabarito', titulo: 'Gabarito' }, body: 'Veja `docs/uc/uc12/evidencias/F/cobertura.md`.' },
    ], inventario);
    expect(links).toEqual([{ id: 'm12', titulo: 'Módulo 12', rota: '/m12/' }]);
  });
});
