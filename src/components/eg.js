import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

Modal.setAppElement('#root');

const InvoiceFormWrapper = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;

  label {
    font-weight: bold;
  }

  input, select {
    padding: 5px;
    border: 1px solid #ccc;
    height: 20px;
    width: 100px;
    border-radius: 5px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
`;

const InvoiceFormModal = ({ isOpen, onClose, onAddItem }) => {
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [gst, setGst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = {
      id,
      date,
      name,
      discount,
      totalAmount,
      gst,
      cgst,
      price,
      quantity,
      total,
      status,
    };
    onAddItem(item);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Add Invoice">
      <InvoiceFormWrapper>
        <h2>Add Invoice</h2>
        <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center',gap: 60 }}>
          <FormField>
            <label>Invoice ID:</label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
          </FormField>
          <FormField>
            <label>Date:</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
          </FormField>
          <FormField>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField>
            <label>Discount (%):</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </FormField>
          </div>
          <div style={{ display: 'flex', alignItems: 'center',gap: 60 }}></div>
          <FormField>
            <label>Total Amount (INR):</label>
            <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
          </FormField>
          <FormField>
            <label>GST:</label>
            <input type="number" value={gst} onChange={(e) => setGst(e.target.value)} />
          </FormField>
          <FormField>
            <label>CGST:</label>
            <input type="number" value={cgst} onChange={(e) => setCgst(e.target.value)} />
          </FormField>
          <FormField>
            <label>Price:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </FormField>
          <FormField>
            <label>Quantity:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </FormField>
          <FormField>
            <label>Total:</label>
            <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
          </FormField>
          <FormField>
            <label>Status:</label>
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
          </FormField>
          <button type="submit">Add Item</button>
        </form>
        
      </InvoiceFormWrapper>
    </Modal>
  );
};

export default InvoiceFormModal;
