const express = require('express');
const router = express.Router();
const { processUserRequest } = require('../services/bookingService');

// Process user queries (booking or general conversation)
router.post('/process', async (req, res) => {
    try {
        const response = await processUserRequest(req.body);
        res.json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: error.message || "Failed to process your request." });
    }
});

module.exports = router;
