import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useTheme, Button, Typography, CardActions, CardContent, Card, Box } from '@mui/material';

const Project = (props) => {
  const theme = useTheme();
  const [veri, setVeri] = useState(false);

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  function formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    return new Intl.DateTimeFormat('es-ES', options).format(new Date(dateString));
  }

  useEffect(() => {
    props.datos.users.forEach((user) => {
      if (user.userId._id == localStorage.getItem("idUser") && user.rol == 1) {
        setVeri(true);
      }
    });
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.primary.white,
        borderRadius: 2,
        boxShadow: 3,
        width: 400,
        height: 'auto',
        mt: 1,
        mb: 3,
        '&:not(:last-child)': {
          ml: 1,
          mr: 1,
        }
      }}
    >

      {/* box de nombre */}
      <Box sx={{
        width: '100%',
        height: 'fit-content',
        backgroundColor: theme.palette.primary.contrastText,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
      }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: theme.palette.primary.white,
            m: 1,
            p: 2,
            textAlign: 'center',
            fontWeight: 'bold',
            letterSpacing: '0.10rem',
          }}
        >
          {truncateText(props.datos.nombre, 21)}
        </Typography>
      </Box>

      {/* box de contenido */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ pt: 2, pb: 1, pl: 2, pr: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Typography sx={{ mb: 1.5 }} color="text.primary.dark">
            {truncateText(props.datos.descripcion, 38)}
          </Typography>
          <Typography sx={{ mb: 1 }} color="text.primary.dark">
            Cierra el {formatDate(props.datos.fechaCierre)}
          </Typography>
        </Box>


        {/* botones */}
        <Box sx={{ width: '100%', p: 2, mt: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {veri && (
            <Button
              component={Link}
              to={`/admin/${props.datos._id}`}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: 'primary.white',
                color: 'primary.dark',
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  borderColor: 'primary.light',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
                }
              }}
            >
              Administrar
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            component={Link}
            to={`/detalles/${props.datos._id}`}
            sx={{
              backgroundColor: 'primary.white',
              color: 'primary.dark',
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'primary.dark',
              '&:hover': {
                backgroundColor: 'primary.light',
                borderColor: 'primary.light',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
              }
            }}
          >
            Ver detalles
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Project;