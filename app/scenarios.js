/**
 * scenarios.js — Banco de dados local de eventos do LifePath
 *
 * Cada cenário tem:
 *  - id, phase (youth | adult | senior), title, story, options[]
 * Cada opção tem:
 *  - label, description, effects: { money, happiness, health, knowledge }
 *  - achievement (opcional): string com o ID de uma conquista a desbloquear
 */

export const SCENARIOS = [
  // ─── FASE JOVEM (18–25 anos) ────────────────────────────────────────────────
  {
    id: 'first_job',
    phase: 'youth',
    title: 'O Primeiro Emprego',
    story:
      'Você acabou de terminar o ensino médio. Uma startup caótica te oferece um estágio com salário baixo mas aprendizado intenso. Seu emprego atual de meio período é tranquilo, mas te limita.',
    options: [
      {
        label: 'Aceitar a Startup',
        description: '+20 conhecimento, -R$200/mês, -10 saúde',
        effects: { money: -200, happiness: -5, health: -10, knowledge: 20 },
      },
      {
        label: 'Ficar no emprego atual',
        description: '+R$800/mês, +10 felicidade, estabilidade',
        effects: { money: 800, happiness: 10, health: 5, knowledge: -5 },
      },
    ],
  },
  {
    id: 'college_decision',
    phase: 'youth',
    title: 'Faculdade ou Liberdade?',
    story:
      'Uma universidade federal te aceitou no curso dos seus sonhos — mas são 4 anos sem renda expressiva. Um amigo quer montar um negócio agora, com você como sócio.',
    options: [
      {
        label: 'Ir para a faculdade',
        description: '+30 conhecimento, -R$1.500/mês de custo',
        effects: { money: -1500, happiness: 5, health: 0, knowledge: 30 },
      },
      {
        label: 'Abrir o negócio',
        description: 'Alto risco, alta recompensa',
        effects: { money: 2000, happiness: 15, health: -15, knowledge: 10 },
        achievement: 'entrepreneur_spirit',
      },
      {
        label: 'Fazer um curso técnico',
        description: 'Equilíbrio entre renda e aprendizado',
        effects: { money: 500, happiness: 5, health: 5, knowledge: 15 },
      },
    ],
  },
  {
    id: 'first_relationship',
    phase: 'youth',
    title: 'Amor de Verão',
    story:
      'Você se apaixonou. O problema: ela/ele mora em outra cidade e o relacionamento exige viagens frequentes — e dinheiro. Mas a conexão é real.',
    options: [
      {
        label: 'Investir no relacionamento',
        description: '+20 felicidade, -R$800/mês em viagens',
        effects: { money: -800, happiness: 20, health: 5, knowledge: 0 },
      },
      {
        label: 'Focar na carreira agora',
        description: '-10 felicidade, liberdade para crescer',
        effects: { money: 1000, happiness: -10, health: 0, knowledge: 10 },
      },
    ],
  },
  {
    id: 'health_wake_up',
    phase: 'youth',
    title: 'O Corpo Fala',
    story:
      'Você está se sentindo exausto. Um exame de rotina mostra que você precisa de mais cuidado. A academia perto de casa tem um plano acessível, mas exige disciplina.',
    options: [
      {
        label: 'Assinar a academia',
        description: '+20 saúde, -R$150/mês, -5 felicidade (início é difícil)',
        effects: { money: -150, happiness: -5, health: 20, knowledge: 0 },
      },
      {
        label: 'Correr no parque de graça',
        description: '+10 saúde, +5 felicidade',
        effects: { money: 0, happiness: 5, health: 10, knowledge: 0 },
      },
      {
        label: 'Ignorar e continuar',
        description: 'Sem custo imediato, -15 saúde a longo prazo',
        effects: { money: 0, happiness: 5, health: -15, knowledge: 0 },
      },
    ],
  },
  {
    id: 'side_hustle',
    phase: 'youth',
    title: 'A Ideia Milionária',
    story:
      'Você teve uma ideia para um produto digital. Pode desenvolver nas madrugadas por 3 meses, sacrificando sono e lazer, ou vender a ideia para um amigo empreendedor por uma grana rápida.',
    options: [
      {
        label: 'Desenvolver você mesmo',
        description: 'Potencial de +R$5.000, custa saúde e felicidade',
        effects: { money: 5000, happiness: -15, health: -20, knowledge: 25 },
        achievement: 'self_made',
      },
      {
        label: 'Vender a ideia',
        description: '+R$2.000 imediato, sem risco',
        effects: { money: 2000, happiness: 5, health: 5, knowledge: 5 },
      },
      {
        label: 'Guardar a ideia para depois',
        description: 'Sem impacto agora, oportunidade futura',
        effects: { money: 0, happiness: 0, health: 5, knowledge: 5 },
      },
    ],
  },

  // ─── FASE ADULTA (26–45 anos) ────────────────────────────────────────────────
  {
    id: 'promotion_trap',
    phase: 'adult',
    title: 'A Promoção Armadilha',
    story:
      'Seu chefe oferece uma promoção: mais R$3.000 por mês, mas você gerenciará uma equipe problemática e terá muito mais pressão. Um concorrente te oferece o mesmo salário para uma posição mais tranquila.',
    options: [
      {
        label: 'Aceitar a promoção',
        description: '+R$3.000/mês, -20 saúde, +15 conhecimento',
        effects: { money: 3000, happiness: -5, health: -20, knowledge: 15 },
        achievement: 'executive_path',
      },
      {
        label: 'Ir para o concorrente',
        description: '+R$3.000/mês, +10 felicidade',
        effects: { money: 3000, happiness: 10, health: 5, knowledge: 10 },
      },
      {
        label: 'Recusar ambos',
        description: 'Ficar onde está por agora',
        effects: { money: 0, happiness: 15, health: 10, knowledge: 0 },
      },
    ],
  },
  {
    id: 'investment_choice',
    phase: 'adult',
    title: 'Hora de Investir',
    story:
      'Você acumulou R$20.000 guardados. Um amigo garante que criptomoeda vai "explodir". Sua mãe sugere um CDB conservador. Você tem vontade de comprar um apartamento pequeno para alugar.',
    options: [
      {
        label: 'Criptomoeda',
        description: '50% de chance de triplicar, 50% de perder tudo',
        effects: { money: Math.random() > 0.5 ? 40000 : -20000, happiness: -10, health: 0, knowledge: 5 },
        achievement: Math.random() > 0.5 ? 'crypto_winner' : 'crypto_loser',
      },
      {
        label: 'CDB conservador',
        description: '+R$2.400/ano com segurança',
        effects: { money: 2400, happiness: 5, health: 0, knowledge: 5 },
      },
      {
        label: 'Imóvel para alugar',
        description: '+R$1.200/mês de renda passiva',
        effects: { money: 1200, happiness: 10, health: 0, knowledge: 10 },
        achievement: 'landlord',
      },
    ],
  },
  {
    id: 'burnout_moment',
    phase: 'adult',
    title: 'No Limite',
    story:
      'Você está em burnout. Dois meses de licença médica custaria seu projeto mais importante. Manter o ritmo pode destruir sua saúde permanentemente.',
    options: [
      {
        label: 'Tirar a licença',
        description: '-R$5.000 em impacto na carreira, +30 saúde',
        effects: { money: -5000, happiness: 15, health: 30, knowledge: 0 },
        achievement: 'self_care_hero',
      },
      {
        label: 'Aguentar firme',
        description: 'Manter o cargo, -30 saúde',
        effects: { money: 2000, happiness: -20, health: -30, knowledge: 5 },
      },
      {
        label: 'Trabalho de home office parcial',
        description: 'Reduzir pressão gradualmente',
        effects: { money: -1000, happiness: 10, health: 15, knowledge: 0 },
      },
    ],
  },
  {
    id: 'family_choice',
    phase: 'adult',
    title: 'E a Família?',
    story:
      'Seus pais estão envelhecendo e precisam de atenção. Você pode trazer um deles para morar com você (impacto financeiro e espacial), contratar uma cuidadora, ou aumentar visitas nos fins de semana.',
    options: [
      {
        label: 'Morar junto',
        description: '-R$2.000/mês, +20 felicidade',
        effects: { money: -2000, happiness: 20, health: 0, knowledge: 5 },
        achievement: 'devoted_child',
      },
      {
        label: 'Contratar cuidadora',
        description: '-R$3.000/mês, equilíbrio emocional',
        effects: { money: -3000, happiness: 10, health: 5, knowledge: 0 },
      },
      {
        label: 'Visitar mais',
        description: 'Custo de tempo, não de dinheiro',
        effects: { money: 0, happiness: 5, health: -5, knowledge: 0 },
      },
    ],
  },
  {
    id: 'startup_opportunity',
    phase: 'adult',
    title: 'Hora do Grande Salto',
    story:
      'Um investidor-anjo quer financiar sua startup em R$500.000 por 30% de participação. Você teria que largar o emprego e mergulhar de cabeça.',
    options: [
      {
        label: 'Aceitar o investimento',
        description: 'Alto risco, potencial CEO',
        effects: { money: 50000, happiness: 10, health: -20, knowledge: 30 },
        achievement: 'ceo_unlocked',
      },
      {
        label: 'Pedir mais participação',
        description: 'Negociar 20% — pode dar certo ou não',
        effects: { money: Math.random() > 0.5 ? 50000 : 0, happiness: 5, health: -10, knowledge: 20 },
      },
      {
        label: 'Recusar e manter estabilidade',
        description: 'Segurança garantida',
        effects: { money: 0, happiness: -5, health: 10, knowledge: 5 },
      },
    ],
  },

  // ─── FASE SÊNIOR (46–65 anos) ────────────────────────────────────────────────
  {
    id: 'legacy_project',
    phase: 'senior',
    title: 'O Legado',
    story:
      'Você tem experiência acumulada. Uma ONG local quer que você lidere projetos de impacto social. Não paga bem, mas pode mudar vidas. Ou você pode focar em consultoria e faturar alto nos últimos anos de carreira.',
    options: [
      {
        label: 'Liderar a ONG',
        description: '-R$4.000/mês vs consultoria, +30 felicidade',
        effects: { money: -4000, happiness: 30, health: 10, knowledge: 10 },
        achievement: 'social_impact',
      },
      {
        label: 'Consultoria lucrativa',
        description: '+R$8.000/mês, trabalho intenso',
        effects: { money: 8000, happiness: 5, health: -15, knowledge: 15 },
      },
      {
        label: 'Equilíbrio: meio a meio',
        description: 'Dividir o tempo entre os dois',
        effects: { money: 2000, happiness: 20, health: 0, knowledge: 12 },
      },
    ],
  },
  {
    id: 'health_crisis',
    phase: 'senior',
    title: 'O Diagnóstico',
    story:
      'O médico detectou uma condição que exige mudanças de estilo de vida sérias. Dieta estrita, sem álcool, exercícios diários — ou um tratamento caro mas menos invasivo.',
    options: [
      {
        label: 'Mudar o estilo de vida',
        description: '+25 saúde, -15 felicidade no início',
        effects: { money: 0, happiness: -15, health: 25, knowledge: 5 },
        achievement: 'health_warrior',
      },
      {
        label: 'Tratamento médico',
        description: '-R$10.000, +20 saúde',
        effects: { money: -10000, happiness: 5, health: 20, knowledge: 0 },
      },
      {
        label: 'Ignorar o médico',
        description: 'Curto prazo bem, longo prazo péssimo',
        effects: { money: 0, happiness: 10, health: -30, knowledge: 0 },
      },
    ],
  },
  {
    id: 'retirement_decision',
    phase: 'senior',
    title: 'A Aposentadoria Chama',
    story:
      'Você tem 62 anos. Pode se aposentar agora com conforto, continuar trabalhando para acumular mais, ou fazer uma transição parcial com trabalho de consultoria leve.',
    options: [
      {
        label: 'Aposentar agora',
        description: 'Viver dos frutos. Fim de jogo (vitória).',
        effects: { money: 5000, happiness: 25, health: 10, knowledge: 0 },
        achievement: 'retired_in_peace',
        endGame: 'victory',
      },
      {
        label: 'Trabalhar mais 3 anos',
        description: '+R$30.000 extras acumulados',
        effects: { money: 30000, happiness: -10, health: -15, knowledge: 10 },
      },
      {
        label: 'Consultoria leve',
        description: 'Equilíbrio perfeito na reta final',
        effects: { money: 10000, happiness: 15, health: 5, knowledge: 10 },
      },
    ],
  },
  {
    id: 'wisdom_moment',
    phase: 'senior',
    title: 'A Grande Pergunta',
    story:
      'Olhando para trás, você percebe que sua maior riqueza não é financeira. Um neto pede seu conselho mais importante. O que você responde?',
    options: [
      {
        label: '"Invista em você antes de qualquer coisa."',
        description: '+15 conhecimento, +10 felicidade',
        effects: { money: 0, happiness: 10, health: 0, knowledge: 15 },
      },
      {
        label: '"Cuide das pessoas que você ama."',
        description: '+20 felicidade',
        effects: { money: 0, happiness: 20, health: 5, knowledge: 5 },
        achievement: 'family_patriarch',
      },
      {
        label: '"Assuma riscos quando ainda é jovem."',
        description: '+10 conhecimento, +5 felicidade',
        effects: { money: 0, happiness: 5, health: 0, knowledge: 10 },
      },
    ],
  },
  {
    id: 'final_chapter',
    phase: 'senior',
    title: 'O Capítulo Final',
    story:
      'Aos 65 anos, você olha para a sua história. A vida foi uma sequência de escolhas. Qual foi o maior presente que você deu a si mesmo?',
    options: [
      {
        label: 'Tempo livre para explorar',
        description: '+20 felicidade, +10 saúde',
        effects: { money: 0, happiness: 20, health: 10, knowledge: 5 },
        endGame: 'victory',
      },
      {
        label: 'Cada centavo acumulado',
        description: '+R$20.000, mas...',
        effects: { money: 20000, happiness: -10, health: -5, knowledge: 0 },
        endGame: 'victory',
      },
      {
        label: 'As pessoas que trouxe junto',
        description: 'O melhor final possível',
        effects: { money: 0, happiness: 30, health: 10, knowledge: 10 },
        achievement: 'zen_master',
        endGame: 'victory',
      },
    ],
  },

  // ─── EVENTOS ALEATÓRIOS (qualquer fase) ─────────────────────────────────────
  {
    id: 'unexpected_bonus',
    phase: 'any',
    title: 'Surpresa Financeira',
    story:
      'Você recebeu um bônus inesperado de R$5.000. Como vai usar?',
    options: [
      {
        label: 'Investir tudo',
        description: '+R$5.000 investidos',
        effects: { money: 5000, happiness: 5, health: 0, knowledge: 5 },
      },
      {
        label: 'Férias dos sonhos',
        description: '+25 felicidade, +10 saúde',
        effects: { money: -2000, happiness: 25, health: 10, knowledge: 5 },
        achievement: 'wanderlust',
      },
      {
        label: 'Dividir com a família',
        description: '+20 felicidade, dinheiro distribuído',
        effects: { money: 0, happiness: 20, health: 0, knowledge: 0 },
      },
    ],
  },
  {
    id: 'crisis_event',
    phase: 'any',
    title: 'Crise Inesperada',
    story:
      'Um imprevisto sério: seu carro quebrou, a geladeira pifou e o aluguel aumentou tudo no mesmo mês. R$8.000 de gasto surpresa.',
    options: [
      {
        label: 'Pagar tudo à vista',
        description: '-R$8.000, paz de espírito',
        effects: { money: -8000, happiness: 5, health: 5, knowledge: 0 },
      },
      {
        label: 'Parcelar com juros',
        description: '-R$10.000 total, -10 felicidade',
        effects: { money: -10000, happiness: -10, health: 0, knowledge: 0 },
      },
      {
        label: 'Pedir ajuda à família',
        description: '-15 felicidade (orgulho), sem custo financeiro',
        effects: { money: 0, happiness: -15, health: 5, knowledge: 5 },
      },
    ],
  },
  {
    id: 'learning_opportunity',
    phase: 'any',
    title: 'Oportunidade de Aprendizado',
    story:
      'Uma plataforma de cursos oferece uma assinatura anual por R$1.200. Você pode estudar programação, finanças ou bem-estar. Vale o investimento?',
    options: [
      {
        label: 'Assinar e estudar',
        description: '+25 conhecimento, -R$1.200',
        effects: { money: -1200, happiness: 10, health: 0, knowledge: 25 },
      },
      {
        label: 'Conteúdo gratuito no YouTube',
        description: '+10 conhecimento, sem custo',
        effects: { money: 0, happiness: 5, health: 0, knowledge: 10 },
      },
      {
        label: 'Não é o momento',
        description: 'Sem impacto',
        effects: { money: 0, happiness: 0, health: 0, knowledge: 0 },
      },
    ],
  },
];

export const ACHIEVEMENTS = [
  {
    id: 'entrepreneur_spirit',
    title: '🚀 Espírito Empreendedor',
    description: 'Escolheu montar um negócio ao invés da faculdade.',
  },
  {
    id: 'self_made',
    title: '💻 Self-Made',
    description: 'Desenvolveu seu próprio produto nas madrugadas.',
  },
  {
    id: 'executive_path',
    title: '👔 Executivo',
    description: 'Aceitou a promoção difícil.',
  },
  {
    id: 'ceo_unlocked',
    title: '🏆 CEO Desbloqueado',
    description: 'Aceitou investimento e virou fundador.',
  },
  {
    id: 'landlord',
    title: '🏠 Rentista',
    description: 'Investiu em imóvel para renda passiva.',
  },
  {
    id: 'crypto_winner',
    title: '🪙 Crypto Winner',
    description: 'Apostou em cripto e ganhou.',
  },
  {
    id: 'crypto_loser',
    title: '📉 Queimou tudo na Cripto',
    description: 'Apostou em cripto e perdeu tudo.',
  },
  {
    id: 'self_care_hero',
    title: '🧘 Self-Care Hero',
    description: 'Priorizou sua saúde acima da carreira.',
  },
  {
    id: 'devoted_child',
    title: '❤️ Filho Dedicado',
    description: 'Acolheu os pais em casa.',
  },
  {
    id: 'social_impact',
    title: '🌱 Agente de Mudança',
    description: 'Liderou projetos de impacto social.',
  },
  {
    id: 'health_warrior',
    title: '💪 Guerreiro da Saúde',
    description: 'Mudou completamente o estilo de vida.',
  },
  {
    id: 'retired_in_peace',
    title: '🌅 Aposentou em Paz',
    description: 'Se aposentou com saúde e tranquilidade.',
  },
  {
    id: 'zen_master',
    title: '☯️ Mestre do Zen',
    description: 'Terminou a vida com sabedoria e paz interior.',
  },
  {
    id: 'family_patriarch',
    title: '👨‍👩‍👧‍👦 Patriarca/Matriarca',
    description: 'Deixou um legado de amor para a família.',
  },
  {
    id: 'wanderlust',
    title: '✈️ Alma Viajante',
    description: 'Usou um bônus surpresa para viver uma aventura.',
  },
];

export const INITIAL_STATS = {
  age: 18,
  money: 3000,
  happiness: 60,
  health: 80,
  knowledge: 20,
};

export const PHASE_MAP = {
  youth: { min: 18, max: 25, label: 'Juventude' },
  adult: { min: 26, max: 45, label: 'Vida Adulta' },
  senior: { min: 46, max: 65, label: 'Maturidade' },
};

/** Retorna o phase atual baseado na idade */
export function getPhase(age) {
  if (age <= 25) return 'youth';
  if (age <= 45) return 'adult';
  return 'senior';
}

/** Seleciona o próximo cenário baseado na fase atual, excluindo já vistos */
export function getNextScenario(age, seenIds = []) {
  const phase = getPhase(age);
  const pool = SCENARIOS.filter(
    (s) => (s.phase === phase || s.phase === 'any') && !seenIds.includes(s.id)
  );

  if (pool.length === 0) {
    // Se todos foram vistos, reaproveita os 'any' ou reinicia os da fase
    const fallback = SCENARIOS.filter((s) => s.phase === 'any');
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  // Prioriza cenários da fase exata sobre 'any'
  const phaseSpecific = pool.filter((s) => s.phase === phase);
  const candidates = phaseSpecific.length > 0 ? phaseSpecific : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
