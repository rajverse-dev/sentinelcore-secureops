import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5EEAD4',
      dark: '#2DD4BF'
    },
    secondary: {
      main: '#7DD3FC'
    },
    background: {
      default: '#07141F',
      paper: '#0D1B2A'
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#94A3B8'
    },
    error: {
      main: '#F87171'
    },
    warning: {
      main: '#FBBF24'
    },
    success: {
      main: '#34D399'
    },
    info: {
      main: '#60A5FA'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          boxShadow: '0px 12px 32px rgba(2, 6, 23, 0.4)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B1724',
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0B1724',
          borderRight: '1px solid rgba(148, 163, 184, 0.12)'
        }
      }
    }
  }
});

export default theme;
