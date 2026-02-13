// Helper to convert hex to space-separated rgb for tailwind alpha support
// format: "r g b"
export const hexToRgb = (hex: string) => {
  if (!hex) return '0 0 0';
  
  // Handle shorthand #ABC
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result 
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` 
    : '0 0 0';
};

export const applyThemeToDocument = (theme: { primary: string; secondary: string; accent: string; background: string; surface: string; }) => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', hexToRgb(theme.primary));
  root.style.setProperty('--color-secondary', hexToRgb(theme.secondary));
  root.style.setProperty('--color-accent', hexToRgb(theme.accent));
  root.style.setProperty('--color-background', hexToRgb(theme.background));
  root.style.setProperty('--color-surface', hexToRgb(theme.surface));
};
