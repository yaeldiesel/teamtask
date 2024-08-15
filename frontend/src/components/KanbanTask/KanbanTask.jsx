import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, useTheme, TextField, FormControl, InputLabel, MenuItem, Grid, IconButton, Menu, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, OutlinedInput, Chip, Select } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MultipleSelectChip from "../MultiSelector/MultiSelector";

const KanbanTask = ({ task, onDelete, onStatusChange, URL, idProject }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false);
    const [users, setUsers] = useState([]);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [projectUsers, setProjectUsers] = useState([]);

    const projectUserNames = projectUsers.map((user) => user.userId.nombre + " " + user.userId.apellido); // Renamed from usuarios to projectUserNames

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
                const userResponse = await fetch(`${URL}/api/proyecto/${idProject}/users`, config);
                if (!userResponse.ok) throw new Error('Failed to fetch users');
                const data = await userResponse.json();
                setUsers(data);
                if (data.some(user => user.userId._id === localStorage.getItem("idUser") && user.rol === 1)) {
                    setIsAuthorized(true); // Renamed from setIsUserAuthorized to setIsAuthorized
                }
            } catch (error) {
                console.error("Fetch users error:", error);
                // Handle errors (e.g., show a notification)
            }
        };

        fetchUsers();
    }, []);

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
                const projectUsersResponse = await fetch(`${URL}/api/proyecto/${idProject}/users`, config); // Renamed from response to projectUsersResponse
                if (!projectUsersResponse.ok) throw new Error('Failed to fetch project users');
                const users = await projectUsersResponse.json();
                setProjectUsers(users);
            } catch (error) {
                console.error("Fetch project users error:", error);
                // Optionally handle errors, e.g., show a notification
            }
        };

        fetchProjectUsers();
    }, [idProject, URL]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStatusSelect = (newStatus) => {
        onStatusChange(task._id, newStatus);
        handleClose();
    };

    const statusLabels = {
        backlog: 'Por hacer',
        'in progress': 'En progreso',
        review: 'Por revisar',
        completed: 'Hecho',
    };

    const priorityLabels = {
        low: 'baja',
        medium: 'media',
        high: 'alta',
    };

    const priorityColors = {
        low: 'green', // Assuming you meant green here
        medium: 'orange',
        high: 'red',
    };

    return (
        <Box
            sx={{
                backgroundColor: '#f1f2f4',
                borderRadius: theme.shape.borderRadius,
                height: '100%',
                mb: 1,
                p: theme.spacing(2),
                display: 'flex',
                flexDirection: 'column', // Changed to column to stack vertically
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={9}> {/* Adjusted for a larger space for details */}
                    <Typography variant="overline" align="left" display="block" gutterBottom sx={{ fontWeight: '400', fontSize: '16px', overflowWrap: 'break-word', wordBreak: 'break-word', width: '100%', lineHeight: '2', }}>
                        {task.title}
                    </Typography>
                    <Typography variant="caption" align="left" display="block" gutterBottom sx={{ fontWeight: '200', fontSize: '16px', overflowWrap: 'break-word', wordBreak: 'break-word', width: '100%', lineHeight: '2', }}>
                        {task.description}
                    </Typography>
                    <Typography variant="caption" align="left" display="block" gutterBottom sx={{ fontWeight: '400', fontSize: '16px', overflowWrap: 'break-word', wordBreak: 'break-word', width: '200px', color: priorityColors[task.priority], textTransform: 'uppercase' }}>
                        Prioridad: {priorityLabels[task.priority]}
                    </Typography>
                </Grid>
                <Grid item xs={3}> {/* Smaller space for the icon button */}
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <MenuItem key={value} onClick={() => handleStatusSelect(value)}>
                                {label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}> {/* Full width for the delete button */}
                    {/* <MultipleSelectChip names={projectUserNames} /> */}

                    {/* <Box>                            {projectUsers.map((user, index) => (
                        <Typography key={index} variant="body2" sx={{ textAlign: 'left' }}>
                            {user.userId.nombre} {user.userId.apellido}
                        </Typography>
                    ))}</Box> */}


                    {isAuthorized && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setOpenDialog(true)}
                            sx={{
                                color: theme.palette.error.main,
                                borderColor: theme.palette.error.main,
                                '&:hover': {
                                    color: theme.palette.error.contrastText,
                                    backgroundColor: theme.palette.error.main,
                                    borderColor: theme.palette.error.main,
                                },
                                fontSize: '0.75rem',
                                width: '100%',
                                height: 'auto'
                            }}
                        >
                            Eliminar
                        </Button>
                    )}
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                ¿Estás seguro de que quieres eliminar esta tarea?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button onClick={() => { onDelete(task._id); setOpenDialog(false); }} autoFocus>
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </Box >
    );
}

export default KanbanTask;