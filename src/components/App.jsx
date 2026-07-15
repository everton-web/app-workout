import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { treinosPadrao } from '../data/workouts.js';
import { useAuth } from '../hooks/useAuth.js';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory.js';
import { tokens } from '../styles/tokens.js';

import AuthScreen from './AuthScreen.jsx';
import BottomNav from './BottomNav.jsx';
import WorkoutMenu from './WorkoutMenu.jsx';
import WorkoutScreen from './WorkoutScreen.jsx';
import WarmUp from './WarmUp.jsx';
import StreakCalendar from './StreakCalendar.jsx';
import Stats from './Stats.jsx';
import NotifSettings from './NotifSettings.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

const PREFS_PADRAO = {
  notif_hora: '18:00',
  notif_dias: [1, 3, 5],
  meta_semanal: 3,
  descanso_segundos: 50,
  hiit_rounds: 8,
  hiit_forte_seg: 20,
  hiit_leve_seg: 40,
};

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { historico, loading: histLoading, salvar, buscarEvolucaoCarga } = useWorkoutHistory(user?.id);

  const [tab, setTab] = useState('treino');
  const [tela, setTela] = useState('menu'); // menu | warmup | treino
  const [treinoKey, setTreinoKey] = useState(null);
  const [checks, setChecks] = useState({});
  const [cargas, setCargas] = useState({});
  const [expandido, setExpandido] = useState(null);
  const [showRest, setShowRest] = useState(false);
  const [showHIIT, setShowHIIT] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [prefs, setPrefs] = useState(PREFS_PADRAO);
  const [salvando, setSalvando] = useState(false);

  const treino = treinoKey ? treinosPadrao[treinoKey] : null;

  // Carrega preferências
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => { if (data) setPrefs({ ...PREFS_PADRAO, ...data }); });
  }, [user?.id]);

  const abrirTreino = async (key) => {
    const t = treinosPadrao[key];
    const novosChecks = {};
    const novasCargas = {};
    t.exercicios.forEach((_, ei) => {
      [0, 1, 2].forEach((s) => {
        novosChecks[`${ei}-${s}`] = false;
        novasCargas[`${ei}-${s}`] = 0;
      });
    });

    // Busca últimas cargas de cada exercício
    try {
      const { data } = await supabase
        .from('workout_sets')
        .select('exercicio, carga_kg, serie_numero, created_at')
        .eq('concluida', true)
        .in('exercicio', t.exercicios.map((e) => e.nome))
        .order('created_at', { ascending: false })
        .limit(60);

      if (data) {
        const vistos = new Set();
        data.forEach((row) => {
          const ei = t.exercicios.findIndex((e) => e.nome === row.exercicio);
          if (ei === -1) return;
          const chave = `${ei}-${row.serie_numero - 1}`;
          if (!vistos.has(chave) && row.serie_numero >= 1 && row.serie_numero <= 3) {
            vistos.add(chave);
            novasCargas[chave] = Number(row.carga_kg) || 0;
          }
        });
      }
    } catch {
      /* offline / sem dados — segue com cargas zeradas */
    }

    setTreinoKey(key);
    setChecks(novosChecks);
    setCargas(novasCargas);
    setExpandido(0);
    setShowHIIT(false);
    setShowRest(false);
    setStartTime(Date.now());
    setTela('treino');
  };

  const toggleSet = (ei, s) => {
    const chave = `${ei}-${s}`;
    setChecks((prev) => {
      const marcando = !prev[chave];
      if (marcando) setShowRest(true);
      return { ...prev, [chave]: marcando };
    });
  };

  const changeCarga = (ei, s, valor) => {
    setCargas((prev) => ({ ...prev, [`${ei}-${s}`]: valor }));
  };

  const finalizarTreino = async () => {
    if (!treino || salvando) return;
    setSalvando(true);
    const duracao = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;
    const totalSeries = treino.exercicios.length * 3;
    const seriesFeitas = Object.values(checks).filter(Boolean).length;

    const entry = {
      tipo: treinoKey,
      nome: treino.nome,
      duracao_min: duracao,
      total_series: totalSeries,
      series_concluidas: seriesFeitas,
      hiit_completo: true,
    };

    const sets = treino.exercicios.flatMap((ex, ei) =>
      [0, 1, 2].map((s) => ({
        exercicio: ex.nome,
        serie_numero: s + 1,
        reps_alvo: ex.reps,
        reps_feitas: checks[`${ei}-${s}`] ? parseInt(ex.reps, 10) || 0 : null,
        carga_kg: cargas[`${ei}-${s}`] || 0,
        concluida: checks[`${ei}-${s}`] || false,
      }))
    );

    try {
      await salvar(entry, sets);
    } catch {
      /* falha ao salvar — mantém fluxo */
    }

    setSalvando(false);
    setTreinoKey(null);
    setShowHIIT(false);
    setTela('menu');
    setTab('treino');
  };

  const salvarPrefsNotif = async (novo) => {
    const patch = { notif_hora: novo.hora, notif_dias: novo.dias };
    setPrefs((p) => ({ ...p, ...patch }));
    if (user?.id) {
      await supabase.from('user_preferences').update(patch).eq('user_id', user.id);
    }
  };

  if (authLoading) return <LoadingSpinner label="Iniciando…" />;
  if (!user) return <AuthScreen />;
  if (histLoading) return <LoadingSpinner label="Carregando treinos…" />;

  let conteudo;
  if (tab === 'treino') {
    if (tela === 'warmup') {
      conteudo = <WarmUp onSair={() => setTela('menu')} />;
    } else if (tela === 'treino' && treino) {
      conteudo = (
        <WorkoutScreen
          treino={treino}
          treinoKey={treinoKey}
          checks={checks}
          cargas={cargas}
          expandido={expandido}
          showRest={showRest}
          showHIIT={showHIIT}
          config={prefs}
          onVoltar={() => { setTela('menu'); setTreinoKey(null); }}
          onToggleExpand={(i) => setExpandido((e) => (e === i ? null : i))}
          onToggleSet={toggleSet}
          onChangeCarga={changeCarga}
          onFecharRest={() => setShowRest(false)}
          onIniciarHIIT={() => setShowHIIT(true)}
          onFinishHIIT={finalizarTreino}
        />
      );
    } else {
      conteudo = (
        <WorkoutMenu
          onSelecionar={abrirTreino}
          onAquecimento={() => setTela('warmup')}
        />
      );
    }
  } else if (tab === 'calendario') {
    conteudo = <StreakCalendar historico={historico} />;
  } else if (tab === 'stats') {
    conteudo = <Stats historico={historico} buscarEvolucaoCarga={buscarEvolucaoCarga} />;
  } else if (tab === 'notif') {
    conteudo = (
      <NotifSettings
        config={{ hora: prefs.notif_hora, dias: prefs.notif_dias || [] }}
        setConfig={() => {}}
        onSave={salvarPrefsNotif}
      />
    );
  }

  // Esconde a BottomNav durante um treino ativo / aquecimento pra foco total
  const emFoco = tab === 'treino' && (tela === 'treino' || tela === 'warmup');

  return (
    <div style={{ minHeight: '100vh', background: tokens.colors.bg, color: tokens.colors.textPrimary, paddingBottom: emFoco ? 24 : 80 }}>
      {tab === 'notif' && (
        <div style={{ maxWidth: 440, margin: '0 auto', padding: '12px 16px 0', textAlign: 'right' }}>
          <button
            onClick={signOut}
            style={{ background: 'transparent', border: 'none', color: tokens.colors.textMuted, fontSize: tokens.fonts.sizes.sm }}
          >
            Sair
          </button>
        </div>
      )}

      {conteudo}

      {!emFoco && <BottomNav tab={tab} onChange={setTab} />}
    </div>
  );
}
