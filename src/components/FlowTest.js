import ReactFlow, {applyNodeChanges, MiniMap, Controls} from 'react-flow-renderer';
import React, {useState, useCallback} from "react";
import useFetchData from "./useFetchData";

function Dashboard() {
    const { nodeData, setNodeData, edgeData, setEdgeData } = useFetchData();
    const onNodesChange = useCallback(
      (changes) => setNodeData((nds) => applyNodeChanges(changes, nds)),
      [setNodeData]
    );
  return (
        <div className='relation-section' style={{ width:800, height:400 }}>
        <ReactFlow nodes={nodeData} edges={edgeData} onNodesChange={onNodesChange}>
        <MiniMap />
        <Controls />
        </ReactFlow>
      </div>
  );
}
export default Dashboard;

