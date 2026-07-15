import { useEffect, useRef, useState } from 'react';
import { tokens } from '../styles/tokens.js';

const exerciciosAquecimento = [
  { nome: "Rotação de Ombros", tempo: 30, emoji: "🔄", dica: "Braços estendidos, círculos amplos. 15s pra frente, 15s pra trás.", grupo: "Articulações" },
  { nome: "Rotação de Quadril", tempo: 30, emoji: "🔄", dica: "Mãos na cintura, círculos amplos. 15s cada lado.", grupo: "Articulações" },
  { nome: "Rotação de Tornozelo", tempo: 20, emoji: "🦶", dica: "Apoie a ponta do pé no chão e gire. 10s cada pé.", grupo: "Articulações" },
  { nome: "Balanço de Pernas (frente/trás)", tempo: 30, emoji: "🦵", dica: "Segura em algo, balança a perna como pêndulo. 15s cada.", grupo: "Dinâmico" },
  { nome: "Balanço de Pernas (lateral)", tempo: 30, emoji: "🦵", dica: "Mesma coisa, agora abrindo pro lado. 15s cada.", grupo: "Dinâmico" },
  { nome: "Agachamento sem peso", tempo: 30, emoji: "🏋️", dica: "Desce controlado, braços pra frente. 10-12 reps.", grupo: "Ativação" },
  { nome: "Avanço alternado", tempo: 30, emoji: "🚶", dica: "Passo largo, joelho de trás quase no chão. 5 cada.", grupo: "Ativação" },
  { nome: "Polichinelo", tempo: 30, emoji: "⭐", dica: "Ritmo moderado, sem explodir.", grupo: "Cardio leve" },
  { nome: "Elevação de joelho", tempo: 30, emoji: "🏃", dica: "Trote no lugar levantando os joelhos.", grupo: "Cardio leve" },
];

const coresGrupo = {
  'Articulações': { bg: '#1a2a3a', border: '#2a4a6a', text: '#6ab4f7' },
  'Dinâmico': { bg: '#2a1a3a', border: '#4a2a6a', text: '#b47af7' },
  'Ativação': { bg: '#1a2e1a', border: '#2a5a2a', text: '#7ae85c' },
  'Cardio leve': { bg: '#3a2a1a', border: '#6a4a2a', text: '#f7b44a' },
};

const RAIO = 54;
const CIRC = 2 * Math.PI * RAIO;

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
    setTimeout(() => { osc.stop(); ctx.close(); }, ms);
  } catch { /* áudio indisponível */ }
}

export default function WarmUp({ onSair }) {
  const [tela, setTela] = useState('inicio'); // inicio | rodando | fim
  const [atual, setAtual] = useState(0);
  const [t, setT] = useState(exerciciosAquecimento[0].tempo);
  const [pausado, setPausado] = useState(false);

  const total = exerciciosAquecimento.length;
  const tempoTotalMin = Math.round(exerciciosAquecimento.reduce((s, e) => s + e.tempo, 0) / 60);
  const ex = exerciciosAquecimento[atual];
  const grupoCor = coresGrupo[ex.grupo];

  const avancarRef = useRef();
  avancarRef.current = () => {
    if (atual < total - 1) {
      beep(880);
      setTimeout(() => {
        setAtual((a) => a + 1);
        setT(exerciciosAquecimento[atual + 1].tempo);
      }, 300);
    } else {
      beep(440, 400);
      setTimeout(() => setTela('fim'), 300);
    }
  };

  useEffect(() => {
    if (tela !== 'rodando' || pausado) return;
    const interval = setInterval(() => {
      setT((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          avancarRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tela, pausado, atual]);

  const iniciar = () => {
    setAtual(0);
    setT(exerciciosAquecimento[0].tempo);
    setPausado(false);
    setTela('rodando');
  };

  const wrap = { maxWidth: 440, margin: '0 auto', padding: 16 };

  if (tela === 'inicio') {
    return (
      <div style={wrap}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 40 }}>🔥</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: tokens.colors.textPrimary }}>Aquecimento</h1>
          <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textMuted }}>
            {total} exercícios • ~{tempoTotalMin} min
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {exerciciosAquecimento.map((e, i) => {
            const c = coresGrupo[e.grupo];
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 10,
                  borderRadius: tokens.radius.lg,
                  background: tokens.colors.bgCard,
                  border: `1px solid ${tokens.colors.border}`,
                }}
              >
                <span style={{ fontSize: 22 }}>{e.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: tokens.fonts.sizes.md, fontWeight: 600, color: tokens.colors.textPrimary }}>{e.nome}</div>
                  <div style={{ fontSize: tokens.fonts.sizes.xs, color: c.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>{e.grupo}</div>
                </div>
                <span style={{ fontSize: tokens.fonts.sizes.md, fontWeight: 700, color: tokens.colors.textSecondary }}>{e.tempo}s</span>
              </div>
            );
          })}
        </div>

        <button onClick={iniciar} style={botaoLaranja}>Iniciar Aquecimento</button>
        <button onClick={onSair} style={botaoSecundario}>Voltar</button>
      </div>
    );
  }

  if (tela === 'fim') {
    return (
      <div style={{ ...wrap, textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 48 }}>🔥</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: tokens.colors.success, marginTop: 8 }}>Aquecimento completo!</h1>
        <p style={{ fontSize: tokens.fonts.sizes.base, color: tokens.colors.textSecondary, marginTop: 8, marginBottom: 24 }}>
          Corpo pronto. Bora pro treino. 💪
        </p>
        <button onClick={iniciar} style={botaoSecundario}>Repetir Aquecimento</button>
        <button onClick={onSair} style={botaoLaranja}>Ir pro treino →</button>
      </div>
    );
  }

  // rodando
  const urgente = t <= 3;
  const offset = CIRC * (1 - t / ex.tempo);
  const progressoGeral = ((atual + (1 - t / ex.tempo)) / total) * 100;

  return (
    <div style={{ ...wrap, textAlign: 'center' }}>
      <div style={{ height: 5, borderRadius: 3, background: tokens.colors.border, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ height: '100%', width: `${progressoGeral}%`, background: grupoCor.text, transition: 'width 0.4s' }} />
      </div>

      <div style={{ fontSize: tokens.fonts.sizes.sm, textTransform: 'uppercase', letterSpacing: 1, color: grupoCor.text, fontWeight: 600 }}>
        {ex.grupo}
      </div>
      <div style={{ fontSize: tokens.fonts.sizes.md, color: tokens.colors.textMuted, marginBottom: 12 }}>
        {atual + 1} de {total}
      </div>

      <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r={RAIO} stroke="#1a2a1a" strokeWidth="7" fill="none" />
          <circle
            cx="70" cy="70" r={RAIO}
            stroke={urgente ? tokens.colors.danger : grupoCor.text}
            strokeWidth="7" fill="none" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, color: urgente ? tokens.colors.danger : tokens.colors.textPrimary }}>
          {t}
        </div>
      </div>

      <div style={{ fontSize: 44, marginTop: 12 }}>{ex.emoji}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: tokens.colors.textPrimary }}>{ex.nome}</div>

      <div style={{ fontSize: tokens.fonts.sizes.base, color: tokens.colors.textSecondary, background: grupoCor.bg, border: `1px solid ${grupoCor.border}`, borderRadius: tokens.radius.lg, padding: 12, margin: '12px 0' }}>
        {ex.dica}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setPausado((p) => !p)} style={{ ...botaoSecundario, flex: 1, margin: 0 }}>
          {pausado ? '▶ Continuar' : '⏸ Pausar'}
        </button>
        <button onClick={() => avancarRef.current()} style={{ ...botaoSecundario, flex: 1, margin: 0 }}>Pular →</button>
      </div>
    </div>
  );
}

const botaoLaranja = {
  width: '100%',
  padding: 14,
  marginTop: 8,
  borderRadius: tokens.radius.xl,
  border: 'none',
  background: `linear-gradient(135deg, ${tokens.colors.streak}, #d89428)`,
  color: '#0a0f0a',
  fontSize: tokens.fonts.sizes.lg,
  fontWeight: 700,
};

const botaoSecundario = {
  width: '100%',
  padding: 14,
  marginTop: 8,
  borderRadius: tokens.radius.xl,
  border: `1px solid ${tokens.colors.border}`,
  background: 'transparent',
  color: tokens.colors.textSecondary,
  fontSize: tokens.fonts.sizes.base,
  fontWeight: 600,
};
