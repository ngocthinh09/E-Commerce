import DeliveryOptions from "./DeliveryOptions";
import CartItemDetails from "./CartItemDetails";
import DeliveryDate from "./DeliveryDate";
import type { DeliveryOption } from "../../types";
import { useCartStore } from "../../store/useCartStore";

function OrderSummary({ deliveryOptions }: { deliveryOptions: DeliveryOption[]; }) {
  const cart = useCartStore((state) => (state.cart));

  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => {
          return (
            <div key={cartItem.productId} className="cart-item-container">
              <DeliveryDate cartItem={cartItem} deliveryOptions={deliveryOptions} />

              <div className="cart-item-details-grid">
                <CartItemDetails cartItem={cartItem} />

                <DeliveryOptions cartItem={cartItem} deliveryOptions={deliveryOptions} />
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default OrderSummary;
