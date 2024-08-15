import React, { useState, useEffect } from "react";
import KanbanTask from "../../KanbanTask/KanbanTask";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, Button, Typography, Stack, useTheme, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import NavBarAlt from "../../NavBarAlt/NavBarAlt";

const KanbanBoard = (props) => {
    const { URL } = props;
    const theme = useTheme();
    const navigate = useNavigate();
    const params = useParams();
    const { idBoard } = params;
    const { idProject } = params;

    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: '' }); // State for new task data
    const [boardDetails, setBoardDetails] = useState({ title: '' }); // State for storing board details

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${URL}/api/proyecto/${idBoard}/tasks`, {
                headers: {
                    "Content-Type": "application/json",
                    "token_user": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 401) {
                console.error('Session expired');
                navigate("/");
                return;
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error fetching tasks');
            }
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Fetch board details
    const fetchBoardDetails = async () => {
        try {
            const response = await fetch(`${URL}/api/board/${idBoard}`, {
                headers: {
                    "Content-Type": "application/json",
                    "token_user": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error fetching board details');
            }
            const data = await response.json();
            setBoardDetails(data); // Update state with board details
        } catch (error) {
            console.error('Error fetching board details:', error);
        }
    };

    // Fetch tasks on component mount and idBoard change
    useEffect(() => {
        fetchTasks();
        fetchBoardDetails();
    }, [idBoard, URL]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskWithBoardId = { ...newTask, idBoard }; // Include idBoard in the task object

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token_user": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(taskWithBoardId), // Send task with idBoard
        };
        try {
            const response = await fetch(`${URL}/api/${idBoard}/tasks`, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            fetchTasks(); // Refetch tasks to update the view
            setNewTask({ title: '', description: '', priority: '' });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteTask = async (idTask) => {
        try {
            const response = await fetch(`${URL}/api/${idTask}/tasks`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "token_user": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete the task');
            } else if (response.status === 401) {
                navigate("/");
            }

            setTasks(tasks.filter(task => task._id !== idTask));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const prioritySortOrder = {
        high: 1,
        medium: 2,
        low: 3,
    };

    const sortedTasks = tasks.sort((a, b) => {
        return prioritySortOrder[a.priority] - prioritySortOrder[b.priority];
    });

    const statuses = ['backlog', 'in progress', 'review', 'completed'];

    // Function to group tasks by status
    const groupTasksByStatus = (tasks) => {
        return tasks.reduce((acc, task) => {
            // Initialize the array if it doesn't exist
            if (!acc[task.status]) {
                acc[task.status] = [];
            }
            acc[task.status].push(task);
            return acc;
        }, {});
    };

    // Grouped tasks by status
    const groupedTasks = groupTasksByStatus(sortedTasks);

    const handleStatusChange = async (idTask, newStatus) => {
        // Optimistically update the UI
        const updatedTasks = tasks.map(task => {
            if (task._id === idTask) {
                return { ...task, status: newStatus };
            }
            return task;
        });
        setTasks(updatedTasks);

        try {
            // Send update request to the backend
            const response = await fetch(`${URL}/api/${idTask}/tasks`, {
                method: 'PATCH', // or 'PUT', depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'token_user': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }

            // Optionally, fetch updated tasks list from the backend
            // fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
            // Revert optimistic UI update if necessary
            // setTasks(previousTasks);
        }
    };

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
                    maxWidth: '95vw',
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
                        <span style={{ color: theme.palette.primary.white }}>Tablero:</span>
                        {' '}
                        <span style={{ color: theme.palette.primary.contrastText }}>{boardDetails.title}
                        </span>
                    </Typography>
                </Box>

                {/* tablero de status */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between', // Adjust as needed
                        width: '100%', // Ensure it takes the full width
                        height: '100%',
                        backgroundColor: theme.palette.primary.white,
                        p: theme.spacing(3),
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3],
                        height: '100%',
                        maxWidth: '95vw',
                        mb: theme.spacing(3),
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: theme.spacing(2),
                        overflow: 'auto', // Add this to handle overflow
                    }}
                >
                    {/* backlog */}
                    <Box flex='4' sx={{ flexGrow: 1, flexBasis: '0%', height: '100%', /* Other styles... */ }}>
                        {/* header to do */}
                        <Box sx={{
                            borderRadius: theme.shape.borderRadius,
                            backgroundColor: '#f48897',
                        }}>
                            <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '16px', mt: 1, p: 0.5 }}>
                                Por hacer
                            </Typography>
                        </Box>


                        {/* box de tasks */}
                        <Box
                            sx={{
                                p: theme.spacing(1),
                                backgroundColor: '#ffffff',
                                borderRadius: theme.shape.borderRadius,
                                border: '1.75px solid #f48897',
                                maxHeight: '90vh',
                                height: '100%',
                                overflowY: 'auto',
                            }}>
                            {tasks.filter(task => task.status === 'backlog').map((task) => (
                                <KanbanTask key={task._id} task={task} onDelete={deleteTask} onStatusChange={handleStatusChange} idProject={idProject} URL={URL} />
                            ))}
                        </Box>
                    </Box>

                    {/* in progress */}
                    <Box flex='4' sx={{ flexGrow: 1, flexBasis: '0%', height: '100%', /* Other styles... */ }}>

                        <Box sx={{
                            borderRadius: theme.shape.borderRadius,
                            backgroundColor: '#f4e688',
                        }}>
                            <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '16px', mt: 1, p: 0.5 }}>
                                En progreso
                            </Typography>
                        </Box>

                        {/* box de tasks */}
                        <Box
                            sx={{
                                p: theme.spacing(1),
                                backgroundColor: '#ffffff',
                                borderRadius: theme.shape.borderRadius,
                                border: '1.75px solid #f4e688',
                                maxHeight: '90vh',
                                height: '100%',
                                overflowY: 'auto',
                            }}>
                            {tasks.filter(task => task.status === 'in progress').map((task) => (
                                <KanbanTask key={task._id} task={task} onDelete={deleteTask} onStatusChange={handleStatusChange} idProject={idProject} URL={URL} />
                            ))}
                        </Box>
                    </Box>

                    {/* review */}
                    <Box flex='4' sx={{ flexGrow: 1, flexBasis: '0%', height: '100%', /* Other styles... */ }}>

                        <Box sx={{
                            borderRadius: theme.shape.borderRadius,
                            backgroundColor: '#88e2f4',
                        }}>
                            <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '16px', mt: 1, p: 0.5 }}>
                                Por revisar
                            </Typography>
                        </Box>

                        {/* box de tasks */}
                        <Box
                            sx={{
                                p: theme.spacing(1),
                                backgroundColor: '#ffffff',
                                borderRadius: theme.shape.borderRadius,
                                border: '1.75px solid #88e2f4',
                                maxHeight: '90vh',
                                height: '100%',
                                overflowY: 'auto',
                            }}>
                            {tasks.filter(task => task.status === 'review').map((task) => (
                                <KanbanTask key={task._id} task={task} onDelete={deleteTask} onStatusChange={handleStatusChange} idProject={idProject} URL={URL} />
                            ))}
                        </Box>
                    </Box>

                    {/* completed */}
                    <Box flex='4' sx={{ flexGrow: 1, flexBasis: '0%', height: '100%', /* Other styles... */ }}>

                        <Box sx={{
                            borderRadius: theme.shape.borderRadius,
                            backgroundColor: '#88f48e',
                        }}>
                            <Typography variant="overline" align="center" display="block" gutterBottom sx={{ fontSize: '16px', mt: 1, p: 0.5 }}>
                                Hecho
                            </Typography>
                        </Box>

                        {/* box de tasks */}
                        <Box
                            sx={{
                                p: theme.spacing(1),
                                backgroundColor: '#ffffff',
                                borderRadius: theme.shape.borderRadius,
                                border: '1.75px solid #88f48e',
                                maxHeight: '90vh',
                                height: '100%',
                                overflowY: 'auto',
                            }}>
                            {tasks.filter(task => task.status === 'completed').map((task) => (
                                <KanbanTask key={task._id} task={task} onDelete={deleteTask} onStatusChange={handleStatusChange} idProject={idProject} URL={URL} />
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* boton agregar tarea */}
                <Button
                    size="large"
                    variant="outlined"
                    onClick={() => setShowForm(!showForm)}
                    sx={{
                        mt: 1,
                        mb: 2,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        boxShadow: 'none',
                        '&:hover': {
                            color: 'primary.white',
                            backgroundColor: 'primary.dark',
                            borderColor: 'primary.dark',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
                        },
                    }}
                    align='center'
                    width='auto'>
                    Añadir nueva tarea
                </Button>
                {showForm && (
                    /* box form de agregar tarea */
                    <Box
                        sx={{
                            backgroundColor: theme.palette.primary.white,
                            p: theme.spacing(3),
                            borderRadius: theme.shape.borderRadius,
                            boxShadow: theme.shadows[3],
                            maxWidth: '650px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >

                        {/* form */}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                type="text"
                                id="title"
                                name="title"
                                label="Titulo de la tarea"
                                placeholder="Título"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={newTask.title}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                type="text"
                                id="description"
                                name="description"
                                label="Descripción"
                                placeholder="Descripción"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={newTask.description}
                                onChange={handleInputChange}
                                required
                            />
                            <FormControl style={{ mt: 3, width: '100%' }}>
                                <InputLabel id="priority-select-label">Prioridad</InputLabel>
                                <Select
                                    width='100%'
                                    labelId="priority-select-label"
                                    name="priority"
                                    id="priority-select"
                                    value={newTask.priority}
                                    label="Asignar Prioridad"
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="low">Baja</MenuItem>
                                    <MenuItem value="medium">Media</MenuItem>
                                    <MenuItem value="high">Alta</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                sx={{
                                    textAlign: 'center',
                                    mt: 2,
                                    color: theme.palette.primary.white,
                                    display: 'block',
                                    mx: 'auto'
                                }}
                                type="submit"
                                variant="contained">
                                Confirmar
                            </Button>
                        </form>
                    </Box>
                )}
            </Box >
        </>
    );
}

export default KanbanBoard;