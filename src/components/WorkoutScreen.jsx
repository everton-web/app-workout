import { tokens } from '../styles/tokens.js';
import ExerciseCard from './ExerciseCard.jsx';
import RestTimer from './RestTimer.jsx';
import HIITTimer from './HIITTimer.jsx';

export default function WorkoutScreen({
  treino,
  treinoKey,
  checks,
  cargas,
  expandido,
  showRest,
  showHIIT,
  config,
  onVoltar,
  onToggleExpand,
  onToggleSet,
  onChangeCarga,
  onFecharRest,
  onIniciarHIIT,
  onFinishHIIT,
}) {
  const totalSeries = treino.exercicios.length * 3;
  const feitas = Object.values(checks).filter(Boolean).length;
  const progresso = (feitas / totalSeries) * 100;
  const treinoCompleto = feitas === totalSeries;

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button
          onClick={onVoltar}
          style={{
            width: 34,
            height: 34,
            borderRadius: tokens.radius.md,
            border: `1px solid ${tokens.colors.border}`,
            background: tokens.colors.bgCard,
            color: tokens.colors.textPrimary,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          ‹
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, color: treino.cor }}>
            Treino {treinoKey}
          </div>
          <div style={{ fontSize: tokens.fonts.sizes.lg, fontWeight: 700, color: tokens.colors.textPrimary }}>{treino.nome}</div>
        </div>
        <span style={{ fontSize: 28 }}>{treino.emoji}</span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ height: 5, borderRadius: 3, background: tokens.colors.border, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progresso}%`,
              background: `linear-gradient(90deg, ${treino.cor}, ${treino.cor}aa)`,
              transition: 'width 0.4s',
            }}
          />
        </div>
        <div style={{ textAlign: 'right', fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textMuted, marginTop: 4 }}>
          {feitas}/{totalSeries} séries
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {treino.exercicios.map((ex, i) => (
          <ExerciseCard
            key={i}
            exercicio={ex}
            index={i}
            checks={checks}
            cargas={cargas}
            expandido={expandido}
            onToggleExpand={onToggleExpand}
            onToggleSet={onToggleSet}
            onChangeCarga={onChangeCarga}
            corTreino={treino.cor}
          />
        ))}
      </div>

      {treinoCompleto && !showHIIT && (
        <button
          onClick={onIniciarHIIT}
          style={{
            width: '100%',
            padding: 16,
            marginTop: 16,
            borderRadius: tokens.radius.xl,
            border: 'none',
            background: `linear-gradient(135deg, ${tokens.colors.streak}, #d89428)`,
            color: '#0a0f0a',
            fontSize: tokens.fonts.sizes.lg,
            fontWeight: 700,
          }}
        >
          🔥 Iniciar HIIT
        </button>
      )}

      {showHIIT && (
        <div
          style={{
            marginTop: 16,
            background: tokens.colors.bgCard,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radius.xl,
            padding: 16,
          }}
        >
          <HIITTimer
            cardio={treino.cardio}
            corTreino={treino.cor}
            rounds={config.hiit_rounds ?? 8}
            forteSeg={config.hiit_forte_seg ?? 20}
            leveSeg={config.hiit_leve_seg ?? 40}
            onFinish={onFinishHIIT}
          />
        </div>
      )}

      {showRest && (
        <RestTimer
          duracaoSegundos={config.descanso_segundos ?? 50}
          corTreino={treino.cor}
          onSkip={onFecharRest}
        />
      )}
    </div>
  );
}
