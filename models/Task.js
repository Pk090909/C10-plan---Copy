const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
    taskType: { type: String, enum: ['daily', 'weekly', 'yearly'], default: 'daily' },
    createdAt: { type: Date, default: Date.now },
});

// Check if the model already exists to avoid OverwriteModelError
module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);
