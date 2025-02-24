require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { processUserRequest } = require('./services/bookingService');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (for audio responses)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Unified endpoint for appointment booking & general queries
app.post('/process', async (req, res) => {
    try {
        const response = await processUserRequest(req.body);
        res.json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: error.message || "Failed to process your request." });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
