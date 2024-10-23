// LineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CSVLink } from 'react-csv';
import './LineChart.css'; 

const LineChartComponent = ({ data = [] }) => {
  return (
    <div className="line-chart-container">
      <div className="line-chart-header">
        <h2 className="line-chart-title">Distribution of Compliments/Complaints over time</h2>
        <CSVLink
          data={data}
          filename={"line-chart-data.csv"}
          className="download-button"
          target="_blank"
        >
          Download Data
        </CSVLink>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date_of_stay" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="compliments" stroke="#8884d8" />
          <Line type="monotone" dataKey="complaints" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
