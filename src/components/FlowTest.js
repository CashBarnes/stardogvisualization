import ReactFlow, { applyNodeChanges, MiniMap, Controls } from 'react-flow-renderer';
import React, { useCallback, useState } from 'react';
import useFetchData from './useFetchData';
import SystemNode from './SystemNode';

const nodeTypes = {
  system: SystemNode
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#4f46e5' }
};

function Dashboard({ searchTerm, onReset, setSearchTerm, searchUri, setSearchUri }) {
  const { nodeData, setNodeData, edgeData } = useFetchData(searchTerm, searchUri);
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const onNodesChange = useCallback(
    (changes) => setNodeData((nds) => applyNodeChanges(changes, nds)),
    [setNodeData]
  );

  const handleSearch = (uri) => {
    // const lowerCaseTerm = term.toLowerCase();
    // setSearchTerm(lowerCaseTerm);
    setSearchUri(uri);
    setSearchTerm('');
  };

  const handleReset = () => {
    setSearchTerm(''); setSearchUri(''); setExpandedGroups(new Set());
    onReset();
  };

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <button onClick={handleReset} style={{ marginRight: '10px' }}>Reset</button>
      </div>
      <div className='relation-section' style={{ width: '100%', height: '600px', border: '1px solid #e5e7eb' }}>
        <ReactFlow
          nodes={nodeData.map(node => ({ ...node, data: { ...node.data, sourceType: node.data.sourceType, onSearch: handleSearch, onReset, expandedGroups, setExpandedGroups } }))}
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