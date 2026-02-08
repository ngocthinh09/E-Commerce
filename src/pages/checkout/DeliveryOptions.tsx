import dayjs from "dayjs";
import axios from "axios";
import { formatMoney } from "../../utils/money";
import type { CartItem, DeliveryOption } from "../../types";
import { useCartStore } from "../../store/useCartStore";

interface DeliveryOptionsProps {
  deliveryOptions: DeliveryOption[];
  cartItem: CartItem;
}

function DeliveryOptions({ deliveryOptions, cartItem }: DeliveryOptionsProps) {
  const loadCart = useCartStore((state) => (state.loadCart));

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";
        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
        }

        const updateDeliveryOption = async () => {
          await axios.put<void>(`/api/cart-items/${cartItem.productId}`,{
            deliveryOptionId: deliveryOption.id
          });
          await loadCart();
        };

        return (
          <div key={deliveryOption.id} className="delivery-option" onClick={updateDeliveryOption}>
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
            />
            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D"
                )}
              </div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DeliveryOptions;
