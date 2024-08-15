import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#e43d12',
            fondo: '#ebe9e1',
            contrastText: '#efb11d',
            light: '#ffa2b6',
            white: '#ffffff',
            dark: '#d6536d',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#ebe9e1',
                },
            },
        },
    },
});

export default theme;