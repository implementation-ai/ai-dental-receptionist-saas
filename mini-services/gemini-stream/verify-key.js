const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('GEMINI_API_KEY not set');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testKey() {
    try {
        console.log('Testing Gemini API Key...');
        console.log(`Key: ${apiKey.substring(0, 10)}...`);

        // Try to generate content
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        const text = response.text();

        console.log('\n✅ API Key is VALID');
        console.log('Model gemini-2.0-flash-exp is accessible');
        console.log(`Test response: ${text.substring(0, 50)}...`);
    } catch (error) {
        console.error('\n❌ API Key FAILED:');
        console.error('Error:', error.message);
        if (error.status) {
            console.error('Status:', error.status);
        }
        process.exit(1);
    }
}

testKey();
