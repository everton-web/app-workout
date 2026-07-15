import { tokens } from '../styles/tokens.js';

// Botão de série individual. Mostra reps alvo ou ✓; abaixo, input de carga quando expandido.
export default function SetButton({
  serieNum,
  concluida,
  reps,
  carga,
  expandido,
  onToggle,
  onChangeCarga,
  corTreino,
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: '10px 0',
          borderRadius: tokens.radius.md,
          border: `2px solid ${concluida ? corTreino : '#2a3a2a'}`,
          background: concluida ? corTreino + '33' : '#0a150a',
          transition: 'all 0.15s',
        }}
      >
        <span
          style={{
            fontSize: tokens.fonts.sizes.xs,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: tokens.colors.textMuted,
            fontWeight: tokens.fonts.weights.semibold,
          }}
        >
          Série {serieNum}
        </span>
        <span
          style={{
            fontSize: 15,
            fontWeight: tokens.fonts.weights.bold,
            color: concluida ? corTreino : tokens.colors.textDark,
          }}
        >
          {concluida ? '✓' : reps}
        </span>
      </button>

      {expandido && (
        <input
          type="number"
          inputMode="decimal"
          placeholder="kg"
          value={carga || ''}
          onChange={(e) => onChangeCarga(e.target.value === '' ? 0 : parseFloat(e.target.value))}
          style={{
            width: '100%',
            textAlign: 'center',
            padding: '6px 4px',
            borderRadius: tokens.radius.sm,
            border: `1px solid ${tokens.colors.border}`,
            background: '#0d140d',
            color: tokens.colors.textPrimary,
            fontSize: tokens.fonts.sizes.md,
            outline: 'none',
          }}
        />
      )}
    </div>
  );
}
