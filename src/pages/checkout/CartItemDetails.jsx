import axios from "axios";
import { formatMoney } from "../../utils/money";
import { useState } from "react";

function CartItemDetails({ cartItem, loadCart }) {
  const [isUpdatingQuantity, showIsUpdatingQuantity] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const updateQuantity = async () => {
    if (isUpdatingQuantity){
      await axios.put(`/api/cart-items/${cartItem.productId}`, {
        quantity: Number(quantity)
      })
      showIsUpdatingQuantity(false);
      await loadCart();
    }
    else showIsUpdatingQuantity(true);
  };

  const updateQuantityInput = (event) => {
    setQuantity(event.target.value);
  }

  const handleQuantityKeyDown = (event) => {
    const keyPressed = event.key;
    if (keyPressed === 'Enter'){
      updateQuantity();
    }
    if (keyPressed === 'Escape'){
      setQuantity(cartItem.quantity);
      showIsUpdatingQuantity(false);
    }
  }

  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  return (
    <>
      <img
        className="product-image"
        src={cartItem.product.image}
        alt={cartItem.product.name}
      />

      <div className="cart-item-details">
        <div className="product-name">{cartItem.product.name}</div>
        <div className="product-price">
          {formatMoney(cartItem.product.priceCents)}
        </div>
        <div className="product-quantity">
          <span>
            Quantity:{" "}
            {isUpdatingQuantity ? (
              <input className="quantity-textbox" type="text" value={quantity} onChange={updateQuantityInput} onKeyDown={handleQuantityKeyDown} />
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
