import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MenuItem from './MenuItem';
import CartModal from './CartModal';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { v4 as uuid } from 'uuid'; // Import a UUID library
import Menu from "../local_json/Menu.json"
import EditItemModal from './EditItemModal'; 

import AddToDbModal from './AddToDbModal';

// const menuItems = Object.values(Menu)[0]
// console.log("data:",menuItems);

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

const MenuWrapper = styled.div`
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
  padding: 15px;
  border: none;
  border-radius: 5px;
  
  margin: 10px;
  cursor: pointer;
  width: 'auto';
  height: 45px;
`;

const MenuButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
  margin-top: 20px;
`;

const MenuItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  margin-top: 20px;
`;


const MenuPage = ({ addOrder }) => {
  const [cart, setCart] = useState({});
  const [cartLen, setCartLen] = useState(0);

  const [cartVisible, setCartVisible] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isAddToDbModalOpen, setAddToDbModalOpen] = useState(false);

  const handleRemoveItem = (itemId) => {
    // Implement the logic to remove an item from the cart
    // You can use this function to remove an item from the cart state
    // For example, you can update the cart state to remove the item with the specified itemId
    // Here's a simplified example assuming cart is an object with order numbers as keys:
    const updatedCart = { ...cart };
    if (updatedCart[orderNumber]) {
      updatedCart[orderNumber] = updatedCart[orderNumber].filter((item) => item.id !== itemId);
    }
    setCart(updatedCart);
  };
  

  const fetchMenuData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/Mdata'); // Replace with the correct URL
      if (response.ok) {
        const menuData = await response.json();
        setMenuItems(menuData["User_1"]);

        if (menuData.items && Array.isArray(menuData.items)) {
          setMenuItems(menuData);
          console.log("here:",menuData);
        }
      } else {
        console.error('Error fetching menu data.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Load menu items from the endpoint when the component mounts
    fetchMenuData();
  }, []);

  // useEffect(() => {
  //   // Load menu items from your JSON data when the component mounts
  //   const items = Object.values(Menu)[0];
  //   setMenuItems(items);
  // }, []); 

  const navigate = useNavigate();

  const toggleCartVisibility = () => {
    setCartVisible(!cartVisible);
  };

  const addToCart = (item) => {
    if (!orderNumber) {
      // Generate a unique order number (e.g., using UUID) when adding the first item
      const newOrderNumber = uuid();
      setOrderNumber(newOrderNumber);
      
      // Create a copy of the cart object with the new order number
      const updatedCart = { ...cart };
      updatedCart[newOrderNumber] = [];
      
      // Add the item to the corresponding order number in the cart
      updatedCart[newOrderNumber].push(item);
  
      // Set the updated cart object as the new cart state
      setCart(updatedCart);
    } else {
      // Create a copy of the cart object to avoid mutating state directly
      const updatedCart = { ...cart };
  
      if (!updatedCart[orderNumber]) {
        // If the order number doesn't exist in the cart, create it with an empty array
        updatedCart[orderNumber] = [];
      }
  
      // Add the item to the corresponding order number in the cart
      updatedCart[orderNumber].push(item);
  
      // Set the updated cart object as the new cart state
      setCart(updatedCart);
    }

    
  
    let len = 1;

    try {
      len = Object.values(cart).length > 0 ? Object.values(cart)[0].length : 1;
    } catch (error) {
      // Handle the error here, e.g., log the error or display an error message
      // console.error('An error occurred while accessing the cart:', error);
    }

    // let len = Object.values(cart)[0].length > 0 ? Object.values(cart)[0].length : 1;
    console.log(len);
    setCartLen(len);
    setAddedToCart(true);
  
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  
    // Log the updated cart state
  };


  const sendUpdatedDataToServer = async (updatedData) => {
    try {
      const response = await fetch('http://localhost:3001/api/updateMenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData), // Replace with the data you want to send
      });
  
      if (response.ok) {
        console.log('Data updated on the server successfully.');
      } else {
        console.error('Error updating data on the server.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleEditItem = (editedItem) => {

    // Update the menu items state
    setMenuItems((prevItems) =>
      prevItems.map((menuitem) =>
        menuitem.id === editedItem.id ? editedItem : menuitem
      )
    );

    // Close the edit modal
    setEditingItem(null);

    sendUpdatedDataToServer(editedItem);
  };


  // const handleAddToDB = (newItem) => {
  //   // Implement the logic to send the new item to your database
  //   // Print the data to the console as requested
  //   console.log('New Item:', newItem);

  //   // Close the modal
  //   setAddToDbModalOpen(false);
  // };
  
  const handleAddToDB = (newItem) => {
    // Make an API call to send the new item to your database
    fetch('http://localhost:3001/api/addItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (response.ok) {
          // Item added to the database successfully
          console.log('New Item added to the database:', newItem);
          // Close the modal
          setAddToDbModalOpen(false);
        } else {
          // Handle the error when the API call fails
          console.error('Error adding the item to the database.');
        }
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error('Error:', error);
      });
  };

  const handleDeleteItem = (itemId) => {
    // Send a DELETE request to your API endpoint
    fetch(`http://localhost:3001/api/deleteItem/${itemId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Item was successfully deleted, update the menu items in your state
          setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        } else {
          console.error('Error deleting item');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleProceedToInvoice = async () => {
    try {
      // Create a POST request to the /api/data endpoint
      const response = await fetch(`http://localhost:3001/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart), // Send the cart data as JSON
      });
  
      if (response.ok) {
        // Data was added successfully to the database
        console.log('Data added to the database successfully.');
  
        // Continue with your navigation and state clearing logic
        addOrder(cart); // Pass the array of orders to the addOrder function
        navigate(`/invoice/${orderNumber}`);
        setCart({});
        setOrderNumber(null);
      } else {
        // Handle error if the data could not be added to the database
        console.error('Error adding data to the database.');
        // You can show an error message to the user or take appropriate action.
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle any network or other errors here.
    }
  };



return (
    <MenuWrapper>
      <Navbar>
        <h1>Restaurant Menu</h1>
      </Navbar>
      <MenuButtons>
        <div className="cart">
          <AddInvoiceButton className="cart-toggle" onClick={toggleCartVisibility}>
            {cartVisible ? 'Hide Cart' : 'Show Cart'}
          </AddInvoiceButton>

          <AddInvoiceButton className="view-cart-button" onClick={handleProceedToInvoice}>
            Proceed to Invoice ({ Object.values(cart).length > 0 ? Object.values(cart)[0].length : 0 } items)
          </AddInvoiceButton>
          
          <AddToDbModal
            isOpen={isAddToDbModalOpen}
            onClose={() => setAddToDbModalOpen(false)}
            onAddToDB={handleAddToDB}
          />
          <AddInvoiceButton onClick={() => setAddToDbModalOpen(true)}>New Item</AddInvoiceButton>
        </div>
      </MenuButtons>

      {addedToCart && <h2>Added!</h2>}
      <MenuItemsContainer>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            onAddToCart={addToCart}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </MenuItemsContainer>

      {cartVisible && <CartModal cartItems={cart} onRemoveItem={handleRemoveItem}  onClose={toggleCartVisibility} />}
      {/* {editingItem && (
        <EditItemModal
          item={editingItem}
          onEdit={handleEditItem}
          onClose={() => setEditingItem(null)}
        />
      )} */}
    </MenuWrapper>
  );
};

export default MenuPage;
