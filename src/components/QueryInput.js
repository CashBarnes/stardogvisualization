import React from 'react';

const QueryInput = ({ query, handleQueryChange }) => {
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Query stored data"
      />
    </div>
  );
};

export default QueryInput;
