import React from 'react';
import { Pie } from 'react-chartjs-2';
import '../styles/DashboardCharts.css';

const DashboardCharts = ({ edgeData }) => {
  const pushCount = edgeData.filter(edge => edge.push_pull === 'Push').length;
  const pullCount = edgeData.filter(edge => edge.push_pull === 'Pull').length;

  const autoCount = edgeData.filter(edge => edge.auto_manual === 'Auto').length;
  const manualCount = edgeData.filter(edge => edge.auto_manual === 'Manual').length;

  const weeklyCount = edgeData.filter(edge => edge.frequency === 'Weekly').length;
  const monthlyCount = edgeData.filter(edge => edge.frequency === 'Monthly').length;
  const quarterlyCount = edgeData.filter(edge => edge.frequency === 'Quarterly').length;

  const pushPullData = {
    labels: ['Push', 'Pull'],
    datasets: [
      {
        data: [pushCount, pullCount],
        backgroundColor: ['#4BC0C0', '#FF9F40'],
        hoverBackgroundColor: ['#4BC0C0', '#FF9F40'],
      },
    ],
  };

  const autoManualData = {
    labels: ['Auto', 'Manual'],
    datasets: [
      {
        data: [autoCount, manualCount],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const frequencyData = {
    labels: ['Weekly', 'Monthly', 'Quarterly'],
    datasets: [
      {
        data: [weeklyCount, monthlyCount, quarterlyCount],
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="dashboard-charts-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
      <div className="dashboard-chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#D9C2F4', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3>Push/Pull</h3>
        <Pie data={pushPullData} />
      </div>

      <div className="dashboard-chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFC078', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3>Auto/Manual</h3>
        <Pie data={autoManualData} />
      </div>

      <div className="dashboard-chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#A7E0FF', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3>Frequency</h3>
        <Pie data={frequencyData} />
      </div>
    </div>
  );
};

export default DashboardCharts;