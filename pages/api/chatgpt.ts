import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_KEY;

  if (!apiKey) {
    console.error('API key not configured');
    return res.status(500).json({ message: 'API key not configured' });
  }

  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 0.7,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const { choices } = response.data;
    res.status(200).json({ text: choices[0].message.content });
  } catch (error:any) {
    console.error('Error communicating with OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error communicating with OpenAI API' });
  }
}
