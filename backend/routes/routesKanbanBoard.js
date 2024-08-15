const validarToken = require("../middlewares/validarToken");
const { getAllBoards, createBoard, deleteBoard, getAllTasks, getBoardById } = require("../controllers/controllerKanbanBoard");

const RoutesKanbanBoard = (app) => {
    app.get("/api/proyecto/:idProject/kanban", validarToken, getAllBoards);
    app.get("/api/proyecto/:idBoard/tasks", validarToken, getAllTasks);
    app.get("/api/board/:idBoard", validarToken, getBoardById);

    app.post("/api/proyecto/:idProject/newkanban", validarToken, createBoard);

    app.delete("/api/proyecto/:idProject/kanban/:idBoard", validarToken, deleteBoard);
};


module.exports = RoutesKanbanBoard;