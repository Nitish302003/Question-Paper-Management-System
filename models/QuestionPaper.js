const mongoose = require('mongoose');

const QuestionPaperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filePath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema);
