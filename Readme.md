#  Voice AI Appointment Scheduler  

This is a **Node.js-powered AI agent** that allows users to **book and manage appointments** via **natural language input**.  
The assistant **extracts details** from user messages using **OpenAI's GPT-4**, manages **appointments in-memory**, and provides **audio responses** using **text-to-speech**.

---

##  Features  
✅ AI-powered **text-to-appointment** extraction  
✅ **Text-to-speech** conversion for voice responses  
✅ **User-specific** appointment tracking  
✅ **Handles missing details** by asking follow-up questions  
✅ **Chat UI** with a futuristic **Jarvis-style** experience  

---

##  Setup & Installation  

### 1 **Clone the Repository**  
```sh
git clone https://github.com/akashsingh95/voice-ai-agent.git
cd voice-ai-agent
```

### 2 **Install Dependencies**
```sh
npm install
```

### 3 **Intialize env file with openAi Key**

### 4 **Start the Server**
```sh
node index.js
```

### 5️ Open the Frontend (Chat UI)
Open index.html in browser



### SEQUENCE FLOW
```sh
User → Frontend: Enters "Book a doctor appointment for tomorrow at 10 AM online"
Frontend → Backend API (/process): Sends request with user input
Backend API → LLM Service: Check intent (appointment booking or general query)
LLM Service → Backend API: Returns extracted appointment details
Backend API → Appointment Service: Validate & save appointment
Appointment Service → Backend API: Confirmation message
Backend API → Text-to-Speech Service: Convert response to MP3
Text-to-Speech Service → Backend API: Return MP3 file URL
Backend API → Frontend: Send text response + audio URL
Frontend → User: Display response in chat & auto-play MP3
```

### PROJECT STRUCTURE
```sh
/voice-ai-agent/            # Root project directory
│
├── application/            # Backend logic (Node.js, Express, AI processing)
│   ├── routes/             # Express API routes
│   │   ├── bookingRoutes.js  # Routes for appointment booking & queries
│   │
│   ├── services/           # Business Logic Layer
│   │   ├── bookingService.js   # Handles appointment scheduling logic
│   │   ├── appointmentService.js  # Stores & retrieves appointment data
│   │   ├── audioService.js  # Converts text responses to MP3 audio
│   │   ├── llmService.js    # AI logic (intent detection, NLP processing)
│   │
│   ├── uploads/            # Stores generated MP3 audio responses
│   ├── index.js            # Main Express Server File
│   
│
├── client/                 # Frontend (Chat UI)
│   ├── script.js           # chat logic
│   ├── index.html          # UI entry
│
├── package.json            # Root package.json
├── README.md               # Main project documentation

```


### Chat UI
![Chat Interface](docs/screenshots/chat.png)

### Appointment Confirmation
![Appointment Booking](docs/screenshots/confirmation.png)




