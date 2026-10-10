const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json({ limit: '10mb' }));

app.get('/api/gemini/status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({ configured: hasKey, model: 'gemini-3.8-flash' });
});

app.post('/api/gemini/generate', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please configure GEMINI_API_KEY in your environment variables to enable the AI Writing Studio.',
        missingKey: true
      });
    }

    const { prompt, systemInstruction } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a text string.' });
    }

    if (prompt.length > 50000) {
      return res.status(400).json({ error: 'Input text exceeds maximum allowed size (50,000 characters).' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined
    });

    return res.json({ text: response.text || '' });
  } catch (err) {
    console.error('Gemini API Server Error:', err);
    const isRateLimit = err?.status === 429 || (err?.message && err.message.includes('429'));
    return res.status(isRateLimit ? 429 : 500).json({
      error: isRateLimit
        ? 'Gemini API rate limit reached. Please wait a moment and try again.'
        : (err.message || 'An error occurred while communicating with the Gemini API.')
    });
  }
});

// Serve static assets from build
app.use(express.static(path.join(__dirname, 'build')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`TextUtil server running on http://${HOST}:${PORT}`);
});
