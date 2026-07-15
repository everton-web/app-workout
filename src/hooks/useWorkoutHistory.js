import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

// Normaliza um registro de workout adicionando `data` (YYYY-MM-DD) derivada de created_at,
// usada pelo cálculo de streak e pelo calendário.
const normalizar = (w) => ({
  ...w,
  data: w?.created_at ? w.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
});

export function useWorkoutHistory(userId) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);
    setHistorico((data || []).map(normalizar));
    setLoading(false);
  };

  const salvar = async (entry, sets) => {
    const { data: workout } = await supabase
      .from('workouts')
      .insert({ ...entry, user_id: userId })
      .select()
      .single();

    if (sets.length > 0) {
      await supabase
        .from('workout_sets')
        .insert(sets.map(s => ({ ...s, workout_id: workout.id })));
    }

    const normalizado = normalizar(workout);
    setHistorico(prev => [normalizado, ...prev]);
    return normalizado;
  };

  const buscarUltimasCargasDoExercicio = async (nomeExercicio) => {
    const { data } = await supabase
      .from('workout_sets')
      .select('serie_numero, carga_kg, created_at')
      .eq('exercicio', nomeExercicio)
      .eq('concluida', true)
      .order('created_at', { ascending: false })
      .limit(3);
    return data || [];
  };

  const buscarEvolucaoCarga = async (nomeExercicio) => {
    const { data } = await supabase
      .from('v_evolucao_carga')
      .select('*')
      .eq('user_id', userId)
      .eq('exercicio', nomeExercicio)
      .order('data', { ascending: true })
      .limit(12);
    return data || [];
  };

  useEffect(() => { if (userId) carregar(); }, [userId]);

  return { historico, loading, salvar, buscarUltimasCargasDoExercicio, buscarEvolucaoCarga };
}
