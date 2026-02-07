import dayjs from "dayjs";
import type { CartItem, DeliveryOption } from "../../types";

interface DeliveryDateProps {
  deliveryOptions: DeliveryOption[];
  cartItem: CartItem;
}

function DeliveryDate({ deliveryOptions, cartItem }: DeliveryDateProps) {
  const selectedDeliveryOption = deliveryOptions.find((deliveryOption) => {
    return deliveryOption.id === cartItem.deliveryOptionId;
  });

  return (
    <div className="delivery-date">
      Delivery date:{" "}
      {dayjs(selectedDeliveryOption?.estimatedDeliveryTimeMs).format(
        "dddd, MMMM D",
      )}
    </div>
  );
}

export default DeliveryDate;
