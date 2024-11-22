import axios from "axios";
import { STARDOG_URL, STARDOG_USERNAME, STARDOG_PASSWORD } from '../config';

export async function fetchSystemDetails(systemUri) {
  if (systemUri?.trim() !== '') {
    try {
      const response = await axios.post(
        STARDOG_URL,
        'query=' + encodeURIComponent(`
          SELECT DISTINCT ?systemUri ?systemName (CONCAT('[', GROUP_CONCAT(
              DISTINCT CONCAT(
                  '{ "uri": "',STR(?groupUri),'", "name" : "', ?groupName, '", "items": [', ?itemList, '] }'
              ); SEPARATOR=", "
          ),']') AS ?groupList)
          FROM <kg_1b:>
          WHERE {
              { ?systemUri a kg_1b:DataSystem . } UNION { ?system a kg_1b:Report . }
              ?systemUri ?groupRel ?groupUri ; rdfs:label ?systemName .
              ?groupUri rdfs:label ?groupName .
              FILTER(?groupRel IN (kg_1b:hasTable, kg_1b:hasSection))
              {
                  SELECT ?groupUri 
                  (COALESCE(GROUP_CONCAT(CONCAT('{"uri": "', STR(?itemUri), '", "name": "', ?itemName, '"}'); SEPARATOR=", "), '') AS ?itemList)
                  WHERE {
                      ?groupUri ?itemRel ?itemUri .
                      FILTER(?itemRel IN (kg_1b:hasField, kg_1b:hasBusinessElement))
                      ?itemUri rdfs:label ?itemName .
                  }
                  GROUP BY ?groupUri
              }
              FILTER(?systemUri=${systemUri})
          }
          GROUP BY ?systemUri ?systemName
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

      if (response.data.results && response.data.results.bindings && response.data.results.bindings[0]) {
        const binding = response.data.results.bindings[0];
        const value = binding.groupList?.value;
        const output = value ? (JSON.parse(value) ?? null) : null;
        return output;
      } else {
        return null; // No data found
      }
    } catch (err) {
      console.error(`src/util/fetchSystemDetails.js`, `| ERROR:`, err);
    }
  } else { return null };
}