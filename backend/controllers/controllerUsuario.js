const User = require("../models/modelUsuario");

const bcrypt = require("bcrypt");
const HASH_SALT = 10;
const saltGenerado = bcrypt.genSaltSync(HASH_SALT);

const jwt = require("jsonwebtoken");
const PRIVATE = "jwtPrivate";

const register = (req, res) => {
  const { nombre, apellido, correo, pass } = req.body;

  if (!nombre || !apellido || !correo || !pass)
    return res.status(406).json({ mensaje: "Datos incompletos" });

  User.findOne({ correo })
    .then((userEncontrado) => {
      if (userEncontrado)
        return res
          .status(406)
          .json({ mensaje: "El correo ya se encuentra registrado" });

      const nuevoUser = {
        nombre,
        apellido,
        correo,
        pass: bcrypt.hashSync(pass, saltGenerado)
      };

      User.create(nuevoUser)
        .then((userCreado) => {
          const infoUser = {
            _id: userCreado._id,
            nombre,
            apellido,
            correo
          };

          jwt.sign(infoUser, PRIVATE, { expiresIn: "30m" }, (err, token) => {
            if (err)
              return res
                .status(500)
                .json({ mensaje: "El token no pudo generarse" });

            return res.status(200).json({ token });
          });
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
};

const login = (req, res) => {
  const { correo, pass } = req.body;

  if (!correo || !pass)
    return res.status(406).json({ mensaje: "Datos incompletos" });

  User.findOne({ correo }).then((userEncontrado) => {
    if (!userEncontrado) {
      return res
        .status(404)
        .json({ mensaje: "Usted no se encuentra registrado" })
    };

    if (!bcrypt.compareSync(pass, userEncontrado.pass))
      return res.status(406).json({ mensaje: "Credenciales invalidas" });

    const infoUser = {
      _id: userEncontrado._id,
      nombre: userEncontrado.nombre,
      apellido: userEncontrado.apellido,
      correo
    };

    jwt.sign(infoUser, PRIVATE, { expiresIn: "10m" }, (err, token) => {
      if (err)
        return res.status(500).json({ mensaje: "El token no pudo generarse" });

      return res.status(200).json({ token });
    });
  });
};

const verUsers = (req, res) => {
  User.find()
    .then((usersEncontrados) => res.status(200).json(usersEncontrados))
    .catch((err) => res.status(500).json(err));
};

const deleteUserByEmail = (req, res) => {
  const { correo } = req.body;

  if (!correo) return res.status(406).json({ mensaje: "Correo no proporcionado" });

  User.findOneAndDelete({ correo })
    .then((userEliminado) => {
      if (!userEliminado)
        return res.status(404).json({ mensaje: "Usuario no encontrado" });

      return res.status(200).json({ mensaje: "Usuario eliminado exitosamente" });
    })
    .catch((err) => res.status(500).json(err));
};

const verificarToken = (req, res) => {
  const { token } = req.body;
  jwt.verify(token, PRIVATE, (err, tokenDecod) => {
    if (err) return res.status(401).json({ mensaje: 'Token invalido' });

    return res.status(200).json(tokenDecod);
  })
}

module.exports = {
  register,
  login,
  verUsers,
  deleteUserByEmail,
  verificarToken
};