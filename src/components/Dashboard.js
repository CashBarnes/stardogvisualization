import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const Dashboard = ({ data }) => {
  const [sourceSystemsCount, setSourceSystemsCount] = useState(0);
  const [targetSystemsCount, setTargetSystemsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    let sourceSystems = 0;
    let targetSystems = 0;
    let reports = 0;

    // Count Source Systems, Target Systems, and Reports from data
    data.forEach((item) => {
      if (item.s.value.startsWith('kg:data:SourceSchema')) {
        sourceSystems++;
      } else if (item.s.value.startsWith('kg:data:TargetSystem')) {
        targetSystems++;
      } else if (item.s.value.startsWith('kg:data:Report')) {
        reports++;
      }
    });

    setSourceSystemsCount(sourceSystems);
    setTargetSystemsCount(targetSystems);
    setReportsCount(reports);
  }, [data]);

  // Data for the Bar chart
  const chartData = {
    labels: ['Source Systems', 'Target Systems', 'Reports'],
    datasets: [
      {
        label: 'Counts',
        data: [sourceSystemsCount, targetSystemsCount, reportsCount],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default Dashboard;
