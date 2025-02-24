async function sendRequest() {
    // Get the user input from the input field
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) return;


    document.getElementById('userInput').value = '';

    // Add user message to chat
    appendMessage(userInput, 'user-message');

    // Add loading animation to simulate bot "thinking"
    const loadingIndicator = createLoadingIndicator();
    document.getElementById('chatBody').appendChild(loadingIndicator);
    scrollChatToBottom();

    // Make a POST request to the /process endpoint
    try {
        const response = await fetch('http://localhost:3000/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: userInput })
        });

        if (!response.ok) throw new Error('Failed to communicate with the server.');

        const data = await response.json();

        // Remove loading animation
        loadingIndicator.remove();

        // Add bot response to chat
        appendMessage(data.response, 'bot-message');

        // Play audio response
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = data.audioUrl;
        audioPlayer.play();
    } catch (error) {
        console.error('Error:', error);
        appendMessage('An error occurred while processing your request.', 'bot-message');
        loadingIndicator.remove();
    }

    scrollChatToBottom();
}

function appendMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', className);
    messageElement.textContent = text;
    document.getElementById('chatBody').appendChild(messageElement);
}

function createLoadingIndicator() {
    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('loading-container');

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('loading');
        dot.style.animationDelay = `${i * 0.2}s`;
        loadingContainer.appendChild(dot);
    }

    return loadingContainer;
}

function scrollChatToBottom() {
    const chatBody = document.getElementById('chatBody');
    chatBody.scrollTop = chatBody.scrollHeight;
}
