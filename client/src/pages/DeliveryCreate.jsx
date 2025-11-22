// FILE: src/pages/DeliveryCreate.jsx

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

  // ---- Global UI State ------------------------------------------------------
  const [loading, setLoading] = useState(false);          // Submit loading state
  const [initialLoading, setInitialLoading] = useState(true); // Loading dropdown data
  const [error, setError] = useState('');                 // Top-level error banner

  // ---- Reference Data (from API) -------------------------------------------
  const [warehouses, setWarehouses] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [rawProducts, setRawProducts] = useState({});     // Map productId -> full product (for reorder info)

  // ---- Form Fields ---------------------------------------------------------
  const [customer, setCustomer] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

  // ---- Load warehouses + products on mount ---------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');

        const [whData, prodData] = await Promise.all([
          warehouseService.getAll(),
          productService.getAll({ limit: 1000 }),
        ]);

        // Warehouses can be either a plain array or { items: [...] }
        const whList = Array.isArray(whData) ? whData : whData.items || [];
        setWarehouses(whList);

        // Products can also be plain array or paginated
        const pList = Array.isArray(prodData) ? prodData : prodData.items || [];

        // Build <select> options
        setProductOptions(
          pList.map((p) => ({
            value: p.id || p._id,
            label: `${p.name} (${p.sku})`,
          }))
        );

        // Map productId -> full product (we only use reorderLevel + uom now)
        const productMap = {};
        pList.forEach((p) => {
          const key = p.id || p._id;
          if (key) {
            productMap[key] = p;
          }
        });
        setRawProducts(productMap);
      } catch (err) {
        console.error('Failed to load delivery form data', err);
        setError('Failed to load delivery form data. Please refresh the page.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---- Line Item Handlers ---------------------------------------------------
  const handleAddItem = () => {
    setItems((prev) => [...prev, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // ---- Helpers --------------------------------------------------------------
  /**
   * Show reorder-level info (Product no longer has quantity; stock is in StockItem).
   * This is purely informational; actual stock enforcement happens on the backend.
   */
  const getStockInfo = (productId) => {
    const product = rawProducts[productId];
    if (!product) return null;

    const uom = product.uom || '';
    const reorderLevel =
      typeof product.reorderLevel === 'number' ? product.reorderLevel : null;

    if (reorderLevel == null) return null;

    return (
      <span className="stock-hint">
        Reorder level: {reorderLevel} {uom}
      </span>
    );
  };

  /**
   * Perform light validation before sending the payload.
   * Returns a string with an error message, or an empty string if valid.
   */
  const validateForm = () => {
    if (!customer.trim() || !warehouseId) {
      return 'Please fill in all required fields.';
    }

    const validItems = items.filter(
      (i) => i.productId && Number(i.quantity) > 0
    );

    if (validItems.length === 0) {
      return 'Please add at least one valid product.';
    }

    // IMPORTANT:
    // Do NOT try to compare with product.quantity here.
    // Product model no longer stores quantity; stock lives in StockItem
    // and will be validated on the backend side.

    return '';
  };

  // ---- Submit Handler -------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const validItems = items
        .filter((i) => i.productId && Number(i.quantity) > 0)
        .map((i) => ({
          product: i.productId,
          quantity: Number(i.quantity),
        }));

      const payload = {
        type: 'DELIVERY',
        customer: customer.trim(),
        warehouse: warehouseId,
        items: validItems,
      };

      const created = await deliveryService.create(payload);

      const createdId = created?.id || created?._id;
      if (createdId) {
        await deliveryService.validate(createdId);
      }

      navigate('/deliveries');
    } catch (err) {
      console.error('Delivery creation failed', err);
      setError(err.message || 'Delivery creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Render ---------------------------------------------------------------
  if (initialLoading) {
    return (
      <div className="transaction-container">
        <div className="loading-state">Loading delivery form...</div>
      </div>
    );
  }

  return (
    <div className="transaction-container">
      <div className="page-header">
        <h1 className="page-title">New Delivery</h1>
        <p className="page-subtitle">
          Schedule outgoing shipment to a customer.
        </p>
      </div>

      {error && <div className="auth-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* --- High-level details --------------------------------------------- */}
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
            options={warehouses.map((w) => ({
              value: w.id || w._id,
              label: w.name,
            }))}
            required
          />
        </div>

        {/* --- Line items ------------------------------------------------------ */}
        <div className="items-section">
          <h3 className="section-title" style={{ marginTop: 0 }}>
            Products to Deliver
          </h3>

          {items.map((item, index) => (
            <div key={index} className="row-group">
              <div className="flex-grow">
                <Select
                  label={index === 0 ? 'Product' : ''}
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(index, 'productId', e.target.value)
                  }
                  options={productOptions}
                  placeholder="Select Product"
                />
                {item.productId && getStockInfo(item.productId)}
              </div>

              <div className="qty-input">
                <Input
                  label={index === 0 ? 'Quantity' : ''}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, 'quantity', e.target.value)
                  }
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
            <button
              type="button"
              className="add-item-btn"
              onClick={handleAddItem}
            >
              <FiPlus style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              Add Another Item
            </button>
          </div>
        </div>

        {/* --- Summary + actions ---------------------------------------------- */}
        <div className="summary-section">
          <div className="summary-text">Total Items: {items.length}</div>

          <div
            className="form-actions"
            style={{ border: 'none', padding: 0, margin: 0 }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/deliveries')}
            >
              Cancel
            </Button>

            <Button type="submit" variant="primary" isLoading={loading}>
              Create Delivery
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeliveryCreate;
