/**
 * Gemini Stream Service (WebSocket Proxy)
 * Connects Frontend <-> Server <-> Gemini Multimodal Live API (Direct WS)
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true })); // Explicitly allow all origins for now to debug

const port = process.env.PORT || 8080;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("CRITICAL: GOOGLE_API_KEY is missing in environment variables!");
} else {
    console.log(`Gemini Service Startup: API Key present (Length: ${GEMINI_API_KEY.length})`);
}
// Using stable model that supports Multimodal Live API
const MODEL = "gemini-1.5-flash";
// GOOGLE_WS_URL is now constructed per connection to allow for API Key redaction in logs

// System Prompt & Tools Config
const sessionConfig = {
    model: `models/${MODEL}`,
    generationConfig: {
        responseModalities: ["AUDIO", "TEXT"],
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
        }
    },
    systemInstruction: {
        parts: [{ text: "Eres Riley, la recepcionista de 'Dental AI'. Hablas español. Eres amable, breve y profesional. Tu objetivo es agendar citas." }]
    },
    tools: [
        {
            functionDeclarations: [
                {
                    name: "checkAvailability",
                    description: "Checks available appointment slots for a given date.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            date: { type: "STRING", description: "The date to check, e.g. 'tomorrow', '2024-10-12'" }
                        },
                        required: ["date"]
                    }
                },
                {
                    name: "bookAppointment",
                    description: "Book a dental appointment for a patient.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING", description: "Patient's full name" },
                            phone: { type: "STRING", description: "Patient's phone number" },
                            date: { type: "STRING", description: "Date of appointment YYYY-MM-DD" },
                            time: { type: "STRING", description: "Time of appointment HH:MM" },
                            reason: { type: "STRING", description: "Reason for visit" }
                        },
                        required: ["name", "phone", "date", "time"]
                    }
                }
            ]
        }
    ]
};

app.get('/', (req, res) => {
    res.send('Gemini Stream Service (Direct Proxy) is Running 🚀');
});

wss.on('connection', (clientWs) => {
    console.log('Client connected 🔌');
    clientWs.isAlive = true;
    clientWs.on('pong', () => { clientWs.isAlive = true; });

    // Connect to Google
    // Use v1beta for 2.0 model (Multimodal Live)
    const geminiUrl = `wss://generativelanguage.googleapis.com/v1beta/models/${MODEL}:bidiConnect?key=${GEMINI_API_KEY}`;
    console.log(`Connecting to Gemini: ${geminiUrl.replace(GEMINI_API_KEY, '***REDACTED***')}`);

    // Explicitly set Host header removed - testing simplified connection in US region
    const googleWs = new WebSocket(geminiUrl);
    const messageQueue = []; // Queue to hold messages while upstream connects

    googleWs.on('open', () => {
        console.log('Connected to Gemini Upstream ☁️');

        // Send Setup Message
        const setupMessage = {
            setup: sessionConfig
        };
        googleWs.send(JSON.stringify(setupMessage));
        console.log('Sent Setup Config');

        // Send initial trigger to force greeting (breaking the silence deadlock)
        const initialTrigger = {
            clientContent: {
                turns: [{
                    role: "user",
                    parts: [{ text: "Hola. Salúdame brevemente." }]
                }],
                turnComplete: true
            }
        };
        googleWs.send(JSON.stringify(initialTrigger));
        console.log('Sent Initial Trigger');

        // Flush buffered messages
        if (messageQueue.length > 0) {
            console.log(`Flushing ${messageQueue.length} queued messages to Gemini...`);
            while (messageQueue.length > 0) {
                const msg = messageQueue.shift();
                googleWs.send(msg);
            }
        }
    });

    googleWs.on('message', (data) => {
        try {
            const strData = data.toString();
            const json = JSON.parse(strData);

            // Log message type (Audio vs Text vs Control)
            if (json.serverContent?.modelTurn?.parts) {
                console.log('📩 RECEIVED CONTENT FROM GEMINI');
                const hasAudio = json.serverContent.modelTurn.parts.some(p => p.inlineData);
                const hasText = json.serverContent.modelTurn.parts.some(p => p.text);
                console.log(`   - Audio: ${hasAudio}, Text: ${hasText}`);
            } else {
                console.log('📩 Received Control/Other Message from Gemini');
            }

            if (json.serverContent?.modelTurn?.parts) {
                for (const part of json.serverContent.modelTurn.parts) {
                    if (part.text) {
                        console.log(`   -> Forwarding Text: "${part.text.substring(0, 20)}..."`);
                        clientWs.send(JSON.stringify({ text: part.text }));
                    }
                    if (part.inlineData && part.inlineData.mimeType.startsWith('audio/')) {
                        // console.log(`   -> Forwarding Audio Chunk (${part.inlineData.data.length} chars)`);
                        clientWs.send(JSON.stringify({ audioChunk: part.inlineData.data }));
                    }
                }
            }
        } catch (e) {
            console.error("Error parsing Gemini message:", e);
        }
    });

    googleWs.on('unexpected-response', (req, res) => {
        console.error("Gemini Handshake Failed:", {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers
        });

        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
            console.error("Gemini Error Body:", body);
            clientWs.send(JSON.stringify({ error: `Upstream Handshake Failed: ${res.statusCode} - ${body}` }));
            clientWs.close();
        });
    });

    googleWs.on('error', (e) => {
        console.error("Gemini Upstream Error:", e.message);
        clientWs.close();
    });

    googleWs.on('close', (code, reason) => {
        console.log(`Gemini Upstream Closed: ${code} - ${reason}`);
        clientWs.close();
    });

    // Client -> Google
    clientWs.on('message', (message) => {
        // Client sends { realtimeInput: { mediaChunks: [...] } }
        // We can forward this directly as it matches the protocol structure roughly.

        // Wait for Upstream to be ready
        if (googleWs.readyState === WebSocket.OPEN) {
            googleWs.send(message);
        } else {
            console.log('Buffering client message (Gemini not ready)...');
            messageQueue.push(message);
        }
    });

    clientWs.on('close', () => {
        console.log('Client disconnected 👋');
        googleWs.close();
    });
});

// Setup Keep-Alive to prevent LB timeouts
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});

server.listen(port, () => {
    console.log(`Gemini Stream Service listening on port ${port}`);
});
