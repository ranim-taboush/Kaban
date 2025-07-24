// app/providers/ThemeProvider.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { indigo, purple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: { main: indigo[500] },
    secondary: { main: purple[500] },
    background: { default: '#f9fafb', paper: '#fff' },
    mode: 'light',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    h2: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow:
              '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

export default function MThemeProvider({ children }: { children: ReactNode; }) {

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {// Remove JSS server-side styles
      jssStyles.parentElement?.removeChild(jssStyles);
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    document.documentElement.classList.toggle('dark', darkModeMediaQuery.matches);
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}