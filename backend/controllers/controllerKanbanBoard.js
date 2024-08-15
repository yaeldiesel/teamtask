const KanbanBoard = require('../models/modelKanbanBoard');
const Proyecto = require('../models/modelProyecto'); // Import the project model

const createBoard = async (req, res) => {
    const { idProject } = req.params; // Extract idProject from URL parameters

    try {
        // Optional: Check if the project exists
        const project = await Proyecto.findById(idProject);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Create a new Kanban board with the project ID
        const newBoard = new KanbanBoard({
            ...req.body,
            project: idProject, // Assuming your KanbanBoard model has a 'project' field to link to the project
        });

        const savedBoard = await newBoard.save();

        // Optionally, add the board to the project's kanbanBoards array
        project.kanbanBoards.push(savedBoard._id);
        await project.save();

        res.status(201).json(savedBoard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Kanban boards
const getAllBoards = async (req, res) => {
    const { idProject } = req.params; // Extract idProject from URL parameters

    try {
        // Check if the project exists
        const projectExists = await Proyecto.findById(idProject);
        if (!projectExists) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Find all Kanban boards associated with the project ID
        const boards = await KanbanBoard.find({ project: idProject });
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBoard = async (req, res) => {
    const { idBoard } = req.params;

    try {
        // Find the board to delete
        const board = await KanbanBoard.findById(idBoard);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // Optional: Check if the board belongs to the project
        const project = await Proyecto.findById(board.project);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        // Remove the board from the project's kanbanBoards array
        project.kanbanBoards = project.kanbanBoards.filter(boardId => boardId.toString() !== idBoard);

        // Save the updated project
        await project.save();

        // Delete the board from the database
        await KanbanBoard.findByIdAndDelete(idBoard);

        // Return a success response
        res.json({ message: "Board successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all tasks from a board by board id
const getAllTasks = async (req, res) => {
    const { idBoard } = req.params;

    try {
        const board = await KanbanBoard.findById(idBoard).populate('tasks');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.setHeader('Content-Type', 'application/json');
        res.json(board.tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//function to get a boards detail by id
const getBoardById = async (req, res) => {
    const { idBoard } = req.params;

    try {
        const board = await KanbanBoard.findById(idBoard);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Additional CRUD operations...

module.exports = {
    createBoard,
    getAllBoards,
    deleteBoard,
    getAllTasks,
    getBoardById,
}