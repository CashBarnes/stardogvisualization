import React, { useState } from 'react';
import useFetchData from './components/useFetchData';
import Dashboard from './components/FlowTest';
import DashboardCharts from './components/DashboardCharts';
import DashboardStats from './components/DashboardStats';
import { handleAddData } from './util/funcs';

const App = () => {
  const [showDashboard, setShowDashboard] = useState(true); // State to control dashboard visibility
  const [showDashboardCharts, setShowDashboardCharts] = useState(true); // State to control DashboardCharts visibility
  const [showDashboardStats, setShowDashboardStats] = useState(true); // State to control DashboardStats visibility
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUri, setSearchUri] = useState('');

  const { nodeData, edgeData } = useFetchData(searchTerm, searchUri);
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  // Handle search change
  const handleSearchChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchInput(input);
  };

  const onReset = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchUri('');
    setExpandedGroups(new Set());
    onReset();
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
        <button onClick={() => setShowDashboardStats(prev => !prev)}>
          {showDashboardStats ? 'Hide' : 'Show'} Dashboard Stats
        </button>
        <button onClick={() => setShowDashboardCharts(prev => !prev)} style={{ marginLeft: '10px' }}>
          {showDashboardCharts ? 'Hide' : 'Show'} Push/Pull Charts
        </button>
        <button onClick={() => setShowDashboard(prev => !prev)} style={{ marginLeft: '10px' }}>
          {showDashboard ? 'Hide' : 'Show'} Lineage Flow
        </button>
        <button onClick={handleReset} style={{ marginLeft: '10px' }}> Reset </button>
      </div>

      {/* Conditionally render the DashboardStats above the DashboardCharts */}
      {showDashboardStats && <DashboardStats />}

      {/* Conditionally render the DashboardCharts above the original dashboard */}
      {showDashboardCharts && <DashboardCharts edgeData={edgeData} />}

      {/* Conditionally render the Dashboard based on showDashboard */}
      {showDashboard && <Dashboard onReset={onReset} setSearchTerm={setSearchTerm} setSearchUri={setSearchUri}
        nodeData={nodeData} edgeData={edgeData} expandedGroups={expandedGroups} setExpandedGroups={setExpandedGroups} />}
    </div>
  );
};

export default App;