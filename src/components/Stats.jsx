import { useState } from 'react';
import { tokens } from '../styles/tokens.js';
import { treinosPadrao } from '../data/workouts.js';
import { formatarData } from '../utils/dates.js';

const cardStyle = {
  background: tokens.colors.bgCard,
  border: `1px solid ${tokens.colors.border}`,
  borderRadius: tokens.radius.xl,
  padding: 16,
  marginBottom: 12,
};
const titulo = { fontSize: tokens.fonts.sizes.base, fontWeight: 700, color: tokens.colors.textPrimary, marginBottom: 12 };

const NOMES_CURTOS = { A: 'Pernas', B: 'Peito/Ombro', C: 'Costas/Bíceps' };

function contarSemana(historico, semanasAtras) {
  const hoje = new Date();
  const start = new Date(hoje);
  start.setDate(start.getDate() - start.getDay() - semanasAtras * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const ws = start.toISOString().slice(0, 10);
  const we = end.toISOString().slice(0, 10);
  return historico.filter((h) => h.data >= ws && h.data <= we).length;
}

export default function Stats({ historico, buscarEvolucaoCarga }) {
  const [exSel, setExSel] = useState('');
  const [evolucao, setEvolucao] = useState([]);

  const totalTreinos = historico.length;
  const totalMin = historico.reduce((s, h) => s + (h.duracao_min || 0), 0);
  const totalSeries = historico.reduce((s, h) => s + (h.series_concluidas || 0), 0);

  const contagem = { A: 0, B: 0, C: 0 };
  historico.forEach((h) => { if (contagem[h.tipo] !== undefined) contagem[h.tipo]++; });
  const maxContagem = Math.max(1, ...Object.values(contagem));

  const semanas = [0, 1, 2, 3].map((w) => contarSemana(historico, w));
  const maxSemana = Math.max(3, ...semanas);
  const labelsSemana = ['Esta', 'Passada', '2 atrás', '3 atrás'];

  const todosExercicios = [...new Set(Object.values(treinosPadrao).flatMap((t) => t.exercicios.map((e) => e.nome)))];

  const selecionarExercicio = async (nome) => {
    setExSel(nome);
    setEvolucao([]);
    if (nome && buscarEvolucaoCarga) {
      const data = await buscarEvolucaoCarga(nome);
      setEvolucao(data.slice(-8));
    }
  };

  const cargas = evolucao.map((e) => Number(e.carga_max) || 0);
  const cargaMin = Math.min(...cargas, 0);
  const cargaMax = Math.max(...cargas, 1);
  const variacao = cargas.length >= 2 ? cargas[cargas.length - 1] - cargas[0] : 0;

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: 16 }}>
      {/* Totais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { label: 'Treinos', valor: totalTreinos, cor: tokens.colors.success },
          { label: 'Minutos', valor: totalMin, cor: tokens.colors.treinoB },
          { label: 'Séries', valor: totalSeries, cor: tokens.colors.treinoC },
        ].map((c) => (
          <div key={c.label} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: 24, fontWeight: tokens.fonts.weights.heavy, color: c.cor }}>{c.valor}</div>
            <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textMuted }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Distribuição */}
      <div style={cardStyle}>
        <div style={titulo}>Distribuição por treino</div>
        {['A', 'B', 'C'].map((tipo) => (
          <div key={tipo} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: tokens.fonts.sizes.md, color: tokens.colors.textSecondary }}>
                {tipo} — {NOMES_CURTOS[tipo]}
              </span>
              <span style={{ fontSize: tokens.fonts.sizes.md, fontWeight: 700, color: treinosPadrao[tipo].cor }}>
                {contagem[tipo]}x
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: '#0d140d', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(contagem[tipo] / maxContagem) * 100}%`, background: treinosPadrao[tipo].cor, transition: 'width 0.4s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Frequência semanal */}
      <div style={cardStyle}>
        <div style={titulo}>Frequência semanal</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8, height: 80 }}>
          {semanas.map((c, i) => {
            const atingiu = c >= 3;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: tokens.fonts.sizes.base, fontWeight: 700, color: atingiu ? tokens.colors.success : tokens.colors.textMuted }}>{c}</span>
                <div
                  style={{
                    width: '100%',
                    height: Math.max(4, (c / maxSemana) * 56),
                    borderRadius: 6,
                    background: atingiu
                      ? `linear-gradient(180deg, ${tokens.colors.success}, #4fae3a)`
                      : c > 0 ? '#2a4a2a' : '#1a2a1a',
                  }}
                />
                <span style={{ fontSize: tokens.fonts.sizes.xs, color: tokens.colors.textMuted }}>{labelsSemana[i]}</span>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textMuted, marginTop: 10 }}>
          Meta: 3x por semana
        </div>
      </div>

      {/* Evolução de carga */}
      <div style={cardStyle}>
        <div style={titulo}>Evolução de carga</div>
        <select
          value={exSel}
          onChange={(e) => selecionarExercicio(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: tokens.radius.md,
            background: '#0d140d',
            color: tokens.colors.textPrimary,
            border: `1px solid ${tokens.colors.border}`,
            fontSize: tokens.fonts.sizes.md,
            marginBottom: 12,
          }}
        >
          <option value="">Selecione um exercício…</option>
          {todosExercicios.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        {exSel && cargas.length === 0 && (
          <div style={{ fontSize: tokens.fonts.sizes.md, color: tokens.colors.textMuted, textAlign: 'center', padding: 12 }}>
            Sem dados registrados ainda.
          </div>
        )}

        {cargas.length > 0 && (
          <>
            <div style={{ fontSize: tokens.fonts.sizes.base, fontWeight: 700, color: tokens.colors.textPrimary, marginBottom: 4 }}>
              Último peso: {cargas[cargas.length - 1]} kg
            </div>
            <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none" style={{ display: 'block' }}>
              {(() => {
                const range = cargaMax - cargaMin || 1;
                const pts = cargas.map((c, i) => {
                  const x = cargas.length === 1 ? 150 : (i / (cargas.length - 1)) * 300;
                  const y = 55 - ((c - cargaMin) / range) * 50;
                  return { x, y };
                });
                const linha = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                return (
                  <>
                    <path d={linha} fill="none" stroke={tokens.colors.success} strokeWidth="2" />
                    {pts.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="3" fill={tokens.colors.success} />
                    ))}
                  </>
                );
              })()}
            </svg>
            <div style={{ fontSize: tokens.fonts.sizes.sm, color: variacao > 0 ? tokens.colors.success : tokens.colors.textMuted, marginTop: 6 }}>
              {variacao > 0 ? `+${variacao} kg desde o início` : `Mantendo ${cargas[cargas.length - 1]} kg`}
            </div>
          </>
        )}
      </div>

      {/* Últimos treinos */}
      <div style={cardStyle}>
        <div style={titulo}>Últimos treinos</div>
        {historico.length === 0 && (
          <div style={{ fontSize: tokens.fonts.sizes.md, color: tokens.colors.textMuted, textAlign: 'center', padding: 12 }}>
            Nenhum treino registrado ainda.
          </div>
        )}
        {historico.slice(0, 5).map((h) => (
          <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${tokens.colors.border}` }}>
            <span style={{ fontSize: 20 }}>{treinosPadrao[h.tipo]?.emoji || '🏋️'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: tokens.fonts.sizes.md, fontWeight: 600, color: treinosPadrao[h.tipo]?.cor || tokens.colors.textPrimary }}>
                Treino {h.tipo}
              </div>
              <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textMuted }}>
                {formatarData(h.data)} • {h.duracao_min} min • {h.series_concluidas} séries
              </div>
            </div>
            {h.hiit_completo && (
              <span style={{ fontSize: tokens.fonts.sizes.xs, fontWeight: 700, color: tokens.colors.streak, background: '#2a1a0a', padding: '3px 8px', borderRadius: tokens.radius.sm }}>
                HIIT
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
