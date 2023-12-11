import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure the modal appears above other elements */
`;

const CartModalWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 300px;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
`;

const CartTitle = styled.h2`
  margin: 0;
`;

const CartItemCount = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const CartItemsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CartItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const CancelItemButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
`;


const CartItemName = styled.span`
  flex-grow: 1;
`;

const CartItemPrice = styled.span`
  margin-left: 10px;
`;

const RemoveButton = styled.button`
  background: 'grey';
  border: none;
  color: red;
  cursor: pointer;
  padding: 5px;
  margin: 2px;
  margin-left: 10px;
`;


const CartModal = ({ cartItems, onClose, onRemoveItem }) => {
  const itemCount = cartItems.length;
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
  

  return (
    <ModalOverlay>
      <CartModalWrapper>
        <CartHeader>
          <CartTitle>Your Cart</CartTitle>
          <CartItemCount>{itemCount} Item{itemCount !== 1 ? 's' : ''}</CartItemCount>
        </CartHeader>
        <CartItemsList>
          {Object.values(cartItems)[0]?.map((cartItem) => (
            <CartItem key={cartItem.id}>
              <CartItemName>{cartItem.name}</CartItemName>
              <CartItemPrice>{cartItem.price}</CartItemPrice>
              <RemoveButton onClick={() => onRemoveItem(cartItem.id)}>X Cancel</RemoveButton>
              {/* <CancelItemButton onClick={() => handleRemoveItem(cartItem.id)}>Cancel</CancelItemButton> */}
            </CartItem>
          ))}
        </CartItemsList>
        <button onClick={onClose}>Close</button>
      </CartModalWrapper>
    </ModalOverlay>
  );
};

export default CartModal;

