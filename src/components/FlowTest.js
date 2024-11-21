import ReactFlow, {applyNodeChanges, MiniMap, Controls} from 'react-flow-renderer';
import React, {useState, useCallback} from "react";
import useFetchData from "./useFetchData";

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

    let systemCount = 0, reportCount = 0;

    for (let i = 0; i < nodeData.length; i++)
    {
      if (nodeData[i].id.toLowerCase().endsWith('report'))
      {
        nodeData[i].position.x = 300;
        nodeData[i].position.y = reportCount * 100;
        reportCount++;
      }
      else
      {
        nodeData[i].position.y = systemCount * 100;
        systemCount++;
      }
    }
    
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

