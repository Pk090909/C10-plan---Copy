const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// Get all subjects
router.get('/', async (req, res) => {
    const subjects = await Subject.find();
    res.render('subjects', { subjects });
});

// Add new subject
router.post('/add', async (req, res) => {
    const { name } = req.body;
    await Subject.create({ name });
    res.redirect('/subjects');
});

// Add chapter to a subject
router.post('/add-chapter/:subjectId', async (req, res) => {
    const { title, difficultyLevel } = req.body;
    const subject = await Subject.findById(req.params.subjectId);
    subject.chapters.push({ title, difficultyLevel });
    await subject.save();
    res.redirect(`/subjects/${subject._id}`);
});

// Update chapter status
router.post('/update-chapter/:subjectId/:chapterId', async (req, res) => {
    const { completionStatus, revisionTimes, testStatus } = req.body;
    const subject = await Subject.findById(req.params.subjectId);
    const chapter = subject.chapters.id(req.params.chapterId);

    chapter.completionStatus = completionStatus;
    chapter.revisionTimes = revisionTimes;
    chapter.testStatus = testStatus;

    await subject.save();
    res.redirect(`/subjects/${subject._id}`);
});

// View individual subject page
router.get('/:id', async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    res.render('subject-detail', { subject });
});

module.exports = router;
