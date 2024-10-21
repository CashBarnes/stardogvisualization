import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css'; // Fixed import path for the CSS

const Dashboard = ({ data }) => {
  const [sourceSystems, setSourceSystems] = useState([]);
  const [filteredSourceSystems, setFilteredSourceSystems] = useState([]); // For filtering source systems
  const [targetSystems, setTargetSystems] = useState([]);
  const [filteredTargetSystems, setFilteredTargetSystems] = useState([]); // For filtering target systems
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]); // For filtering reports
  const [expandedSourceSystems, setExpandedSourceSystems] = useState({}); // To track the expanded state of source systems
  const [expandedSourceTables, setExpandedSourceTables] = useState({}); // To track the expanded state of source tables
  const [expandedTargetSystems, setExpandedTargetSystems] = useState({}); // To track expanded state for Target Systems
  const [expandedReports, setExpandedReports] = useState({}); // To track expanded state for Reports
  const [expandedReportSections, setExpandedReportSections] = useState({}); // To track expanded state for Report Sections
  const [searchTermSource, setSearchTermSource] = useState(''); // To track the search input for Source Systems
  const [searchTermTarget, setSearchTermTarget] = useState(''); // To track the search input for Target Systems
  const [searchTermReports, setSearchTermReports] = useState(''); // To track the search input for Reports
  const [sourceTablesCount, setSourceTablesCount] = useState(0); // To count Source Tables
  const [sourceFieldsCount, setSourceFieldsCount] = useState(0); // To count Source Fields
  const [reportSectionsCount, setReportSectionsCount] = useState(0); // To count Report Sections
  const [keyBusinessElementsCount, setKeyBusinessElementsCount] = useState(0); // To count KeyBusinessElements
  const [targetFieldCount, setTargetFieldCount] = useState(0);

  useEffect(() => {
    const uniqueSourceSystems = new Map(); // Map for Source Systems and their Tables
    const uniqueTargetSystems = new Map(); // Map for Target Systems and their Key Business Elements (KBEs)
    const uniqueReports = new Map(); // Map for Reports and their Sections
    const sourceTableFieldMapping = new Map(); // Map for SourceTables and their SourceFields
    let totalSourceTables = 0;
    let totalSourceFields = 0;
    let totalReportSections = 0;
    let totalKeyBusinessElements = 0;
    let totalTargetFields = 0;

    data.forEach((item) => {
      // Identify Source Systems and their Tables
      if (item.s.value.startsWith('kg:data:DataSource') && item.p.value === 'tag:stardog:designer:Knowledge_Graph_Demo:model:name') {
        if (!uniqueSourceSystems.has(item.s.value)) {
          uniqueSourceSystems.set(item.s.value, {
            name: decodeURIComponent(item.o.value), // Decode URI components
            tables: [] // Initialize the array for tables
          });
        }
      }
    });

    data.forEach((item) => {
      // Match tables (SourceSchemas) to Source Systems using 'kg:model:inSourceSystem'
      if (item.p.value === 'kg:model:inSourceSystem') {
        const table = decodeURIComponent(item.s.value.split(':').pop()); // Extract the table name from URI
        const sourceSystemUri = item.o.value; // The source system URI is the object

        if (uniqueSourceSystems.has(sourceSystemUri)) {
          uniqueSourceSystems.get(sourceSystemUri).tables.push({
            name: table,
            fields: [] // Initialize an array for the fields under this table
          });
          totalSourceTables++; // Increment Source Tables count
        }
      }
    });

    data.forEach((item) => {
      // Match fields (SourceFields) to Source Tables using 'kg:model:inSchema'
      if (item.p.value === 'kg:model:inSchema') {
        const field = decodeURIComponent(item.s.value.split(':').pop()); // Extract the field name from URI
        const sourceTableUri = item.o.value; // The source table URI is the object

        // Initialize the table in the map if it's not already there
        if (!sourceTableFieldMapping.has(sourceTableUri)) {
          sourceTableFieldMapping.set(sourceTableUri, []);
        }
        // Push the field under the correct table
        sourceTableFieldMapping.get(sourceTableUri).push(field);
        totalSourceFields++; // Increment Source Fields count
      }
    });

    data.forEach((item) => {
      // Identify Reports and their Sections using 'hasSection'
      if (item.s.value.startsWith('kg:data:Report') && item.p.value === 'tag:stardog:designer:Knowledge_Graph_Demo:model:hasSection') {
        const report = decodeURIComponent(item.s.value.split(':').pop());
        const section = decodeURIComponent(item.o.value.split(':').pop());

        if (!uniqueReports.has(report)) {
          uniqueReports.set(report, {
            name: report,
            sections: [] // Initialize the array for sections
          });
        }

        uniqueReports.get(report).sections.push({
          name: section,
          kbes: [] // Initialize the array for Key Business Elements (KBE)
        });

        totalReportSections++; // Increment Report Sections count
      }
    });

    data.forEach((item) => {
      // Match Report Sections to Key Business Elements using 'hasKeyBusinessElement'
      if (item.p.value === 'tag:stardog:designer:Knowledge_Graph_Demo:model:hasKeyBusinessElement') {
        const section = decodeURIComponent(item.s.value.split(':').pop()); // Extract the section name from URI
        const kbeURI = item.o.value; // Extract the KBE name from URI
        const kbeNode = data.find(kbe => (kbe.s.value === kbeURI))

        uniqueReports.forEach((report) => {
          report.sections.forEach((sectionObj) => {
            if (sectionObj.name === section) {
              sectionObj.kbes.push(kbeNode.s_label.value);
            }
          });
        });

        totalKeyBusinessElements++; // Increment Key Business Elements count
      }
    });

    data.forEach((item) => {
      // Identify Target Systems
      if (item.s.value.startsWith('kg:data:TargetSystem') && item.p.value === 'tag:stardog:designer:Knowledge_Graph_Demo:model:name') {
        if (!uniqueTargetSystems.has(item.s.value)) {
          uniqueTargetSystems.set(item.s.value, {
            name: decodeURIComponent(item.o.value),
            targetFields: [] // Initialize an array for Key Business Elements (KBEs)
          });
        }
      }
    });

    data.forEach((item) => {
      // Match Target Systems to Key Business Elements using 'inTargetSystem'
      if (item.p.value === 'kg:model:inTargetSystem') {
        const targetSystemUri = item.o.value;
        const targetField = decodeURIComponent(item.s.value.split(':').pop()); // Extract the KBE name from URI

        if (uniqueTargetSystems.has(targetSystemUri)) {
          uniqueTargetSystems.get(targetSystemUri).targetFields.push(targetField); // Add KBEs under their respective Target System
          totalTargetFields++; // Increment Key Business Elements count for Target Systems
        }
      }
    });

    // Now associate fields with their respective tables inside source systems
    uniqueSourceSystems.forEach((system) => {
      system.tables.forEach((table) => {
        const tableUri = `kg:data:SourceSchema:${table.name}`;
        if (sourceTableFieldMapping.has(tableUri)) {
          table.fields = sourceTableFieldMapping.get(tableUri); // Add the fields to the table
        }
      });
    });

    // Convert Maps and Sets to arrays
    const sourceSystemsArray = Array.from(uniqueSourceSystems.values());
    setSourceSystems(sourceSystemsArray); // Convert the Map to an array of objects (with names, tables, and fields)
    setFilteredSourceSystems(sourceSystemsArray); // Initialize filtered source systems
    const targetSystemsArray = Array.from(uniqueTargetSystems.values());
    setTargetSystems(targetSystemsArray); // Convert the Map to an array of objects (with names and KBEs)
    setFilteredTargetSystems(targetSystemsArray); // Initialize filtered target systems
    const reportsArray = Array.from(uniqueReports.values());
    setReports(reportsArray); // Set reports array
    setFilteredReports(reportsArray); // Initialize filtered reports
    setSourceTablesCount(totalSourceTables); // Set total Source Tables count
    setSourceFieldsCount(totalSourceFields); // Set total Source Fields count
    setReportSectionsCount(totalReportSections); // Set total Report Sections count
    setKeyBusinessElementsCount(totalKeyBusinessElements); // Set total KBE count
    setTargetFieldCount(totalTargetFields); // Set total Target Fields count
  }, [data]);

  // Function to toggle dropdown for source systems
  const toggleSourceSystemDropdown = (system) => {
    setExpandedSourceSystems((prevState) => {
      return({
      ...prevState,
      [system]: !prevState[system], // Toggle the expanded state
    })});
  };

  // Function to toggle dropdown for source tables
  const toggleSourceTableDropdown = (table) => {
    setExpandedSourceTables((prevState) => ({
      ...prevState,
      [table]: !prevState[table], // Toggle the expanded state
    }));
  };

  // Function to toggle dropdown for target systems
  const toggleTargetSystemDropdown = (system) => {
    setExpandedTargetSystems((prevState) => ({
      ...prevState,
      [system]: !prevState[system], // Toggle the expanded state
    }));
  };

  // Function to toggle dropdown for reports
  const toggleReportDropdown = (report) => {
    setExpandedReports((prevState) => ({
      ...prevState,
      [report]: !prevState[report], // Toggle the expanded state
    }));
  };

  // Function to toggle dropdown for report sections
  const toggleReportSectionDropdown = (section) => {
    setExpandedReportSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section], // Toggle the expanded state
    }));
  };

  // Handle search input change to filter Source Systems
  const handleSearchSourceChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchTermSource(input);
    const filtered = sourceSystems.filter((system) =>
      system.name.toLowerCase().includes(input)
    );
    setFilteredSourceSystems(filtered); // Update the filtered list
  };

  // Handle search input change to filter Target Systems
  const handleSearchTargetChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchTermTarget(input);
    const filtered = targetSystems.filter((system) =>
      system.name.toLowerCase().includes(input)
    );
    setFilteredTargetSystems(filtered); // Update the filtered list
  };

  // Handle search input change to filter Reports
  const handleSearchReportChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchTermReports(input);
    const filtered = reports.filter((report) =>
      report.name.toLowerCase().includes(input)
    );
    setFilteredReports(filtered); // Update the filtered list
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-section">
        {/* Source Systems Section */}
        <div className="dashboard-card">
          <h3>{filteredSourceSystems.length} Source Systems</h3>
          {/* Search Box */}
          <input
            type="text"
            value={searchTermSource}
            onChange={handleSearchSourceChange}
            placeholder="Search Source Systems"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          {/* Display the count of Source Tables and Source Fields */}
          <div>
            <p>Source Tables: {sourceTablesCount}</p>
            <p>Source Fields: {sourceFieldsCount}</p>
          </div>
          {/* Display filtered Source Systems */}
          <ul>
            {filteredSourceSystems.map((system, index) => (
              <li key={index}>
                <span onClick={() => toggleSourceSystemDropdown(system.name)} style={{ cursor: 'pointer' }}>
                  {expandedSourceSystems[system.name] ? '▼' : '►'} {system.name}
                </span>
                {expandedSourceSystems[system.name] && system.tables.length > 0 && (
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {system.tables.map((table, idx) => (
                      <li key={idx} style={{ paddingLeft: '10px' }}>
                        <span onClick={() => toggleSourceTableDropdown(table.name)} style={{ cursor: 'pointer' }}>
                          {expandedSourceTables[table.name] ? '▼' : '►'} {table.name}
                        </span>
                        {expandedSourceTables[table.name] && table.fields.length > 0 && (
                          <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                            {table.fields.map((field, fieldIdx) => (
                              <li key={fieldIdx} style={{ paddingLeft: '20px' }}>
                                {field}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Target Systems Section */}
        <div className="dashboard-card">
          <h3>{filteredTargetSystems.length} Target Systems</h3>
          {/* Search Box */}
          <input
            type="text"
            value={searchTermTarget}
            onChange={handleSearchTargetChange}
            placeholder="Search Target Systems"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <p>Target Fields: {targetFieldCount}</p>
          <ul>
            {filteredTargetSystems.map((system, index) => (
              <li key={index}>
                <span onClick={() => toggleTargetSystemDropdown(system.name)} style={{ cursor: 'pointer' }}>
                  {expandedTargetSystems[system.name] ? '▼' : '►'} {system.name}
                </span>
                {expandedTargetSystems[system.name] && system.targetFields.length > 0 && (
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {system.targetFields.map((kbe, idx) => (
                      <li key={idx} style={{ paddingLeft: '10px' }}>
                        {kbe}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Reports Section */}
        <div className="dashboard-card">
          <h3>{filteredReports.length} Reports</h3>
          {/* Search Box */}
          <input
            type="text"
            value={searchTermReports}
            onChange={handleSearchReportChange}
            placeholder="Search Reports"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <p>Report Sections: {reportSectionsCount}</p>
          <p>Data Elements: {keyBusinessElementsCount}</p>
          <ul>
            {filteredReports.map((report, index) => (
              <li key={index}>
                <span onClick={() => toggleReportDropdown(report.name)} style={{ cursor: 'pointer' }}>
                  {expandedReports[report.name] ? '▼' : '►'} {report.name}
                </span>
                {expandedReports[report.name] && report.sections.length > 0 && (
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {report.sections.map((section, idx) => (
                      <li key={idx} style={{ paddingLeft: '10px' }}>
                        <span onClick={() => toggleReportSectionDropdown(section.name)} style={{ cursor: 'pointer' }}>
                          {expandedReportSections[section.name] ? '▼' : '►'} {section.name}
                        </span>
                        {expandedReportSections[section.name] && section.kbes.length > 0 && (
                          <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                            {section.kbes.map((kbe, kbeIdx) => (
                              <li key={kbeIdx} style={{ paddingLeft: '20px' }}>
                                {kbe}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
