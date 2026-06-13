# LifePath — O Simulador de Escolhas

Um jogo/simulador de texto e escolhas (estilo RPG de texto) para React Native + Expo.

## Estrutura do Projeto

```
lifepath/
├── app/                        # Expo Router: cada arquivo = uma rota
│   ├── _layout.js              # Root layout (Stack navigator, StatusBar)
│   ├── index.js                # Home/Menu principal
│   ├── game.js                 # 🎮 Tela principal do jogo
│   ├── gameover.js             # Tela de Game Over / Vitória
│   └── achievements.js         # Tela de conquistas
│
├── src/
│   ├── data/
│   │   └── scenarios.js        # 📦 Banco de dados local (15+ cenários, 15 conquistas)
│   │
│   ├── hooks/
│   │   └── useGameState.js     # 🧠 Toda a lógica de estado e AsyncStorage
│   │
│   ├── components/
│   │   ├── StatBar.js          # Barra de progresso animada (Reanimated)
│   │   ├── ChoiceButton.js     # Botão de escolha com animação de press
│   │   └── AgeTimeline.js      # Timeline visual da vida do personagem
│   │
│   └── utils/
│       └── theme.js            # Design tokens (cores, fontes, espaçamento)
│
├── app.config.js               # Configuração do Expo
├── babel.config.js             # Babel com suporte a Reanimated
└── package.json
```

## Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npx expo start

# 3. Abrir no dispositivo
# Escaneie o QR code com o app Expo Go (iOS/Android)
# Ou pressione 'a' para Android emulator / 'i' para iOS simulator
```

## Dependências Principais

| Pacote | Uso |
|--------|-----|
| `expo-router` | Navegação baseada em arquivos |
| `react-native-reanimated` | Animações fluidas das barras de status |
| `@react-native-async-storage/async-storage` | Persistência local (save game + conquistas) |
| `expo-haptics` | Feedback tátil ao fazer escolhas |
| `expo-linear-gradient` | Efeitos visuais (opcional) |

## Arquitetura de Game Loop

```
index.js (Menu)
    │
    ▼
game.js (Jogo)
    │
    ├─ useGameState hook
    │      ├─ stats: { age, money, happiness, health, knowledge }
    │      ├─ currentScenario (do scenarios.js)
    │      └─ AsyncStorage save/load
    │
    ├─ Exibe cenário + opções
    │
    ├─ Usuário escolhe → applyChoice()
    │      ├─ Calcula novos stats
    │      ├─ Verifica conquistas
    │      ├─ Persiste save
    │      └─ Avança idade (+2 anos por turno)
    │
    ├─ Verifica Game Over (health=0 ou happiness=0)
    │
    ├─ Verifica Vitória (age >= 65 ou endGame='victory')
    │
    └─ Carrega próximo cenário → loop reinicia
```

## Fases do Jogo

| Fase | Idades | Cenários |
|------|--------|----------|
| Juventude | 18–25 | Primeiro emprego, faculdade, relacionamentos |
| Vida Adulta | 26–45 | Promoções, investimentos, burnout, família |
| Maturidade | 46–65 | Legado, saúde, aposentadoria, sabedoria |
| Qualquer | — | Bônus, crises, aprendizado |

## Expansão Futura

- Adicionar mais cenários em `src/data/scenarios.js`
- Criar eventos ramificados (uma escolha desbloqueia novas opções)
- Adicionar `expo-av` para sons de feedback
- Modo "Sandbox" sem Game Over para exploração livre
