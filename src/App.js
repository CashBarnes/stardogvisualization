import React, { useState } from 'react';
import useFetchData from './components/useFetchData';
import Dashboard from './components/FlowTest';
import DashboardCharts from './components/DashboardCharts';
import { handleAddData } from './util/funcs';

const App = () => {
  const [showDashboard, setShowDashboard] = useState(true); // State to control dashboard visibility
  const [showDashboardCharts, setShowDashboardCharts] = useState(true); // State to control DashboardCharts visibility
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUri, setSearchUri] = useState('');

  const { nodeData, edgeData } = useFetchData(searchTerm, searchUri);

  // Placeholder data for DashboardCharts
  // const data = {
  //   pushPull: [50, 50],
  //   autoManual: [50, 50],
  //   frequency: [33, 33, 34]
  // };

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
      <h1>End-to-End Lineage Graph</h1>
      {/*{error && <p>Connection failed: {error}</p>}*/}

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchTerm(searchInput);
              setSearchUri('');
            }
          }}
          placeholder="Search Report"
          style={{ flex: 1 }}
        />

        <button style={{ marginLeft: '10px' }} onClick={() => { setSearchTerm(searchInput); setSearchUri('') }}>
          Search
        </button>

        <button style={{ marginLeft: '30px' }} onClick={handleAddData}>
          Add Data
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setShowDashboardCharts(prev => !prev)}>
          {showDashboardCharts ? 'Hide' : 'Show'} Push/Pull Charts
        </button>
        <button onClick={() => setShowDashboard(prev => !prev)} style={{ marginLeft: '10px' }}>
          {showDashboard ? 'Hide' : 'Show'} Lineage Flow
        </button>
      </div>

      {/*/!* Conditionally render the DashboardCharts above the original dashboard *!/*/}
      {showDashboardCharts && <DashboardCharts edgeData={edgeData} />}

      {/* Conditionally render the Dashboard based on showDashboard */}
      {showDashboard && <Dashboard searchTerm={searchTerm} onReset={handleReset} setSearchTerm={setSearchTerm}
      searchUri={searchUri} setSearchUri={setSearchUri} nodeData={nodeData} edgeData={edgeData} />}
    </div>
  );
};

export default App;