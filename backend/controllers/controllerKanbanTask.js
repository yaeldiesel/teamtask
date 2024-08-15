const KanbanTask = require('../models/modelKanbanTask');
const KanbanBoard = require('../models/modelKanbanBoard'); // Import the KanbanBoard model

const createTask = async (req, res) => {
    try {
        const { idBoard, title, description, status, priority } = req.body;
        const newTask = await KanbanTask.create({ idBoard, title, description, status, priority });

        // Find the corresponding board and update it by pushing the new task's ID to its tasks array
        await KanbanBoard.findByIdAndUpdate(idBoard, { $push: { tasks: newTask } });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: 'Error adding task to board', error: error.message });
    }
};

//delete a task
const deleteTask = async (req, res) => {
    try {
        const { idTask } = req.params;
        const task = await KanbanTask.findByIdAndDelete(idTask);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Find the corresponding board and update it by removing the task's ID from its tasks array
        await KanbanBoard.findByIdAndUpdate(task.idBoard, { $pull: { tasks: idTask } });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { idTask } = req.params; // or req.body, depending on your frontend setup
        const { status } = req.body;

        const updatedTask = await KanbanTask.findByIdAndUpdate(idTask, { status }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task status updated successfully', updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task status', error: error.message });
    }
};

module.exports = {
    createTask,
    deleteTask,
    updateTaskStatus
};