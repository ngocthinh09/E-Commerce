import axios from "axios";
import { Fragment } from "react";
import dayjs from "dayjs";
import BuyAgainIcon from "../../assets/images/icons/buy-again.png";
import { Link } from "react-router";

function OrderProduct ({ orderId, orderProduct, loadCart }) {
    const productId = orderProduct.productId;
    const addToCart = async () => {
        await axios.post("/api/cart-items", {
            productId: productId,
            quantity: 1,
        });

        await loadCart();
    };


    return (
        <Fragment>
            <div className="product-image-container">
              <img src={orderProduct.product.image} />
            </div>

            <div className="product-details">
              <div className="product-name">{orderProduct.product.name}</div>
              <div className="product-delivery-date">
                Arriving on: {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
              </div>
              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>
              <button 
                className="buy-again-button button-primary"
                onClick={addToCart}
              >
                <img className="buy-again-icon" src={BuyAgainIcon} />
                <span className="buy-again-message">Add to Cart</span>
              </button>
            </div>

            <div className="product-actions">
              <Link to={`/tracking/${orderId}/${productId}`}>
                <button className="track-package-button button-secondary">
                  Track package
                </button>
              </Link>
            </div>
        </Fragment>
    )
}

export default OrderProduct;