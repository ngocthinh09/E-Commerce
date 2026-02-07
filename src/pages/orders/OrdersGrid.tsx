import OrderHeader from "./OrderHeader";
import OrderDetailsGrid from "./OrderDetailsGrid";
import type { Order } from "../../types";

interface OrdersGridProps {
  orders: Order[];
  loadCart: () => Promise<void>;
}

function OrdersGrid({ orders, loadCart }: OrdersGridProps) {
  return (
    <div className="orders-grid">
      {orders.map((order) => {
        return (
          <div key={order.id} className="order-container">
            <OrderHeader order={order} />

            <OrderDetailsGrid order={order} loadCart={loadCart} />
          </div>
        );
      })}
    </div>
  );
}

export default OrdersGrid;
