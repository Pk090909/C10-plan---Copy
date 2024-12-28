const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completionStatus: { type: String, enum: ['not started', 'in progress', 'completed'], default: 'not started' },
    difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    revisionTimes: { type: Number, default: 0 },
    testStatus: { type: Boolean, default: false },
});

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    chapters: [chapterSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subject', subjectSchema);
