import React from 'react';

const DataList = ({ data }) => {
  if (data.length === 0) {
    return <p>No data found.</p>;
  }

  return (
    <ul>
      {data.map((result, index) => (
        <li key={index}>
          Subject: {result.s.value}, Predicate: {result.p.value}, Object: {result.o.value}
        </li>
      ))}
    </ul>
  );
};

export default DataList;
