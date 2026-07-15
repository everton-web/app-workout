import { useState } from 'react';
import { tokens } from '../styles/tokens.js';
import { useNotifications } from '../hooks/useNotifications.js';

const HORARIOS = ['07:00', '08:00', '17:00', '18:00', '19:00'];
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const cardStyle = {
  background: tokens.colors.bgCard,
  border: `1px solid ${tokens.colors.border}`,
  borderRadius: tokens.radius.xl,
  padding: 16,
  marginBottom: 12,
};

export default function NotifSettings({ config, setConfig, onSave }) {
  const { permissao, pedir, enviar } = useNotifications();
  const [testeEnviado, setTesteEnviado] = useState(false);

  const atualizar = (patch) => {
    const novo = { ...config, ...patch };
    setConfig(novo);
    if (onSave) onSave(novo);
  };

  const toggleDia = (i) => {
    const dias = config.dias.includes(i)
      ? config.dias.filter((d) => d !== i)
      : [...config.dias, i].sort((a, b) => a - b);
    atualizar({ dias });
  };

  const enviarTeste = () => {
    enviar('💪 Treino Pro', 'Bora treinar! Tá na hora.');
    setTesteEnviado(true);
    setTimeout(() => setTesteEnviado(false), 3000);
  };

  const btnBase = {
    flex: 1,
    padding: '10px 4px',
    borderRadius: tokens.radius.md,
    fontSize: tokens.fonts.sizes.sm,
    fontWeight: 600,
    background: '#0d140d',
  };

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: 16 }}>
      <div style={cardStyle}>
        <div style={{ fontSize: tokens.fonts.sizes.base, fontWeight: 700, color: tokens.colors.textPrimary, marginBottom: 12 }}>
          🔔 Notificações
        </div>

        {permissao !== 'granted' ? (
          <button
            onClick={pedir}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: tokens.radius.xl,
              border: 'none',
              background: `linear-gradient(135deg, ${tokens.colors.streak}, #d89428)`,
              color: '#0a0f0a',
              fontSize: tokens.fonts.sizes.base,
              fontWeight: 700,
            }}
          >
            Permitir notificações
          </button>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: tokens.fonts.sizes.sm, fontWeight: 700, color: tokens.colors.success, background: '#1a3a1a', padding: '4px 10px', borderRadius: tokens.radius.pill }}>
                ✓ Ativadas
              </span>
            </div>

            <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textSecondary, marginBottom: 6 }}>Horário do lembrete</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {HORARIOS.map((h) => {
                const sel = config.hora === h;
                return (
                  <button
                    key={h}
                    onClick={() => atualizar({ hora: h })}
                    style={{
                      ...btnBase,
                      border: `1px solid ${sel ? tokens.colors.streak : tokens.colors.border}`,
                      background: sel ? tokens.colors.streak + '38' : '#0d140d',
                      color: sel ? tokens.colors.streak : tokens.colors.textSecondary,
                    }}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textSecondary, marginBottom: 6 }}>Dias de treino</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {DIAS.map((d, i) => {
                const sel = config.dias.includes(i);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDia(i)}
                    style={{
                      ...btnBase,
                      border: `1px solid ${sel ? tokens.colors.success : tokens.colors.border}`,
                      background: sel ? tokens.colors.success + '38' : '#0d140d',
                      color: sel ? tokens.colors.success : tokens.colors.textSecondary,
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <button
              onClick={enviarTeste}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: tokens.radius.xl,
                border: `1px solid ${tokens.colors.border}`,
                background: 'transparent',
                color: testeEnviado ? tokens.colors.success : tokens.colors.textSecondary,
                fontSize: tokens.fonts.sizes.base,
                fontWeight: 600,
              }}
            >
              {testeEnviado ? '✓ Notificação enviada!' : 'Enviar notificação teste'}
            </button>
          </>
        )}
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: tokens.fonts.sizes.base, fontWeight: 700, color: tokens.colors.textPrimary, marginBottom: 8 }}>💡 Dica</div>
        <p style={{ fontSize: tokens.fonts.sizes.md, color: tokens.colors.textSecondary, lineHeight: 1.5 }}>
          Adicione o Treino Pro à tela inicial do celular para receber lembretes como um app nativo:
          no Android, toque em ⋮ → "Adicionar à tela inicial"; no iPhone, toque em compartilhar → "Adicionar à Tela de Início".
        </p>
      </div>
    </div>
  );
}
