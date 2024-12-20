// src/components/useFetchData.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { STARDOG_USERNAME, STARDOG_PASSWORD } from '../config';
import {STARDOG_URL} from "../endpoints";

const useFetchData = (searchTerm, searchUri) => {
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

  const systemsById = new Map(); // Used to quickly look up data on nodes during

  const isReportById = (id) => { if(!systemsById.has(id)) { return false; } return isReport(systemsById.get(id)); };

  // const hasOutgoingEdges = (nodeId) => { return edgesArr.some(edge => edge.source === nodeId); };

  const hasOutgoingEdges = (nodeId) => { return edgesArr.find(edge => edge.source === nodeId && !isReportById(edge.target)); };
  const hasReportEdges = (nodeId) => { return edgesArr.find(edge => edge.source === nodeId && isReportById(edge.target)); };

  const strProtector = (s) => (s?.replace(/(["'\\])/g, '\\$1') ?? '');

  const queryStr = `SELECT DISTINCT ?system ?systemName ?systemType 
    (CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT(
        '{ "uri": "',STR(?groupUri),'", "name" : "', ?groupName, '", "items": [',?itemList,'] }'
    ); SEPARATOR=", "),']') AS ?groupList)
FROM <kg_1b:>
WHERE {
    {
        SELECT DISTINCT ?system ?systemName ?systemType ?groupUri ?groupName 
            (COALESCE(GROUP_CONCAT(DISTINCT CONCAT('{"uri": "', STR(?item), '", "name": "', ?itemName, '"}'); SEPARATOR=", "), '') AS ?itemList)
        WHERE {
            ?system a ?systemType ; rdfs:label ?systemName ; (kg_1b:hasSection|kg_1b:hasTable) ?groupUri .
            ?groupUri rdfs:label ?groupName ; (kg_1b:hasBusinessElement|kg_1b:hasField) ?item .
            ?item rdfs:label ?itemName .
            FILTER(?systemType!=kg_1b:DataSystem)
            ${searchUri?.trim() === '' ?
      `FILTER(REGEX(LCASE(?systemName), ?searchTerm) || REGEX(LCASE(?groupName), ?searchTerm) || REGEX(LCASE(?itemName), ?searchTerm))
                    BIND('${strProtector(searchTerm)}' AS ?searchTerm)`
      : `FILTER(?system=${searchUri} || ?groupUri=${searchUri} || ?item=${searchUri})`}
        }
        GROUP BY ?system ?systemName ?systemType ?groupUri ?groupName
    } UNION {
        SELECT DISTINCT ?system ?systemName ?systemType ?groupUri ?groupName 
            (COALESCE(GROUP_CONCAT(DISTINCT CONCAT('{"uri": "', STR(?item), '", "name": "', ?itemName, '"}'); SEPARATOR=", "), '') AS ?itemList)
        WHERE {
            ?sys0 rdfs:label ?sys0Name ; (kg_1b:hasSection|kg_1b:hasTable) ?grp0 .
            ?grp0 rdfs:label ?grp0Name ; (kg_1b:hasBusinessElement|kg_1b:hasField) ?itm0 .
            ?itm0 rdfs:label ?itm0Name .
            FILTER(?systemType!=kg_1b:DataSystem)
            ${searchUri?.trim() === '' ?
      `FILTER(REGEX(LCASE(?sys0Name), ?searchTerm) || REGEX(LCASE(?grp0Name), ?searchTerm) || REGEX(LCASE(?itm0Name), ?searchTerm))
              FILTER(!REGEX(LCASE(?systemName), ?searchTerm) && !REGEX(LCASE(?groupName), ?searchTerm) && !REGEX(LCASE(?itemName), ?searchTerm))
                    BIND('${strProtector(searchTerm)}' AS ?searchTerm)`
      : `FILTER(?sys0=${searchUri} || ?grp0=${searchUri} || ?itm0=${searchUri})`}
            ?system (kg_1b:hasSection|kg_1b:hasTable) ?groupUri ; a ?systemType ; rdfs:label ?systemName .
            ?groupUri rdfs:label ?groupName ; (kg_1b:hasField|kg_1b:hasBusinessElement) ?item .
            ?item rdfs:label ?itemName .
            {
                ?item (kg_1b:derivedItemLevelFrom|kg_1b:computedItemLevelFrom)+ ?itm0 .
            } UNION {
                ?itm0 (kg_1b:derivedItemLevelFrom|kg_1b:computedItemLevelFrom)+ ?item .
            }
        }
        GROUP BY ?system ?systemName ?systemType ?groupUri ?groupName
    }
        FILTER EXISTS { ?system a ?systemType . }
}
GROUP BY ?system ?systemName ?systemType
  `;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          STARDOG_URL,
          'query=' + encodeURIComponent(queryStr),
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
          nodesArr = resultBindings.filter(res => ((res.system?.value ?? '') !== '')).map((res, idx) => ({
            id: res.system.value, type: 'system',
            systemType: res.systemType.value,
            data: {
              searchTerm: searchTerm ?? '',
              systemUri: res.system.value,
              systemName: res.systemName.value,
              systemType: res.systemType.value,
              groupList: JSON.parse(res.groupList.value),
              sourceType: '',
              hasOutgoingEdges: true,
              hasReportEdges: true
            },
            position: { x: 0, y: 0 },
            derivationIndex: 0
          }));
          setNodeData(nodesArr);
          console.log("LOOK HERE FOR NODESARR: ", nodesArr);
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
          console.log("LOOK HERE FOR EDGESARR: ", edgesArr);

          // Update nodesArr to set sourceType based on connected node's systemType
          edgesArr.forEach(edge => {
            const sourceNode = nodesArr.find(node => node.id === edge.source);
            const targetNode = nodesArr.find(node => node.id === edge.target);
            if (sourceNode && targetNode) {
              if (targetNode.data.sourceType !== '' && targetNode.data.sourceType !== sourceNode.systemType) {
                targetNode.data.sourceType = 'both';
              }
              else {
                targetNode.data.sourceType = sourceNode.systemType;
              }
            }
          });

          // setNodeData(nodesArr);
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
      // const systemsById = new Map(); // Used to quickly look up data on nodes during loops

      for (let i = 0; i < nodesArr.length; i++)
      {
        if (nodesArr[i].id === null || nodesArr[i].id === undefined)
        {
          continue; // Should not be possible, but prevents errors for bad data.
        }

        systemsById.set(nodesArr[i].id, nodesArr[i]);
      }

      for (let i = 0; i < nodesArr.length; i++)
      {
        if (nodesArr[i].id === null || nodesArr[i].id === undefined)
        {
          continue; // Should not be possible, but prevents errors for bad data.
        }
        nodesArr[i].data.hasOutgoingEdges = hasOutgoingEdges(nodesArr[i].id);
        nodesArr[i].data.hasReportEdges = hasReportEdges(nodesArr[i].id);
        console.log("ID: ", nodesArr[i].id, " has report edge: ", nodesArr[i].data.hasReportEdges);
      }

      // const isReportById = (id) => {
      //   if(!systemsById.has(id))
      //   {
      //     return false; // Error handling if we check an ID we do not recognize; shouldn't be possible
      //   }
      //
      //   return isReport(systemsById.get(id));
      // };

      // Currently unused, but kept here for convenience in case it is needed later
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
      let skipList, sourceNode, targetNode;

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
        // console.log(isReportById(edgesArr[i].target));
        if (isReportById(edgesArr[i].target))
        {
          edgesArr[i].sourceHandle = "a";
          edgesArr[i].targetHandle = "left";
        }
        else
        {
          if (!isSourceSystemById(edgesArr[i].source)){
            edgesArr[i].targetHandle = "top";
          }
          else {
            edgesArr[i].targetHandle = "left";
          }
          edgesArr[i].sourceHandle = "b";
          edgesArr[i].style = { stroke: redHandleColor };
        }
      }

      // console.log("query edges arr", edgesArr);
      setNodeData(nodesArr);
      setEdgeData(edgesArr);
    };

    fetchData();
  }, [searchTerm, searchUri]);

  return { nodeData, setNodeData, edgeData, setEdgeData, error };
};

export default useFetchData;