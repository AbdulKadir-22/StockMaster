// FILE: src/pages/ProductsList.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/product.service';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import './ProductsList.css';

/**
 * Products List
 * -------------
 * Improvements:
 * - Safe API parsing (items may be undefined)
 * - Better empty state clarity
 * - Prevent crashing on missing fields
 */
const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await productService.getAll({
          page,
          limit: 10,
          search: debouncedSearch
        });

        const items = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
          ? response
          : [];

        setProducts(items);
        setTotalPages(response?.totalPages || 1);
      } catch (err) {
        console.error('Products load failed:', err);
        setError('Could not load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, debouncedSearch]);

  const getStockStatus = (quantity, reorderLevel) => {
    if (typeof quantity !== 'number' || typeof reorderLevel !== 'number') {
      return <span className="status-badge">Unknown</span>;
    }

    if (quantity <= reorderLevel) {
      return <span className="status-badge status-low">Low Stock</span>;
    }
    return <span className="status-badge status-ok">In Stock</span>;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your inventory items</p>
        </div>
        <Link to="/products/create">
          <Button variant="primary">+ Add Product</Button>
        </Link>
      </div>

      <div className="toolbar">
        <Input
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading inventory...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
          {search && (
            <Button variant="secondary" onClick={() => setSearch('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <>
          <Table
            headers={[
              'Product Name',
              'SKU',
              'Category',
              'Total Stock',
              'Reorder Level',
              'Status'
            ]}
          >
            {products.map((product) => (
              <tr key={product?.id || product?._id}>
                <td><strong>{product?.name || 'N/A'}</strong></td>
                <td>{product?.sku || 'N/A'}</td>
                <td>{product?.category || 'N/A'}</td>
                <td>
                  {product?.quantity ?? 0} {product?.uom || ''}
                </td>
                <td>{product?.reorderLevel ?? 0}</td>
                <td>
                  {getStockStatus(
                    product?.quantity ?? 0,
                    product?.reorderLevel ?? 0
                  )}
                </td>
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
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => page < totalPages && setPage(page + 1)}
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

export default ProductsList;
