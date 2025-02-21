const slots = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

function handleBookingRequest(text) {
    // Check for available slots
    if (/available slots|what slots are available|show me available slots/i.test(text)) {
        return `Available slots are: ${slots.join(', ')}`;
    }

    // Check for booking request
    const slotMatch = text.match(/(\d{1,2}:\d{2}\s?(AM|PM))/i);
    if (slotMatch) {
        const slot = slotMatch[0];
        const index = slots.indexOf(slot);

        if (index > -1) {
            slots.splice(index, 1);  // Remove the booked slot
            return `Appointment successfully booked for ${slot}`;
        } else {
            return `Sorry, the slot ${slot} is not available.`;
        }
    }

    // Default response for unrecognized requests
    return null;  // Let the LLM handle anything beyond booking/slots
}

module.exports = { handleBookingRequest };
