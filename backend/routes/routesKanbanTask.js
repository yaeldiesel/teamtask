const { createTask, deleteTask, updateTaskStatus } = require("../controllers/controllerKanbanTask");
const validarToken = require("../middlewares/validarToken");

const RoutesKanbanTask = (app) => {
    app.post('/api/:idBoard/tasks', validarToken, createTask);

    app.delete('/api/:idTask/tasks', validarToken, deleteTask);

    app.patch('/api/:idTask/tasks', validarToken, updateTaskStatus);
};

module.exports = RoutesKanbanTask;