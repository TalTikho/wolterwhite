import { Platform } from 'react-native';

// Web palette colors — matched exactly from your web CSS
const greenAccent = '#3b7a57';   // --button-border / --btn-outline-text
const darkNavyAccent = '#1a365d'; // body.dark-mode --button-border

export const Colors = {
  light: {
    text: '#1a1a1a',              // --text-color
    background: '#f4f4f4',        // --bg-color
    surface: '#ffffff',           // --button-bg (card background)
    tint: greenAccent,            // Primary accent
    icon: '#3b7a57',
    tabIconDefault: '#767577',
    tabIconSelected: greenAccent,
    header: '#ffffff',            // Navbar background
    border: '#3b7a57',            // --button-border
  },
  dark: {
    text: '#e0e0e0',              // body.dark-mode --text-color
    background: '#121212',        // body.dark-mode --bg-color
    surface: '#1f1f1f',           // body.dark-mode --button-bg
    tint: darkNavyAccent,         // body.dark-mode primary accent
    icon: '#1a365d',
    tabIconDefault: '#767577',
    tabIconSelected: '#e0e0e0',
    header: '#1f1f1f',            // Navbar background in dark mode
    border: '#1a365d',            // body.dark-mode --button-border
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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