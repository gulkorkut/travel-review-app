// PieChart.js
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import html2canvas from 'html2canvas';
import './PieChart.css'; 

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFB833', '#FF33A1', '#33FFDA', '#9B59B6'];

const PieChartComponent = ({ data = [] }) => {
  const downloadChartAsPNG = () => {
    const chartElement = document.querySelector('.pie-chart-content');
    if (chartElement) {
      html2canvas(chartElement).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'pie-chart.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

 
  const filteredData = data
    .filter(entry => entry.name && entry.value != null && entry.name.trim() !== '') // Geçerli verileri filtrele
    .reduce((acc, entry) => {
      const existing = acc.find(item => item.name === entry.name);
      if (existing) {
        existing.value += entry.value;
      } else {
        acc.push(entry);
      }
      return acc;
    }, []);

  return (
    <div className="pie-chart-container">
      <div className="pie-chart-header">
        <h2 className="pie-chart-title">Trip Type Distribution</h2>
        <button
          className="download-button"
          onClick={downloadChartAsPNG}
        >
          Download as PNG
        </button>
      </div>
      <div className="pie-chart-content">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="horizontal" 
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                padding: 20,
                backgroundColor: '#fff',
                border: '1px solid #ddd'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;
