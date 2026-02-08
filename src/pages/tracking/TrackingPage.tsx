import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link } from 'react-router';
import { useParams } from 'react-router';
import Header from '../../components/Header';
import './TrackingPage.css';
import type { Order } from '../../types';

function TrackingPage() {
  const { orderId, productId } = useParams<{ orderId: string; productId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      const response = await axios.get<Order>(`/api/orders/${orderId}?expand=products`);
      setOrder(response.data);
    }
    fetchTrackingData();
  }, [orderId])

  if (!order)
    return null;

  const orderProduct = order.products.find((product) => {
    return product.productId === productId;
  });

  if (!orderProduct)
      return null;
  
  const totalDeliveryTimeMs = orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;
  const deliveryPercent = Math.min(timePassedMs / totalDeliveryTimeMs * 100, 100);
  const isPreparing = (deliveryPercent < 33);
  const isShipped = (deliveryPercent >= 33 && deliveryPercent < 100);
  const isDeliveried = (deliveryPercent === 100);

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="favicon/tracking-favicon.png" />
      <title>Tracking</title>

      <Header />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">Arriving on {dayjs(orderProduct.estimatedDeliveryTimeMs).format("dddd, MMMM D")}</div>

          <div className="product-info">
            {orderProduct.product.name}
          </div>

          <div className="product-info">Quantity: {orderProduct.quantity}</div>

          <img
            className="product-image"
            src={orderProduct.product.image}
          />

          <div className="progress-labels-container">
            <div className={`progress-label ${isPreparing && 'current-status'}`}>Preparing</div>
            <div className={`progress-label ${isShipped && 'current-status'}`}>Shipped</div>
            <div className={`progress-label ${isDeliveried && 'current-status'}`}>Delivered</div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{width: `${deliveryPercent}%`}}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrackingPage;
