import React, { useState } from 'react';

function Recommendation() {
  const [userId, setUserId] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    const response = await fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, method: 'content-based' }),
    });
    const data = await response.json();
    setRecommendations(data.recommendations);
  };

  return (
    <div>
      <h2>Get Restaurant Recommendations</h2>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchRecommendations}>Get Recommendations</button>

      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>
            {rec.placeID}: {rec.name || 'Unknown'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendation;
