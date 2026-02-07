import axios from "axios";
import { useState, useEffect } from "react";
import CheckoutHeader from "./CheckoutHeader";
import OrderSummary from "./OrderSummary";
import PaymentSummary from "./PaymentSummary";
import "./CheckoutPage.css";
import type {
  CartItem,
  DeliveryOption,
  PaymentSummary as PaymentSummaryType,
} from "../../types";

interface CheckoutPageProps {
  cart: CartItem[];
  loadCart: () => Promise<void>;
}

function CheckoutPage({ cart, loadCart }: CheckoutPageProps) {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryType | null>(null);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      const response = await axios.get<DeliveryOption[]>("/api/delivery-options?expand=estimatedDeliveryTime");
      setDeliveryOptions(response.data);
    };
    fetchCheckoutData();
  }, []);

  useEffect(() => {
    const fetchPaymentSummay = async () => {
      const response = await axios.get<PaymentSummaryType>("/api/payment-summary");
      setPaymentSummary(response.data);
    };
    fetchPaymentSummay();
  }, [cart]);

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="favicon/cart-favicon.png" />
      <title>Checkout</title>

      <CheckoutHeader cart={cart} />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />

          {paymentSummary && (<PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />)}
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
