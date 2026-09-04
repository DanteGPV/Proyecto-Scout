/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const COLORS = {
  light: {
    text: '#11181C',
    textSecondary: '#666666',      // NUEVO — para subtítulos, texto secundario
    textOnPrimary: '#fff',         // NUEVO — texto sobre fondos de color (ej: botones)
    background: '#fff',
    screenBackground: '#E9ECEF',
    backgroundAlt: '#f5f5f5',      // NUEVO — fondo de inputs, cards, etc.
    border: '#e0e0e0',             // NUEVO — bordes de inputs, separadores
    tint: tintColorLight,
    icon: '#687076',
    primary: 'coral',              // NUEVO — color de acción principal (botones, links)
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',      // NUEVO
    textOnPrimary: '#151718',      // NUEVO
    background: '#151718',
    backgroundAlt: '#1E2021',      // NUEVO
    border: '#2A2D2E',             // NUEVO
    tint: tintColorDark,
    icon: '#9BA1A6',
    primary: 'coral',              // NUEVO — mismo valor por ahora, ajustable después
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const TYPOGRAPGY = {
  sizes: {
    small: 12,
    label: 14,       // NUEVO — para textos de links, ayuda, etc.
    body: 16,
    heading: 20,
    title: 24,
    largeTitle: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',  // NUEVO
    bold: '700',
  },
}as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  mdp: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const RADIUS = {          // NUEVO — bloque completo
  sm: 8,
  md: 12,
  lg: 25,
  full: 9999,
}