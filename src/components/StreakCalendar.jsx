import { tokens } from '../styles/tokens.js';
import { treinosPadrao } from '../data/workouts.js';
import { calcularStreak } from '../utils/streak.js';

const corDoTipo = (tipo) => treinosPadrao[tipo]?.cor || tokens.colors.textMuted;
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export default function StreakCalendar({ historico }) {
  const streak = calcularStreak(historico);
  const hojeIso = new Date().toISOString().slice(0, 10);

  // Mapa data -> tipo (último treino do dia)
  const porData = {};
  historico.forEach((h) => {
    if (!porData[h.data]) porData[h.data] = h.tipo;
  });

  // Gera últimos 78 dias, alinhando a grade para começar no domingo
  const hoje = new Date();
  const inicio = new Date(hoje);
  inicio.setDate(inicio.getDate() - 77);
  inicio.setDate(inicio.getDate() - inicio.getDay()); // volta pro domingo

  const dias = [];
  const cursor = new Date(inicio);
  while (cursor <= hoje) {
    dias.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: tokens.colors.bgCard,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.xl,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 40 }}>🔥</span>
        <div>
          <div style={{ fontSize: 32, fontWeight: tokens.fonts.weights.heavy, color: tokens.colors.streak, lineHeight: 1 }}>
            {streak}
          </div>
          <div style={{ fontSize: tokens.fonts.sizes.md, color: tokens.colors.textSecondary }}>
            {streak === 1 ? 'semana seguida' : 'semanas seguidas'}
          </div>
        </div>
      </div>

      <div
        style={{
          background: tokens.colors.bgCard,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.xl,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: tokens.fonts.sizes.xs, color: tokens.colors.textDark }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {dias.map((d, i) => {
            const iso = d.toISOString().slice(0, 10);
            const tipo = porData[iso];
            const hoje = iso === hojeIso;
            const dia1 = d.getDate() === 1;
            return (
              <div
                key={i}
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 700,
                  background: tipo ? corDoTipo(tipo) + 'cc' : '#0d140d',
                  border: hoje ? `2px solid ${tokens.colors.streak}` : `1px solid ${tokens.colors.border}`,
                  color: tipo ? '#0a0f0a' : tokens.colors.textDark,
                }}
              >
                {tipo ? tipo : dia1 ? MESES[d.getMonth()] : ''}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {['A', 'B', 'C'].map((tipo) => (
          <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: corDoTipo(tipo) }} />
            <span style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textSecondary }}>Treino {tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
