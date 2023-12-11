import React, { useState } from 'react';

const BillingForm = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [salesperson, setSalesperson] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission (e.g., add item to the bill).
  };

  return (
    <div>
      <h2>Billing Form</h2>
      <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', alignItems: 'center',gap: 600 }}>
        <label>
          Select Food Item:
          <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
            <option value="" disabled>Select an option</option>
            {/* Add food item options here */}
          </select>
        </label>
        <label>
          Quantity:
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        </div>
        <label>
          Salesperson Name:
          <input type="text" value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
        </label>
        <label>
          Discount (%):
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </label>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default BillingForm;
