import React from "react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useTheme, TextField, Box, Button, Stack, Typography, Snackbar, Alert, Link as MuiLink, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const KanbanBoardDetalle = ({ board, idProject, onDelete }) => {
    const [veri, setVeri] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();

    const handleOpenDialog = () => setOpenDialog(true); // Helper function to open the dialog
    const handleCloseDialog = () => setOpenDialog(false); // Helper function to close the dialog

    const confirmDelete = () => { // Step 3
        handleCloseDialog();
        deleteBoard(); // Assuming deleteBoard is your function to delete the board
    };

    useEffect(() => {
        const fetchProjectUsers = async () => {
            const url = `http://localhost:8080/api/proyecto/${idProject}/users`;
            try {
                const response = await fetch(url, {
                    headers: {
                        "token_user": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    // console.log("Response data:", data); // Temporarily log the data for inspection

                    if (data && Array.isArray(data)) {
                        const isUserAuthorized = data.some(user =>
                            user.userId._id === localStorage.getItem("idUser") && user.rol === 1
                        );
                        setVeri(isUserAuthorized);
                    } else {
                        console.error("data is undefined or not an array", data);
                        setVeri(false);
                    }
                }
            } catch (error) {
                console.error("Error fetching project users:", error);
            }
        };

        if (board.datos) {
            const isUserAuthorized = board.datos.users.some(user =>
                user.userId._id === localStorage.getItem("idUser") && user.rol === 1
            );
            setVeri(isUserAuthorized);
        } else {
            // Fetch project users if datos is not part of board
            fetchProjectUsers();
        }
    }, [board, idProject]);

    const deleteBoard = async () => {
        // Check if board._id is undefined before attempting to delete
        if (!board._id) {
            console.error("Board ID is undefined. Cannot delete board.");
            alert("Error: Board ID is missing. Cannot delete board.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/proyecto/${idProject}/kanban/${board._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "token_user": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                onDelete(); // Call onDelete to refresh the boards list in the parent component
            }
        } catch (error) {
            console.error(error);
        }
    };

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    }

    return (
        <Box sx={{
            backgroundColor: 'primary.contrastText',
            p: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            border: '1px solid',
            borderColor: 'primary.contrastText',
            maxWidth: '600px',
            width: '100%',
            mb: theme.spacing(3),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <Typography
                variant="h5"
                component="div"
                sx={{
                    fontSize: '1.25rem',
                    color: theme.palette.primary.main,
                    m: 1,
                    p: 2,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    letterSpacing: '0.10rem',
                }}>
                {truncateText(board.title, 23)}
            </Typography>

            {/* botones */}
            <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: theme.spacing(1), // Add this line to create a gap between the buttons
                m: theme.spacing(1),
            }}>
                {/* Only render the delete button if board._id is defined */}
                {veri && board._id &&
                    <Button
                        variant="outlined"
                        onClick={handleOpenDialog}
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
                }
                <Button
                    variant="outlined"
                    sx={{
                        backgroundColor: 'primary.dark',
                        borderColor: 'primary.dark',
                        color: 'primary.white',
                        boxShadow: 'none',
                        '&:hover': {
                            color: 'primary.white',
                            backgroundColor: 'primary.dark',
                            borderColor: 'primary.dark',
                        },
                        fontSize: '0.75rem',
                        width: 'auto',
                        height: 'auto'
                    }}
                    component={Link}
                    to={`/detalles/${idProject}/${board._id}`}
                    align='center'
                    width='auto'
                >
                    Ampliar
                </Button>


                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Estás seguro de que quieres eliminar este tablero?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={confirmDelete} autoFocus>
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default KanbanBoardDetalle;
