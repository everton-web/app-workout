import { useEffect, useRef, useState } from 'react';
import { tokens } from '../styles/tokens.js';

function beep(freq = 880, ms = 200, vol = 0.15) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, ms);
  } catch {
    /* áudio indisponível */
  }
}

export default function HIITTimer({ cardio, corTreino, rounds, forteSeg, leveSeg, onFinish }) {
  const [round, setRound] = useState(1);
  const [fase, setFase] = useState('forte');
  const [t, setT] = useState(forteSeg);
  const [rodando, setRodando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const estado = useRef({ round, fase });
  estado.current = { round, fase };

  useEffect(() => {
    if (!rodando || finalizado) return;
    const interval = setInterval(() => {
      setT((prev) => {
        if (prev > 1) return prev - 1;

        // Transição de fase
        const { round: r, fase: f } = estado.current;
        if (f === 'forte') {
          beep(660);
          setFase('leve');
          return leveSeg;
        }
        // fim da fase leve
        if (r < rounds) {
          beep(880);
          setRound(r + 1);
          setFase('forte');
          return forteSeg;
        }
        // último round concluído
        beep(440, 400);
        setFinalizado(true);
        setRodando(false);
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rodando, finalizado, rounds, forteSeg, leveSeg]);

  if (finalizado) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '24px 0' }}>
        <span style={{ fontSize: 44 }}>🔥</span>
        <span style={{ fontSize: 18, fontWeight: tokens.fonts.weights.bold, color: tokens.colors.success }}>
          HIIT Completo!
        </span>
        <button
          onClick={onFinish}
          style={{
            padding: '14px 24px',
            borderRadius: tokens.radius.xl,
            border: 'none',
            background: `linear-gradient(135deg, ${tokens.colors.success}, #4fae3a)`,
            color: '#0a0f0a',
            fontSize: tokens.fonts.sizes.lg,
            fontWeight: tokens.fonts.weights.bold,
            width: '100%',
          }}
        >
          Finalizar treino ✓
        </button>
      </div>
    );
  }

  const corFase = fase === 'forte' ? tokens.colors.hiitForte : tokens.colors.hiitLeve;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '16px 0' }}>
      <span style={{ fontSize: tokens.fonts.sizes.sm, textTransform: 'uppercase', letterSpacing: 1, color: tokens.colors.textSecondary }}>
        HIIT — {cardio}
      </span>
      <span style={{ fontSize: tokens.fonts.sizes.md, color: tokens.colors.textMuted }}>
        Round {round}/{rounds}
      </span>

      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: rounds }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 24,
              height: 5,
              borderRadius: 3,
              background: i < round - 1 || (i === round - 1 && fase === 'leve') ? corTreino : tokens.colors.border,
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 56, fontWeight: tokens.fonts.weights.heavy, color: corFase }}>{t}</div>

      <div
        style={{
          padding: '6px 16px',
          borderRadius: tokens.radius.pill,
          fontSize: tokens.fonts.sizes.md,
          fontWeight: tokens.fonts.weights.bold,
          background: fase === 'forte' ? '#3a1a1a' : '#1a3a1a',
          color: fase === 'forte' ? tokens.colors.danger : tokens.colors.success,
        }}
      >
        {fase === 'forte' ? '🔥 FORTE' : '😮‍💨 LEVE'}
      </div>

      <button
        onClick={() => setRodando((r) => !r)}
        style={{
          padding: '12px 32px',
          borderRadius: tokens.radius.xl,
          border: 'none',
          background: rodando ? tokens.colors.border : `linear-gradient(135deg, ${tokens.colors.streak}, #d89428)`,
          color: rodando ? tokens.colors.textPrimary : '#0a0f0a',
          fontSize: tokens.fonts.sizes.lg,
          fontWeight: tokens.fonts.weights.bold,
          width: '100%',
        }}
      >
        {rodando ? '⏸ Pausar' : round === 1 && t === forteSeg ? '▶ Iniciar' : '▶ Continuar'}
      </button>
    </div>
  );
}
