import React, { useState } from 'react';
import axios from 'axios';

const TestApi = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/chatgpt', { prompt });
      setResponse(res.data.text);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Test API ChatGPT</h1>
      <textarea
        className="p-2 border rounded mb-4 w-1/2"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {response && (
        <div className="mt-4 p-4 border rounded w-1/2">
          <h2 className="text-xl font-bold mb-2">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default TestApi;
