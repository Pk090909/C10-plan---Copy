const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const today = new Date();
    const examDate = new Date("2024-02-15");
    const daysRemaining = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    res.render('home', { daysRemaining });
});

module.exports = router; // Export the router instance
