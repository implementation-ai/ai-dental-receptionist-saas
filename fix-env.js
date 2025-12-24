const fs = require('fs');
const content = `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAeNmlLEJ7LZFIKuy991tuNl8-_3c7vXbI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ai-dental-receptionist-saas.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-dental-receptionist-saas
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ai-dental-receptionist-saas.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=504425939294
NEXT_PUBLIC_FIREBASE_APP_ID=1:504425939294:web:0a7a0b367123485108007a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-02JVQVLQD7
NEXT_PUBLIC_GEMINI_WS_URL=wss://gemini-stream-us-504425939294.us-central1.run.app
`;
fs.writeFileSync('.env.production', content, 'utf8');
console.log('.env.production written successfully');
