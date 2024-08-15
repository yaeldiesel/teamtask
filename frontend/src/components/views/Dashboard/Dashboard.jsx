import { useEffect, useState } from "react";
import NavBar from "../../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import Project from "../../Project/Project";
import theme from "../../../theme";
import { useTheme, Button, Typography, Box, Grid } from '@mui/material';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [proyectos, setProyectos] = useState([]);
  //separar por roles
  const [proyectosRol1, setProyectosRol1] = useState([]);
  const [proyectosRol2, setProyectosRol2] = useState([]);

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

    if (respuesta.status == 200) {
      pedirProyectosUser(resJson._id);
      localStorage.setItem("idUser", resJson._id);
    } else if (respuesta.status == 401) {
      navigate("/");
    }
  };

  const pedirProyectosUser = async (idUser) => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token_user: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ idUser }),
    };

    const respuesta = await fetch(`${props.URL}/api/proyectos/user`, config);
    const resJson = await respuesta.json();

    if (respuesta.status == 200) {
      setProyectos(resJson);

      //roles
      const proyectosRol1 = resJson.filter(proyecto => proyecto.users.some(user => user.userId._id === idUser && user.rol === 1));
      const proyectosRol2 = resJson.filter(proyecto => proyecto.users.some(user => user.userId._id === idUser && user.rol === 2));

      // estado roles
      setProyectosRol1(proyectosRol1);
      setProyectosRol2(proyectosRol2);
    } else {
      alert(resJson.mensaje);
    }
  };

  useEffect(() => {
    veriToken();

    return () => {
      setProyectos([]);
    };
  }, []);

  return (
    <div>
      {localStorage.getItem("token") ? (
        <>
          <NavBar />
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Center horizontally in a column layout
            justifyContent: 'center', // Center vertically in a column layout
            mt: 4,
            width: '100%', // Ensure the Box takes up the full width
          }}>
            <Typography
              variant="overline"
              alignSelf="center"
              align="center"
              display="block"
              gutterBottom
              sx={(theme) => ({
                fontSize: '26px',
                mb: 0,
                fontWeight: 'bold',
                color: theme.palette.primary.main, // Correctly reference the theme color
                letterSpacing: '0.3rem',
              })}
            >
              Panel principal
            </Typography>
            <Typography
              variant="overline"
              alignSelf="flex-start"
              align="center"
              display="block"
              gutterBottom
              sx={(theme) => ({
                fontSize: '20px',
                ml: 4,
                mb: 0,
                fontWeight: 'bold',
                color: theme.palette.primary.main, // Correctly reference the theme color
              })}
            >
              Mis proyectos
            </Typography>
            <Grid container spacing={2} justifyContent="left" style={{ maxWidth: "100%", placeItems: 'center' }}>
              {proyectosRol1.length ? proyectosRol1.map((proyecto) => {
                const fechaCreacionDate = new Date(proyecto.fechaCreacion);
                const fechaCierreDate = new Date(proyecto.fechaCierre);

                const fechaCreacion = fechaCreacionDate.toLocaleDateString("en-CA");
                const fechaCierre = fechaCierreDate.toLocaleDateString("en-CA");

                return (
                  <Grid sx={{ paddingLeft: '40px', mt: 2 }} key={proyecto._id}>
                    <Project
                      datos={{ ...proyecto, fechaCierre, fechaCreacion }}
                    />
                  </Grid>
                );
              }) : (
                <Typography variant="overline" justifySelf="left" align="center" display="block" gutterBottom sx={{ fontSize: '14px', mb: 0, mt: 3, ml: 5 }}>
                  No tienes proyectos.
                </Typography>
              )}
            </Grid>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4
          }}>
            <Typography
              variant="overline"
              alignSelf="flex-start"
              align="center"
              display="block"
              gutterBottom
              sx={(theme) => ({
                fontSize: '20px',
                ml: 4,
                mb: 0,
                fontWeight: 'bold',
                color: theme.palette.primary.main, // Correctly reference the theme color
              })}
            >
              Proyectos asignados
            </Typography>
            <Grid container spacing={2} justifyContent="left" style={{ maxWidth: "100%", placeItems: 'center' }}>
              {proyectosRol2.length ? proyectosRol2.map((proyecto) => {
                const fechaCreacionDate = new Date(proyecto.fechaCreacion);
                const fechaCierreDate = new Date(proyecto.fechaCierre);

                const fechaCreacion = fechaCreacionDate.toLocaleDateString("en-CA");
                const fechaCierre = fechaCierreDate.toLocaleDateString("en-CA");

                return (
                  <Grid sx={{ paddingLeft: '40px', mt: 2 }} key={proyecto._id}>
                    <Project
                      datos={{ ...proyecto, fechaCierre, fechaCreacion }}
                    />
                  </Grid>
                );
              }) : (
                <Typography variant="overline" justifySelf="left" align="center" display="block" gutterBottom sx={{ fontSize: '14px', mb: 0, mt: 3, ml: 5 }}>
                  No tienes proyectos asignados.
                </Typography>
              )}
            </Grid>
          </Box>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Dashboard;