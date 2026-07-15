-- ============================================================
-- Treino Pro — Schema Supabase
-- Rode este script no SQL Editor do seu projeto Supabase.
-- ============================================================

-- ===== TABELAS =====

-- Treinos realizados
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo VARCHAR(1) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  duracao_min INTEGER NOT NULL DEFAULT 0,
  total_series INTEGER NOT NULL DEFAULT 0,
  series_concluidas INTEGER NOT NULL DEFAULT 0,
  hiit_completo BOOLEAN DEFAULT false,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Séries individuais (permite rastrear carga por exercício ao longo do tempo)
CREATE TABLE workout_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercicio VARCHAR(100) NOT NULL,
  serie_numero INTEGER NOT NULL CHECK (serie_numero >= 1),
  reps_alvo VARCHAR(10) NOT NULL,
  reps_feitas INTEGER,
  carga_kg DECIMAL(5,2) DEFAULT 0,
  concluida BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Preferências do usuário
CREATE TABLE user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome VARCHAR(100),
  notif_hora VARCHAR(5) DEFAULT '18:00',
  notif_dias INTEGER[] DEFAULT '{1,3,5}',
  meta_semanal INTEGER DEFAULT 3,
  descanso_segundos INTEGER DEFAULT 50,
  hiit_rounds INTEGER DEFAULT 8,
  hiit_forte_seg INTEGER DEFAULT 20,
  hiit_leve_seg INTEGER DEFAULT 40,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INDEXES =====
CREATE INDEX idx_workouts_user_date ON workouts(user_id, created_at DESC);
CREATE INDEX idx_workout_sets_workout ON workout_sets(workout_id);
CREATE INDEX idx_workout_sets_exercicio ON workout_sets(exercicio, created_at DESC);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Workouts: usuário só acessa os próprios
CREATE POLICY "workouts_select" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workouts_insert" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workouts_update" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "workouts_delete" ON workouts FOR DELETE USING (auth.uid() = user_id);

-- Sets: acesso via ownership do workout
CREATE POLICY "sets_select" ON workout_sets FOR SELECT
  USING (workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid()));
CREATE POLICY "sets_insert" ON workout_sets FOR INSERT
  WITH CHECK (workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid()));
CREATE POLICY "sets_update" ON workout_sets FOR UPDATE
  USING (workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid()));
CREATE POLICY "sets_delete" ON workout_sets FOR DELETE
  USING (workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid()));

-- Preferências: cada um a sua
CREATE POLICY "prefs_select" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "prefs_insert" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prefs_update" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- ===== FUNÇÃO: Criar preferências ao cadastrar =====
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===== VIEWS ÚTEIS =====

-- Evolução de carga por exercício (última carga de cada treino)
CREATE OR REPLACE VIEW v_evolucao_carga AS
SELECT
  w.user_id,
  ws.exercicio,
  w.created_at::date AS data,
  MAX(ws.carga_kg) AS carga_max,
  AVG(ws.carga_kg)::decimal(5,2) AS carga_media,
  SUM(ws.reps_feitas) AS total_reps
FROM workout_sets ws
JOIN workouts w ON ws.workout_id = w.id
WHERE ws.concluida = true
GROUP BY w.user_id, ws.exercicio, w.created_at::date
ORDER BY w.created_at::date DESC;
