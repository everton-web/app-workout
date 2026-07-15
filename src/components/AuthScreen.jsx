import { useState } from 'react';
import { tokens } from '../styles/tokens.js';
import { supabase } from '../lib/supabase.js';

export default function AuthScreen() {
  const [modo, setModo] = useState('login'); // login | cadastro
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');
  const [carregando, setCarregando] = useState(false);

  const loginGoogle = async () => {
    setErro('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const submeter = async (e) => {
    e.preventDefault();
    setErro('');
    setMsg('');
    setCarregando(true);
    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) setErro(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) setErro(error.message);
      else setMsg('Conta criada! Você já pode entrar.');
    }
    setCarregando(false);
  };

  const inputStyle = {
    width: '100%',
    padding: 12,
    borderRadius: tokens.radius.md,
    border: `1px solid ${tokens.colors.border}`,
    background: '#0d140d',
    color: tokens.colors.textPrimary,
    fontSize: tokens.fonts.sizes.base,
    outline: 'none',
    marginBottom: 10,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 24,
        maxWidth: 440,
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 52 }}>💪</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: tokens.colors.textPrimary }}>Treino Pro</h1>
        <p style={{ fontSize: tokens.fonts.sizes.base, color: tokens.colors.textMuted }}>
          Seu treino de academia no bolso
        </p>
      </div>

      <button
        onClick={loginGoogle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: 12,
          borderRadius: tokens.radius.md,
          border: 'none',
          background: '#ffffff',
          color: '#1a1a1a',
          fontSize: tokens.fonts.sizes.base,
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
          <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
          <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
          <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
        </svg>
        Entrar com Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 16px' }}>
        <div style={{ flex: 1, height: 1, background: tokens.colors.border }} />
        <span style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.textMuted }}>ou</span>
        <div style={{ flex: 1, height: 1, background: tokens.colors.border }} />
      </div>

      <form onSubmit={submeter}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={6}
          style={inputStyle}
        />

        {erro && <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.danger, marginBottom: 10 }}>{erro}</div>}
        {msg && <div style={{ fontSize: tokens.fonts.sizes.sm, color: tokens.colors.success, marginBottom: 10 }}>{msg}</div>}

        <button
          type="submit"
          disabled={carregando}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: tokens.radius.md,
            border: 'none',
            background: `linear-gradient(135deg, ${tokens.colors.success}, #4fae3a)`,
            color: '#0a0f0a',
            fontSize: tokens.fonts.sizes.base,
            fontWeight: 700,
            opacity: carregando ? 0.6 : 1,
          }}
        >
          {carregando ? '…' : modo === 'login' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      <button
        onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro(''); setMsg(''); }}
        style={{
          background: 'transparent',
          border: 'none',
          color: tokens.colors.textSecondary,
          fontSize: tokens.fonts.sizes.md,
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {modo === 'login' ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
      </button>
    </div>
  );
}
