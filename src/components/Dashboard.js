import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InvoiceFormModal from './InvoiceFormModal';
import CartModal from './CartModal';
import { useParams } from 'react-router-dom';

import Receipt from './Reciept'; 
// import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Document, Page, pdfjs } from "react-pdf";

// Replace these import statements:

// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { drawEllipsePath } from 'pdf-lib';

// Wherever you call createPdf, you have to pass VFS


const DashboardWrapper = styled.div`
  background-color: #f2f2f2;
  padding: 20px;
`;

const Navbar = styled.nav`
  background-color: #2a0018;
  color: #fff;
  padding: 10px 0;
  text-align: center;
`;

const AddInvoiceButton = styled.button`
  background-color: #2a0018;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  margin: 10px;
  cursor: pointer;
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




const InvoiceTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
`;

const InvoiceTableHead = styled.thead`
  background-color: #f2f2f2;
`;

const InvoiceTableRow = styled.tr`
  border: 1px solid #ccc;
`;

const InvoiceTableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
`;


const PaymentModalOverlay = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;
const DeleteButton = styled.button`
  background-color: #f44336; /* Red color for delete button */
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin: 10px;

  cursor: pointer;
`;

const PaymentModal = styled.div`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaymentInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const PaymentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Dashboard = ({ orders, cartItems }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState(null);
  const [saveval, setsaveval] = useState(false);
  const [Toedit, setToedit] = useState(false);


  
  const [editInvoice, setEditInvoice] = useState(null); 
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const { orderNumber } = useParams();
  const order = orders.find((order) => order.orderNumber === orderNumber);
  console.log(order);

  const handleAddInvoiceClick = () => {
    setModalOpen(true);
  };
  // Function to calculate the total payable amount
  const calculateTotalAmount = () => {
    // Calculate the total based on the items in the invoices
    const total = invoices.reduce((acc, item) => {
      return acc + item.total;
    }, 0);
    const currentInvoice = invoices[invoices.length - 1]; // Assuming the current invoice is the last one
    const gst = currentInvoice.gst;
    const cgst = currentInvoice.cgst;

    // You can add additional logic for applying discounts, taxes, etc., if needed

    return { total, gst, cgst };
  };
  



  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddItemToInvoice = (item) => {
    setInvoices([...invoices, item]);
  };


  const handleEditItemToInvoice = (item) => {
    // Find the index of the item with the same id as invoiceToEdit
    const index = invoices.findIndex((invoice) => invoice.id === Toedit.id);
  
    if (index !== -1) {
      // Create a new array with the updated item
      const updatedInvoices = [...invoices];
      updatedInvoices[index] = item;
  
      // Set the updated array as the new invoices state
      setInvoices(updatedInvoices);
    } else {
      // Handle the case where the item with invoiceToEdit's id is not found
      console.error('Item not found in invoices:', Toedit);
    }
  };
  

  const handlePaymentClick = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentClose = () => {
    setPaymentModalOpen(false);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Implement payment processing logic here (e.g., integrate with a payment gateway)
    // After successful payment, you can close the payment modal
    setPaymentModalOpen(false);
  };
// Function to clear the invoices
const handleClearInvoices = () => {
  setInvoices([]);
}
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    });
  };

  const generatePDF = () => {
    // const data = Object.values(orders[0]['items']);
    const docDefinition = {
      content:[
        { text: '-------------------------------------------', alignment: 'center' },
        { text: 'Receipt', alignment: 'center' },
        { text: '-------------------------------------------', alignment: 'center' },

      ...invoices.map((invoice, index) => [
        { text: `Invoice ID: ${invoice.id}`, fontSize: 12, margin: [200, 0, 0, 5] }, // Add left spacing with margin
        { text: `Date: ${invoice.date}`, fontSize: 12, margin: [200, 0, 0, 5] },
        { text: `Name: ${invoice.name}`, fontSize: 12, margin: [200, 0, 0, 5] },
        { text: `Discount: ${invoice.discount}%`, fontSize: 12, margin: [200, 0, 0, 5] },
        { text: `Total Amount (INR): ${invoice.totalAmount}`, fontSize: 12, margin: [200, 0, 0, 5] },
        { text: `GST: ${invoice.gst}%`, fontSize: 12, margin: [200, 0, 0, 5] },
        { text: `Total: ${invoice.total}`, fontSize: 12, margin: [200, 0, 0, 5] },
        { text: `Status: ${invoice.status}`, fontSize: 12, margin: [200, 0, 0, 5] },
        // Add a separator
        { text: '-------------------------------------------', alignment: 'center' },
      ]),

    ],
  
    };

    // pdfMake.createPdf(docDefinition).download('invoice.pdf');
    pdfMake.createPdf(docDefinition, null, null, pdfFonts.pdfMake.vfs).open();

  };

  
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


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
  // Function to edit an invoice by index
  const setsave = (val) => {
    setsaveval(val);

  }
  const handleEditInvoice = (id) => {
    // Find the invoice with the matching ID
    const invoiceToEdit = invoices.find((invoice) => invoice.id === id);
    setToedit(invoiceToEdit)
    // Check if the invoice was found
    if (invoiceToEdit) {
      setsaveval(true);
      // Set the found invoice as the edited invoice
      // console.log(invoiceToEdit['id']);
      setEditedInvoice(invoiceToEdit);
      
      // Open the edit modal
      setModalOpen(true);
    } else {
      // Handle the case where the invoice with the given ID was not found
      console.log('Invoice not found for editing.');
    }
  };

  // Function to delete an invoice by index
  const handleDeleteInvoice = (index) => {
    // Create a copy of the invoices array
    const updatedInvoices = [...invoices];
    
    updatedInvoices.splice(index, 1);
   
    setInvoices(updatedInvoices);
  }
  console.log("api> ", apiData.length);
  // if(Object.values(apiData[apiData.length - 1]) !== null){
  //   console.log("cart " );
  // }
  // else{
  //   console.log("null" );
  // }
  if ( !(apiData[apiData.length - 1] !== null && typeof apiData[apiData.length - 1] === 'object')) {
    console.log("cart");
  } else {
    console.log("null");
  }
  
  

  return (
    <DashboardWrapper>
      <Navbar>
        <h1>Restaurant Billing System</h1>
      </Navbar>
      <div >
        <h2>Recent Invoices</h2>
        <div>
          <AddInvoiceButton onClick={handleAddInvoiceClick}>Add Invoice</AddInvoiceButton>
          {/* <AddInvoiceButton onClick={handleDownloadPDF}>Download PDF</AddInvoiceButton> */}
          <PaymentButton onClick={handlePaymentClick}>Make Payment</PaymentButton>
          <AddInvoiceButton onClick={generatePDF}>Download PDF</AddInvoiceButton>


        </div>
      </div>
      {/* Invoice table code remains the same */}
      <InvoiceTable>
        <InvoiceTableHead>
          <tr>
            <InvoiceTableHeader>Invoice ID</InvoiceTableHeader>
            <InvoiceTableHeader>Date</InvoiceTableHeader>
            <InvoiceTableHeader>Name</InvoiceTableHeader>
            <InvoiceTableHeader>Discount</InvoiceTableHeader>
            <InvoiceTableHeader>Total Amount (INR)</InvoiceTableHeader>
            <InvoiceTableHeader>GST</InvoiceTableHeader>
            <InvoiceTableHeader>Total</InvoiceTableHeader>
            <InvoiceTableHeader>Status</InvoiceTableHeader>
            <InvoiceTableHeader>Actions</InvoiceTableHeader>
          </tr>
        </InvoiceTableHead>
        <tbody>
          {invoices.map((invoice, index) => (
            <InvoiceTableRow key={index}>
              <td>{invoice.id}</td>
              <td>{invoice.date}</td>
              <td>{invoice.name}</td>
              <td>{invoice.discount}</td>
              <td>{invoice.totalAmount}</td>
              <td>{invoice.gst}</td>
              <td>{invoice.total}</td>
              <td>{invoice.status}</td>
              <td>
                {/* "Edit" button with a click handler */}
                <PaymentButton onClick={() => handleEditInvoice(invoice.id)}>Edit</PaymentButton>
                {/* "Delete" button with a click handler */}
                <DeleteButton onClick={() => handleDeleteInvoice(index)}>Delete</DeleteButton>
              </td>
            </InvoiceTableRow>
          ))}
        </tbody>
      </InvoiceTable>

      {/* <InvoiceFormModal isOpen={isModalOpen} onClose={handleCloseModal} onAddItem={handleAddItemToInvoice} />
      <InvoiceFormModal isOpen={isModalOpen} onClose={handleCloseModal} onAddItem={handleAddItemToInvoice} /> */}
      <InvoiceFormModal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal} 
      onAddItem={handleAddItemToInvoice} 
      onEditItem={handleEditItemToInvoice}
      editInvoice={editInvoice} 
      save={saveval}
      invoices={invoices}
      setsave={setsave}
      lastObjectValues={apiData.length > 0 ? Object.values(apiData[apiData.length - 1]) : [] } 
      />


      {/* Payment Modal */}
      <PaymentModalOverlay show={isPaymentModalOpen}>
        <PaymentModal>
          <h3>Payment Details</h3>
          <PaymentForm onSubmit={handlePaymentSubmit}>
            <PaymentInput
              type="text"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handlePaymentInputChange}
              placeholder="Card Number"
            />
            <PaymentInput
              type="text"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={handlePaymentInputChange}
              placeholder="Expiry Date"
            />
            <PaymentInput
              type="text"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handlePaymentInputChange}
              placeholder="CVV"
            />
            <PaymentActions>
              <button type="button" onClick={handlePaymentClose}>
                Close
              </button>
              <button type="submit">Submit Payment</button>
            </PaymentActions>
          </PaymentForm>
        </PaymentModal>
      </PaymentModalOverlay>
      {/* Total Payable Amount Section */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
        maxWidth: '300px', // Set a maximum width
        width: '100%', // Make it full width on small screens
      }}>
        <h3>Total Payable Amount</h3>
        {invoices.length > 0 && (
          <div>
            <b>Total: INR </b>{calculateTotalAmount().total}
            <div>
            <b>GST: </b>{calculateTotalAmount().gst}
              <br />
              <b> CGST: </b>{calculateTotalAmount().cgst}
            </div>
          </div>
        )}
        {/* Add the Clear button */}
        {invoices.length > 0 && (
          <button onClick={handleClearInvoices}>Clear</button>
        )}
      </div>

      
      {invoices.map((invoice, index) => (
        <div key={index}>
          
          <h3>Invoice {invoice.id}</h3>
          {/* Display other invoice details here */}
          
          {/* Add the Receipt component and pass the invoice data */}

          {/* {!(apiData[apiData.length - 1] !== null && typeof apiData[apiData.length - 1] === 'object') && (
            
            <Receipt invoiceData={invoice} totalAmount={invoices[0].total}  discount={invoices[0].discount} salesperson={invoices[invoices.length-1].name }  Data={apiData.length > 0 ? Object.values(apiData[apiData.length - 1]) : [] } />)}

        </div> */}
          <Receipt invoiceData={invoice} totalAmount={invoices[0].total}  discount={invoices[0].discount} salesperson={invoices[invoices.length-1].name }  Data={apiData.length > 0 ? Object.values(apiData[apiData.length - 1]) : [] } />
        </div>
        
         ))}  

    </DashboardWrapper>
  );
};

export default Dashboard;
