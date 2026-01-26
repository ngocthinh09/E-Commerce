import axios from 'axios';
import { Routes, Route } from 'react-router';
import { useEffect, useState } from 'react';
import HomePage from './pages/home/HomePage'
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import TrackingPage from './pages/tracking/TrackingPage';
import NotFound from './pages/NotFound';
import './App.css'

function App() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
      const response = await axios.get("/api/cart-items?expand=product");
      setCart(response.data);
  };

  useEffect(() => {
    // eslint-disable-next-line
    loadCart();
  }, [])

  return (
    <Routes>
      <Route path='/' element={<HomePage cart={cart} loadCart={loadCart} />} />
      <Route path='checkout' element={<CheckoutPage cart={cart} loadCart={loadCart} />} />
      <Route path='orders' element={<OrdersPage cart={cart} loadCart={loadCart} />} />
      <Route path='tracking/:orderId/:productId' element={<TrackingPage cart={cart} />} />
      <Route path='*' element={<NotFound cart={cart} />} />
    </Routes>
  );
}

export default App;
