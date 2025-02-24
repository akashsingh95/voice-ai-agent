require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generic function to communicate with OpenAI API.
 * @param {string} systemPrompt - The system's role and instructions.
 * @param {string} userMessage - The user's input text.
 * @param {number} maxTokens - Maximum tokens for response.
 * @returns {Promise<string>} - The AI-generated response.
 */
async function askLLM(systemPrompt, userMessage, maxTokens = 100) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            max_tokens: maxTokens,
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error(`Error in LLM request: ${systemPrompt}`, error);
        throw new Error("Failed to process request with OpenAI.");
    }
}

/**
 * Determines if the user's message is about booking an appointment.
 * @param {string} text - User input.
 * @returns {Promise<boolean>} - True if intent is booking, otherwise false.
 */
async function checkBookingIntent(text) {
    const response = await askLLM(
        "You are an AI assistant that determines if a user's message is about booking an appointment. Respond with a simple 'yes' or 'no'.",
        text,
        10
    );
    return response.toLowerCase() === 'yes';
}

/**
 * Extracts appointment details (type, date, time, mode) from user input.
 * @param {string} text - User input.
 * @returns {Promise<object>} - Extracted appointment details.
 */
async function extractAppointmentDetails(text) {
    const response = await askLLM(
        "You are an AI assistant that extracts appointment details from user messages. Return the data as a JSON object with keys: appointment_type, date, time, and type (online/offline). If any of these are missing, set them to null.",
        text
    );

    try {
        return JSON.parse(response);
    } catch (error) {
        console.error("Error parsing appointment details:", response);
        throw new Error("Failed to extract appointment details.");
    }
}

/**
 * Generates a general AI response if the message is not related to booking.
 * @param {string} text - User input.
 * @returns {Promise<string>} - AI-generated general response.
 */
async function getGeneralConversationResponse(text) {
    return askLLM(
        "You are a helpful AI assistant that provides friendly and informative answers to user questions.",
        text,
        150
    );
}

/**
 * Determines if the user's message is about checking available appointment slots.
 * @param {string} text - User input.
 * @returns {Promise<boolean>} - True if intent is to check slots, otherwise false.
 */
async function checkAvailableSlotsIntent(text) {
    const response = await askLLM(
        "You are an AI assistant that determines if a user's message is about checking available appointment slots. Respond with 'yes' or 'no'.",
        text,
        10
    );
    return response.toLowerCase() === 'yes';
}

module.exports = {
    checkBookingIntent,
    extractAppointmentDetails,
    getGeneralConversationResponse,
    checkAvailableSlotsIntent
};
