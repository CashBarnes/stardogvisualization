import React from 'react';

function NestedList(props) {
    const renderItem = (node, level = 0) => {
      if (node.items === null || !Array.isArray(node.items) || node.items.length == 0)
      {
        return <span key={level}>| {node.label}</span>; // display item with "|" at the beginning
      }
      
      return node.items.map((child, index) => (
        <div key={index}>
          {renderItem(child, level + 1)} // recursive call to handle nested items
        </div>
      ));
    };
    
    return (
      <div style={{ background: 'linear-gradient(#e4f8fd, #9fe6f6)', border: '1px solid #23a8b8' }}>
        {renderItem(props)} // render the list with recursive function
      </div>
    );
  }

export default NestedList;