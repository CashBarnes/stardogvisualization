import Papa from 'papaparse';
import { postAdditionalData } from './postAdditionalData';

export const handleAddData = async () => {
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
          const jsonData = results.data.filter(d => (d.reportId !== null));

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
                sectionId: reportSection.replaceAll(' ', ''),
                sectionName: reportSection,
                businessElements: [],
                systems: []
              };
              report.sections.push(section);
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

            // Add businessElement to the section
            let be = section.businessElements.find(b => b.beName === reportBusinessElement);
            if (!be) {
              be = {
                beId: reportBusinessElement.replaceAll(' ', ''),
                beName: reportBusinessElement,
                systems: []
              };
              section.businessElements.push(be);
            }

            // Add system to the section
            if (!be.systems.find(b => b.systemId === systemId)) {
              be.systems.push({
                systemId,
                tables: []
              });
            }

            // Add systemTable to the section's system
            const beSystem = be.systems.find(s => s.systemId === systemId);
            if (!beSystem.tables.find(t => t.tableName === systemTable)) {
              beSystem.tables.push({
                tableName: systemTable,
                fields: []
              });
            }

            // Add systemField to the systemTable
            const beTable = beSystem.tables.find(t => t.tableName === systemTable);
            if (!beTable.fields.includes(systemField)) {
              beTable.fields.push(systemField);
            }

            return acc;
          }, []);

          // console.log(`src/util/funcs.js`, `| reports:`, reports);

          // Generate SPARQL INSERT query
          let sparqlInsert = `
INSERT DATA {
  GRAPH <kg_1b:> {
`;

          reports.forEach(report => {
            sparqlInsert += `    kg_1b:${report.reportId} a kg_1b:Report ;
      rdfs:label "${report.reportName}" .\n`;

            report.systems.forEach(system => {
              sparqlInsert += `    kg_1b:${report.reportId} kg_1b:computedFrom kg_1b:${system.systemId} .\n`;

              system.tables.forEach(table => {
                sparqlInsert += `    kg_1b:${report.reportId} kg_1b:computedFrom kg_1b:${table.tableName} .\n`;

                table.fields.forEach(field => {
                  sparqlInsert += `    kg_1b:${report.reportId} kg_1b:computedFrom kg_1b:${field} .\n`;
                });
              });
            });

            report.sections.forEach(section => {
              sparqlInsert += `    kg_1b:${report.reportId} kg_1b:hasSection kg_1b:${section.sectionId} .
    kg_1b:${section.sectionId} a kg_1b:ReportSection ; rdfs:label "${section.sectionName}" .\n`;

              section.systems.forEach(system => {
                sparqlInsert += `    kg_1b:${section.sectionId} kg_1b:computedFrom kg_1b:${system.systemId} .\n`;

                system.tables.forEach(table => {
                  sparqlInsert += `    kg_1b:${section.sectionId} kg_1b:computedFrom kg_1b:${table.tableName} .\n`;

                  table.fields.forEach(field => {
                    sparqlInsert += `    kg_1b:${section.sectionId} kg_1b:computedFrom kg_1b:${field} .\n`;
                  });
                });
              });

              section.businessElements.forEach(be => {
                sparqlInsert += `    kg_1b:${section.sectionId} kg_1b:hasBusinessElement kg_1b:${be.beId} .
    kg_1b:${be.beId} a kg_1b:BusinessElement ; rdfs:label "${be.beName}" .\n`;

                be.systems.forEach(system => {
                  sparqlInsert += `    kg_1b:${be.beId} kg_1b:computedFrom kg_1b:${system.systemId} .\n`;

                  system.tables.forEach(table => {
                    sparqlInsert += `    kg_1b:${be.beId} kg_1b:computedFrom kg_1b:${table.tableName} .\n`;

                    table.fields.forEach(field => {
                      sparqlInsert += `    kg_1b:${be.beId} kg_1b:computedFrom kg_1b:${field} .\n`;
                    });
                  });
                });
              });
            });

          });

          sparqlInsert += `  }
}`;

          console.log(sparqlInsert);

          postAdditionalData(sparqlInsert);
        }
      });
    };

    reader.readAsText(file);
  };

  input.click();
};