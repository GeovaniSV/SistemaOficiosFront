export const formatOficioNumber = (id: string) => {
  const format = localStorage.getItem('formatoNumeracao') || 'SEQUENCIAL/ANO';
  const match = id.match(/OF-(\d{4})\/(\d{3})/);
  if (match) {
    const ano = match[1];
    const seq = match[2];
    if (format === 'ANO-SEQUENCIAL') return `${ano}-${seq}`;
    if (format === 'SEQUENCIAL') return seq;
    return `${seq}/${ano}`;
  }
  return id;
};
