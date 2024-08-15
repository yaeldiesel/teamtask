import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useTheme, Button, TextField, Link, Grid, Box, Typography } from '@mui/material';

export default function Register(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      nombre: data.get("nombre"),
      apellido: data.get("apellido"),
      correo: data.get("correo"),
      pass: data.get("pass"),
    };

    try {
      const response = await axios.post(`${props.URL}/api/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Registration successful:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setError(`Error: ${error.response.data.mensaje}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setError("No response received from server. Please try again.");
      } else {
        // Something else happened in making the request that triggered an error
        console.error("Error message:", error.message);
        setError("Error making request. Please try again later.");
      }
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
          Registrarse
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
          {error && (
            <Typography
              sx={{ mb: 2, fontSize: 17, textAlign: "center" }}
              component="h1"
              variant="body2"
              color="error"
            >
              {error}
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                name="nombre"
                id="nombre"
                label="Nombre"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="family-name"
                required
                fullWidth
                id="apellido"
                label="Apellido"
                name="apellido"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="correo"
                label="Correo electrónico"
                name="correo"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="pass"
                label="Contraseña"
                type="password"
                id="pass"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ color: theme.palette.primary.white }}
          >
            Registrarse
          </Button>
          <Link href="/" variant="body2">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
