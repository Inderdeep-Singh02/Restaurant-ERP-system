import React, { useState } from 'react';

const InvoiceSummary = () => {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Add functions to calculate the invoice total and update state.

  return (
    <div>
      <h2>Invoice Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Quantity</th>
            <th>Price per Item (INR)</th>
            <th>Total (INR)</th>
            <th>Price with GST (INR)</th>
          </tr>
        </thead>
        <tbody>
          {/* Display invoice items here */}
        </tbody>
      </table>
      <h3>Total Amount (INR): {totalAmount}</h3>
    </div>
  );
};

export default InvoiceSummary;
