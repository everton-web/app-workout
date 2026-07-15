import { tokens } from '../styles/tokens.js';

export default function LoadingSpinner({ label = 'Carregando…' }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: tokens.colors.bg,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `3px solid ${tokens.colors.border}`,
          borderTopColor: tokens.colors.success,
          animation: 'tp-spin 0.8s linear infinite',
        }}
      />
      <span style={{ color: tokens.colors.textSecondary, fontSize: tokens.fonts.sizes.md }}>
        {label}
      </span>
      <style>{`@keyframes tp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
