const mongoose = require('mongoose');

const kanbanTaskSchema = new mongoose.Schema({
    idBoard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KanbanBoard',
        required: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['backlog', 'in progress', 'review', 'completed'],
        default: 'backlog',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
}, { timestamps: true });

module.exports = mongoose.model('KanbanTask', kanbanTaskSchema);