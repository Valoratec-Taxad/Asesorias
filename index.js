require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const { Configuration, OpenAIApi } = require('openai');
const faqs = require('./faqs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to get AI response from OpenAI
async function getAIResponse(userMessage) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un asesor legal de Valoratec S.A. especializado en Derecho Societario, Laboral, Civil, Constitucional y Defensa Técnica. Responde siempre en español de manera profesional y clara."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return 'Lo siento, no puedo procesar tu solicitud en este momento. Por favor, intenta más tarde.';
  }
}

// Webhook endpoint for WhatsApp messages
app.post('/whatsapp', async (req, res) => {
  const incomingMessage = req.body.Body;
  const senderNumber = req.body.From;

  console.log(`Message from ${senderNumber}: ${incomingMessage}`);

  // Get response from OpenAI
  const aiResponse = await getAIResponse(incomingMessage);

  // Send response back via Twilio
  try {
    await client.messages.create({
      body: aiResponse,
      from: twilioPhoneNumber,
      to: senderNumber
    });

    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

app.listen(port, () => {
  console.log(`WhatsApp chatbot server running on port ${port}`);
});
