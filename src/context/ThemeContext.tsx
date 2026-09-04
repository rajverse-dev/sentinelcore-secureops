import React, { createContext, useContext, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export type ThemeName = 'sentinel' | 'midnight' | 'emerald' | 'crimson' | 'ocean';
export type ThemeMode = 'light' | 'dark';

export interface ColorPalette {
  primary: string;
  secondary: string;
  bg: string;
  surface: string;
  sidebar: string;
  header: string;
  card: string;
  cardHover: string;
  border: string;
  primaryText: string;
  secondaryText: string;
  healthy: string;
  warning: string;
  critical: string;
  info: string;
  activeNavBg: string;
}

const themeConfigs: Record<ThemeName, Record<ThemeMode, ColorPalette>> = {
  sentinel: {
    light: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      sidebar: '#F5F7FA',
      header: '#FFFFFF',
      card: '#F3F6FB',
      cardHover: '#EBF0F7',
      border: '#E2E8F0',
      primaryText: '#1E293B',
      secondaryText: '#64748B',
      healthy: '#22C55E',
      warning: '#F59E0B',
      critical: '#EF4444',
      info: '#38BDF8',
      activeNavBg: 'rgba(139, 92, 246, 0.1)'
    },
    dark: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      bg: '#0F1117',
      surface: '#202633',
      sidebar: '#151923',
      header: '#1A1F2B',
      card: '#202633',
      cardHover: '#272E3D',
      border: '#343B4A',
      primaryText: '#F8FAFC',
      secondaryText: '#A8B1C2',
      healthy: '#22C55E',
      warning: '#F59E0B',
      critical: '#EF4444',
      info: '#38BDF8',
      activeNavBg: 'rgba(139, 92, 246, 0.15)'
    }
  },
  midnight: {
    light: { primary: '#8B5CF6', secondary: '#EC4899', bg: '#F5F3FF', surface: '#FFFFFF', sidebar: '#F5F3FF', header: '#FFFFFF', card: '#FAF5FF', cardHover: '#F3E8FF', border: '#E9D5FF', primaryText: '#1F1335', secondaryText: '#6B21A8', healthy: '#22C55E', warning: '#F59E0B', critical: '#EF4444', info: '#38BDF8', activeNavBg: 'rgba(139, 92, 246, 0.1)' },
    dark: { primary: '#A78BFA', secondary: '#F472B6', bg: '#0F0A1B', surface: '#1A1433', sidebar: '#140D27', header: '#1A1433', card: '#1A1433', cardHover: '#2D1F47', border: '#3D2854', primaryText: '#F8FAFC', secondaryText: '#A8B1C2', healthy: '#22C55E', warning: '#F59E0B', critical: '#EF4444', info: '#38BDF8', activeNavBg: 'rgba(167, 139, 250, 0.15)' }
  },
  emerald: {
    light: { primary: '#10B981', secondary: '#059669', bg: '#F0FDF4', surface: '#FFFFFF', sidebar: '#F0FDF4', header: '#FFFFFF', card: '#ECFDF5', cardHover: '#D1FAE5', border: '#A7F3D0', primaryText: '#065F46', secondaryText: '#047857', healthy: '#22C55E', warning: '#F59E0B', critical: '#EF4444', info: '#38BDF8', activeNavBg: 'rgba(16, 185, 129, 0.1)' },
    dark: { primary: '#34D399', secondary: '#6EE7B7', bg: '#051F1A', surface: '#0F2F28', sidebar: '#041E18', header: '#0F2F28', card: '#0F2F28', cardHover: '#1A4D45', border: '#245C55', primaryText: '#F8FAFC', secondaryText: '#A8B1C2', healthy: '#22C55E', warning: '#F59E0B', critical: '#EF4444', info: '#38BDF8', activeNavBg: 'rgba(52, 211, 153, 0.15)' }
  },
  crimson: {
    light: { primary: '#EF4444', secondary: '#DC2626', bg: '#FEF2F2', surface: '#FFFFFF', sidebar: '#FEF2F2', header: '#FFFFFF', card: '#FEE2E2', cardHover: '#FECACA', border: '#FECACA', primaryText: '#7F1D1D', secondaryText: '#991B1B', healthy: '#22C55E', warning: '#F59E0B', critical: '#EF4444', info: '#38BDF8', activeNavBg: 'rgba(239, 68, 68, 0.1)' },
    dark: { primary: '#FCA5A5', secondary: '#F87171', bg: '#1F0F0F', surface: '#3F1C1C', sidebar: '#2A0C0C', header: '#3F1C1C', card: '#3F1C1C', cardHover: '#5C2E2E', border: '#7F3A3A', primaryText: '#F8FAFC', secondaryText: '#A8B1C2', healthy: '#22C55E', warning: '#F59E0B', critical: '#EF4444', info: '#38BDF8', activeNavBg: 'rgba(252, 165, 165, 0.15)' }
  },
  ocean: {
    light: { primary: '#0EA5E9', secondary: '#06B6D4', bg: '#F0F9FF', surface: '#FFFFFF', sidebar: '#F0F9FF', header: '#FFFFFF', card: '#E0F2FE', cardHover: '#BAE6FD', border: '#7DD3FC', primaryText: '#0C4A6E', secondaryText: '#0369A1', healthy: '#22C55E', warning: '#F59E0B', critical: '#EF4444', info: '#38BDF8', activeNavBg: 'rgba(14, 165, 233, 0.1)' },
    dark: { primary: '#38BDF8', secondary: '#22D3EE', bg: '#0C1E2E', surface: '#164E63', sidebar: '#082543', header: '#164E63', card: '#164E63', cardHover: '#1F5F7F', border: '#2A7A9B', primaryText: '#F8FAFC', secondaryText: '#A8B1C2', healthy: '#22C55E', warning: '#F59E0B', critical: '#EF4444', info: '#38BDF8', activeNavBg: 'rgba(56, 189, 248, 0.15)' }
  }
};

interface ThemeContextType {
  themeName: ThemeName;
  themeMode: ThemeMode;
  colors: ColorPalette;
  setThemeName: (name: ThemeName) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('sentinel');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const colors = themeConfigs[themeName][themeMode];

  const muiTheme = createTheme({
    palette: {
      mode: themeMode,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      background: {
        default: colors.bg,
        paper: colors.surface
      },
      text: {
        primary: colors.primaryText,
        secondary: colors.secondaryText
      },
      success: { main: colors.healthy },
      warning: { main: colors.warning },
      error: { main: colors.critical },
      info: { main: colors.info }
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", sans-serif'
    }
  });

  return (
    <ThemeContext.Provider value={{ themeName, themeMode, colors, setThemeName, setThemeMode }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeContextProvider');
  return context;
}
