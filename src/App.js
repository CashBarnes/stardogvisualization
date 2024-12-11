import React, { useState } from 'react';
import useFetchData from './components/useFetchData';
import Dashboard from './components/FlowTest';
import DashboardCharts from './components/DashboardCharts';
import { handleAddData } from './util/funcs';

const App = () => {
  const [showDashboard, setShowDashboard] = useState(true); // State to control dashboard visibility
  const [showDashboardCharts, setShowDashboardCharts] = useState(false); // State to control DashboardCharts visibility
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Handle search change
  const handleSearchChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchInput(input);
  };

  const handleReset = () => {
  setSearchInput('');
  setSearchTerm('');
};


  return (
    <div>
      <h1>Stardog Query Results</h1>
      {error && <p>Connection failed: {error}</p>}

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchTerm(searchInput);
            }
          }}
          placeholder="Search Report"
          style={{ flex: 1 }}
        />

        <button style={{ marginLeft: '10px' }} onClick={() => setSearchTerm(searchInput)}>
          Search
        </button>

        <button style={{ marginLeft: '30px' }} onClick={handleAddData}>
          Add Data
        </button>
      </div>

      {/*/!* Conditionally render the DashboardCharts above the original dashboard *!/*/}
      {/*{showDashboardCharts && <DashboardCharts data={data} />}*/}

      {/* Conditionally render the Dashboard based on showDashboard */}
      {showDashboard && <Dashboard data={data} searchTerm={searchTerm} onReset={handleReset} />}
    </div>
  );
};

export default App;