const express = require('express');
const router = express.Router();
const QuestionPaper = require('../models/QuestionPaper');
const upload = require('../middleware/upload'); // Multer upload middleware
const auth = require('../middleware/auth'); // JWT Auth middleware

// Middleware to extract token from x-auth-token header
const extractToken = (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    req.token = token;
    next();
};

// @route   POST /api/question/upload
// @desc    Upload a question paper (Teachers only)
router.post('/upload', extractToken, auth, (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ msg: 'Authorization denied' });
    }

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message || 'File upload error' });
        }
        if (!req.file) {
            return res.status(400).json({ msg: 'No file selected' });
        }

        const { title, subject } = req.body;

        try {
            // Update the filePath to include the "uploads/" prefix
            const filePath = `${req.file.filename}`; // Change here

            const questionPaper = new QuestionPaper({
                title,
                subject,
                teacher: req.user.id,
                filePath: filePath, // Use the modified filePath
            });
            

            await questionPaper.save();
            res.status(201).json(questionPaper); // Return created paper with 201 status
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server error' });
        }
    });
});

// @route   GET /api/question/subject/:subject
// @desc    Get question papers for a specific subject (For students)
router.get('/subject/:subject', extractToken, async (req, res) => {
    try {
        const questionPapers = await QuestionPaper.find({ subject: req.params.subject });

        if (!questionPapers.length) {
            return res.status(404).json({ msg: 'No question papers found for this subject' });
        }

        res.json(questionPapers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});
// @route   DELETE /api/question/:id
// @desc    Delete a question paper (Teachers only)
router.delete('/:id', extractToken, auth, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ msg: 'Authorization denied' });
    }

    try {
        const questionPaper = await QuestionPaper.findById(req.params.id);
        if (!questionPaper) {
            return res.status(404).json({ msg: 'Question paper not found' });
        }

        if (questionPaper.teacher.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Using findByIdAndDelete to remove the document
        await QuestionPaper.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Question paper removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
