import axios from "axios";
import { formatMoney } from "../../utils/money";
import { useState } from "react";
import type { CartItem } from "../../types";
import type { ChangeEvent, KeyboardEvent } from "react";

interface CartItemDetailsProps {
  cartItem: CartItem;
  loadCart: () => Promise<void>;
}

function CartItemDetails({ cartItem, loadCart }: CartItemDetailsProps) {
  const [isUpdatingQuantity, showIsUpdatingQuantity] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(cartItem.quantity);

  const updateQuantity = async (): Promise<void> => {
    if (isUpdatingQuantity){
      await axios.put<void>(`/api/cart-items/${cartItem.productId}`, {
        quantity: Number(quantity)
      });

      showIsUpdatingQuantity(false);
      await loadCart();
    }
    else showIsUpdatingQuantity(true);
  };

  const updateQuantityInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  }

  const handleQuantityKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const keyPressed = event.key;
    if (keyPressed === 'Enter'){
      updateQuantity();
    }
    if (keyPressed === 'Escape'){
      setQuantity(cartItem.quantity);
      showIsUpdatingQuantity(false);
    }
  }

  const deleteCartItem = async (): Promise<void> => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  return (
    <>
      <img
        className="product-image"
        src={cartItem.product?.image}
        alt={cartItem.product?.name}
      />

      <div className="cart-item-details">
        <div className="product-name">{cartItem.product?.name}</div>
        <div className="product-price">
          {cartItem.product?.priceCents ? formatMoney(cartItem.product?.priceCents) : "$0.00"}
        </div>
        <div className="product-quantity">
          <span>
            Quantity:{" "}
            {isUpdatingQuantity ? (
              <input className="quantity-textbox" type="number" value={quantity} onChange={updateQuantityInput} onKeyDown={handleQuantityKeyDown} autoFocus />
            ) : (
              <span className="quantity-label">{cartItem.quantity}</span>
            )}
          </span>
          <span
            className="update-quantity-link link-primary"
            onClick={updateQuantity}
          >
            Update
          </span>
          <span
            className="delete-quantity-link link-primary"
            onClick={deleteCartItem}
          >
            Delete
          </span>
        </div>
      </div>
    </>
  );
}

export default CartItemDetails;
