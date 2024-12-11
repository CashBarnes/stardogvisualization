import ReactFlow, { applyNodeChanges, MiniMap, Controls } from 'react-flow-renderer';
import React, { useState, useCallback, useEffect } from 'react';
import useFetchData from './useFetchData';
import SystemNode from './SystemNode';

const nodeTypes = {
  system: SystemNode
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#4f46e5' }
};

function Dashboard({ searchTerm, onReset }) {
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  const { nodeData, setNodeData, edgeData } = useFetchData(searchTermState);

  useEffect(() => {
    setSearchTermState(searchTerm);
  }, [searchTerm]);

  const onNodesChange = useCallback(
    (changes) => setNodeData((nds) => applyNodeChanges(changes, nds)),
    [setNodeData]
  );

  const handleSearch = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    setSearchTermState(lowerCaseTerm);
  };

  const handleReset = () => {
    setSearchTermState('');
    onReset();
  };

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <button onClick={handleReset} style={{ marginRight: '10px' }}>Reset</button>
      </div>
      <div className='relation-section' style={{ width: '100%', height: '600px', border: '1px solid #e5e7eb' }}>
        <ReactFlow
          nodes={nodeData.map(node => ({ ...node, data: { ...node.data, sourceType: node.data.sourceType, onSearch: handleSearch, onReset } }))}
          edges={edgeData}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Dashboard;