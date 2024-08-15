import { Link, useNavigate } from "react-router-dom";
import * as React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useTheme } from "@emotion/react";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const NavBarAlt = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("idUser");
        navigate("/");
    };

    return (
        <Box sx={{
            flexGrow: 1,
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'primary.theme.components.MuiCssBaseline.styleOverrides.body.backgroundColor',
            mb: 2,
        }}>

            <Stack direction="row" spacing={0} sx={{ ml: 3 }}>
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ color: theme.palette.primary.main, m: 0, p: 0, }}
                >
                </Button>
                <Button
                    variant="h1"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        letterSpacing: '0.1rem',
                        color: 'primary.main',
                        textTransform: 'none',
                    }}
                    component={Link}
                    to="/dashboard"
                    align="center"
                    width="auto"
                >
                    <span>team</span>
                    <span>task</span>
                </Button>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mr: 3 }}>
                <Button
                    sx={{
                        color: 'primary.main',
                        boxShadow: 'none',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        m: 0
                    }}
                    onClick={cerrarSesion}
                >
                    Cerrar Sesión
                </Button>
            </Stack>
        </Box >
    );
};

export default NavBarAlt;