const crypto = require('crypto');

// In-memory cache to store appointments
const appointmentCache = new Map();

// In-memory conversation state to track missing info
const conversationState = new Map();

// Generate a random appointment ID
function generateAppointmentId() {
    return crypto.randomBytes(8).toString('hex');
}

// Create a new appointment
function createAppointment({ appointment_type, time, date, type }) {
    if (!appointment_type || !time || !date || !type) {
        return { success: false, message: 'Missing required appointment fields.' };
    }

    // Check if the slot is already booked
    if (isSlotBooked(time, date)) {
        return { success: false, message: `The slot at ${time} on ${date} is already booked.` };
    }

    // Create the appointment object
    const appointment = {
        appointment_id: generateAppointmentId(),
        appointment_type,
        time,
        date,
        type
    };

    // Save to cache
    const key = `${date}-${time}`;
    appointmentCache.set(key, appointment);

    // Clear conversation state once booking is completed
    conversationState.delete(time + date);

    return { success: true, message: `Appointment successfully booked for ${appointment_type} on ${date} at ${time} (${type})!`, appointment };
}

// Check if a slot is already booked
function isSlotBooked(time, date) {
    const key = `${date}-${time}`;
    return appointmentCache.has(key);
}

// Get all appointments
function getAllAppointments() {
    return Array.from(appointmentCache.values());
}

// Store conversation state
function saveConversationState(userId, state) {
    conversationState.set(userId, state);
}

// Get conversation state
function getConversationState(userId) {
    return conversationState.get(userId);
}

module.exports = {
    createAppointment,
    getAllAppointments,
    isSlotBooked,
    saveConversationState,
    getConversationState
};
