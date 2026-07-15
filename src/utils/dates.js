export const formatarData = (iso) => {
  const d = new Date(iso + 'T12:00:00');
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
};

export const diasAtras = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const inicioSemana = (date, semanasAtras = 0) => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay() - semanasAtras * 7);
  return d.toISOString().slice(0, 10);
};

export const fimSemana = (inicioIso) => {
  const d = new Date(inicioIso + 'T12:00:00');
  d.setDate(d.getDate() + 6);
  return d.toISOString().slice(0, 10);
};
