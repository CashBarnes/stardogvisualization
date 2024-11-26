import ReactFlow, {applyNodeChanges, MiniMap, Controls} from 'react-flow-renderer';
import React, {useState, useCallback} from "react";
import useFetchData from "./useFetchData";
import SystemNode from "./SystemNode";

// Define nodeTypes outside component
const nodeTypes = {
  system: SystemNode
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#4f46e5' }
};

function Dashboard({ searchTerm }) {
    const { nodeData, setNodeData, edgeData} = useFetchData(searchTerm);
    const onNodesChange = useCallback(
      (changes) => setNodeData((nds) => applyNodeChanges(changes, nds)),
      [setNodeData]
    );
  return (
        <div className='relation-section' style={{ width: '100%', height: '600px', border: '1px solid #e5e7eb' }}>
        <ReactFlow nodes={nodeData} edges={edgeData} nodeTypes={nodeTypes} defaultEdgeOptions={defaultEdgeOptions} onNodesChange={onNodesChange}>
        <MiniMap />
        <Controls />
        </ReactFlow>
      </div>
  );
}
export default Dashboard;

