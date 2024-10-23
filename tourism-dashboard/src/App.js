import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import Statics from './components/Statistics';
import LineChartComponent from './components/LineChart';
import PieChartComponent from './components/PieChart';
import ReviewTable from './components/ReviewsTable';
import './App.css';

function App() {
  const [stats, setStats] = useState({ newReviews: 0, complaints: 0, compliments: 0, openReviews: 0 });
  const [lineChartData, setLineChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const csvUrl = '/data/full_stack_data.csv'; 

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (result) => {
        console.log('Parsed Data:', result.data);
        const parsedData = result.data;

        
        parsedData.forEach(row => {
          if (row.date_of_stay) {
            const [day, month, year] = row.date_of_stay.split('-');
            if (year && month) {
              row.date_of_stay = `${year}-${month}`;
            }
          }
        });

      
        setReviews(parsedData);
        setFilteredReviews(parsedData.filter(review => {
          const date = new Date(review.date_of_stay);
          return date >= new Date('2023-08-01') && date <= new Date('2023-11-01');
        }));
        setStats(calculateStatistics(parsedData));
        setLineChartData(calculateLineChartData(parsedData));
        setPieChartData(calculatePieChartData(parsedData));
      },
      error: (error) => {
        console.error('PapaParse Error:', error.message);
      }
    });
  }, []);

  const calculateStatistics = (data) => {
    const now = new Date('2023-11-01');
    const lastMonth = new Date('2023-10-01');
    const fiveMonthsAgo = new Date('2023-04-01');
    

    const newReviews = data.filter(review => {
      const reviewDate = new Date(review.date_of_stay);
      return reviewDate >= lastMonth && reviewDate < now;
    }).length;
  
  
    const openReviews = data.filter(review => {
      const reviewDate = new Date(review.date_of_stay);
      return reviewDate >= fiveMonthsAgo && reviewDate < lastMonth;
    }).length;
  
    return {
      newReviews,
      openReviews,
      complaints: data.filter(review => review.Sentiment === 'Negative').length,
      compliments: data.filter(review => review.Sentiment === 'Positive').length
    };
  };
  

  const calculateLineChartData = (data) => {
    const groupedData = data.reduce((acc, review) => {
      const date = review.date_of_stay; // YYYY-MM formatında tarih
      if (!acc[date]) {
        acc[date] = { date_of_stay: date, compliments: 0, complaints: 0 };
      }
      if (review.Sentiment === 'Positive') {
        acc[date].compliments += 1;
      } else if (review.Sentiment === 'Negative') {
        acc[date].complaints += 1;
      }
      return acc;
    }, {});

  
    const filteredGroupedData = Object.values(groupedData)
      .filter(data => {
        const date = new Date(data.date_of_stay);
        return date >= new Date('2023-04-01') && date <= new Date('2023-11-01');
      })
      .sort((a, b) => new Date(a.date_of_stay) - new Date(b.date_of_stay));

    console.log('Line Chart Data:', filteredGroupedData);
    return filteredGroupedData;
  };

  const calculatePieChartData = (data) => {
    const tripTypeCounts = data.reduce((acc, review) => {
      if (review.trip_type) {
        acc[review.trip_type] = (acc[review.trip_type] || 0) + 1;
      }
      return acc;
    }, {});
  
    return Object.keys(tripTypeCounts).map(key => ({
      name: key || 'Unknown', // Handle undefined names
      value: tripTypeCounts[key] || 0, // Handle undefined values
    }));
  };
  

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const filtered = reviews.filter(review => newFilter === 'all' || review.Sentiment === newFilter);
    setFilteredReviews(filtered);
    setStats(calculateStatistics(filtered));
    setLineChartData(calculateLineChartData(filtered));
    setPieChartData(calculatePieChartData(filtered));
  };

  const downloadAsPNG = () => {
    html2canvas(document.querySelector(".App")).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'dashboard.png';
      link.click();
    });
  };

  return (
    <div className="App">
      <button onClick={downloadAsPNG} className="download-button-page">Download as PNG</button>
      <div className="side-menu">
        <h2>INTRO</h2>
        <ul>
          <li>Statistical Overview</li>
          <li>Data Platform Overview</li>
          <li>Comparison Overview</li>
        </ul>
        <h2>CATEGORIES</h2>
        <ul>
          <li>TIMELINE</li>
          <li>EXPLORE REGIONS</li>
          <li>LOCATIONS</li>
          <li>ASPECTS</li>
        </ul>
      </div>
      <div className="main-content">
        <div className="filter-container">
          <div className="filter-label">Filter:</div>
          <div className="filter-buttons">
            <button onClick={() => handleFilterChange('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>All</button>
            <button onClick={() => handleFilterChange('Positive')} className={`filter-button ${filter === 'Positive' ? 'active' : ''}`}>Positive</button>
            <button onClick={() => handleFilterChange('Negative')} className={`filter-button ${filter === 'Negative' ? 'active' : ''}`}>Negative</button>
          </div>
        </div>
        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-point" style={{ backgroundColor: '#28a745' }}></div>
            <div>New Reviews: {stats.newReviews}</div>
          </div>
          <div className="stat-box">
            <div className="stat-point" style={{ backgroundColor: '#ffc107' }}></div>
            <div>Open Reviews: {stats.openReviews}</div>
          </div>
          <div className="stat-box">
            <div className="stat-point" style={{ backgroundColor: '#dc3545' }}></div>
            <div>Complaints: {stats.complaints}</div>
          </div>
          <div className="stat-box">
            <div className="stat-point" style={{ backgroundColor: '#007bff' }}></div>
            <div>Compliments: {stats.compliments}</div>
          </div>
          
        </div>
        <LineChartComponent data={lineChartData} />
        <div className="charts-container">
          <div className="pie-chart-box">
            <PieChartComponent data={pieChartData} />
          </div>
          <div className="review-table-box">
            <ReviewTable reviews={filteredReviews} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
