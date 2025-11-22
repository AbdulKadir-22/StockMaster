// FILE: stockmaster-frontend/src/pages/ReceiptCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus } from 'react-icons/fi';

// Services
import receiptService from '../services/receipt.service';
import warehouseService from '../services/warehouse.service';
import productService from '../services/product.service';

// Components
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

// Styles
import './TransactionForm.css';

const ReceiptCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data Lists
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  // Form State
  const [supplier, setSupplier] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

  // Load Dependencies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [whData, prodData] = await Promise.all([
          warehouseService.getAll(),
          productService.getAll({ limit: 1000 }) // Fetch all for dropdown
        ]);
        
        // Handle potential array vs paginated response wrapper
        setWarehouses(Array.isArray(whData) ? whData : whData.items || []);
        
        // Adapt products for select options
        const pList = Array.isArray(prodData) ? prodData : prodData.items || [];
        setProducts(pList.map(p => ({ 
          value: p.id || p._id, 
          label: `${p.name} (${p.sku})`,
          uom: p.uom
        })));
        
      } catch (err) {
        setError('Failed to load form data. Please refresh.');
      }
    };
    fetchData();
  }, []);

  // Item Row Handlers
  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supplier || !warehouseId) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Validate items
    const validItems = items.filter(i => i.productId && i.quantity > 0);
    if (validItems.length === 0) {
      setError('Please add at least one valid product.');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Receipt
      const payload = {
        type: 'RECEIPT',
        supplier,
        warehouseId,
        items: validItems.map(i => ({
          product: i.productId,
          quantity: Number(i.quantity)
        }))
      };

      const response = await receiptService.create(payload);
      
      // 2. Auto-validate for MVP flow
      if (response && (response.id || response._id)) {
        await receiptService.validate(response.id || response._id);
      }

      navigate('/receipts');
    } catch (err) {
      setError(err.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <div className="page-header">
        <h1 className="page-title">New Receipt</h1>
        <p className="page-subtitle">Record incoming stock from suppliers.</p>
      </div>

      {error && <div className="auth-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <Input
            label="Supplier Name"
            name="supplier"
            placeholder="Enter supplier name"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          />
          <Select
            label="Warehouse"
            name="warehouse"
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            options={warehouses.map(w => ({ value: w.id || w._id, label: w.name }))}
            required
          />
        </div>

        <div className="items-section">
          <h3 className="section-title" style={{marginTop: 0}}>Items to Receive</h3>
          
          {items.map((item, index) => (
            <div key={index} className="row-group">
              <div className="flex-grow">
                <Select
                  label={index === 0 ? "Product" : ""}
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  options={products}
                  placeholder="Select Product"
                />
              </div>
              
              <div className="qty-input">
                <Input
                  label={index === 0 ? "Quantity" : ""}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                />
              </div>

              {items.length > 1 && (
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => handleRemoveItem(index)}
                  title="Remove Item"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}

          <div className="add-item-container">
            <button type="button" className="add-item-btn" onClick={handleAddItem}>
              <FiPlus style={{marginRight: '5px', verticalAlign: 'middle'}} />
              Add Another Item
            </button>
          </div>
        </div>

        <div className="summary-section">
          <div className="summary-text">
            Total Items: {items.length}
          </div>
          <div className="form-actions" style={{border: 'none', padding: 0, margin: 0}}>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/receipts')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={loading}
            >
              Create Receipt
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReceiptCreate;