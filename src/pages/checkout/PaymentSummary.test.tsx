import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, within, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import PaymentSummary from "./PaymentSummary";
import { useLocation } from "react-router";
import axios from "axios";
import type { PaymentSummary as PaymentSummaryType } from "../../types";
import { useCartStore, type CartStore } from "../../store/useCartStore";

vi.mock('axios');
vi.mock('../../store/useCartStore');

describe("PaymentSummary component", () => {
  let paymentSummary: PaymentSummaryType;
  let mockLoadCart: Mock;
  let mockAddToCart: Mock;

  beforeEach(() => {
    paymentSummary = {
      totalItems: 3,
      productCostCents: 4275,
      shippingCostCents: 499,
      totalCostBeforeTaxCents: 4774,
      taxCents: 477,
      totalCostCents: 5251,
    };

    mockLoadCart = vi.fn();
    mockAddToCart = vi.fn(async (itemId: string, quantity: number): Promise<void> => {
      await axios.post('/api/cart-items', {
        productId: itemId,
        quantity: quantity,
      });

      await mockLoadCart();
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useCartStore).mockImplementation((selector?: any) => {
      const mockStore: CartStore = {
        cart: [],
        isLoading: false,
        error: null,
        loadCart: mockLoadCart,
        addToCart: mockAddToCart
      }

      if (selector) {
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  it("displays the correct details", () => {
    render(
      <MemoryRouter>
        <PaymentSummary paymentSummary={paymentSummary} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Items (3):")).toBeInTheDocument();
    expect(within(screen.getByTestId("payment-summary-product-cost")).getByText("$42.75")).toBeInTheDocument();

    expect(screen.getByTestId("payment-summary-shipping-cost")).toHaveTextContent("$4.99");
    expect(screen.getByTestId("payment-summary-total-before-tax")).toHaveTextContent("$47.74");
    expect(screen.getByTestId("payment-summary-tax")).toHaveTextContent("$4.77");
    expect(screen.getByTestId("payment-summary-total")).toHaveTextContent("$52.51");
  });

  it("places an order", async () => {
    function Location() {
      const location = useLocation();
      return (
          <div data-testid='url-path'>{location.pathname}</div>
      );
    }
    
    render(
      <MemoryRouter>
        <PaymentSummary paymentSummary={paymentSummary} />
        <Location />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const placeOrderButton = screen.getByTestId('place-order-button');
    await user.click(placeOrderButton);

    expect(axios.post).toHaveBeenCalledWith('/api/orders');
    expect(mockLoadCart).toHaveBeenCalled();
    
    expect(
      screen.getByTestId('url-path')
    ).toHaveTextContent('/orders');
  });

});
