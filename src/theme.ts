import { createTheme } from '@mui/material/styles';



const theme = createTheme({
  palette: {
    primary: {
      main: '#6D1E20', // Il nostro rosso Chianti

    },
    secondary: {
      main: '#757575', // Un grigio neutro per elementi secondari
    },
    background: {
      default: '#FFFFFF', // Sfondo bianco pulito
      paper: '#F5F5F5',   // Sfondo leggermente grigio per le sezioni
    },
    text: {
      primary: '#212121', // Nero non assoluto per una migliore leggibilità
      secondary: '#757575',
    }
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    // h1: {
    //   fontFamily: '"Playfair Display", serif',
    //   fontWeight: 700,
    // },
    // h2: {
    //   fontFamily: '"Playfair Display", serif',
    //   fontWeight: 700,
    // },
    // h3: {
    //   fontFamily: '"Playfair Display", serif',
    //   fontWeight: 700,
    // },
    // h4: {
    //   fontFamily: '"Playfair Display", serif',
    //   fontWeight: 700,
    // },
  },
});

export default theme;