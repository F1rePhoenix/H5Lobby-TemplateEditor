import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TemplateProvider } from './contexts/TemplateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import MainEditor from './pages/MainEditor';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark', // Явно указываем темную тему
    primary: {
      main: '#F1BF11',
      contrastText: '#000',
    },
    secondary: {
      main: '#daa520',
    },
    background: {
      default: '#0a0a0f',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#e8e6e3',
      secondary: '#a0a0a0',
    },
    divider: '#F1BF11',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a0f', // Принудительно устанавливаем фон
          color: '#e8e6e3',
          '&::backdrop': {
            backgroundColor: '#0a0a0f',
          },
        },
        'h5, h4, .MuiTypography-h5': {
        color: '#F1BF11 !important'
      },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a2e',
          color: '#e8e6e3',
          borderBottom: '2px solid #F1BF11',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#daa520',
          },
        },
        containedPrimary: {
          color: '#000',
          backgroundColor: '#F1BF11',
          '&:hover': {
            backgroundColor: '#daa520',
          },
        },
        outlined: {
          borderColor: '#F1BF11',
          color: '#F1BF11',
          '&:hover': {
            backgroundColor: 'rgba(241, 191, 17, 0.1)',
            borderColor: '#daa520',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a2e',
          border: '1px solid #F1BF11',
          boxShadow: '0 0 10px rgba(218, 165, 32, 0.3)',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiTextField: {
  styleOverrides: {
    root: {
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#1a1a2e',
        '& fieldset': {
          borderColor: '#F1BF11',
        },
        '&:hover fieldset': {
          borderColor: '#daa520',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#F1BF11',
        },
        // Цвет стрелочек числовых полей
        '& input[type=number]::-webkit-outer-spin-button': {
          filter: 'invert(1) brightness(2)',
        },
        '& input[type=number]::-webkit-inner-spin-button': {
          filter: 'invert(1) brightness(2)',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#a0a0a0',
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#F1BF11',
      },
    },
  },
},
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a2e',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F1BF11',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#daa520',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F1BF11',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#F1BF11',
          '&.Mui-checked': {
            color: '#F1BF11',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#F1BF11',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#F1BF11',
          },
        },
      },
    },
    // Добавляем стили для других компонентов которые могут быть белыми
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a2e',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a2e',
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a2e',
          backgroundImage: 'none',
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
          <div 
            className="App" 
            style={{ 
              backgroundColor: '#0a0a0f', 
              minHeight: '100vh',
              color: '#e8e6e3'
            }}
          >
            <MainEditor />
          </div>
        </TemplateProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;