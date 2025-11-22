// FILE: src/pages/Ledger.jsx

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ledgerService from '../services/ledger.service';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import './Ledger.css';

/**
 * Ledger Page
 * -----------
 * Improvements:
 * - safer data handling
 * - fallback for missing populated fields
 * - no crashes on weird backend rows
 */
const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const params = { page, limit: 15 };
        if (filterType !== 'ALL') params.type = filterType.toLowerCase();

        const response = await ledgerService.getAll(params);
        const items = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
          ? response
          : [];

        setEntries(items);
        setTotalPages(response?.totalPages || 1);
      } catch (err) {
        console.error('Ledger load error:', err);
        setError('Could not load ledger.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, filterType]);

  const renderQty = (qty) => {
    if (typeof qty !== 'number') return <span className="qty-zero">0</span>;
    const positive = qty > 0;
    return (
      <span className={positive ? 'qty-positive' : 'qty-negative'}>
        {positive ? '+' : ''}
        {qty}
      </span>
    );
  };

  return (
    <div className="ledger-container">
      <div className="page-header">
        <h1 className="page-title">Stock Ledger</h1>
        <p className="page-subtitle">History of all inventory movements.</p>
      </div>

      <div className="filter-bar">
        <Select
          value={filterType}
          options={filterOptions}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {error && <div className="ledger-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading history...</div>
      ) : entries.length === 0 ? (
        <div className="empty-state">No ledger entries found.</div>
      ) : (
        <>
          <Table
            headers={[
              'Timestamp',
              'Product',
              'Operation Type',
              'Quantity Change',
              'Warehouse',
              'User'
            ]}
          >
            {entries.map((entry) => (
              <tr key={entry?._id || entry?.id}>
                <td>
                  {entry?.createdAt
                    ? format(new Date(entry.createdAt), 'MMM d, yyyy, h:mm a')
                    : 'N/A'}
                </td>

                <td>
                  <div className="product-cell">
                    <span className="product-name">
                      {entry?.productName || entry?.product?.name || 'Unknown'}
                    </span>
                    <span className="product-sku">
                      {entry?.productSku || entry?.product?.sku || ''}
                    </span>
                  </div>
                </td>

                <td>
                  <span className={`type-badge type-${entry?.type || ''}`}>
                    {(entry?.type || '').toUpperCase()}
                  </span>
                </td>

                <td>{renderQty(entry?.quantityChange)}</td>

                <td>{entry?.warehouseName || 'Warehouse'}</td>

                <td>{entry?.userName || 'System'}</td>
              </tr>
            ))}
          </Table>

          <div className="pagination">
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>

            <div className="pagination-controls">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
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
