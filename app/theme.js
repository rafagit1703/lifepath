// ─── Paleta principal ─────────────────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  bg: '#0A0A0F',
  surface: '#111118',
  surfaceElevated: '#1A1A26',
  border: '#2A2A3A',

  // Texto
  textPrimary: '#F0F0FF',
  textSecondary: '#8888AA',
  textMuted: '#55556A',

  // Accent
  accent: '#7C6AF7',       // roxo vívido
  accentGlow: '#9D8FFF',
  accentDim: '#3D3480',

  // Stats
  money: '#4ECDC4',        // teal
  moneyDark: '#1A6B66',
  happiness: '#FFD166',    // âmbar
  happinessDark: '#6B5200',
  health: '#EF6461',       // coral
  healthDark: '#6B1F1D',
  knowledge: '#7C6AF7',    // roxo (mesmo do accent)
  knowledgeDark: '#3D3480',

  // Estados
  danger: '#FF4D6D',
  warning: '#FFB347',
  success: '#6BCB77',
  successDark: '#1D5C25',

  // Overlay
  overlay: 'rgba(10,10,15,0.85)',
};

// ─── Tipografia ───────────────────────────────────────────────────────────────
export const FONTS = {
  sizeXs: 11,
  sizeSm: 13,
  sizeMd: 15,
  sizeLg: 18,
  sizeXl: 22,
  size2xl: 28,
  size3xl: 36,
  weightRegular: '400',
  weightMedium: '500',
  weightSemibold: '600',
  weightBold: '700',
};

// ─── Espaçamento ──────────────────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── Border radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const SHADOW = {
  accent: {
    shadowColor: '#7C6AF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
};
