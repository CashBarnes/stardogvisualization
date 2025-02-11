import React, { useEffect, useState }  from 'react';
import '../styles/DashboardStats.css';

const DashboardStats = ({ metricData }) => {
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    // Update statsData whenever metricData changes
    setStatsData([
      { icon: '💻', label: 'Systems', value: metricData?.systemCount ?? 0, color: '#3283bd' },
      { icon: '📊', label: 'Reports', value: metricData?.reportCount ?? 0, color: '#6bb0d6' },
      { icon: '📂', label: 'Data Elements', value: metricData?.fieldCount ?? 0, color: '#3283bd' },
      { icon: '📋', label: 'Line Items', value: metricData?.businessElementCount ?? 0, color: '#6bb0d6' },
    ]);
  }, [metricData]);

  return (
    <div className="dashboard-stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', padding: '20px' }}>
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
