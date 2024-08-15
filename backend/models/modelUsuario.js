const mongoose = require("mongoose");

const ColeccionUsuarios = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  apellido: {
    type: String,
    required: [true, "El apellido es requerido"],
  },
  correo: {
    type: String,
    required: [true, "El correo es requerido"],
    unique: true,
  },
  pass: {
    type: String,
    required: [true, "La contraseña es requerida"],
  }
});

const User = mongoose.model("usuarios", ColeccionUsuarios);

module.exports = User;
