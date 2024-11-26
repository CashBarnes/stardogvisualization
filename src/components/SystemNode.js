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
    color: '#4b5563',
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
  }
};

const SystemNode = memo(function SystemNode({ data }) {
  const [systemDetails, setSystemDetails] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [isHovered, setIsHovered] = useState(false);

  const reportTitle = "report";

  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = useCallback(async () => {
    try {
      const results = await fetchSystemDetails(data?.systemUri ?? '');
      setSystemDetails(results ?? []);
    } catch (error) {
      console.error('Error fetching system details:', error);
      setSystemDetails([]);
    }
  }, [data?.systemUri]);

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
        position={Position.Left}
        style={data.systemName.toLowerCase().endsWith(reportTitle) ? styles.handle : styles.redHandle}
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

    {
      !data.systemName.toLowerCase().endsWith(reportTitle)
      &&
    (
    <Handle
      type="source"
      position={Position.Right}
      id="a"
      style={{
        ...styles.handle,
        top: '30%',
      }}
    />      
    )
    }
    {
      !data.systemName.toLowerCase().endsWith(reportTitle)
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