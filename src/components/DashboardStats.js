import React from 'react';
import '../styles/DashboardStats.css';

const DashboardStats = ({ metricData }) => {
  // Dummy data for the cards
  const statsData = [
    { icon: '💻', label: 'Systems', value: metricData?.systemCount ?? 0, color: '#C2F4C2' },
    { icon: '📊', label: 'Reports', value: metricData?.reportCount ?? 0, color: '#D9C2F4' },
    { icon: '⚙️', label: 'Depth', value: metricData?.depthMax ?? 0, color: '#A7E0FF' },

    { icon: '📂', label: 'Data Elements', value: metricData?.fieldCount ?? 0, color: '#FFDBA4' },
    { icon: '📋', label: 'Line Items', value: metricData?.businessElementCount ?? 0, color: '#FFC078' },
    { icon: '📚', label: 'Steps', value: metricData?.stepCount ?? 0, color: '#FFE1A1' },
  ];

  return (
    <div className="dashboard-stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="stat-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: stat.color,
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>{stat.icon}</div>
          <h3 style={{ margin: '5px 0', fontSize: '20px' }}>{stat.value}</h3>
          <p style={{ margin: '0', fontSize: '16px', color: '#555' }}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
