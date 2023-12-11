import { type } from '@testing-library/user-event/dist/type';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';


Modal.setAppElement('#root');

const InvoiceFormWrapper = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
`;
const PaymentButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  margin-left: 10px;
  cursor: pointer;
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

const InvoiceFormModal = ({ isOpen, onClose, onAddItem, onEditItem, lastObjectValues, editInvoice, save, invoices, setsave}) => {
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(18); 
  const [cgst, setCgst] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [apiData, setApiData] = useState([]); 



  

useEffect(() => {
  fetch('http://localhost:3001/api/data')
    .then((response) => response.json())
    .then((data) => {
      setApiData(data.users);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, []);

useEffect(() => {

  if (apiData.length > 0) {
    const lastObjectValues = Object.values(apiData[apiData.length - 1]);

    if (lastObjectValues.length > 0){

    const totalPriceFromApi = lastObjectValues[0]
      .map((item) => item.price)
      .reduce((total, price) => total + price, 0);

    setTotalAmount(totalPriceFromApi);
    }
  }
}, [apiData]);

useEffect(() => {
  setIsEditing(save);
})
useEffect(() => {

  if (editInvoice) {
    console.log("invoice edit");
    // If editInvoice is provided, set the state for the form fields
    setIsEditing(true);

    const {
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
    } = editInvoice;

    setId(id);
    setDate(date);
    setName(name);
    setDiscount(discount);
    setTotalAmount(totalAmount);
    setGstPercentage(gst);
    setCgst(cgst);
    setPrice(price);
    setQuantity(quantity);
    setTotal(total);
    setStatus(status);
  } else {
    // Clear the form when adding a new item
    setIsEditing(false);
    setId('');
    setDate('');
    setName('');
    setDiscount(0);
    setTotalAmount(0);
    setGstPercentage(18);
    setCgst(0);
    setPrice(0);
    setQuantity(0);
    setTotal(0);
    setStatus('');
  }
}, [editInvoice]);

// useEffect(() => {
//   if (lastObjectValues.length > 0) {
//     const totalPriceFromApi = lastObjectValues[0]
//       .map((item) => item.price)
//       .reduce((total, price) => total + price, 0);

//     setTotalAmount(totalPriceFromApi);
//   }
// }, [lastObjectValues]);



  const calculateGst = () => {
    return (totalAmount * gstPercentage) / 100;
  };

  const calculateTotalPrice = () => {
    return totalAmount + calculateGst();
  };

  const handleSubmit = (e) => {

   

    e.preventDefault();
    console.log("submits");
    if(save){
      const gst = calculateGst();

      const totalPrice = calculateTotalPrice();
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
        total: totalPrice, 
        status,
      };
      setIsEditing(false);
      setsave(false);
      onEditItem(item);


      onClose();
      }
    else{

      const gst = calculateGst();

        const totalPrice = calculateTotalPrice();

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
          total: totalPrice, 
          status,
        };
        onAddItem(item);
        onClose();
    }
    
  };


  const handleSaveChanges = () => {
    // Add your logic to save changes here
    if(save){
      console.log(invoices);
    }
    setIsEditing(false); // Set isEditing back to false when done editing
  };
  

  
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Add Invoice">

      <InvoiceFormWrapper>
      {isOpen && (
          <div>
            <h3>Items</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {lastObjectValues && lastObjectValues.length > 0 && (
                  lastObjectValues[0].map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <h2>Add Invoice</h2>
        <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center',gap: 50 }}>
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
          <FormField>
            <label>Total Amount (INR):</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
           
          </FormField>
          </div>
          <div style={{ display: 'flex', alignItems: 'center',gap:6 }}>
          <FormField>
            <label>GST (%):</label>
            <input type="number" value={gstPercentage} onChange={(e) => setGstPercentage(e.target.value)} />
          </FormField>
          {/* <FormField>
            <label>CGST:</label>
            <input type="number" value={cgst} onChange={(e) => setCgst(e.target.value)} />
          </FormField> */}
          {/* <FormField>
            <label>Price:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </FormField>
          <FormField>
            <label>Quantity:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </FormField> */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center',gap: 100,paddingTop: 50 }}>
          <FormField>

            <label>Total (Including GST):</label>
            <input type="number" value={calculateTotalPrice()} disabled />
          </FormField>
          <FormField>
            <label>Status:</label>
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
          </FormField>
          </div>
          <PaymentButton onClick={handleSaveChanges}>{isEditing ? 'Save Changes' : 'Add Item'}</PaymentButton>

        </form>
      </InvoiceFormWrapper>

    </Modal>
  );
};


export default InvoiceFormModal;
