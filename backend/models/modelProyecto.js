const mongoose = require("mongoose");

const ColeccionProyectos = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del proyecto es requerido"],
  },
  descripcion: {
    type: String,
    required: [true, "La descripción del proyecto es requerida"],
  },
  fechaCreacion: {
    type: Date,
    required: [true, "La fecha de creación del proyecto es requerida"],
  },
  fechaCierre: {
    type: Date,
    required: [true, "La fecha de cierre del proyecto es requerida"],
  },
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios" },
      rol: { type: Number, required: [true, "El rol del user es requerido"] },
      _id: false,
    },
  ],
  kanbanBoards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KanbanBoard',
  }]
});

const Proyecto = mongoose.model("proyectos", ColeccionProyectos);

module.exports = Proyecto;
