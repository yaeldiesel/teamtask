const jwt = require("jsonwebtoken");
const PRIVATE = "jwtPrivate";

const validarToken = (req, res, next) => {
  const { token_user } = req.headers;

  if (!token_user || !token_user.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado o inválido" });
  }

  const token = token_user.split(" ")[1]; // Extract token from Bearer header

  try {
    jwt.verify(token, PRIVATE, (err, tokenDecod) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ mensaje: "Sesión expirada" });
        }
        return res.status(401).json({ mensaje: "Token inválido" });
      }

      req.infoEnUser = tokenDecod;
      next();
    });
  } catch (error) {
    console.error("Error de validación de token:", error);
    return res.status(500).json({ mensaje: "Error de servidor" });
  }
};

module.exports = validarToken;
