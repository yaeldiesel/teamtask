const {
  register,
  verUsers,
  login,
  verificarToken,
} = require("../controllers/controllerUsuario");

const validarToken = require("../middlewares/validarToken");

const RoutesUsuario = (app) => {
  app.post("/api/register", register);
  app.post("/api/login", login);
  app.post("/api/verificarToken", verificarToken);

  app.get("/api/users", validarToken, verUsers);
};

module.exports = RoutesUsuario;
