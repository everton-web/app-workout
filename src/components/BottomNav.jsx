import { tokens } from '../styles/tokens.js';

const ABAS = [
  { key: 'treino', emoji: '🏋️', label: 'Treino' },
  { key: 'calendario', emoji: '🔥', label: 'Streak' },
  { key: 'stats', emoji: '📊', label: 'Stats' },
  { key: 'notif', emoji: '🔔', label: 'Alertas' },
];

export default function BottomNav({ tab, onChange }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: tokens.colors.bg,
        borderTop: `1px solid ${tokens.colors.border}`,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        zIndex: 100,
      }}
    >
      {ABAS.map((a) => {
        const ativo = tab === a.key;
        return (
          <button
            key={a.key}
            onClick={() => onChange(a.key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 0',
              background: 'transparent',
              border: 'none',
              filter: ativo ? 'none' : 'grayscale(1) opacity(0.4)',
              transition: 'filter 0.2s',
            }}
          >
            <span style={{ fontSize: 20 }}>{a.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: tokens.colors.textSecondary }}>{a.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
