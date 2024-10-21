import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const Dashboard = ({ data }) => {
  const [sourceSystemsCount, setSourceSystemsCount] = useState(0);
  const [targetSystemsCount, setTargetSystemsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    // Use Sets to ensure unique counts
    const uniqueSourceSystems = new Set();
    const uniqueTargetSystems = new Set();
    const uniqueReports = new Set();

    // Count unique Source Systems, Target Systems, and Reports from data
    data.forEach((item) => {
      if (item.s.value.startsWith('kg:data:DataSource') && item.p.value === 'tag:stardog:designer:Knowledge_Graph_Demo:model:name') {
        // Add the object (source system name) to the set
        uniqueSourceSystems.add(item.o.value);
      } else if (item.s.value.startsWith('kg:data:TargetSystem:')) {
        uniqueTargetSystems.add(item.s.value); // Add unique target system
      } else if (item.s.value.startsWith('kg:data:Report:') && !item.s.value.startsWith('kg:data:ReportSection')) {
        // Count only items starting with kg:data:Report: but exclude ReportSection
        uniqueReports.add(item.s.value); // Add unique report
      }
    });

    setSourceSystemsCount(uniqueSourceSystems.size); // Set the size of unique source systems
    setTargetSystemsCount(uniqueTargetSystems.size); // Set the size of unique target systems
    setReportsCount(uniqueReports.size); // Set the size of unique reports
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
