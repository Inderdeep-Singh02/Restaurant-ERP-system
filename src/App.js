import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MenuPage from './components/MenuPage';

function App() {
  // State to manage orders
  const [orders, setOrders] = useState([]);
  // Counter for generating order numbers
  const [orderCounter, setOrderCounter] = useState(1);

  // Function to add a new order
  const addOrder = (cartItems) => {
    const newOrder = {
      orderNumber: orderCounter,
      items: cartItems,
    };
    setOrders([...orders, newOrder]);
    setOrderCounter(orderCounter + 1);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MenuPage addOrder={addOrder} />}
        />
      
        <Route
          path="/invoice/:orderNumber"
          element={<Dashboard orders={orders} />}
        />
      </Routes>
    </Router>
  );
}



{/* <Route
path="/dashboard"
element={<Dashboard orders={orders} />}
/> */}
export default App;
