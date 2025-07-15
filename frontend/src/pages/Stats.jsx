import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Stats.css';

function Stats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/stats')
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="stats-container animate-fade-in">
      <h2 className="stats-title">Shortened URLs Stats</h2>
      <table className="stats-table animate-slide-up">
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Created</th>
            <th>Expiry</th>
            <th>Clicks</th>
            <th>Sources</th>
            <th>Locations</th>
          </tr>
        </thead>
        <tbody>
          {data.map(url => (
            <tr key={url._id}>
              <td>
                <a
                  href={`${window.location.origin}/${url.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stats-link"
                >
                  {`${window.location.origin}/${url.shortCode}`}
                </a>
              </td>
              <td className="stats-original">{url.originalUrl}</td>
              <td>{new Date(url.createdAt).toLocaleString()}</td>
              <td>{url.expiresAt ? new Date(url.expiresAt).toLocaleString() : 'N/A'}</td>
              <td>{url.clicks.length}</td>
              <td>{[...new Set(url.clicks.map(c => c.referrer))].join(', ')}</td>
              <td>{[...new Set(url.clicks.map(c => c.location))].join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="stats-empty animate-fade-in">
          No stats available yet. Shorten a URL to see stats here!
        </div>
      )}
    </div>
  );
}

export default Stats;