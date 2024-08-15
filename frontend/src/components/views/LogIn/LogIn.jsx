import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useTheme, Button, TextField, Link, Grid, Box, Typography } from '@mui/material';
export default function LogIn(props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [err, setErr] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      correo: data.get("correo"),
      pass: data.get("pass"),
    };

    try {
      const response = await axios.post(
        `${props.URL}/api/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login exitoso:", response.data);
      localStorage.setItem('token', response.data.token);
      setErr("");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error iniciando sesión:", error.response.data);
      setErr(error.response.data.mensaje);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: theme.spacing(2),
      }}
    >

      {/* encabezado */}
      <Box sx={{
        color: theme.palette.primary.white,
        textAlign: 'center',
        mt: 2,
        mb: 2,
        maxWidth: '500px',
        width: '100%',
        bgcolor: 'primary.main',
        boxShadow: theme.shadows[1],
        mb: theme.spacing(3),
        p: theme.spacing(3),
        pb: theme.spacing(1),
        pt: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3],
      }}>
        <Typography
          variant="overline"
          align="center"
          display="block"
          gutterBottom
          sx={{
            fontSize: '24px',
            mb: 0,
            fontWeight: 'bold',
          }}
        >
          Iniciar sesión
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.white,
          p: theme.spacing(3),
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[3],
          maxWidth: '500px',
          width: '100%',
          mb: theme.spacing(3),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        {/* form */}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          {err && (
            <Typography
              sx={{ fontSize: 17, textAlign: "center" }}
              component="h1"
              variant="body2"
              color="error"
            >
              {err}
            </Typography>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="correo"
            label="Correo electrónico"
            name="correo"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="pass"
            label="Contraseña"
            type="password"
            id="pass"
            autoComplete="current-pass"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ color: theme.palette.primary.white }}
          >
            Iniciar sesión
          </Button>
          <Link href="/register" variant="body2">
            {"¿No tienes una cuenta? Regístrate"}
          </Link>


        </Box>
      </Box>
    </Box>


  );
}
