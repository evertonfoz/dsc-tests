// Commit e data de origem do conteúdo, passados na construção (plano do M0, seção 5).
export interface Origem {
  commit: string;
  commitCurto: string;
  /** Data do commit em UTC, formato ISO 8601. */
  dataUtc: string;
  /** Data exibida no formato brasileiro, em UTC. */
  dataExibida: string;
}

export function lerOrigem(env: Record<string, string | undefined>): Origem | null {
  const commit = env.ORIGEM_COMMIT?.trim();
  const data = env.ORIGEM_DATA?.trim();
  if (!commit && !data) return null;
  if (!commit || !/^[0-9a-f]{7,40}$/.test(commit)) {
    throw new Error(`ORIGEM_COMMIT inválido: "${commit ?? ''}" (esperado: hash de commit em hexadecimal)`);
  }
  const instante = data ? new Date(data) : null;
  if (!instante || Number.isNaN(instante.getTime())) {
    throw new Error(`ORIGEM_DATA inválida: "${data ?? ''}" (esperado: data ISO 8601, como a de "git show -s --format=%cI")`);
  }
  const dataExibida = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(instante).replace(',', '');
  return {
    commit,
    commitCurto: commit.slice(0, 7),
    dataUtc: instante.toISOString(),
    dataExibida: `${dataExibida} UTC`,
  };
}
