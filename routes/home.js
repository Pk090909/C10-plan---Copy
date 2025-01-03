const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Home Page
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 5; // Number of tasks per page

    const totalTasks = await Task.countDocuments({ taskType: 'daily', isCompleted: false });
    const tasks = await Task.find({ taskType: 'daily', isCompleted: false })
        .sort({ dueDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const hasMore = page * limit < totalTasks;

    res.render('home', { tasks, currentPage: page, hasMore });
});

// Fetch paginated tasks for "Show More" functionality
router.get('/tasks', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 5; // Number of tasks per page

    const tasks = await Task.find({ taskType: 'daily', isCompleted: false })
        .sort({ dueDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.json(tasks);
});

// Mark task as completed
router.post('/tasks/complete/:id', async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, { isCompleted: true });
    res.redirect('/');
});


module.exports = router;
