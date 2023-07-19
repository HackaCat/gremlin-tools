const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 9990;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await summarizeFor2ndGrader(text);
    res.json({ summary });
  } catch (error) {
    console.error('An error occurred:', error.response.data);
    res.status(500).json({ error: 'An error occurred' });
  }
});
console.log('=====================');
async function summarizeFor2ndGrader(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/engines/davinci/completions';

  const response = await axios.post(url, {
    prompt: `Translate the following text for a 2nd grader: ${text}`,
    max_tokens: 50,
    temperature: 0.3
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  });

  return response.data.choices[0].text.trim();
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});