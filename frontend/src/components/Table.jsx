import React, { useState } from 'react';
import './Table.css';

const Table = ({
  columns,
  data,
  onRowClick,
  selectable = false,
  actions,
  emptyMessage = 'No data available',
  loading = false,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleHeaderCheckbox = () => {
    setSelectedRows((prev) =>
      prev.length === data.length ? [] : data.map((row) => row.id)
    );
  };

  if (loading) {
    return (
      <div className="table-loading">
        <div className="table-spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (!data.length) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {selectable && (
              <th className="table-checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={handleHeaderCheckbox}
                />
              </th>
            )}
            {columns.map((column) => (
              <th key={column.key} style={column.style}>
                {column.title}
              </th>
            ))}
            {actions && <th className="table-actions">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`table-row ${onRowClick ? 'clickable' : ''} ${
                selectedRows.includes(row.id) ? 'selected' : ''
              }`}
            >
              {selectable && (
                <td className="table-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleRowSelect(row.id);
                    }}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="table-actions">
                  {typeof actions === 'function'
                    ? actions(row)
                    : actions}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 