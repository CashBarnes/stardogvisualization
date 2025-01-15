import React from 'react';
import '../styles/DashboardStats.css';

const DashboardStats = () => {
  // Dummy data for the cards
  const statsData = [
    { icon: '📊', label: 'Reports', value: 11, color: '#D9C2F4' },
    { icon: '📋', label: 'Line Items', value: 874, color: '#FFC078' },
    { icon: '⚙️', label: 'Functional Areas', value: 3, color: '#A7E0FF' },
    { icon: '💻', label: 'Applications', value: 100, color: '#C2F4C2' },
    { icon: '📂', label: 'Data Elements', value: 962, color: '#FFDBA4' },
    { icon: '📚', label: 'Logical Attributes', value: 901, color: '#FFE1A1' },
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
