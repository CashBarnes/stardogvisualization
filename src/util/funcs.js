import Papa from 'papaparse';

export const handleAddData = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';

  input.onchange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;

      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const jsonData = results.data;

          // Create structured data from CSV
          const reports = jsonData.reduce((acc, item) => {
            const {
              reportId,
              reportName,
              reportSection,
              reportBusinessElement,
              systemId,
              systemTable,
              systemField
            } = item;

            // Find or create the report
            let report = acc.find(r => r.reportId === reportId);
            if (!report) {
              report = {
                reportId,
                reportName,
                sections: [],
                systems: []
              };
              acc.push(report);
            }

            // Add system to the report
            if (!report.systems.find(s => s.systemId === systemId)) {
              report.systems.push({
                systemId,
                tables: []
              });
            }

            // Add systemTable to the report's system
            const reportSystem = report.systems.find(s => s.systemId === systemId);
            if (!reportSystem.tables.find(t => t.tableName === systemTable)) {
              reportSystem.tables.push({
                tableName: systemTable,
                fields: []
              });
            }

            // Add systemField to the systemTable
            const reportTable = reportSystem.tables.find(t => t.tableName === systemTable);
            if (!reportTable.fields.includes(systemField)) {
              reportTable.fields.push(systemField);
            }

            // Find or create the reportSection
            let section = report.sections.find(s => s.sectionName === reportSection);
            if (!section) {
              section = {
                sectionId: reportSection,
                sectionName: reportSection,
                businessElements: [],
                systems: []
              };
              report.sections.push(section);
            }

            // Add businessElement to the section
            if (!section.businessElements.find(b => b.businessElementName === reportBusinessElement)) {
              section.businessElements.push({
                businessElementName: reportBusinessElement,
                systems: []
              });
            }

            // Add system to the section
            if (!section.systems.find(s => s.systemId === systemId)) {
              section.systems.push({
                systemId,
                tables: []
              });
            }

            // Add systemTable to the section's system
            const sectionSystem = section.systems.find(s => s.systemId === systemId);
            if (!sectionSystem.tables.find(t => t.tableName === systemTable)) {
              sectionSystem.tables.push({
                tableName: systemTable,
                fields: []
              });
            }

            // Add systemField to the systemTable
            const sectionTable = sectionSystem.tables.find(t => t.tableName === systemTable);
            if (!sectionTable.fields.includes(systemField)) {
              sectionTable.fields.push(systemField);
            }

            return acc;
          }, []);

          // Generate SPARQL INSERT query
          let sparqlInsert = `
INSERT DATA {
  GRAPH <kg_1b:> {
`;

      //     reports.forEach(report => {
      //       sparqlInsert += `    kg_1b:${report.reportId} a kg_1b:Report ;
      // rdfs:label "${report.reportName}" .\n`;

      //       report.systems.forEach(system => {
      //         sparqlInsert += `    kg_1b:${report.reportId} kg_1b:computedFrom kg_1b:${system.systemId} .\n`;

      //         system.tables.forEach(table => {
      //           sparqlInsert += `    kg_1b:${system.systemId} kg_1b:hasTable kg_1b:${table.tableName} .\n`;

      //           table.fields.forEach(field => {
      //             sparqlInsert += `    kg_1b:${table.tableName} kg_1b:hasField kg_1b:${field} .\n`;
      //           });
      //         });
      //       });

      //       report.sections.forEach(section => {
      //         sparqlInsert += `    kg_1b:${report.reportId} kg_1b:hasSection kg_1b:${section.sectionId} .\n`;

      //         section.businessElements.forEach(be => {
      //           sparqlInsert += `    kg_1b:${sectionId} rdfs:label "${section.sectionName}" ;
      // kg_1b:hasBusinessElement kg_1b:${be.businessElementName} .\n`;

      //           be.systems.forEach(system => {
      //             sparqlInsert += `    kg_1b:${be.businessElementName} kg_1b:computedFrom kg_1b:${system.systemId} .\n`;

      //             system.tables.forEach(table => {
      //               sparqlInsert += `    kg_1b:${table.tableName} a kg_1b:SystemTable ;
      // kg_1b:belongsTo kg_1b:${system.systemId} .\n`;

      //               table.fields.forEach(field => {
      //                 sparqlInsert += `    kg_1b:${field} a kg_1b:SystemField ;
      // kg_1b:partOf kg_1b:${table.tableName} .\n`;
      //               });
      //             });
      //           });
      //         });

      //         section.systems.forEach(system => {
      //           sparqlInsert += `    kg_1b:${system.systemId} a kg_1b:System ;
      // kg_1b:usedBy kg_1b:${section.sectionName} .\n`;

      //           system.tables.forEach(table => {
      //             sparqlInsert += `    kg_1b:${table.tableName} a kg_1b:SystemTable ;
      // kg_1b:belongsTo kg_1b:${system.systemId} .\n`;

      //             table.fields.forEach(field => {
      //               sparqlInsert += `    kg_1b:${field} a kg_1b:SystemField ;
      // kg_1b:partOf kg_1b:${table.tableName} .\n`;
      //             });
      //           });
      //         });
      //       });
      //     });

          sparqlInsert += `  }
}`;

          console.log(sparqlInsert);
        }
      });
    };

    reader.readAsText(file);
  };

  input.click();
};