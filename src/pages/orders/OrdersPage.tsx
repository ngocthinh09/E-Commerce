import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import OrdersGrid from "./OrdersGrid";
import "./OrdersPage.css";
import type { CartItem, Order } from "../../types";

interface OrdersPageProps {
  cart: CartItem[];
  loadCart: () => Promise<void>;
}

function OrdersPage({ cart, loadCart }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      const response = await axios.get<Order[]>("/api/orders?expand=products");
      setOrders(response.data);
    };
    fetchOrdersData();
  }, []);

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="favicon/orders-favicon.png" />
      <title>Orders</title>

      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <OrdersGrid orders={orders} loadCart={loadCart} />
      </div>
    </>
  );
}

export default OrdersPage;
