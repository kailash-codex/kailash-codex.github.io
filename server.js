require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mailjet = require('node-mailjet').apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const app = express();
const port = 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve your static files

// Route to handle form submission
app.post('/send-email', (req, res) => {
  const { name, email, subject, message } = req.body;
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'kailashcodex@gmail.com', // Set this value
          Name: 'Me',
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: subject,
        TextPart: message,
        HTMLPart: `<h3>Dear ${name},</h3><p>${message}</p>`,
      },
    ],
  });

  request
    .then((result) => {
      console.log(result.body);
      res.send('Email sent successfully');
    })
    .catch((err) => {
      console.log(err.statusCode);
      res.status(500).send('Failed to send email');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});