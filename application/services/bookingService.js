const {
    createAppointment,
    getAllAppointments,
    saveConversationState,
    getConversationState,
    getAvailableSlots
} = require('./appointmentService');
const { textToSpeech } = require('./audioService');
const {
    checkBookingIntent,
    extractAppointmentDetails,
    getGeneralConversationResponse,
    checkAvailableSlotsIntent
} = require('./llmService');

async function processUserRequest({ text, userId = 'default-user' }) {
    if (!text) throw new Error('Text input is required');

    let responseText = '';
    let appointmentDetails = getConversationState(userId) || {};

    // available slots check
    const isCheckingSlots = await checkAvailableSlotsIntent(text);
    console.log('Checking available slots:', isCheckingSlots);

    if (isCheckingSlots && text.toLowerCase().includes("available slots")) {
        const availableSlots = getAvailableSlots();
        responseText = availableSlots.length
            ? `Available slots: ${availableSlots.join(', ')}`
            : "Sorry, no slots are available at the moment.";
    } else {
        // check booking intent
        const isBookingIntent = await checkBookingIntent(text);
        console.log('Booking intent detected:', isBookingIntent);

        if (isBookingIntent) {
            //  Extract appointment details
            const extractedDetails = await extractAppointmentDetails(text);
            console.log('Extracted appointment details:', extractedDetails);

            //  Merge extracted details with conversation state
            appointmentDetails = { ...appointmentDetails, ...extractedDetails };

            // Validate appointment details
            if (!appointmentDetails.appointment_type) {
                responseText = 'What type of appointment is this? (e.g., doctor, meeting)';
            } else if (!appointmentDetails.date) {
                responseText = 'When would you like to schedule this appointment?';
            } else if (!appointmentDetails.time) {
                responseText = 'What time would you like the appointment?';
            } else if (!appointmentDetails.type) {
                responseText = 'Should this be an online or offline appointment?';
            } else {
                // Create the appointment
                const bookingResponse = createAppointment(appointmentDetails);
                responseText = bookingResponse.message;

                // Clear conversation state after booking
                saveConversationState(userId, {});
            }

            //  Save updated conversation state
            saveConversationState(userId, appointmentDetails);
        } else {
            //  Handle as a general conversation
            responseText = await getGeneralConversationResponse(text);
        }
    }

    //convert response to speech
    const audioFilePath = await textToSpeech(responseText);

    return {
        response: responseText,
        audioUrl: `http://localhost:3000/${audioFilePath}`
    };
}

module.exports = { processUserRequest };
