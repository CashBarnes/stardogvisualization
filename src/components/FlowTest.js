import ReactFlow, { applyNodeChanges, MiniMap, Controls } from 'react-flow-renderer';
import React, { useCallback, useEffect, useState } from 'react';
import SystemNode from './SystemNode';

const nodeTypes = {
  system: SystemNode
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#4f46e5' }
};

function Dashboard({ onReset, setSearchTerm, setSearchUri, nodeData, edgeData, expandedGroups, setExpandedGroups }) {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    setNodes(nodes.map(node => ({ ...node, data: { ...node.data, sourceType: node.data.sourceType, onSearch: handleSearch, onReset, expandedGroups, setExpandedGroups } })));
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

  return (
    <div>
      <div className='relation-section' style={{ width: '100%', height: '600px', border: '1px solid #e5e7eb' }}>
        <ReactFlow
          // nodes={nodeData.map(node => ({ ...node, data: { ...node.data, sourceType: node.data.sourceType, onSearch: handleSearch, onReset, expandedGroups, setExpandedGroups } }))}
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