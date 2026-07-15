import { tokens } from '../styles/tokens.js';
import { treinosPadrao } from '../data/workouts.js';

export default function WorkoutMenu({ onSelecionar, onAquecimento }) {
  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: 16 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: tokens.fonts.weights.black, color: tokens.colors.textPrimary }}>
          ⚽ Treino Pro
        </h1>
        <p style={{ fontSize: tokens.fonts.sizes.md, color: tokens.colors.textMuted }}>
          Escolha o treino de hoje
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {['A', 'B', 'C'].map((key) => {
          const t = treinosPadrao[key];
          return (
            <button
              key={key}
              onClick={() => onSelecionar(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: tokens.radius.xl,
                background: t.corBg,
                border: `1px solid ${t.corBorder}`,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: tokens.radius.lg,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  background: t.cor + '26',
                }}
              >
                {t.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, color: t.cor }}>
                  Treino {key}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: tokens.colors.textPrimary }}>{t.nome}</div>
                <div style={{ fontSize: 11, color: tokens.colors.textMuted }}>
                  {t.exercicios.length} exercícios + HIIT {t.cardio}
                </div>
              </div>
              <span style={{ fontSize: 22, color: t.cor }}>›</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onAquecimento}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: 14,
          borderRadius: tokens.radius.xl,
          border: 'none',
          background: `linear-gradient(135deg, ${tokens.colors.streak}, #d89428)`,
          color: '#0a0f0a',
          fontSize: tokens.fonts.sizes.base,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        🔥 Aquecimento
      </button>

      <div
        style={{
          background: tokens.colors.bgCard,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.xl,
          padding: 16,
        }}
      >
        <div style={{ fontSize: tokens.fonts.sizes.sm, fontWeight: 700, color: tokens.colors.textSecondary, marginBottom: 8 }}>
          Semana sugerida
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['Seg', 'A'], ['Qua', 'B'], ['Sex', 'C']].map(([dia, tipo]) => (
            <div key={dia} style={{ flex: 1, textAlign: 'center', padding: 8, borderRadius: tokens.radius.md, background: '#0d140d' }}>
              <div style={{ fontSize: tokens.fonts.sizes.xs, color: tokens.colors.textMuted }}>{dia}</div>
              <div style={{ fontSize: tokens.fonts.sizes.lg, fontWeight: 700, color: treinosPadrao[tipo].cor }}>{tipo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
