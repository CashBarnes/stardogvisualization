import ReactFlow, { applyNodeChanges, MiniMap, Controls } from 'react-flow-renderer';
import React, { useCallback, useEffect, useState } from 'react';
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
  const { nodeData, edgeData } = useFetchData(searchTerm, searchUri);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [nodes, setNodes] = useState([]);

  // useEffect(() => {
  // console.log("FlowTest.js --- nodeData & edgeData update ---", '| nodeData:', nodeData, '| edgeData:', edgeData);
  // }, [nodeData, edgeData]);

  useEffect(() => {
    setNodes(nodes.map(node => ({ ...node, data: { ...node.data, sourceType: node.data.sourceType, onSearch: handleSearch, onReset, expandedGroups, setExpandedGroups } })));
    // console.log("FlowTest.js --- expandedGroups update ---", '| expandedGroups:', expandedGroups,
    //   '| nodeData:', nodeData, '| edgeData:', edgeData);
  }, [expandedGroups]);

  useEffect(() => {
    setNodes(nodeData.map(node => ({ ...node, data: { ...node.data, sourceType: node.data.sourceType, onSearch: handleSearch, onReset, expandedGroups, setExpandedGroups } })));
  }, [edgeData]);

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const handleSearch = (uri) => {
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
          nodes={nodes}
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