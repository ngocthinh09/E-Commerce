import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useCartStore } from './store/useCartStore';
import HomePage from './pages/home/HomePage'
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import TrackingPage from './pages/tracking/TrackingPage';
import NotFound from './pages/NotFound';
import './App.css'

function App() {
  const loadCart = useCartStore((state) => (state.loadCart));

  useEffect(() => {
    loadCart();
  }, [loadCart])

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='checkout' element={<CheckoutPage />} />
      <Route path='orders' element={<OrdersPage />} />
      <Route path='tracking/:orderId/:productId' element={<TrackingPage />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
