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
    setNodes(nodes.map(node => ({ ...node,
      data: {
      ...node.data,
        sourceType: node.data.sourceType,
        onSearch: handleSearch,
        onReset,
        expandedGroups,
        setExpandedGroups
    },
    style: {
        // background: getNodeColor(node.data.sourceType),
        borderRadius: '10px',
        padding: '0px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }
    })));'0 4px 6px rgba(0, 0, 0, 0.1)'
  }, [expandedGroups]);

  useEffect(() => {
    setNodes(nodeData.map(node => ({
      ...node,
      data: {
        ...node.data,
        sourceType: node.data.sourceType,
        onSearch: handleSearch,
        onReset,
        expandedGroups,
        setExpandedGroups
      },
      style: {
        // background: getNodeColor(node.data.sourceType),
        borderRadius: '10px',
        padding: '0px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }
    })));
  }, [edgeData]);

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const handleSearch = (uri) => {
    setSearchUri(uri);
    setSearchTerm('');
  };

    const getNodeColor = (sourceType) => {
      console.log('sourceType:', sourceType);
      switch (sourceType) {
        // case 'kg_1b:SourceSystem':
        //   return '#3283bd';
        // case 'both':
        //   return '#6bb0d6';
        default:
          return '#6bb0d6';
      }
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