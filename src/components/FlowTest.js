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

function Dashboard() {
    const { nodeData, setNodeData, edgeData, setEdgeData } = useFetchData();
    // const initialNodes = [
    // {id: '1', position: {x: 0, y: 0}, data: {label: '1'}},
    // {id: '2', position: {x: 0, y: 100}, data: {label: '2'}},
    // {id: '3', position: {x: 0, y: 200}, data: {label: '3'}},
    // ];
    // const initialEdges = [
    //     {id: 'e1-2', source: '1', target: '2'},
    //     {id: 'e2-3', source: '2', target: '3'},
    // ];

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

