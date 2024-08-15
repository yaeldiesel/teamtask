const mongoose = require('mongoose');

const kanbanBoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KanbanTask'
    }],
    // Add a reference to the Project model
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // Ensure this matches the name of your project model
        required: true // Make the project reference required if every board must be associated with a project
    }
});

module.exports = mongoose.model('KanbanBoard', kanbanBoardSchema);