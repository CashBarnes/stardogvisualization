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
          'query=' + encodeURIComponent(`
            SELECT * WHERE {
              { 
                GRAPH <kg:data:final_merged_output> { 
                  ?s rdf:type ?s_type ; rdfs:label ?s_label ; ?p ?o . 
                  FILTER(?p != rdf:type && ?p != rdfs:label) 
                } 
              } UNION { 
                GRAPH <kg:data:JoinedData> { 
                  ?s rdf:type ?s_type ; rdfs:label ?s_label ; ?p ?o . 
                  FILTER(?p != rdf:type && ?p != rdfs:label) 
                } 
              } 
            }
          `),
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

        if (response.data.results && response.data.results.bindings) {
          setData(response.data.results.bindings);
          setStoredData(response.data.results.bindings); // Store fetched data in memory
        } else {
          setData([]); // No data found
          setStoredData([]); // Clear stored data
        }
      } catch (err) {
        setError(err.message); // Handle connection errors
      }
    };

    fetchData();
  }, []);


  return { data, storedData, setData, error };
};

export default useFetchData;
