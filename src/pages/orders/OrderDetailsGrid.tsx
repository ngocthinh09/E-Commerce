import OrderProduct from "./OrderProduct";
import type { Order } from "../../types";

function OrderDetailsGrid({ order }: { order: Order }) {
  const orderId = order.id;
  
  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
        
        return (
          <OrderProduct key={orderProduct.product.id} orderId={orderId} orderProduct={orderProduct} />
        );
      })}
    </div>
  );
}

export default OrderDetailsGrid;
