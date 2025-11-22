// FILE: stockmaster-frontend/src/pages/ProductCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/product.service';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import './ProductCreate.css';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    uom: '',
    reorderLevel: '',
    description: ''
  });

  // Mock Options (In real app, fetch from API or constants)
  const categoryOptions = [
    { value: 'Raw Materials', label: 'Raw Materials' },
    { value: 'Components', label: 'Components' },
    { value: 'Finished Goods', label: 'Finished Goods' },
    { value: 'Packaging', label: 'Packaging' }
  ];

  const uomOptions = [
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'l', label: 'Liters (l)' },
    { value: 'box', label: 'Box' },
    { value: 'set', label: 'Set' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert reorderLevel to number
      const payload = {
        ...formData,
        reorderLevel: Number(formData.reorderLevel),
        quantity: 0 // Initial stock is 0
      };

      await productService.create(payload);
      navigate('/products');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page-container">
      <div className="page-header">
        <h1 className="page-title">Add New Product</h1>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <Input
              label="Product Name"
              name="name"
              placeholder="e.g., Organic Coffee Beans"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="SKU"
              name="sku"
              placeholder="e.g., OCB-00125"
              value={formData.sku}
              onChange={handleChange}
              required
              // Add helper text logic here if Component supports it, otherwise generic layout
            />
            <small className="helper-text">Stock Keeping Unit. Must be unique.</small>
          </div>

          <div className="form-row-2">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categoryOptions}
              required
            />

            <Select
              label="Unit of Measure"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
              options={uomOptions}
              required
            />
          </div>

          <div className="form-section">
            <Input
              label="Reorder Level"
              name="reorderLevel"
              type="number"
              placeholder="e.g., 50"
              value={formData.reorderLevel}
              onChange={handleChange}
              required
              min="0"
            />
            <small className="helper-text">Get notified when stock falls to this level.</small>
          </div>

          <div className="form-section">
            <label className="textarea-label">Description</label>
            <textarea
              name="description"
              className="textarea-field"
              rows="4"
              placeholder="Add a short description of the product..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={loading}
            >
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;