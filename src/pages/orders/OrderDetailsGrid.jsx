import OrderProduct from "./OrderProduct";

function OrderDetailsGrid({ order, loadCart }) {
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
