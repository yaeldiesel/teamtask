import { Link, useNavigate } from "react-router-dom";
import * as React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useTheme } from "@emotion/react";

const NavBar = () => {
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
      backgroundColor: 'primary.main',
      mb: 3,
    }}>
      <Button
        variant="h1"
        sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          letterSpacing: '0.1rem',
          ml: 3,
          color: 'primary.white',
          textTransform: 'none',
        }}
        component={Link}
        to="/dashboard"
        align='center'
        width='auto'
      >
        <span>team</span>
        <span>task</span>
      </Button>

      <Stack direction="row" spacing={2} sx={{ mr: 3 }}>
        <Button
          sx={{
            color: 'primary.white',
            boxShadow: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            m: 0
          }}
          component={Link}
          to="/proyecto/new"
          align='center'
          width='auto'
        >
          Crear nuevo Proyecto
        </Button>
        <Button
          sx={{
            color: 'primary.white',
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

export default NavBar;