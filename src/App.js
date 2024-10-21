import React, { useState } from 'react';
import useFetchData from './components/useFetchData';
import QueryInput from './components/QueryInput';
import DataList from './components/DataList';
import Dashboard from './components/Dashboard';
import DashboardCharts from './components/DashboardCharts';

const App = () => {
  const [query, setQuery] = useState(''); // State for user input to query data
  const [showResults, setShowResults] = useState(false); // State to control display of results
  const [showQueryBox, setShowQueryBox] = useState(false); // State to control query box visibility
  const [showDashboard, setShowDashboard] = useState(true); // State to control dashboard visibility
  const [showDashboardCharts, setShowDashboardCharts] = useState(true); // State to control DashboardCharts visibility
  const { data, storedData, setData, error } = useFetchData();

  // Function to filter stored data based on query input
  const queryData = (input) => {
    return storedData.filter(
      (item) =>
        item.s.value.includes(input) ||
        item.p.value.includes(input) ||
        item.o.value.includes(input)
    );
  };

  // Handle input change and query stored data
  const handleQueryChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.length > 0) {
      setShowResults(true);
      setData(queryData(input)); // Update displayed data based on query
    } else {
      setShowResults(false); // Hide results if input is cleared
    }
  };

  return (
    <div>
      <h1>Stardog Query Results</h1>
      {error && <p>Connection failed: {error}</p>}

      {/* Toggle buttons */}
      <button onClick={() => setShowQueryBox(!showQueryBox)}>
        Toggle Query Box
      </button>
      <button onClick={() => setShowResults(!showResults)}>
        Toggle Query Results
      </button>
      <button onClick={() => setShowDashboardCharts(!showDashboardCharts)}>
        Toggle Dashboard Charts
      </button>
      <button onClick={() => setShowDashboard(!showDashboard)}>
        Toggle Dashboard
      </button>

      {/* Conditionally render the QueryInput component based on showQueryBox */}
      {showQueryBox && (
        <QueryInput query={query} handleQueryChange={handleQueryChange} />
      )}

      {/* Conditionally render the DataList only if showResults is true */}
      {showResults && <DataList data={data} />}

      {/* Conditionally render the DashboardCharts above the original dashboard */}
      {showDashboardCharts && <DashboardCharts data={data} />}

      {/* Conditionally render the Dashboard based on showDashboard */}
      {showDashboard && <Dashboard data={data} />}
    </div>
  );
};

export default App;
