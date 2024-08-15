require("./config/conexion");

const express = require("express");
const cors = require("cors");
const RoutesUsuario = require("./routes/routesUsuario");
const RoutesProyecto = require("./routes/routesProyecto");
const RoutesKanbanBoard = require("./routes/routesKanbanBoard");
const RoutesKanbanTask = require("./routes/routesKanbanTask");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

RoutesUsuario(app);
RoutesProyecto(app);
RoutesKanbanBoard(app);
RoutesKanbanTask(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listen port: ${PORT}`);
});
