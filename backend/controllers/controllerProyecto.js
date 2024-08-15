const Proyecto = require("../models/modelProyecto");
const User = require("../models/modelUsuario");
const { parse, format, isValid } = require("date-fns");

const addProject = (req, res) => {
  const { nombre, descripcion, fechaCierre, idUser } = req.body;

  if (!nombre || !descripcion || !fechaCierre || !idUser)
    return res.status(406).json({ mensaje: "Datos incompletos" });

  const parsedFecha = parse(fechaCierre, "yyyy-MM-dd", new Date());

  if (!isValid(parsedFecha)) {
    return res.status(400).json({ error: "Fecha inválida" });
  }

  const formattedFecha = format(parsedFecha, "yyyy-MM-dd");

  User.findOne({ _id: idUser })
    .then(userEncontrado => {
      if (!userEncontrado) return res.status(404).json({ mensaje: 'No se encontro el user' });

      const proyectoAgregar = {
        nombre,
        descripcion,
        fechaCreacion: new Date(),
        fechaCierre: formattedFecha,
        users: { userId: userEncontrado, rol: 1 }
      };

      Proyecto.create(proyectoAgregar)
        .then((proyectoCreado) => res.status(201).json(proyectoCreado))
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
};

const addUserInProject = (req, res) => {
  const { correo, rol, idProject } = req.body;

  if (!correo || !idProject || !rol)
    return res.status(406).json({ mensaje: "Datos incompletos" });

  User.findOne({ correo })
    .then((userEncontrado) => {
      if (!userEncontrado)
        return res.status(404).json({ mensaje: "No se encontró el usuario" });

      Proyecto.findById(idProject)
        .then((proyectoEncontrado) => {
          if (!proyectoEncontrado)
            return res.status(404).json({ mensaje: "El proyecto no existe" });

          let repetido = false;

          proyectoEncontrado.users.forEach((user) => {
            if (user.userId.toString() == userEncontrado._id.toString())
              repetido = true;
          });

          if (repetido)
            return res.status(406).json({
              mensaje: "El usuario ya se encuentra agregado en este proyecto",
            });

          proyectoEncontrado.users.push({ userId: userEncontrado, rol });

          proyectoEncontrado
            .save()
            .then((proyectoActualizado) =>
              res.status(200).json(proyectoActualizado)
            )
            .catch((err) => res.status(500).json(err));
        })
        .catch((err) =>
          res
            .status(500)
            .json({ mensaje: "No se encontró el proyecto", error: err.message })
        );
    })
    .catch((err) => res.status(500).json(err));
};

const deleteProject = (req, res) => {
  const { idProject } = req.body;

  Proyecto.deleteOne({ _id: idProject })
    .then((proyectoBorrado) => {
      if (proyectoBorrado.deletedCount > 0) {
        return res.status(200).end();
      }

      return res.status(404).json({ mensaje: "Proyecto no se encontró" });
    })
    .catch((err) => res.status(500).json(err));
};

const deleteUserProject = (req, res) => {
  const { correo, idProject } = req.body;

  User.findOne({ correo })
    .then((userEncontrado) => {
      if (!userEncontrado)
        return res
          .status(404)
          .json({ mensaje: "No se encontro el user para eliminar" });

      Proyecto.findById(idProject)
        .then((proyectoEncontrado) => {
          if (!proyectoEncontrado)
            return res
              .status(404)
              .json({ mensaje: "El proyecto no se encontro" });

          proyectoEncontrado.users = proyectoEncontrado.users.filter(
            (user) => user.userId.toString() != userEncontrado._id.toString()
          );

          proyectoEncontrado
            .save()
            .then((proyectoActualizado) =>
              res.status(200).json(proyectoActualizado)
            )
            .catch((err) => res.status(500).json(err));
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
};

const verProyectos = (req, res) => {
  Proyecto.find()
    .populate("users.userId")
    .then((proyectosEncontrados) => res.status(200).json(proyectosEncontrados))
    .catch((err) => res.status(500).json(err));
};

const verProyectosDeUser = (req, res) => {
  const { idUser } = req.body;

  if (!idUser)
    return res
      .status(406)
      .json({ mensaje: "Debe proporcionar el id del user" });

  Proyecto.find({ "users.userId": idUser })
    .populate("users.userId")
    .then((proyectosEncontrados) => res.status(200).json(proyectosEncontrados))
    .catch((err) => res.status(500).json(err));
};

const verDetalleProyecto = async (req, res) => {
  const { idProject } = req.body;
  try {
    const proyecto = await Proyecto.findOne({ _id: idProject })
      .populate("users.userId")

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    return res.status(200).json(proyecto);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project details', error: error.message });
  }

  try {
    // Start with populating kanbanBoards only
    const proyecto = await Proyecto.findById(idProject).populate('kanbanBoards');

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    console.log(proyecto); // Check the output to see if kanbanBoards are populated

    // If kanbanBoards are correctly populated, then try populating kanbanTasks
    const proyectoWithTasks = await Proyecto.findById(idProject)
      .populate({
        path: 'kanbanBoards',
        populate: {
          path: 'tasks'
        }
      });

    if (!proyectoWithTasks) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    res.json(proyectoWithTasks);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el detalle del proyecto", error: error.message });
  }
};

const getAllUsersInProject = async (req, res) => {
  const { idProject } = req.params;

  try {
    const project = await Proyecto.findById(idProject).populate("users.userId");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project.users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  addProject,
  addUserInProject,
  verProyectos,
  deleteProject,
  deleteUserProject,
  verProyectosDeUser,
  verDetalleProyecto,
  getAllUsersInProject
};
