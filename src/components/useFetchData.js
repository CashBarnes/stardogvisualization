import { useState, useEffect } from 'react';
import axios from 'axios';
import { STARDOG_URL, STARDOG_USERNAME, STARDOG_PASSWORD } from '../config';

const useFetchData = () => {
  const [data, setData] = useState([]);
  const [storedData, setStoredData] = useState([]); // Stored data in memory
  const [nodeData, setNodeData] = useState([]);
  const [edgeData, setEdgeData] = useState([]);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.post(
  //         STARDOG_URL,
  //         'query=' + encodeURIComponent(`
  //           SELECT DISTINCT * WHERE {
  //             {
  //               GRAPH <kg_1b:> {
  //                 ?s rdf:type ?s_type ; rdfs:label ?s_label ; ?p ?o .
  //                 OPTIONAL {
  //                 ?o rdfs:label ?o_label .
  //                 }
  //                 FILTER(?p != rdf:type && ?p != rdfs:label)
  //               }
  //             }
  //           }
  //
  //         `),
  //         {
  //           auth: {
  //             username: STARDOG_USERNAME,
  //             password: STARDOG_PASSWORD
  //           },
  //           headers: {
  //             'Content-Type': 'application/x-www-form-urlencoded',
  //             'Accept': 'application/sparql-results+json'
  //           }
  //         }
  //       );
  //
  //       if (response.data.results && response.data.results.bindings) {
  //         setData(response.data.results.bindings);
  //         setStoredData(response.data.results.bindings); // Store fetched data in memory
  //         console.log(response.data.results.bindings);
  //       } else {
  //         setData([]); // No data found
  //         setStoredData([]); // Clear stored data
  //       }
  //     } catch (err) {
  //       setError(err.message); // Handle connection errors
  //     }
  //   };
  //
  //   fetchData();
  // }, []);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          STARDOG_URL,
          'query=' + encodeURIComponent(`
          SELECT DISTINCT ?system ?systemName
            FROM <kg_1b:>
            WHERE {
                { ?system a kg_1b:DataSystem . } UNION { ?system a kg_1b:Report . }
              ?system rdfs:label ?systemName .
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
          const resultBindings = response.data.results.bindings??[];
          const nodesArr = resultBindings.map(res => ({id: res.system.value, data: {label: res.systemName.value}, position: {x:0, y:0}}));
          let systemCount = 0, reportCount = 0;
          for (let i = 0; i < nodesArr.length; i++)
            {
              if (nodesArr[i].id.toLowerCase().endsWith('report'))
              {
                nodesArr[i].position.x = 300;
                nodesArr[i].position.y = reportCount * 100;
                reportCount++;
              }
              else
              {
                nodesArr[i].position.y = systemCount * 100;
                systemCount++;
              }
            }
          setNodeData(nodesArr);
          console.log(nodesArr);
        } else {
          setNodeData([]); // No data found
        }
      } catch (err) {
        setError(err.message); // Handle connection errors
      }
    };

    fetchData();
  }, []);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          STARDOG_URL,
          'query=' + encodeURIComponent(`
          SELECT DISTINCT ?origin ?edge ?destination
          FROM <kg_1b:>
          {
              ?destination ?edge ?origin .
              ?origin a kg_1b:DataSystem .
              {
                  ?destination a kg_1b:DataSystem .
              } UNION {
                  ?destination a kg_1b:Report .
              }
              FILTER(?edge IN (kg_1b:derivedFrom, kg_1b:computedFrom))
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
          const resultBindings = response.data.results.bindings??[];
          const edgesArr = resultBindings.map(res => ({id: res.edge.value, source: res.origin.value, target: res.destination.value}));
          setEdgeData(edgesArr);
          console.log(edgesArr);
        } else {
          setEdgeData([]); // No data found
        }
      } catch (err) {
        setError(err.message); // Handle connection errors
      }
    };

    fetchData();
  }, []);

  return { nodeData, setNodeData, edgeData, setEdgeData, error };
};

export default useFetchData;
