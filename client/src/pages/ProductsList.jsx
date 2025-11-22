// FILE: stockmaster-frontend/src/pages/ProductsList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/product.service';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import './ProductsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAll({
          page,
          limit: 10,
          search: debouncedSearch
        });
        
        // Handle both potential response structures (array or paginated object)
        if (response.items) {
          setProducts(response.items);
          setTotalPages(response.totalPages || 1);
        } else if (Array.isArray(response)) {
          setProducts(response); // Fallback if API returns just an array
        }
      } catch (err) {
        console.error("Failed to load products", err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, debouncedSearch]);

  // Helper to determine status
  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity <= reorderLevel) {
      return <span className="status-badge status-low">Low Stock</span>;
    }
    return <span className="status-badge status-ok">In Stock</span>;
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const tableHeaders = ['Product Name', 'SKU', 'Category', 'Total Stock', 'Reorder Level', 'Status'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your inventory items</p>
        </div>
        <Link to="/products/create" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md">+ Add Product</Button>
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
      ) : (
        <>
          {products.length === 0 ? (
            <div className="empty-state">
              <p>No products found.</p>
              {search && <Button variant="secondary" onClick={() => setSearch('')} size="sm">Clear Search</Button>}
            </div>
          ) : (
            <Table headers={tableHeaders}>
              {products.map((product) => (
                <tr key={product.id || product._id}>
                  <td>
                    <div className="product-name-cell">
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity} {product.uom}</td>
                  <td>{product.reorderLevel}</td>
                  <td>{getStockStatus(product.quantity, product.reorderLevel)}</td>
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

export default ProductsList;