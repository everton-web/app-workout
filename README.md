# 💪 Treino Pro — PWA

Aplicativo web progressivo (PWA) de treino de academia com acompanhamento de evolução, streaks de constância e notificações. Leve, gratuito e funciona como app nativo no celular — sem precisar baixar nada.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![PWA](https://img.shields.io/badge/PWA-ready-blue)

---

## 📱 Sobre o Projeto

O Treino Pro é um app de academia minimalista focado em quem quer treinar sério sem complicação. Treinos guiados, timer automático, registro de evolução e lembretes — tudo num web app leve que funciona offline.

### O Problema

- Apps de treino são pesados, cheios de funcionalidades inúteis e caros
- Quem tá começando precisa de algo direto, rápido e motivador
- Perder o histórico de treinos acaba com a motivação

### A Solução

Uma PWA gratuita, rápida e que funciona como app nativo no celular — sem precisar baixar nada da App Store ou Play Store. Seus dados ficam sincronizados na nuvem.

---

## 🚀 Funcionalidades

### Treino Guiado
- Treinos personalizáveis com exercícios, séries e reps
- Timer de descanso automático entre séries
- Marcação de séries concluídas com progresso visual
- Dicas de execução em cada exercício
- Registro de carga utilizada

### HIIT Pós-Treino
- Protocolo intervalado integrado ao final de cada sessão
- Timer com rounds, alternando entre intensidade forte e leve
- Progressão mensal configurável

### Aquecimento
- Rotina guiada de ~5 min pré-treino
- Timer automático por exercício com transição sonora
- Fases: articulações, dinâmico, ativação e cardio leve

### Calendário de Constância (Streak)
- Visualização estilo Duolingo das últimas 11 semanas
- Cores por tipo de treino
- Contagem de semanas consecutivas

### Estatísticas
- Total de treinos, minutos e séries
- Distribuição por tipo de treino
- Frequência semanal com meta configurável
- Histórico completo com evolução de carga

### Notificações
- Lembretes configuráveis por dia e horário
- Notificações push via Web Notification API
- Funciona como app nativo ao instalar na tela inicial

---

## 🛠 Stack Tecnológica

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | React + Vite | Leve, rápido, hot reload |
| Estilização | CSS-in-JS (inline) | Zero config, sem dependências extras |
| Backend/DB | Supabase | Banco relacional gratuito + auth + API pronta |
| Hospedagem | Vercel | Deploy automático, HTTPS, CDN global |
| PWA | Workbox | Service Worker, cache offline, manifest |

---

## 📐 Arquitetura

```
treino-pro/
├── public/
│   ├── manifest.json          # Configuração PWA
│   ├── sw.js                  # Service Worker
│   ├── icon-192.png           # Ícone PWA
│   └── icon-512.png           # Ícone PWA
├── src/
│   ├── components/
│   │   ├── WorkoutScreen.jsx  # Tela de treino com séries
│   │   ├── WarmUp.jsx         # Aquecimento guiado
│   │   ├── HIITTimer.jsx      # Timer HIIT pós-treino
│   │   ├── RestTimer.jsx      # Timer de descanso
│   │   ├── StreakCalendar.jsx  # Calendário estilo Duolingo
│   │   ├── Stats.jsx          # Estatísticas e gráficos
│   │   └── NotifSettings.jsx  # Config de notificações
│   ├── data/
│   │   └── workouts.js        # Definição dos treinos
│   ├── lib/
│   │   └── supabase.js        # Cliente Supabase
│   ├── App.jsx                # App principal com navegação
│   └── main.jsx               # Entry point
├── .env.local                 # Variáveis de ambiente (não commitado)
├── package.json
├── vite.config.js
└── README.md
```

---

## 🗄 Banco de Dados (Supabase)

### Tabelas

**users** (gerenciada pelo Supabase Auth)

**workouts** — registro de cada treino realizado
```sql
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo VARCHAR(1) NOT NULL,
  nome VARCHAR(100),
  duracao_min INTEGER NOT NULL,
  total_series INTEGER NOT NULL,
  hiit_completo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**workout_sets** — cada série de cada exercício
```sql
CREATE TABLE workout_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercicio VARCHAR(100) NOT NULL,
  serie INTEGER NOT NULL,
  reps INTEGER,
  carga_kg DECIMAL(5,2),
  concluida BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**user_preferences** — configurações do usuário
```sql
CREATE TABLE user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  notif_hora VARCHAR(5) DEFAULT '18:00',
  notif_dias INTEGER[] DEFAULT '{1,3,5}',
  meta_semanal INTEGER DEFAULT 3,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Cada usuário só vê seus próprios dados
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own workouts" ON workouts
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own sets" ON workout_sets
  FOR ALL USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own prefs" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);
```

---

## ⚙️ Setup Local

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/treino-pro.git
cd treino-pro
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor** e execute os scripts de criação das tabelas (acima)
3. Vá em **Authentication > Providers** e ative o Google (ou Email)
4. Copie a **URL** e a **anon key** do projeto

### 4. Configure as variáveis de ambiente

Crie o arquivo `.env.local` na raiz:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 5. Rode o projeto
```bash
npm run dev
```

Acesse `http://localhost:5173`

---

## 🚀 Deploy na Vercel

### Opção 1 — Via GitHub (recomendado)

1. Suba o repositório no GitHub
2. Acesse [vercel.com/new](https://vercel.com/new)
3. Importe o repositório
4. Adicione as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
5. Clique em **Deploy**

Cada push na `main` faz deploy automático.

### Opção 2 — Via CLI
```bash
npm install -g vercel
vercel
```

---

## 📱 Instalação como PWA

Após acessar o link do app no celular:

**Android (Chrome)**
1. Acesse o app no Chrome
2. Toque nos 3 pontinhos (⋮) > "Adicionar à tela inicial"
3. Confirme

**iPhone (Safari)**
1. Acesse o app no Safari
2. Toque no botão de compartilhar (↑)
3. "Adicionar à Tela de Início"

O app abre em tela cheia, sem barra do navegador, com ícone próprio.

---

## 🗺 Roadmap

- [x] Treinos guiados com timer
- [x] HIIT pós-treino
- [x] Aquecimento guiado
- [x] Calendário de streak
- [x] Estatísticas básicas
- [x] Notificações push
- [ ] Integração com Supabase (persistência na nuvem)
- [ ] Login com Google
- [ ] Registro de carga por exercício
- [ ] Gráfico de evolução de carga ao longo do tempo
- [ ] Criação de treinos personalizados pelo usuário
- [ ] Modo offline completo com sync
- [ ] Compartilhar streak nas redes sociais
- [ ] Temporizador para atividades físicas diversas

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

Feito com 💪 para quem quer treinar sem desculpa.
