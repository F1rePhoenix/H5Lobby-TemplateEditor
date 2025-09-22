import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TemplateProvider } from './contexts/TemplateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import MainEditor from './pages/MainEditor';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F1BF11', // Желтый акцентный цвет
      contrastText: '#000',
    },
    secondary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F1BF11',
          color: '#000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#E0AE10',
          },
        },
        containedPrimary: {
          color: '#000',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid #ddd',
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
      <TemplateProvider>
        <div className="App">
          <MainEditor />
        </div>
      </TemplateProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;