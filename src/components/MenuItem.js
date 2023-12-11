// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EditItemModal from './EditItemModal';
import Menu from "../local_json/Menu.json"


const MenuItemWrapper = styled.div`
  flex: 0 0 calc(17.33% - 20px); /* 33.33% for three items per column, adjust as needed */
  margin-right: 10px; /* Adjust margin between columns */
  margin-bottom: 10px; /* Add margin at the bottom to separate columns */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
    direction : row;
  
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



const ItemImage = styled.img`
  max-width: 100%;
  max-height: 200px; /* Adjust the max height as needed */
  margin-bottom: 10px;
`;
const AddInvoiceButton = styled.button`
  background-color: #2a0018;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  margin: 5px;
  cursor: pointer;
  
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

const MenuItem = ({ item, onAddToCart, onEditItem, onDeleteItem }) => {
  const { name, price, image } = item;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  useEffect(() => {
    // This effect runs whenever selectedItem changes
    console.log('Selected Item:', selectedItem);
  }, [selectedItem]);

  const handleEditClick = () => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };
  
  


  return (
    <MenuItemWrapper>
      <ItemImage src={image} alt={name} />
      <h3>{name}</h3>
      <p>Price: ${price.toFixed()}</p>

      <PaymentButton onClick={handleEditClick}>Edit</PaymentButton>
      {/* <DeleteButton onClick={() => onDeleteItem(id)}>Delete</DeleteButton> */}
      <DeleteButton onClick={() => onDeleteItem(item.id)}>Delete</DeleteButton>


      {editModalVisible && (
        <EditItemModal item={selectedItem} onEdit={onEditItem} onClose={() => setEditModalVisible(false)} />
      )}
      <AddInvoiceButton onClick={() => onAddToCart(item)}>Add</AddInvoiceButton>
    </MenuItemWrapper>
  );
};

export default MenuItem;