import { memo, useEffect, useState, useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { fetchSystemDetails } from '../util/fetchSystemDetails';

const styles = {
  node: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.2s',
    minWidth: '200px',
  },
  nodeHover: {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  header: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '500',
    color: '#111827',
  },
  content: {
    padding: '8px',
  },
  group: {
    marginBottom: '4px',
  },
  groupButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '4px 8px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'background-color 0.2s',
  },
  groupButtonHover: {
    backgroundColor: '#f3f4f6',
  },
  chevron: {
    marginRight: '8px',
    fontSize: '12px',
    color: '#9ca3af',
  },
  itemsContainer: {
    marginLeft: '24px',
    marginTop: '4px',
  },
  item: {
    padding: '4px 8px',
    fontSize: '14px',
    color: '#1d4ed8',
    textDecoration: 'underline',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  itemCount: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#9ca3af',
  },
  handle: {
    width: '8px',
    height: '8px',
    backgroundColor: '#4f46e5',
    border: 'none',
  },
  redHandle: {
    width: '8px',
    height: '8px',
    backgroundColor: '#e00546',
    border: 'none',
  },
  greenHandle: {
    width: '8px',
    height: '8px',
    backgroundColor: '#8fce00',
    border: 'none',
  },
  emptyHandle: {
    width: '8px',
    height: '8px',
    backgroundColor: 'transparent',
    border: 'none',
  }
};

const SystemNode = memo(function SystemNode({ data }) {
  const { onSearch, onReset, groupList, expandedGroups, setExpandedGroups } = data;
  const [systemDetails, setSystemDetails] = useState([]);
  // const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [isHovered, setIsHovered] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const sourceSystemType = "sourcesystem";
  const derivedSystemType = "derivedsystem";
  const reportType = "report";

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const results = await fetchSystemDetails(data?.systemUri ?? '');
        if (isMounted) {
          setSystemDetails(groupList);
          console.log("system node outgoing edges: ", data.hasOutgoingEdges);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching system details:', error);
          setSystemDetails([]);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [data, refresh]);

  const toggleGroup = useCallback((groupName) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  }, []);
  // console.log("sys type: ", data.systemType, " source type: ", data.sourceType)
  return (
    <div
      style={{
        ...styles.node,
        ...(isHovered ? styles.nodeHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
    <Handle
      type="target"
      id="top"
      position={Position.Top}
      style={(data.systemType.toLowerCase().endsWith(derivedSystemType) && (data.sourceType.toLowerCase().endsWith(derivedSystemType) || data.sourceType === 'both')) ? styles.redHandle : styles.emptyHandle}
    />
    <Handle
      type="target"
      id="left"
      position={Position.Left}
      style={(data.systemType.toLowerCase().endsWith(derivedSystemType) && (data.sourceType.toLowerCase().endsWith(sourceSystemType) || data.sourceType === 'both')) ? styles.redHandle : styles.emptyHandle}
    />
    <Handle
      type="target"
      id = 'left'
      position={Position.Left}
      style={(!data.systemType.toLowerCase().endsWith(derivedSystemType) && data.systemType.toLowerCase().endsWith(reportType)) ? styles.handle : styles.emptyHandle}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="a"
      style={
        (data.systemType.toLowerCase().endsWith(sourceSystemType) && data.hasReportEdges) ? {...styles.handle} : {...styles.emptyHandle}
      }
    />

      <div style={styles.header}>
        {data.systemName}
      </div>

      {systemDetails?.length > 0 && (
        <div style={styles.content}>
          {systemDetails.map((group, idx) => (
            <div key={`${group.name}-${idx}`} style={styles.group}>
              <button
                onClick={() => toggleGroup(group.name)}
                style={{
                  ...styles.groupButton,
                  ...(isHovered ? styles.groupButtonHover : {})
                }}
              >
                <span style={styles.chevron}>
                  {expandedGroups.has(group.name) ? '▼' : '►'}
                </span>
                <span>{group.name}</span>
                {group.items?.length > 0 && (
                  <span style={styles.itemCount}>
                    {group.items.length}
                  </span>
                )}
              </button>

              {expandedGroups.has(group.name) && group.items?.length > 0 && (
                <div style={styles.itemsContainer}>
                  {group.items.map((item, itemIdx) => (
                    <div
                      key={`${item.name}-${itemIdx}`}
                      style={styles.item}
                      onClick={() => {
                        console.log("Item clicked: ", item.name);
                        onReset();
                        onSearch(item.uri);
                        setRefresh(prev => !prev);
                        setExpandedGroups(new Set(expandedGroups));
                        console.log("Refresh state toggled: ", !refresh);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    {/*{*/}
    {/*  data.systemType.toLowerCase().endsWith(sourceSystemType) && data.hasReportEdges*/}
    {/*  &&*/}
    {/*(*/}
    {/*<Handle*/}
    {/*  type="source"*/}
    {/*  position={Position.Right}*/}
    {/*  id="a"*/}
    {/*  style={{*/}
    {/*    ...styles.handle,*/}
    {/*    top: '30%',*/}
    {/*  }}*/}
    {/*/>*/}
    {/*)*/}
    {/*}*/}
    {
      data.systemType.toLowerCase().endsWith(derivedSystemType) && data.hasReportEdges
      &&
    (
    <Handle
      type="source"
      position={Position.Right}
      id="a"
      style={{
        ...styles.handle,
        // top: '30%',
      }}
    />
    )
    }
    {
      data.systemType.toLowerCase().endsWith(derivedSystemType) && data.hasOutgoingEdges && (data.sourceType.toLowerCase().endsWith(sourceSystemType) || data.sourceType === 'both')
      &&
    (
    <Handle
      type="source"
      position={Position.Bottom}
      id="b"
      style={{
        ...styles.redHandle,
        // top: '70%',
      }}
    />
    )
    }
    {
      data.systemType.toLowerCase().endsWith(sourceSystemType) && data.hasOutgoingEdges
      &&
    (
    <Handle
      type="source"
      position={Position.Right}
      id="b"
      style={{
        ...styles.redHandle,
        top: '70%',
      }}
    />
    )
    }
    </div>
  );
});

SystemNode.displayName = 'SystemNode';

export default SystemNode;

