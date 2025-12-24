const WebSocket = require('ws');

const wsUrl = "wss://gemini-stream-us-504425939294.us-central1.run.app";
console.log(`Connecting to ${wsUrl}...`);

const ws = new WebSocket(wsUrl, {
    headers: {
        "Origin": "https://ai-dental-receptionist-saas.web.app",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
});

ws.on('open', () => {
    console.log('✅ Connected to Server');

    // Send a 1-second silence chunk to "prime" the connection if needed
    setTimeout(() => {
        console.log('🎤 Sending simulated audio chunk...');
        const silence = Buffer.alloc(32000, 0); // 1s of 16kHz 16-bit mono PCM
        ws.send(JSON.stringify({
            realtimeInput: {
                mediaChunks: [{
                    mimeType: "audio/pcm",
                    data: silence.toString('base64')
                }]
            }
        }));
    }, 1000);

    setTimeout(() => {
        console.log('✅ Stayed connected for 5 seconds. Success!');
        ws.close();
        process.exit(0);
    }, 5000);
});

ws.on('message', (data) => {
    console.log("📩 Received Message:", data.toString().substring(0, 100) + "...");
});

ws.on('error', (e) => {
    console.error('❌ Connection Error:', e.message);
    process.exit(1);
});

ws.on('close', (code, reason) => {
    console.log(`❌ Disconnected: ${code} - ${reason}`);
    if (code !== 1000) process.exit(1);
});
