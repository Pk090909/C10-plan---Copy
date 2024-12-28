const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['daily', 'weekly'], required: true }, // 'daily' or 'weekly'
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
