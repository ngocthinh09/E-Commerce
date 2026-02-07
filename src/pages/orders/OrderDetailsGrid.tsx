import OrderProduct from "./OrderProduct";
import type { Order } from "../../types";

interface OrderDetailsGridProps {
  order: Order;
  loadCart: () => Promise<void>;
}

function OrderDetailsGrid({ order, loadCart }: OrderDetailsGridProps) {
  const orderId = order.id;
  
  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
        
        return (
          <OrderProduct key={orderProduct.product.id} orderId={orderId} orderProduct={orderProduct} loadCart={loadCart} />
        );
      })}
    </div>
  );
}

export default OrderDetailsGrid;
