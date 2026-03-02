import { Routes, Route } from 'react-router';
import HomePage from './pages/home/HomePage'
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import TrackingPage from './pages/tracking/TrackingPage';
import NotFound from './pages/NotFound';
import './App.css'
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='checkout' element={<CheckoutPage />} />
      <Route path='orders' element={<OrdersPage />} />
      <Route path='tracking/:orderId/:productId' element={<TrackingPage />} />
      <Route path='auth/login' element={<LoginPage />} />
      <Route path='auth/signup' element={<SignupPage />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
