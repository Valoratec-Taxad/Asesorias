// chatbot.js

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: 'YOUR_API_KEY',
});

async function handleCustomerMessage(message) {
    try {
        const response = await openai.Completions.create({
            engine: 'davinci',
            prompt: message,
            maxTokens: 150,
            n: 1,
            stop: null,
            temperature: 0.7,
        });

        const reply = response.choices[0].text.trim();
        return reply;
    } catch (error) {
        console.error('Error handling customer message:', error);
        return 'Lo siento, no puedo ayudar en este momento.';
    }
}

// Export the function to use in other parts of the application
module.exports = handleCustomerMessage;
