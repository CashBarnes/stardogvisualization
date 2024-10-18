import React, { useEffect, useState } from 'react';

/*import {
    ReactFlow,
    MiniMap,
    Controls,
    MarkerType,
    useNodesState,
    useEdgesState,
    addEdge,
  } from '@xyflow/react';
   
  import '@xyflow/react/dist/style.css';*/

  const FilterBox = ({ header, label1, label2, filterText, onFilterTextChange }) => {
    const labelElement1 = label1 === null ? '' : <label style={{ display: 'block', color: 'white' }}>{label1}</label>;
    const labelElement2 = label2 === null ? '' : <label style={{ display: 'block', color: 'white' }}>{label2}</label>;

    return (
      <div style={{ backgroundColor: '#0097a7', border: '2px solid black', width: '220px', height: '125px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <table>
          <tr>
            <label style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', display: 'block' }}>{header}</label>
          </tr>
          <tr>
            <input type="text" value={filterText} onChange={onFilterTextChange} />
          </tr>
          <tr>
            {labelElement1}
          </tr>
          <tr>
            {labelElement2}
          </tr>
        </table>
      </div>
    );
  };

  export default FilterBox;