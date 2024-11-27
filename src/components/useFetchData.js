import { useState, useEffect } from 'react';
import axios from 'axios';
import { STARDOG_URL, STARDOG_USERNAME, STARDOG_PASSWORD } from '../config';

const useFetchData = (searchTerm) => {
  const [nodeData, setNodeData] = useState([]);
  const [edgeData, setEdgeData] = useState([]);
  const [error, setError] = useState(null);

  const rowPositionOffset = 150;
  const columnPositionOffset = 400;

  let nodesArr = [];
  let edgesArr = [];
  const reportType = "report";
  const sourceSystemType = "sourcesystem";
  const redHandleColor = "#e00546";

  const isReport = (node) => { return node.systemType.toLowerCase().endsWith(reportType); };
  const isSourceSystem = (node) => { return node.systemType.toLowerCase().endsWith(sourceSystemType); };

  const strProtector = (s) => (s?.replace(/(["'\\])/g, '\\$1') ?? '');

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          STARDOG_URL,
          'query=' + encodeURIComponent(`
          SELECT DISTINCT 
            ?system ?systemName ?systemType
            FROM <kg_1b:>
            WHERE {
                ?system a ?systemType .
                ?system rdfs:label ?systemName .
                FILTER(
                    (?systemType=kg_1b:Report && REGEX(LCASE(?systemName), '${strProtector(searchTerm)}')) ||
                    (
                        (?systemType IN (kg_1b:DerivedSystem, kg_1b:SourceSystem)) 
                        && (
                            EXISTS { 
                                ?report a kg_1b:Report ; rdfs:label ?reportName .
                                { ?report kg_1b:computedFrom ?system . } UNION { 
                                    ?report kg_1b:computedFrom ?system1 . ?system1 kg_1b:derivedFrom+ ?system .
                                }
                                FILTER(REGEX(LCASE(?reportName), '${strProtector(searchTerm)}'))
                            }
                        )
                    )
                )
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
          nodesArr = resultBindings.map((res, idx) => ({
            id: res.system.value, type: 'system',
            systemType: res.systemType.value,
            data: { systemUri: res.system.value, systemName: res.systemName.value, systemType: res.systemType.value },
            position: { x: 0, y: 0 },
            derivationIndex: 0
          }));
          setNodeData(nodesArr);
          console.log(nodesArr);
        } else {
          nodesArr = [];
          setNodeData([]); // No data found
        }
      } catch (err) {
        setError(err.message); // Handle connection errors
      }

      try {
        const nodeUrisStr = nodesArr.map(n => (n.id ?? '')).join(', ') ?? '';
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
              FILTER(?origin IN (${nodeUrisStr}) && ?destination IN (${nodeUrisStr}))
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
          edgesArr = resultBindings.map(res => ({id: res.edge.value + res.origin.value + res.destination.value, source: res.origin.value, target: res.destination.value}));
          setEdgeData(edgesArr);
          console.log(edgesArr);
        } else {
          edgesArr = [];
          setEdgeData([]); // No data found
        }
      } catch (err) {
        setError(err.message); // Handle connection errors
      }

      // Iterate through edge data
      let indexedSystems = [];
      let numberOfSystems = nodesArr.length;
      const systemsById = new Map(); // Used to quickly look up data on nodes during loops

      for (let i = 0; i < nodesArr.length; i++)
      {
        if (nodesArr[i].id === null || nodesArr[i].id === undefined)
        {
          continue; // Should not be possible, but prevents errors for bad data.
        }

        systemsById.set(nodesArr[i].id, nodesArr[i]);
      }

      const isReportById = (id) => {
        if(!systemsById.has(id))
        {
          return false; // Error handling if we check an ID we do not recognize; shouldn't be possible
        }

        return isReport(systemsById.get(id));
      };

      const isSourceSystemById = (id) => {
        if(!systemsById.has(id))
          {
            return false; // Error handling if we check an ID we do not recognize; shouldn't be possible
          }
  
          return isSourceSystem(systemsById.get(id));
      };
      
      // Assign an index for levels of derivation
      // Start with source systems
      for (let i = 0; i < nodesArr.length; i++)
      {
        if (isReport(nodesArr[i]))
        {
          numberOfSystems--; // Reports will be checked last, so don't include them in the total count
          continue;
        }

        if (!isSourceSystem(nodesArr[i]))
        {
          continue;
        }

        indexedSystems.push(nodesArr[i].id);
      }

      let currentNodeIndex = -1;
      let currentDerivationIndex = -1;
      let highestIndex = 0;
      const maxAttempts = 100;
      let currentAttempts = 0;
      let skipList;

      // Assign indices until every system has been assigned
      // This loop is potentially infinite, so including an upper limit to ensure we break it. (This is fragile.)
      while(indexedSystems.length < numberOfSystems
            && currentAttempts < maxAttempts)
      {
        currentAttempts++;
        skipList = [];
        for (let i = 0; i < edgesArr.length; i++)
        {
          if (indexedSystems.includes(edgesArr[i].target)
            || !indexedSystems.includes(edgesArr[i].source)
            || isReportById(edgesArr[i].target))
          {
            skipList.push(edgesArr[i].target);
          }
        }

        console.log("Skip List:");
        console.log(skipList);

        let sourceNode, targetNode;

        for (let i = 0; i < edgesArr.length; i++)
        {
          if (skipList.includes(edgesArr[i].target))
          {
            continue;
          }

          currentNodeIndex = -1;
          currentDerivationIndex = -1;

          sourceNode = systemsById.get(edgesArr[i].source);
          targetNode = systemsById.get(edgesArr[i].target);

          if (sourceNode != null && targetNode != null)
          {
            currentDerivationIndex = sourceNode.derivationIndex + 1;
            if (highestIndex < currentDerivationIndex)
            {
              highestIndex = currentDerivationIndex;
            }

            targetNode.derivationIndex = Math.max(currentDerivationIndex, targetNode.derivationIndex);
            if (!indexedSystems.includes(targetNode.id))
            {
              indexedSystems.push(targetNode.id);
            }
          }
        } // This while loop will continue until all systems have a derivation index.

        console.log("Indexed Systems:");
        console.log(indexedSystems);
      }

      let nextReport;

      // Assign an index to reports last.
      // Similar to the above logic, but only looking for reports.
      for (let i = 0; i < edgesArr.length; i++)
      {
        if (!isReportById(edgesArr[i].target))
        {
          continue;
        }

        nextReport = systemsById.get(edgesArr[i].target);

        if (nextReport !== null)
        {
          nextReport.derivationIndex = highestIndex + 1;
        }
      }

      // Set positions based on row and column
      // Reports are one column to the right of the highest derivation level

      let countByIndex = new Map();

      let systemCount = 0, reportCount = 0;
      for (let i = 0; i < nodesArr.length; i++)
      {
        if (!countByIndex.has(nodesArr[i].derivationIndex))
        {
          countByIndex.set(nodesArr[i].derivationIndex, 0);
        }

        nodesArr[i].position.x = nodesArr[i].derivationIndex * columnPositionOffset;
        nodesArr[i].position.y = countByIndex.get(nodesArr[i].derivationIndex) * rowPositionOffset;
        countByIndex.set(nodesArr[i].derivationIndex, countByIndex.get(nodesArr[i].derivationIndex) + 1); // Increment by 1. Probably a cleaner way to do this!
      }

      // Choose which source handle an edge should use based on whether it feeds into a report or a system
      for (let i = 0; i < edgesArr.length; i++)
      {
        if (isReportById(edgesArr[i].target))
        {
          edgesArr[i].sourceHandle = "a";
        }
        else
        {
          edgesArr[i].sourceHandle = "b";
          edgesArr[i].style = { stroke: redHandleColor };
        }
      }

      console.log(nodesArr);
      setNodeData(nodesArr);
      setEdgeData(edgesArr);
    };

    fetchData();
  }, [searchTerm]);



  

  return { nodeData, setNodeData, edgeData, setEdgeData, error };
};

export default useFetchData;