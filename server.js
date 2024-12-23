const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Import CORS
const path = require('path'); // Import path
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing JSON bodies

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/auth')); // Existing auth routes
app.use('/api/question', require('./routes/questionPaper')); // Question paper routes

// Root Route to Display a Message
app.get('/', (req, res) => {
    res.send('🚀 Server is running smoothly 🚀');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running smoothly on port ${PORT} 🚀`);
});
