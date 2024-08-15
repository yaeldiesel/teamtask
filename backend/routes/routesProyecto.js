const {
  addProject,
  addUserInProject,
  verProyectos,
  deleteProject,
  deleteUserProject,
  verProyectosDeUser,
  verDetalleProyecto,
  getAllUsersInProject
} = require("../controllers/controllerProyecto");

const validarToken = require("../middlewares/validarToken");

const RoutesProyecto = (app) => {
  app.post("/api/proyecto/nuevo", validarToken, addProject);
  app.post("/api/proyectos/user", validarToken, verProyectosDeUser);
  app.post('/api/proyecto/detalle', validarToken, verDetalleProyecto)

  app.put("/api/proyecto/adduser", validarToken, addUserInProject);
  app.put("/api/proyecto/deleteuser", validarToken, deleteUserProject);

  app.get("/api/proyectos", validarToken, verProyectos);
  app.get("/api/proyecto/:idProject/users", validarToken, getAllUsersInProject);

  app.delete("/api/proyecto/delete", validarToken, deleteProject);
};

module.exports = RoutesProyecto;
