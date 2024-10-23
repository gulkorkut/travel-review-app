// Statistics.js
import React from 'react';
import './Statistics.css'; 

const Statics = ({ newReviews, complaints, compliments, openReviews }) => (
  <div className="statistics-container">
    <div className="statistics-item">
      <h3>New Reviews:</h3>
      <p>{newReviews}</p>
    </div>
    <div className="statistics-item">
      <h3>Complaints:</h3>
      <p>{complaints}</p>
    </div>
    <div className="statistics-item">
      <h3>Compliments:</h3>
      <p>{compliments}</p>
    </div>
    <div className="statistics-item">
      <h3>Open Reviews:</h3>
      <p>{openReviews}</p>
    </div>
  </div>
);

export default Statics;
