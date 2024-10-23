// ReviewTable.js
import React from 'react';
import html2canvas from 'html2canvas';
import './ReviewTable.css'; 

const ReviewTable = ({ reviews }) => {
  const downloadAsPNG = () => {
    const table = document.getElementById('review-table');
    html2canvas(table).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'review_table.png';
      link.click();
    });
  };

  return (
    <div className="review-table-container">
      <div className="review-table-header">
        <h2>Review Table</h2>
        <button onClick={downloadAsPNG} className="download-button">
          Download as PNG
        </button>
      </div>
      <table id="review-table" className="review-table">
        <thead>
          <tr>
            <th>Date of Stay</th>
            <th>Review</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {reviews.slice(0, 2).map((review, index) => (
            <tr key={index}>
              <td>{review.date_of_stay}</td>
              <td>{review.review}</td>
              <td>{review.Sentiment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
