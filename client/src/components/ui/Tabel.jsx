// FILE: stockmaster-frontend/src/components/ui/Table.jsx
import React from 'react';
import './Table.css';

const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className="table-container">
      <table className={`data-table ${className}`}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;