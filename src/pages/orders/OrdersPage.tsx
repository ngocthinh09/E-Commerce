import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import OrdersGrid from "./OrdersGrid";
import "./OrdersPage.css";
import type { Order } from "../../types";


function OrdersPage() {
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

      <Header />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <OrdersGrid orders={orders} />
      </div>
    </>
  );
}

export default OrdersPage;
