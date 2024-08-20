import React, { useState } from 'react';
import axios from 'axios';

function TestUrl() {
  const [url, setUrl] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleExtractText = async () => {
    setLoading(true);
    setError('');
    setExtractedText('');
    try {
      // Step 1: Fetch the HTML content from the URL
      const response = await axios.get(`/api/extract-text?url=${encodeURIComponent(url)}`);
      setExtractedText(response.data.text);
    } catch (err) {
      setError('An error occurred while extracting text from the URL.');
      console.error("C'etait dans le front");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Extract Text from URL</h1>
      <input
        type="text"
        placeholder="Enter a URL"
        value={url}
        onChange={handleInputChange}
        className="input"
      />
      <button onClick={handleExtractText} className="button">
        Extract Text
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {extractedText && <div className="extracted-text"><pre>{extractedText}</pre></div>}
    </div>
  );
}

export default TestUrl;
