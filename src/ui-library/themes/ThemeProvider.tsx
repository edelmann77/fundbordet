import React, { createContext, useContext, CSSProperties, ReactNode } from 'react';
import { Theme } from './types';
import { outdoorTheme } from './outdoorTheme';

const ThemeContext = createContext<Theme>(outdoorTheme);

/** Maps a Theme object to the CSS custom properties consumed by tf-ui components. */
function themeToCssVars(theme: Theme): CSSProperties {
  return {
    '--tf-primary': theme.colors.primary,
    '--tf-primary-dark': theme.colors.primaryDark,
    '--tf-primary-light': theme.colors.primaryLight,
    '--tf-secondary': theme.colors.secondary,
    '--tf-secondary-dark': theme.colors.secondaryDark,
    '--tf-secondary-light': theme.colors.secondaryLight,
    '--tf-accent': theme.colors.accent,
    '--tf-accent-dark': theme.colors.accentDark,
    '--tf-accent-light': theme.colors.accentLight,
    '--tf-bg': theme.colors.background,
    '--tf-surface': theme.colors.surface,
    '--tf-surface-elevated': theme.colors.surfaceElevated,
    '--tf-text-primary': theme.colors.textPrimary,
    '--tf-text-secondary': theme.colors.textSecondary,
    '--tf-text-disabled': theme.colors.textDisabled,
    '--tf-text-inverse': theme.colors.textInverse,
    '--tf-border': theme.colors.border,
    '--tf-border-focus': theme.colors.borderFocus,
    '--tf-border-error': theme.colors.borderError,
    '--tf-error': theme.colors.error,
    '--tf-error-light': theme.colors.errorLight,
    '--tf-warning': theme.colors.warning,
    '--tf-warning-light': theme.colors.warningLight,
    '--tf-success': theme.colors.success,
    '--tf-success-light': theme.colors.successLight,
    '--tf-info': theme.colors.info,
    '--tf-info-light': theme.colors.infoLight,
    '--tf-font': theme.typography.fontFamily,
    '--tf-font-mono': theme.typography.fontFamilyMono,
  } as CSSProperties;
}

export interface ThemeProviderProps {
  /** The theme to apply. Defaults to the built-in outdoor theme. */
  theme?: Theme;
  children: ReactNode;
}

/**
 * Wrap your application (or a section of it) with `ThemeProvider` to apply
 * a theme to all tf-ui components. Theme tokens are injected as CSS custom
 * properties on a wrapper element — no CSS-in-JS runtime required.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = outdoorTheme,
  children,
}) => {
  return (
    <ThemeContext.Provider value={theme}>
      <div style={themeToCssVars(theme)}>{children}</div>
    </ThemeContext.Provider>
  );
};

/** Access the current theme object inside any component. */
export const useTheme = (): Theme => useContext(ThemeContext);
