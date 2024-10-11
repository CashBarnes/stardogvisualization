import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { STARDOG_URL, STARDOG_USERNAME, STARDOG_PASSWORD } from './config';

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          STARDOG_URL,
          'query=SELECT * FROM <kg:data:final_merged_output> WHERE { ?s ?p ?o }',
          {
            auth: {
              username: STARDOG_USERNAME,
              password: STARDOG_PASSWORD
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/sparql-results+json'
            }
          }
        );
        if (response.data.results.bindings.length === 0) {
          setData([]);
        } else {
          setData(response.data.results.bindings);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);
  // Display results used before creating front end
  return (
    <div>
      <h1>Stardog Query Results</h1>
      {error && <p>Connection failed: {error}</p>}
      {data.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <ul>
          {data.map((result, index) => (
            <li key={index}>
              Subject: {result.s.value}, Predicate: {result.p.value}, Object: {result.o.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;