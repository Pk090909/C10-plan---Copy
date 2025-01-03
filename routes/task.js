const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all daily tasks
router.get('/', async (req, res) => {
    const tasks = await Task.find({ taskType: 'daily' }).sort({ dueDate: 1 });
    res.render('tasks', { tasks });
});

// Add new task
router.post('/add', async (req, res) => {
    const { title, description, dueDate, taskType } = req.body;
    await Task.create({ title, description, dueDate, taskType });
    res.redirect('/task');
});

// Mark task as completed
router.post('/complete/:id', async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, { isCompleted: true });
    res.redirect('/task');
});

// Delete task
router.post('/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/task');
});

module.exports = router;
