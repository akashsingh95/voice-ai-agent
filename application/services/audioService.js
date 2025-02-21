const fs = require('fs');
const path = require('path');
const gTTS = require('gtts');

async function textToSpeech(text) {
    return new Promise((resolve, reject) => {
        const audioDir = path.join(__dirname, '..', 'uploads');  // Adjust the path to be relative
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }

        // Define audio file path
        const fileName = `response_${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);

        // Create the gTTS instance
        const gtts = new gTTS(text, 'en');

        // Save the audio file
        gtts.save(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                // Return the relative URL (not absolute file path!)
                resolve(`uploads/${fileName}`);
            }
        });
    });
}

module.exports = { textToSpeech };
