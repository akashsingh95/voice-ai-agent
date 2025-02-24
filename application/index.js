require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const {
    createAppointment,
    getAllAppointments,
    saveConversationState,
    getConversationState,
    getAvailableSlots
} = require('./services/appointmentService');
const { textToSpeech } = require('./services/audioService');
const {
    checkBookingIntent,
    extractAppointmentDetails,
    getGeneralConversationResponse,
    checkAvailableSlotsIntent
} = require('./services/llmService');

const app = express();


app.use(cors());
app.use(bodyParser.json());

// Serve static files (for audio responses)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Unified endpoint for appointment booking & general queries
app.post('/process', async (req, res) => {
    const { text, userId = 'default-user' } = req.body; // userId to track conversation state

    if (!text) {
        return res.status(400).json({ error: 'Text input is required' });
    }

    try {
        let responseText = '';
        let appointmentDetails = getConversationState(userId) || {};

        // First, check if the user is asking about available slots
        const isCheckingSlots = await checkAvailableSlotsIntent(text);
        console.log('Is checking available slots:', isCheckingSlots); 

    
        if (isCheckingSlots && text.toLowerCase().includes("available slots")) {
            const availableSlots = getAvailableSlots();
            responseText = availableSlots.length
                ? `Available slots: ${availableSlots.join(', ')}`
                : "Sorry, no slots are available at the moment.";
        } else {
            // Check if the text has booking intent
            const isBookingIntent = await checkBookingIntent(text);
            console.log('Is booking intent:', isBookingIntent);

            if (isBookingIntent) {
                // Extract appointment details from the current message
                const extractedDetails = await extractAppointmentDetails(text);
                console.log('Extracted appointment details:', extractedDetails);

                // Merge extracted details with conversation state
                appointmentDetails = { ...appointmentDetails, ...extractedDetails };

                // Check if all required details are present
                if (!appointmentDetails.appointment_type) {
                    responseText = 'What type of appointment is this? (e.g., doctor, meeting)';
                } else if (!appointmentDetails.date) {
                    responseText = 'When would you like to schedule this appointment?';
                } else if (!appointmentDetails.time) {
                    responseText = 'What time would you like the appointment?';
                } else if (!appointmentDetails.type) {
                    responseText = 'Should this be an online or offline appointment?';
                } else {
                    // All required details are present, create the appointment
                    const bookingResponse = createAppointment(appointmentDetails);
                    responseText = bookingResponse.message;
                    // Clear conversation state after booking
                    saveConversationState(userId, {});
                }

                // Save the conversation state for the next interaction
                saveConversationState(userId, appointmentDetails);
            } else {
                // Handle as a general conversation
                responseText = await getGeneralConversationResponse(text);
            }
        }

        // Convert text response to speech (MP3)
        const audioFilePath = await textToSpeech(responseText);

        res.json({
            response: responseText,
            audioUrl: `http://localhost:3000/${audioFilePath}`
        });
    } catch (error) {
        console.error('Error during processing:', error);
        res.status(500).json({ error: error.message || "Failed to process your request." });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
