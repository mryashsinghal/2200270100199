import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalExpiry = expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString();

    try {
      const res = await axios.post('http://localhost:5000/shorten', {
        originalUrl: url,
        customCode,
        expiresAt: finalExpiry
      });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      alert(err.response?.data?.message || 'Error shortening URL');
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      <div className="welcome-card animate-fade-in">
        <h2>Welcome to URL Shortener!</h2>
        <p>
          Easily shorten your long URLs, customize your short codes, and set expiry times. 
          Start by entering your link below and experience fast, secure, and reliable URL shortening!
        </p>
      </div>
      <form onSubmit={handleSubmit} className="shorten-form animate-slide-up">
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="form-control mb-2"
          placeholder="Enter long URL"
          required
        />
        <input
          value={customCode}
          onChange={e => setCustomCode(e.target.value)}
          className="form-control mb-2"
          placeholder="Custom short code (optional)"
        />
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-success" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {shortUrl && (
        <div className="result-card animate-fade-in">
          <strong>Short URL:</strong>{' '}
          <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </div>
      )}
    </div>
  );
}

export default Home;