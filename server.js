const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Endpoint to handle incoming webhook from Twilio
app.post('/whatsapp-webhook', (req, res) => {
    const payload = req.body;
    console.log('Received WhatsApp message:', payload);

    // Respond to Twilio with 200 status
    res.status(200).send('Message received');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
