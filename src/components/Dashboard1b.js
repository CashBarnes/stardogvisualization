import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ data }) => {
  const [sourceSystems, setSourceSystems] = useState([]);
  const [filteredSourceSystems, setFilteredSourceSystems] = useState([]);
  const [targetSystems, setTargetSystems] = useState([]);
  const [filteredTargetSystems, setFilteredTargetSystems] = useState([]);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [expandedSourceSystems, setExpandedSourceSystems] = useState({});
  const [expandedSourceTables, setExpandedSourceTables] = useState({});
  const [expandedTargetSystems, setExpandedTargetSystems] = useState({});
  const [expandedReports, setExpandedReports] = useState({});
  const [expandedReportSections, setExpandedReportSections] = useState({});
  const [searchTermSource, setSearchTermSource] = useState('');
  const [searchTermTarget, setSearchTermTarget] = useState('');
  const [searchTermReports, setSearchTermReports] = useState('');

  useEffect(() => {
    const srcSystems = new Map();
    const tgtSystems = new Map();
    const rptSystems = new Map();

      data.forEach((item) => {
        if (item.s_type.value === 'kg_1b:SourceSystem') {
          const tables = data
            .filter((entry) => entry.s.value === item.s.value && entry.p.value === 'kg_1b:hasTable')
            .map((tableEntry) => {
              const fields = data
                .filter((fieldEntry) => fieldEntry.s.value === tableEntry.o.value && fieldEntry.p.value.includes("hasField"))
                .map((fieldItem) => fieldItem.o_label ? fieldItem.o_label.value : fieldItem.o.value);

              return {
                name: tableEntry.o_label ? tableEntry.o_label.value : tableEntry.o.value,
                fields,
              };
            });

        srcSystems.set(item.s.value, {
          name: item.s_label ? item.s_label.value : item.s.value,
          tables,
        });
      } else if (item.s.value.includes("DerivedSystem")) {
        const derivedFrom = data
          .filter((entry) => entry.s.value === item.s.value && entry.p.value.includes("derivedFrom"))
          .map((derivedEntry) => derivedEntry.o_label ? derivedEntry.o_label.value : derivedEntry.o.value);

        tgtSystems.set(item.s.value, {
          name: item.s_label ? item.s_label.value : item.s.value,
          derivedFrom,
          targetFields: [],
        });
      } else if (item.s.value.includes("Report")) {
        const sections = data
          .filter((entry) => entry.s.value === item.s.value && entry.p.value.includes("hasSection"))
          .map((sectionEntry) => {
            const businessElements = data
              .filter((busElemEntry) => busElemEntry.s.value === sectionEntry.o.value && busElemEntry.p.value.includes("hasBusinessElement"))
              .map((elemEntry) => elemEntry.o_label ? elemEntry.o_label.value : elemEntry.o.value);

            return {
              name: sectionEntry.o_label ? sectionEntry.o_label.value : sectionEntry.o.value,
              businessElements,
            };
          });

        rptSystems.set(item.s.value, {
          name: item.s_label ? item.s_label.value : item.s.value,
          sections,
        });
      }
    });

    setSourceSystems(Array.from(srcSystems.values()));
    setFilteredSourceSystems(Array.from(srcSystems.values()));
    setTargetSystems(Array.from(tgtSystems.values()));
    setFilteredTargetSystems(Array.from(tgtSystems.values()));
    setReports(Array.from(rptSystems.values()));
    setFilteredReports(Array.from(rptSystems.values()));
  }, [data]);
  // Search and filter handling
  const handleSearchSourceChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchTermSource(input);
    const filtered = sourceSystems.filter((system) => system.name.toLowerCase().includes(input));
    setFilteredSourceSystems(filtered);
  };

  const handleSearchTargetChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchTermTarget(input);
    const filtered = targetSystems.filter((system) => system.name.toLowerCase().includes(input));
    setFilteredTargetSystems(filtered);
  };

  const handleSearchReportChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchTermReports(input);
    const filtered = reports.filter((report) => report.name.toLowerCase().includes(input));
    setFilteredReports(filtered);
  };

  const toggleDropdown = (expandedStateSetter, id) => {
    expandedStateSetter((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const toggleReportDropdown = (reportName) => {
    setExpandedReports((prevState) => ({
      ...prevState,
      [reportName]: !prevState[reportName]
    }));
  };

  const toggleReportSectionDropdown = (sectionName) => {
    setExpandedReportSections((prevState) => ({
      ...prevState,
      [sectionName]: !prevState[sectionName]
    }));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-section">
        {/* Source Systems Section */}
        <div className="dashboard-card">
          <h3>{filteredSourceSystems.length} Source Systems</h3>
          <input
            type="text"
            value={searchTermSource}
            onChange={handleSearchSourceChange}
            placeholder="Search Source Systems"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <ul>
            {filteredSourceSystems.map((system, index) => (
              <li key={index}>
                <span onClick={() => toggleDropdown(setExpandedSourceSystems, system.name)} style={{ cursor: 'pointer' }}>
                  {expandedSourceSystems[system.name] ? '▼' : '►'} {system.name}
                </span>
                {expandedSourceSystems[system.name] && system.tables.length > 0 && (
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {system.tables.map((table, idx) => (
                      <li key={idx} style={{ paddingLeft: '10px' }}>
                        <span onClick={() => toggleDropdown(setExpandedSourceTables, table.name)} style={{ cursor: 'pointer' }}>
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
          <input
            type="text"
            value={searchTermTarget}
            onChange={handleSearchTargetChange}
            placeholder="Search Target Systems"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <ul>
            {filteredTargetSystems.map((system, index) => (
              <li key={index}>
                <span onClick={() => toggleDropdown(setExpandedTargetSystems, system.name)} style={{ cursor: 'pointer' }}>
                  {expandedTargetSystems[system.name] ? '▼' : '►'} {system.name}
                </span>
                {expandedTargetSystems[system.name] && system.derivedFrom.length > 0 && (
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {system.derivedFrom.map((derived, idx) => (
                      <li key={idx} style={{ paddingLeft: '10px' }}>
                        {derived}
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
          <input
            type="text"
            value={searchTermReports}
            onChange={handleSearchReportChange}
            placeholder="Search Reports"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <ul>
            {filteredReports.map((report, index) => (
              <li key={index}>
                <span onClick={() => toggleReportDropdown(report.name)} style={{ cursor: 'pointer' }}>
                  {expandedReports[report.name] ? '▼' : '►'} {report.name.replace('kg_1b:', '')}
                </span>
                {expandedReports[report.name] && report.sections.length > 0 && (
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {report.sections.map((section, idx) => (
                      <li key={idx} style={{ paddingLeft: '10px' }}>
                        <span onClick={() => toggleReportSectionDropdown(section.name)} style={{ cursor: 'pointer' }}>
                          {expandedReportSections[section.name] ? '▼' : '►'} {section.name.replace('kg_1b:', '')}
                        </span>
                        {expandedReportSections[section.name] && section.businessElements.length > 0 && (
                          <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                            {section.businessElements.map((elem, elemIdx) => (
                              <li key={elemIdx} style={{ paddingLeft: '20px' }}>
                                {elem.replace('kg_1b:', '')}
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