require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bookingRoutes = require('./routes/appointmentRoute')

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (for audio responses)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', bookingRoutes); 

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
