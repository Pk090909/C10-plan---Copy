const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all weekly tasks
router.get('/', async (req, res) => {
    const tasks = await Task.find({ taskType: 'yearly' }).sort({ dueDate: 1 });
    res.render('yearly-tasks', { tasks });
});

// Mark a weekly task as completed
router.post('/complete/:id', async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, { isCompleted: true });
    res.redirect('/yearly-tasks');
});

// Delete a weekly task
router.post('/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/yearly-tasks');
});

module.exports = router;
