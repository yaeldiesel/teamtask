import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTheme, TextField, Box, Button, Stack, Link, Typography } from '@mui/material';
import NavBarAlt from '../../NavBarAlt/NavBarAlt'

const FormAddProject = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fechaCierre: "",
  });

  //errores
  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    fechaCierre: "",
  });

  const veriToken = async () => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    };
    const respuesta = await fetch(`${props.URL}/api/verificarToken`, config);

    const resJson = await respuesta.json();

    if (respuesta.status == 401) {
      navigate("/");
    }
  };

  useEffect(() => {
    veriToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    // Clear errors as the user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token_user: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...form, idUser: localStorage.getItem("idUser") }),
    };

    const respuesta = await fetch(`${props.URL}/api/proyecto/nuevo`, config);

    const resJson = await respuesta.json();

    if (respuesta.status === 201) {
      navigate('/dashboard');
    } else if (respuesta.status === 401) {
      navigate('/');
    } else if (resJson.mensaje === 'Datos incompletos') {
      // Assuming 'Datos incompletos' means some fields are empty, update errors state
      setErrors({
        nombre: !form.nombre ? 'Este campo es obligatorio' : '',
        descripcion: !form.descripcion ? 'Este campo es obligatorio' : '',
        fechaCierre: !form.fechaCierre ? 'Este campo es obligatorio' : '',
      });
    } else {
      // For other errors, you might want to display a general error message
      console.error(resJson.mensaje);
    }
  };

  return localStorage.getItem("token") ? (
    <>
      <NavBarAlt />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          minHeight: '100vh',
          p: theme.spacing(3),
        }}
      >

        {/* titulo del proyecto */}
        <Box sx={{
          textAlign: 'center',
          mt: 2,
          mb: 2,
          maxWidth: '650px',
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
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)',
              mb: 0,
              fontWeight: 'bold',
            }}
          >
            <span style={{ color: theme.palette.primary.white }}>Crear</span>
            {' '}
            <span style={{ color: theme.palette.primary.contrastText }}>nuevo</span>
            {' '}
            <span style={{ color: theme.palette.primary.white }}>proyecto</span>
          </Typography>
        </Box>

        {/* cajita */}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.white,
            p: theme.spacing(3),
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3],
            maxWidth: '650px',
            width: '100%',
            mb: theme.spacing(3),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <form onChange={handleChange} onSubmit={handleSubmit}>
            <TextField
              type="text"
              id="nombre"
              name="nombre"
              label="Nombre del proyecto"
              placeholder="Nombre del proyecto"
              fullWidth
              margin="normal"
              variant="outlined"
              value={form.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
            <TextField
              type="text"
              id="descripcion"
              name="descripcion"
              label="Descripción"
              placeholder="Descripción"
              fullWidth
              margin="normal"
              variant="outlined"
              value={form.descripcion}
              onChange={handleChange}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography
                variant="overline"
                align="left"
                display="block"
                gutterBottom
                sx={{ fontSize: '12px', mb: -2 }}
              >
                Fecha de Cierre
              </Typography>
            </Box>
            <TextField
              type="date"
              id="fechaCierre"
              name="fechaCierre"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              variant="outlined"
              value={form.fechaCierre}
              onChange={handleChange}
              error={!!errors.fechaCierre}
              helperText={errors.fechaCierre}

            />
            <Button
              sx={{
                textAlign: 'center',
                mt: 2,
                color: theme.palette.primary.white,
                display: 'block',
                mx: 'auto'
              }}
              type="submit"
              variant="contained"
            >
              Crear
            </Button>
          </form>
        </Box>
      </Box>
    </>
  ) : (
    <p>Cargando...</p>
  );
};

export default FormAddProject;