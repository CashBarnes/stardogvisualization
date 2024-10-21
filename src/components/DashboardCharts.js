import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const DashboardCharts = ({ data }) => {
  const [frequencyCounts, setFrequencyCounts] = useState({ daily: 0, monthly: 0, quarterly: 0 });
  const [pushPullCounts, setPushPullCounts] = useState({ push: 0, pull: 0 });

  useEffect(() => {
    let dailyCount = 0;
    let monthlyCount = 0;
    let quarterlyCount = 0;
    let pushCount = 0;
    let pullCount = 0;

    // Iterate through the data to count frequency and push/pull values
    data.forEach((item) => {
      let existingNodesFrequency = [];
      let existingNodesPushPull = [];
      // Check for frequency values
      if (item.p.value === 'kg:model:frequency') {
        if(!existingNodesFrequency.includes(item.s.value)) {
          const frequencyValue = item.o.value.toLowerCase();
          if (frequencyValue === 'daily') {
            dailyCount++;
          } else if (frequencyValue === 'monthly') {
            monthlyCount++;
          } else if (frequencyValue === 'quarterly') {
            quarterlyCount++;
          }
        }
        existingNodesFrequency.push(item.s.value);
      }

      // Check for push/pull values
        if (item.p.value === 'kg:model:pushPull') {
          if(!existingNodesPushPull.includes(item.s.value)) {
            const pushPullValue = item.o.value.toLowerCase();
            if (pushPullValue === 'push') {
              pushCount++;
            } else if (pushPullValue === 'pull') {
              pullCount++;
            }
          }
          existingNodesPushPull.push(item.s.value);
      }
    });

    // Update state with counts
    setFrequencyCounts({ daily: dailyCount, monthly: monthlyCount, quarterly: quarterlyCount });
    setPushPullCounts({ push: pushCount, pull: pullCount });
  }, [data]);

  // Data for the Frequency Pie Chart
  const frequencyData = {
    labels: ['Daily', 'Monthly', 'Quarterly'],
    datasets: [
      {
        data: [frequencyCounts.daily, frequencyCounts.monthly, frequencyCounts.quarterly],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Data for the Push/Pull Pie Chart
  const pushPullData = {
    labels: ['Push', 'Pull'],
    datasets: [
      {
        data: [pushPullCounts.push, pushPullCounts.pull],
        backgroundColor: ['#4BC0C0', '#FF9F40'],
        hoverBackgroundColor: ['#4BC0C0', '#FF9F40'],
      },
    ],
  };

  return (
    <div className="dashboard-charts-container">
      <div className="dashboard-charts-section">
        {/* Pie Chart for Frequency */}
        <div className="dashboard-chart-card">
          <h3>Target System Frequencies</h3>
          <Pie data={frequencyData} />
        </div>

        {/* Pie Chart for Push/Pull */}
        <div className="dashboard-chart-card">
          <h3>Target System Push/Pull</h3>
          <Pie data={pushPullData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
