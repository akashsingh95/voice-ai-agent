require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Check if the message indicates an intent to book an appointment
async function checkBookingIntent(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant that determines if a user's message is about booking an appointment. Respond with a simple 'yes' or 'no'."
                },
                { role: "user", content: text }
            ],
            max_tokens: 10,
        });

        const intent = completion.choices[0].message.content.trim().toLowerCase();
        return intent === 'yes';
    } catch (error) {
        console.error("Error checking booking intent:", error);
        return false;
    }
}

// Extract appointment details
async function extractAppointmentDetails(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant that extracts appointment details from user messages. Return the data as a JSON object with keys: appointment_type, date, time, and type (online/offline). If you can't find any of these, set them to null."
                },
                { role: "user", content: text }
            ],
            max_tokens: 100,
        });

        const resultText = completion.choices[0].message.content;
        return JSON.parse(resultText);
    } catch (error) {
        console.error("Error extracting appointment details:", error);
        throw new Error("Failed to extract appointment details.");
    }
}

// Get a general conversation response if it's not a booking intent
async function getGeneralConversationResponse(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant that provides friendly and informative answers to user questions."
                },
                { role: "user", content: text }
            ],
            max_tokens: 150,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating conversation response:", error);
        throw new Error("Failed to generate a conversation response.");
    }
}

module.exports = {
    checkBookingIntent,
    extractAppointmentDetails,
    getGeneralConversationResponse,
};
