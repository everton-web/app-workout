export const calcularStreak = (historico) => {
  const today = new Date();
  let streak = 0;

  for (let w = 0; w < 52; w++) {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() - w * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const ws = start.toISOString().slice(0, 10);
    const we = end.toISOString().slice(0, 10);
    const count = historico.filter(h => h.data >= ws && h.data <= we).length;

    if (count >= 2) streak++;
    else if (w > 0) break;
    // Semana atual: conta mesmo com 1 treino (está em andamento)
  }

  return streak;
};
