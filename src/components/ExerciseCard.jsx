import { tokens } from '../styles/tokens.js';
import SetButton from './SetButton.jsx';

export default function ExerciseCard({
  exercicio,
  index,
  checks,
  cargas,
  expandido,
  onToggleExpand,
  onToggleSet,
  onChangeCarga,
  corTreino,
}) {
  const seriesFeitas = [0, 1, 2].filter((s) => checks[`${index}-${s}`]).length;
  const completo = seriesFeitas === exercicio.series;
  const aberto = expandido === index;

  return (
    <div
      style={{
        border: `1px solid ${completo ? corTreino + '33' : tokens.colors.border}`,
        background: completo ? corTreino + '08' : tokens.colors.bgCard,
        borderRadius: tokens.radius.xl,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => onToggleExpand(index)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: completo ? corTreino : tokens.colors.border,
            color: completo ? '#0a0f0a' : tokens.colors.textSecondary,
            fontSize: tokens.fonts.sizes.sm,
            fontWeight: tokens.fonts.weights.bold,
          }}
        >
          {completo ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#0a0f0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            seriesFeitas
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: tokens.fonts.sizes.md,
              fontWeight: tokens.fonts.weights.semibold,
              color: tokens.colors.textPrimary,
            }}
          >
            {exercicio.nome}
          </div>
          <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textMuted }}>
            {exercicio.series} × {exercicio.reps}
          </div>
        </div>

        <span
          style={{
            color: tokens.colors.textMuted,
            fontSize: 20,
            transform: aberto ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          ›
        </span>
      </button>

      {aberto && (
        <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              fontSize: 12,
              color: tokens.colors.textSecondary,
              background: corTreino + '14',
              border: `1px solid ${corTreino}44`,
              borderRadius: tokens.radius.md,
              padding: '8px 10px',
            }}
          >
            💡 {exercicio.dica}
          </div>
          <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textMuted }}>
            {exercicio.musculo}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map((s) => (
              <SetButton
                key={s}
                serieNum={s + 1}
                concluida={!!checks[`${index}-${s}`]}
                reps={exercicio.reps}
                carga={cargas[`${index}-${s}`]}
                expandido={aberto}
                onToggle={() => onToggleSet(index, s)}
                onChangeCarga={(v) => onChangeCarga(index, s, v)}
                corTreino={corTreino}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
