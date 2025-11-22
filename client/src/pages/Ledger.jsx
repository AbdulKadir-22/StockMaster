// FILE: stockmaster-frontend/src/pages/Ledger.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ledgerService from '../services/ledger.service';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import './Ledger.css';

const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('ALL');

  const filterOptions = [
    { value: 'ALL', label: 'All Types' },
    { value: 'RECEIPT', label: 'Receipt' },
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'ADJUSTMENT', label: 'Adjustment' },
    { value: 'TRANSFER', label: 'Transfer' }
  ];

  useEffect(() => {
    const fetchLedger = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: 15, // Slightly larger limit for ledger views
        };

        if (filterType !== 'ALL') {
          params.type = filterType;
        }

        const response = await ledgerService.getAll(params);

        // Handle potential response variations
        if (response.items) {
          setEntries(response.items);
          setTotalPages(response.totalPages || 1);
        } else if (Array.isArray(response)) {
          setEntries(response);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load stock ledger.');
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [page, filterType]);

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  // Helper to format quantity display
  const renderQuantity = (qty, type) => {
    const isPositive = qty > 0;
    const sign = isPositive ? '+' : '';
    const className = isPositive ? 'qty-positive' : 'qty-negative';
    
    return (
      <span className={className}>
        {sign}{qty}
      </span>
    );
  };

  const tableHeaders = ['Timestamp', 'Product', 'Operation Type', 'Quantity Change', 'Warehouse', 'User'];

  return (
    <div className="ledger-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Ledger</h1>
          <p className="page-subtitle">History of all inventory movements.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-item">
          <Select
            name="operationType"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1); // Reset to page 1 on filter change
            }}
            options={filterOptions}
          />
        </div>
      </div>

      {error && <div className="ledger-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading history...</div>
      ) : (
        <>
          {entries.length === 0 ? (
            <div className="empty-state">
              <p>No ledger entries found.</p>
            </div>
          ) : (
            <Table headers={tableHeaders}>
              {entries.map((entry) => (
                <tr key={entry.id || entry._id}>
                  <td>
                    {entry.createdAt ? format(new Date(entry.createdAt), 'MMM d, yyyy, h:mm a') : 'N/A'}
                  </td>
                  <td>
                    <div className="product-cell">
                      <span className="product-name">{entry.productName || 'Unknown Product'}</span>
                      <span className="product-sku">{entry.productSku}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge type-${entry.type?.toLowerCase()}`}>
                      {entry.type}
                    </span>
                  </td>
                  <td>
                    {renderQuantity(entry.quantityChange, entry.type)}
                  </td>
                  <td>
                    {entry.warehouseName || 'Main Warehouse'}
                  </td>
                  <td>
                    {entry.userName || 'System'}
                  </td>
                </tr>
              ))}
            </Table>
          )}

          <div className="pagination">
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <div className="pagination-controls">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handlePrevPage} 
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Ledger;