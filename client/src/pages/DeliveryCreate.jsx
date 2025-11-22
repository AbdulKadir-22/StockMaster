// FILE: stockmaster-frontend/src/pages/DeliveryCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus } from 'react-icons/fi';

// Services
import deliveryService from '../services/delivery.service';
import warehouseService from '../services/warehouse.service';
import productService from '../services/product.service';

// Components
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

// Styles
import './TransactionForm.css';

const DeliveryCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data Lists
  const [warehouses, setWarehouses] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [rawProducts, setRawProducts] = useState({}); // Map for looking up stock

  // Form State
  const [customer, setCustomer] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

  // Load Dependencies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [whData, prodData] = await Promise.all([
          warehouseService.getAll(),
          productService.getAll({ limit: 1000 }) 
        ]);
        
        setWarehouses(Array.isArray(whData) ? whData : whData.items || []);
        
        const pList = Array.isArray(prodData) ? prodData : prodData.items || [];
        
        // Create options map
        setProductOptions(pList.map(p => ({ 
          value: p.id || p._id, 
          label: `${p.name} (${p.sku})` 
        })));

        // Store raw data for lookup (to check available stock)
        const pMap = {};
        pList.forEach(p => {
          pMap[p.id || p._id] = p;
        });
        setRawProducts(pMap);
        
      } catch (err) {
        setError('Failed to load form data.');
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Helper to get stock info for UI
  const getStockInfo = (productId) => {
    const product = rawProducts[productId];
    if (!product) return null;
    
    const isLow = product.quantity <= product.reorderLevel;
    return (
      <span className={`stock-hint ${isLow ? 'low' : 'ok'}`}>
        Available: {product.quantity} {product.uom} {isLow && '(Low Stock)'}
      </span>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!customer || !warehouseId) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const validItems = items.filter(i => i.productId && i.quantity > 0);
    if (validItems.length === 0) {
      setError('Please add at least one valid product.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        type: 'DELIVERY',
        customer,
        warehouseId,
        items: validItems.map(i => ({
          product: i.productId,
          quantity: Number(i.quantity)
        }))
      };

      const response = await deliveryService.create(payload);
      
      // Auto-validate
      if (response && (response.id || response._id)) {
        await deliveryService.validate(response.id || response._id);
      }

      navigate('/deliveries');
    } catch (err) {
      setError(err.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <div className="page-header">
        <h1 className="page-title">New Delivery</h1>
        <p className="page-subtitle">Schedule outgoing shipment to customer.</p>
      </div>

      {error && <div className="auth-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <Input
            label="Customer Name"
            name="customer"
            placeholder="Enter customer name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
          <Select
            label="Origin Warehouse"
            name="warehouse"
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            options={warehouses.map(w => ({ value: w.id || w._id, label: w.name }))}
            required
          />
        </div>

        <div className="items-section">
          <h3 className="section-title" style={{marginTop: 0}}>Products to Deliver</h3>
          
          {items.map((item, index) => (
            <div key={index} className="row-group">
              <div className="flex-grow">
                <Select
                  label={index === 0 ? "Product" : ""}
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  options={productOptions}
                  placeholder="Select Product"
                />
                {item.productId && getStockInfo(item.productId)}
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
              onClick={() => navigate('/deliveries')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={loading}
            >
              Create Delivery
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeliveryCreate;