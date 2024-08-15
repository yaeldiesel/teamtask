import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, Button, Typography, Stack, useTheme, alpha } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import KanbanBoardDetalle from "../../KanbanBoardDetalle/KanbanBoardDetalle";
import FormAddBoard from "../FormAddBoard/FormAddBoard";
import NavBarAlt from "../../NavBarAlt/NavBarAlt";

const DetallesProyecto = (props) => {
    const { URL } = props;
    const { idProject } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const [projectDetails, setProjectDetails] = useState(null);
    const [boards, setBoards] = useState([]);
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [projectUsers, setProjectUsers] = useState([]);
    const proyecto = { idProject }

    useEffect(() => {
        const fetchProjectUsers = async () => {
            const config = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token_user: `Bearer ${localStorage.getItem("token")}`,
                },
            };

            try {
                const response = await fetch(`${URL}/api/proyecto/${idProject}/users`, config);
                if (!response.ok) throw new Error('Failed to fetch project users');
                const users = await response.json();
                setProjectUsers(users);
            } catch (error) {
                console.error("Fetch project users error:", error);
                // Optionally handle errors, e.g., show a notification
            }
        };

        fetchProjectUsers();
    }, [idProject, URL]);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token_user": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ idProject }),
            };

            try {
                const response = await fetch(`${URL}/api/proyecto/detalle`, config);
                if (response.ok) {
                    const data = await response.json();
                    setProjectDetails(data);
                    fetchKanbanBoards();
                } else if (response.status === 401) {
                    navigate("/");
                } else {
                    console.error("Failed to fetch project details");
                }
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
        };

        fetchProjectDetails();
    }, [idProject, URL, navigate]);

    //function to fetch all kanban boards for this project
    const fetchKanbanBoards = async () => {
        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token_user": `Bearer ${localStorage.getItem("token")}`,
            },
        };

        try {
            const response = await fetch(`${URL}/api/proyecto/${idProject}/kanban`, config);
            if (response.ok) {
                const data = await response.json();
                setBoards(data); // Store fetched boards in state
            } else if (response.status === 401) { // Check if the status code indicates token expiration
                navigate("/"); // Redirect to login view
            } else {
                console.error("Failed to fetch kanban boards");
            }
        } catch (error) {
            console.error("Error fetching kanban boards:", error);
        }
    };

    const refreshBoards = () => {
        fetchKanbanBoards(); // Re-fetch boards after one is deleted
    };

    const addNewBoard = (newBoard) => {
        setBoards((prevBoards) => [...prevBoards, newBoard]);
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

    if (!projectDetails) {
        return <div>Loading...</div>;
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
                            {projectDetails.nombre}
                        </span>
                    </Typography>
                </Box>

                {/*  cajita de info */}
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
                    {/* info */}
                    {/* descripcion */}
                    <Box sx={{
                        backgroundColor: theme.palette.primary.white,
                        p: theme.spacing(1),
                        borderRadius: theme.shape.borderRadius,
                        maxWidth: '600px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid',
                        borderColor: theme.palette.primary.contrastText,
                        mb: 2,
                        mt: 1
                    }}>
                        <Typography variant="caption" align="left" display="block" gutterBottom sx={{
                            fontSize: 'clamp(16px, 2vw, 18px)',
                            mb: 0,
                            color: theme.palette.primary.main,
                            overflowWrap: 'break-word', // Allows long words to be broken and wrap to the next line
                            wordBreak: 'break-word', // Ensures words break to prevent overflow
                            maxWidth: '100%', // Ensures it respects the container's width
                            padding: '0 2%', // Responsive padding
                            margin: 'auto', // Centers the text, adjust as needed
                            textAlign: 'left',
                            alignItems: 'center',
                            fontWeight: '500'
                        }}>
                            {projectDetails.descripcion}
                        </Typography>
                    </Box>

                    {/* fechas */}
                    <Box sx={{
                        p: theme.spacing(1),
                        borderRadius: theme.shape.borderRadius,
                        maxWidth: '600px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography variant="overline" align="left" display="block" gutterBottom sx={{
                            fontSize: 'clamp(12px, 2vw, 14px)', // Adjusts between 12px and 14px based on viewport width
                            mb: 0,
                            color: theme.palette.primary.main,
                            overflowWrap: 'break-word', // Allows long words to be broken and wrap to the next line
                            wordBreak: 'break-word', // Ensures words break to prevent overflow
                            maxWidth: '100%', // Ensures it respects the container's width
                            padding: '0 2%', // Responsive padding
                            margin: 'auto', // Centers the text, adjust as needed
                            fontWeight: '600'
                        }}>
                            Creado el {formatDate(projectDetails.fechaCreacion)}
                            <br />
                            Termina el {formatDate(projectDetails.fechaCierre)}
                        </Typography>
                    </Box>
                </Box>

                {/* cajita de colaboradores */}
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
                        color: theme.palette.primary.main,
                    }}
                >
                    {/* titulo de tableros */}
                    <Box sx={{ textAlign: 'center', mt: 2, mb: 1, width: '100%' }}>
                        <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '18px', mb: 0, color: theme.palette.primary.main, fontWeight: '600' }}>
                            Colaboradores
                        </Typography>
                        {/* Display each user's name and last name */}
                        <Box sx={{
                            display: 'block',
                            p: theme.spacing(2),
                            borderRadius: theme.shape.borderRadius,
                            border: '2px solid',
                            borderColor: theme.palette.primary.contrastText,
                            alignItems: 'left',
                            justifyContent: 'left',
                            width: '100%',
                        }}>
                            {projectUsers.map((user, index) => (
                                <Typography key={index} variant="body2" sx={{ textAlign: 'left', fontSize: '20px' }}>
                                    {user.userId.nombre} {user.userId.apellido} {user.rol === 1 ? "(administrador)" : ""}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/*  cajita de tablero kanban */}
                {
                    boards.length > 0 && (
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
                            {/* titulo de tableros */}
                            <Box sx={{ textAlign: 'center', mt: 2, mb: 1 }}>
                                <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '18px', mb: 0, color: theme.palette.primary.main, fontWeight: '600' }}>
                                    Tableros
                                </Typography>
                            </Box>

                            <Box sx={{
                                m: 0,
                                p: 0,
                                backgroundColor: theme.palette.primary.white,
                                maxWidth: '655px',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                maxHeight: '60vh',
                                height: '100%',
                                overflowY: 'auto',
                            }}>

                                {/* lista de tableros */}
                                {/* Display boards using KanbanBoard component */}
                                {boards.map((board) => (
                                    <KanbanBoardDetalle key={board._id} board={board} idProject={idProject} onDelete={refreshBoards} />
                                ))}
                            </Box>
                        </Box>
                    )}

                {/* boton agregar tablero */}
                <Button
                    variant="outlined"
                    sx={{
                        mt: 2,
                        mb: 1,
                        borderColor: 'primary.dark',
                        color: 'primary.dark',
                        boxShadow: 'none',
                        '&:hover': {
                            color: 'primary.white',
                            backgroundColor: 'primary.dark',
                            borderColor: 'primary.dark',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
                        },
                    }}
                    onClick={() => setShowForm(!showForm)}
                    align='center'
                    width='auto'
                >
                    Añadir nuevo tablero
                </Button>

                {showForm && (
                    /* box form de agregar tarea */
                    <FormAddBoard addBoardCallback={addNewBoard} URL={URL} />
                )}
            </Box>
        </>

    );
};

export default DetallesProyecto;