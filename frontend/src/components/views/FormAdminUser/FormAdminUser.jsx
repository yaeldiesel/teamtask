import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useTheme, TextField, Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Autocomplete, Select, MenuItem, FormControl, InputLabel, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import NavBarAlt from '../../NavBarAlt/NavBarAlt';

const FormAdminUser = (props) => {
  const theme = useTheme();
  const { idProject } = useParams();
  const [proyecto, setProyecto] = useState({});
  const navigate = useNavigate();

  //dialog user
  const [openDialog, setOpenDialog] = useState(false);
  const [userEmailToDelete, setUserEmailToDelete] = useState('');

  const handleOpenDialog = (email) => {
    setUserEmailToDelete(email);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const confirmDelete = () => {
    deleteUser(userEmailToDelete);
    setOpenDialog(false);
  };

  //dialog project
  const [openProjectDialog, setOpenProjectDialog] = useState(false);

  const confirmDeleteProject = () => {
    deleteProject();
    setOpenProjectDialog(false); // Close the dialog
  };

  // Button or method to trigger the dialog
  const handleOpenProjectDialog = () => {
    setOpenProjectDialog(true);
  };

  const [form, setForm] = useState({
    correo: "",
    rol: "",
  });

  // `${props.URL}/api/users`,

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token_user: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      try {
        const respuesta = await fetch(`${props.URL}/api/users`, config);
        if (!respuesta.ok) throw new Error('Failed to fetch users');
        const data = await respuesta.json();
        setUsers(data);
      } catch (error) {
        console.error("Fetch users error:", error);
        // Handle errors (e.g., show a notification)
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (event, value) => {
    setForm({ ...form, correo: value ? value.correo : '' });
  };

  const handleRoleChange = (event) => {
    setForm({ ...form, rol: event.target.value });
  };


  //alerts
  const [showAlert, setShowAlert] = useState(false);
  const [triggerNavigation, setTriggerNavigation] = useState(false); // Step 1: New state for navigation trigger

  // errores
  const [correoError, setCorreoError] = useState('');
  const [rolError, setRolError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    // errores
    if (id === 'correo') setCorreoError('');
    if (id === 'rol') setRolError('');
    setError('');
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setCorreoError('');
    setRolError('');

    if (form.rol == 1 || form.rol == 2) {
      const config = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token_user: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...form, idProject }),
      };

      // console.log(config)

      const respuesta = await fetch(
        `${props.URL}/api/proyecto/adduser`,
        config
      );

      const resJson = await respuesta.json();

      if (respuesta.status == 200) {
        pedirProyecto();

      } else if (respuesta.status == 401) {
        navigate("/");
      } else {
        // actualizar error
        if (resJson.mensaje === "No se encontró el usuario" || resJson.mensaje === "El usuario ya se encuentra agregado en este proyecto") {
          setCorreoError(resJson.mensaje);
        } else {
          setGeneralError('Ocurrió un error al agregar el usuario. Por favor, intenta de nuevo.');
        }
      }
    } else {
      if (form.rol !== 1 && form.rol !== 2) {
        setRolError("Debe asignarse un Rol al Usuario.");
      }
    }
  };

  const pedirProyecto = async () => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token_user: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ idProject }),
    };

    const respuesta = await fetch(`${props.URL}/api/proyecto/detalle`, config);

    const resJson = await respuesta.json();

    if (respuesta.status == 200) {
      setProyecto(resJson);
    } else if (respuesta.status == 401) {
      navigate("/");
    }
  };

  const deleteUser = async (correo) => {

    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token_user: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ correo, idProject }),
    };

    const respuesta = await fetch(
      `${props.URL}/api/proyecto/deleteuser`,
      config
    );

    const resJson = await respuesta.json();

    if (respuesta.status == 200) {
      pedirProyecto();
    } else if (respuesta.status == 401) {
      navigate("/");
    } else {
      alert(resJson.mensaje);
    }
  };

  const deleteProject = () => {

    fetch(`${props.URL}/api/proyecto/delete`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        token_user: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ idProject: idProject }),
    })
      .then(response => {
        console.log(response.status);
        if (!response.ok) {
          throw new Error(`Network response was not ok, status code: ${response.status}`);
        }
        if (response.headers.get("content-length") === "0") {
          return null;
        } else {
          return response.json();
        }
      })
      .then(() => {
        setShowAlert(true);
        setTimeout(() => setTriggerNavigation(true), 3000);
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error.");
      });
  };

  function truncateText(text, maxLength) {
    if (!text) {
      return '';
    }
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  useEffect(() => {
    if (triggerNavigation) {
      navigate("/dashboard");
    }
  }, [triggerNavigation, navigate]);

  useEffect(() => {
    pedirProyecto();

    return () => {
      setProyecto({});
    };
  }, []);

  return (
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
              mb: 0,
              fontWeight: 'bold',
              overflowWrap: 'break-word', // Allows long words to be broken and wrap to the next line
              wordBreak: 'break-word', // Ensures words break to prevent overflow
              maxWidth: '100%', // Ensures it respects the container's width
              padding: '0 2%', // Responsive padding
              margin: 'auto',
              lineHeight: '2',
            }}
          >
            <span style={{ color: theme.palette.primary.white }}>Proyecto:</span>
            {' '}
            <span style={{ color: theme.palette.primary.contrastText }}>
              {proyecto.nombre}
            </span>
          </Typography>
        </Box>

        {/*  cajita de tabla */}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.contrastText,
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

          {/* titulo de admin */}
          <Box sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
            <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '18px', mb: 0, color: theme.palette.primary.main, fontWeight: '600' }}>
              Administrar usuarios
            </Typography>
          </Box>

          {/* tabla */}
          {proyecto.users ? (
            <Box
              sx={{
                width: '100%',
              }}>
              <TableContainer component={Paper} sx={{ borderRadius: theme.shape.borderRadius, }}>
                <Table aria-label="user table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <Typography variant="overline" style={{ textTransform: 'uppercase' }}>Nombre</Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <Typography variant="overline" style={{ textTransform: 'uppercase' }}>Apellido</Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <Typography variant="overline" style={{ textTransform: 'uppercase' }}>Correo</Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <Typography variant="overline" style={{ textTransform: 'uppercase' }}>Rol</Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <Typography variant="overline" style={{ textTransform: 'uppercase' }}>Acción</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proyecto.users.map((user) => {
                      return (
                        <TableRow key={user.userId._id}>
                          <TableCell style={{ padding: '10px' }}>{user.userId.nombre}</TableCell>
                          <TableCell style={{ padding: '10px' }}>{user.userId.apellido}</TableCell>
                          <TableCell style={{ padding: '10px' }}>{user.userId.correo}</TableCell>
                          <TableCell style={{ padding: '10px' }}>
                            {user.rol === 1 ? "Administrador" : user.rol === 2 ? "Colaborador" : ""}
                          </TableCell>
                          <TableCell style={{ padding: '10px' }}>
                            <Button
                              variant="outlined"
                              onClick={() => handleOpenDialog(user.userId.correo)}
                              sx={{
                                color: theme.palette.error.main,
                                borderColor: theme.palette.error.main,
                                '&:hover': {
                                  color: theme.palette.error.contrastText,
                                  backgroundColor: theme.palette.error.main,
                                  borderColor: theme.palette.error.main,
                                },
                                fontSize: '0.75rem',
                                width: 'auto',
                                height: 'auto'
                              }}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Dialog component */}
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    ¿Estás seguro de que quieres eliminar este usuario?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancelar</Button>
                  <Button onClick={confirmDelete} autoFocus>
                    Confirmar
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={openProjectDialog}
                onClose={() => setOpenProjectDialog(false)}
                aria-labelledby="project-dialog-title"
                aria-describedby="project-dialog-description"
              >
                <DialogTitle id="project-dialog-title">{"Confirmar eliminación"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="project-dialog-description">
                    ¿Estás seguro de que quieres eliminar este proyecto?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenProjectDialog(false)}>Cancelar</Button>
                  <Button onClick={confirmDeleteProject} autoFocus>
                    Eliminar
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '14px', mb: 0 }}>
                Cargando...
              </Typography>
            </Box>
          )}
        </Box >

        {/* agregar */}
        < Box
          sx={{
            backgroundColor: theme.palette.primary.white,
            p: theme.spacing(3),
            mb: theme.spacing(3),
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3],
            maxWidth: '650px',
            width: '100%',
          }}
        >
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '18px', mb: 0, color: theme.palette.primary.main, fontWeight: '600' }}>
              Agregar Usuarios
            </Typography>
          </Box>

          {/* formulario para agregar usuarios */}
          <Box sx={{ '& .MuiTextField-root': { m: 1, minWidth: 120, width: '400px' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* errores */}
            <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
              {rolError && <Alert severity="error">{rolError}</Alert>}
              {correoError && <Alert severity="error">{correoError}</Alert>}
              {generalError && <Alert severity="error">{generalError}</Alert>}
            </Stack>

            {/* selects */}
            <Autocomplete
              id="user-dropdown"
              options={users}
              getOptionLabel={(option) => option.nombre + ' ' + option.apellido}
              onChange={handleUserChange}
              renderInput={(params) => <TextField {...params} label="Seleccionar Usuario" />}
            />
            <FormControl style={{ m: 1, minWidth: 120, width: '400px' }}>
              <InputLabel id="role-select-label">Rol</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={form.rol}
                label="Asignar Rol"
                onChange={handleRoleChange}
              >
                <MenuItem value={1}>Administrador</MenuItem>
                <MenuItem value={2}>Colaborador</MenuItem>
              </Select>
            </FormControl>
            <Button sx={{
              textAlign: 'center',
              mt: 2,
              color: theme.palette.primary.white,
              display: 'block',
              mx: 'auto'
            }} variant="contained"
              onClick={handleSubmit}>
              Agregar
            </Button>
          </Box>


        </Box >

        {showAlert && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{
          maxWidth: '670px',
          width: '100%',
          mb: 3
        }}>
          Proyecto eliminado exitosamente.
        </Alert>}

        {/* eliminar proyecto */}
        <Button
          type="submit"
          variant="outlined"
          onClick={handleOpenProjectDialog}
          sx={{
            p: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            maxWidth: '650px',
            width: '100%',
            textAlign: 'center',
            color: theme.palette.error.main,
            borderColor: theme.palette.error.main,
            fontSize: '0.75rem',
            '&:hover': {
              color: theme.palette.error.contrastText,
              backgroundColor: theme.palette.error.main,
              borderColor: theme.palette.error.main,
            },
          }}
        >
          Eliminar proyecto
        </Button>
      </Box >
    </>
  );
};

export default FormAdminUser;