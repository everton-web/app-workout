import { useEffect, useRef, useState } from 'react';
import { tokens } from '../styles/tokens.js';

const RAIO = 44;
const CIRC = 2 * Math.PI * RAIO;

export default function RestTimer({ duracaoSegundos, corTreino, onSkip }) {
  const [t, setT] = useState(duracaoSegundos);
  const onSkipRef = useRef(onSkip);
  onSkipRef.current = onSkip;

  useEffect(() => {
    const interval = setInterval(() => {
      setT((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onSkipRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const urgente = t <= 5;
  const corProgresso = urgente ? tokens.colors.danger : corTreino;
  const offset = CIRC * (1 - t / duracaoSegundos);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      <span
        style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 2,
          color: tokens.colors.textMuted,
          fontWeight: tokens.fonts.weights.semibold,
        }}
      >
        Descanso
      </span>

      <div style={{ position: 'relative', width: 108, height: 108 }}>
        <svg width="108" height="108" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="54" cy="54" r={RAIO} stroke="#1a2a1a" strokeWidth="6" fill="none" />
          <circle
            cx="54"
            cy="54"
            r={RAIO}
            stroke={corProgresso}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            fontWeight: 800,
            color: urgente ? tokens.colors.danger : tokens.colors.textPrimary,
          }}
        >
          {t}
        </div>
      </div>

      <button
        onClick={onSkip}
        style={{
          padding: '10px 24px',
          borderRadius: tokens.radius.pill,
          border: `1px solid ${corTreino}70`,
          background: 'transparent',
          color: tokens.colors.textPrimary,
          fontSize: tokens.fonts.sizes.base,
          fontWeight: tokens.fonts.weights.semibold,
        }}
      >
        Pular →
      </button>
    </div>
  );
}
