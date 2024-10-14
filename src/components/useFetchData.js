import { useState, useEffect } from 'react';
import axios from 'axios';
import { STARDOG_URL, STARDOG_USERNAME, STARDOG_PASSWORD } from '../config';

const useFetchData = () => {
  const [data, setData] = useState([]);
  const [storedData, setStoredData] = useState([]); // Stored data in memory
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
          setStoredData([]); // Clear stored data if no results
        } else {
          setData(response.data.results.bindings);
          setStoredData(response.data.results.bindings); // Store fetched data in memory
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return { data, storedData, setData, error };
};

export default useFetchData;
