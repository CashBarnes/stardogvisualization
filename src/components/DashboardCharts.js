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
        backgroundColor: ['#9dcae1', '#3283bd'],
        hoverBackgroundColor: ['#9dcae1', '#3283bd'],
      },
    ],
  };

  const autoManualData = {
    labels: ['Auto', 'Manual'],
    datasets: [
      {
        data: [autoCount, manualCount],
        backgroundColor: ['#9dcae1', '#3283bd'],
        hoverBackgroundColor: ['#9dcae1', '#3283bd'],
      },
    ],
  };

  const frequencyData = {
    labels: ['Weekly', 'Monthly', 'Quarterly'],
    datasets: [
      {
        data: [weeklyCount, monthlyCount, quarterlyCount],
        backgroundColor: ['#9dcae1', '#6bb0d6', '#3283bd'],
        hoverBackgroundColor: ['#9dcae1', '#6bb0d6', '#3283bd'],
      },
    ],
  };

  return (
    <div className="dashboard-charts-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
      <div className="dashboard-chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#e4e5e7', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3>Push/Pull</h3>
        <Pie data={pushPullData} />
      </div>

      <div className="dashboard-chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#e4e5e7', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3>Auto/Manual</h3>
        <Pie data={autoManualData} />
      </div>

      <div className="dashboard-chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#e4e5e7', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3>Frequency</h3>
        <Pie data={frequencyData} />
      </div>
    </div>
  );
};

export default DashboardCharts;