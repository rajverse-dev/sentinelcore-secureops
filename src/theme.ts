import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
      dark: '#6D28D9'
    },
    secondary: {
      main: '#4F46E5'
    },
    background: {
      default: '#0B1020',
      paper: '#151C2C'
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#A7B0C0'
    },
    error: {
      main: '#EF4444'
    },
    warning: {
      main: '#F59E0B'
    },
    success: {
      main: '#22C55E'
    },
    info: {
      main: '#22D3EE'
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
          background: '#151C2C',
          border: '1px solid #334155',
          boxShadow: '0px 12px 32px rgba(2, 6, 23, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#7C3AED',
            boxShadow: '0px 12px 48px rgba(124, 58, 237, 0.15)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B1020',
          borderBottom: '1px solid #334155'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0B1020',
          borderRight: '1px solid #334155'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#151C2C',
          border: '1px solid #334155',
          transition: 'all 0.3s ease'
        }
      }
    }
  }
});

export default theme;
