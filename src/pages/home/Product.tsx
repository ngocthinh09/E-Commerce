import { formatMoney } from "../../utils/money";
import { useState, type ChangeEvent } from "react";
import CheckmarkIcon from "../../assets/images/icons/checkmark.png";
import type { Product as ProductType } from "../../types";
import { useCartStore } from "../../store/useCartStore";


function Product({ product } : { product: ProductType }) {
  const [quantity, setQuantity] = useState<number>(1);
  const [showAddedMessage, setShowAddedMessage] = useState<boolean>(false);
  const addToCart = useCartStore((state) => (state.addItem))

  const addToCartOnHomepage = async (): Promise<void> => {
    await addToCart(product.id, quantity);

    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false)
    }, 2000);
  };

  const selectQuantity = (event: ChangeEvent<HTMLSelectElement>): void => {
    const quantitySelected = Number(event.target.value);
    setQuantity(quantitySelected);
    console.log(quantitySelected);
  };

  return (
    <div 
      className="product-container"
      data-testid="product-container"
    >
      <div className="product-image-container">
        <img 
          className="product-image" 
          data-testid="product-image"
          src={product.image} 
        />
      </div>

      <div className="product-name limit-text-to-2-lines">{product.name}</div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`images/ratings/rating-${product.rating.stars * 10}.png`}
          alt={`${product.rating.stars} stars`}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">{formatMoney(product.priceCents)}</div>

      <div className="product-quantity-container">
        <select
          value={quantity}
          onChange={selectQuantity}
          data-testid="product-quantity-selector"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>

      <div className="product-spacer"></div>

      <div 
        className="added-to-cart"
        style={{opacity: showAddedMessage ? 1 : 0}}
      >
        <img src={CheckmarkIcon} />
        Added
      </div>

      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCartOnHomepage}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default Product;
