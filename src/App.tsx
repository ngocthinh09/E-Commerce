import axios from 'axios';
import { Routes, Route } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import HomePage from './pages/home/HomePage'
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import TrackingPage from './pages/tracking/TrackingPage';
import NotFound from './pages/NotFound';
import './App.css'
import type { CartItem } from './types';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = useCallback(async () => {
    try{
      const response = await axios.get<CartItem[]>("/api/cart-items?expand=product");
      setCart(response.data);
    }
    catch (error) {
      console.log("Failed to load cart: ", error);
    }
  }, []); 

  useEffect(() => {
    // eslint-disable-next-line
    loadCart();
  }, [loadCart])

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
