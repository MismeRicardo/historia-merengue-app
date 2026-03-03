/**
 * Colores del Club Universitario de Deportes de Perú
 * Identidad: Rojo, Crema, Negro
 */

import { Platform } from "react-native";

// Paleta del Club Universitario
export const Universitario = {
  rojo: "#C8102E",
  rojoOscuro: "#9B0C22",
  crema: "#F5F0E8",
  cremaOscuro: "#E8E0D0",
  negro: "#1A1A1A",
  grisOscuro: "#2C2C2C",
  grisMedio: "#666666",
  grisClaro: "#F2F2F2",
  blanco: "#FFFFFF",
  dorado: "#C9A84C",
};

export const Colors = {
  light: {
    text: "#1A1A1A",
    background: "#F5F0E8",
    tint: "#C8102E",
    icon: "#666666",
    tabIconDefault: "#999999",
    tabIconSelected: "#C8102E",
    card: "#FFFFFF",
    border: "#E8E0D0",
  },
  dark: {
    text: "#F5F0E8",
    background: "#1A1A1A",
    tint: "#C8102E",
    icon: "#AAAAAA",
    tabIconDefault: "#666666",
    tabIconSelected: "#C8102E",
    card: "#2C2C2C",
    border: "#3A3A3A",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
