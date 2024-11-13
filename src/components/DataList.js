import React from 'react';

const DataList = ({ data }) => {
  if (data.length === 0) {
    return <p>No data found.</p>;
  }

  return (
    <ul>
      {data.map((result, index) => (
        <li key={index}>
          s: {result.s.value}, s_type: {result.s_type.value}, s_label: {result.s_label.value}, p: {result.p.value}, o: {result.o.value}
        </li>
      ))}
    </ul>
  );
};

export default DataList;
