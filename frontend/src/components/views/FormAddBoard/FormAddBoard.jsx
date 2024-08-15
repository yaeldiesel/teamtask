import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useTheme, TextField, Box, Button, Stack, Link, Typography, Snackbar, Alert } from '@mui/material';

const FormAddBoard = (props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { idProject } = useParams(); // Get the project ID from URL parameters
    const [form, setForm] = useState({
        title: "",
    });

    // Errors state
    const [errors, setErrors] = useState({
        title: ""
    });

    // Snackbar state for success message
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
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
            body: JSON.stringify({ ...form, project: idProject }),
        };

        try {
            const respuesta = await fetch(`${props.URL}/api/proyecto/${idProject}/newkanban`, config);

            if (respuesta.ok) {
                const newBoard = await respuesta.json();
                props.addBoardCallback(newBoard); // Assuming newBoard is the created board object
                setOpenSnackbar(true);
                setForm({ title: "" });
            } else if (respuesta.status == 401) {
                navigate("/");
            } else {
                // Handle non-200 responses
                console.error(`Error: ${respuesta.status}`);
                // Optionally, handle different status codes differently
            }
        } catch (error) {
            console.error('Error parsing response:', error);
        }
    };

    // Close snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (

        <Box
            sx={{
                backgroundColor: theme.palette.primary.white,
                p: theme.spacing(3),
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[3],
                maxWidth: '650px',
                width: '100%',
                m: theme.spacing(3),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <form onChange={handleChange} onSubmit={handleSubmit}>
                <TextField
                    type="text"
                    id="title"
                    name="title"
                    label="Titulo del tablero"
                    placeholder="Título del tablero"
                    margin="normal"
                    variant="outlined"
                    value={form.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    sx={{
                        minWidth: '550px',
                        width: '100%'
                    }}
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
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Tablero creado con éxito!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FormAddBoard;