import { it, expect, describe, vi, beforeEach, type Mock } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import axios from "axios";
import HomePage from "./HomePage";
import type { Product } from "../../types";
import { useCartStore } from "../../store/useCartStore";
import type { CartStore } from "../../store/useCartStore";

vi.mock("axios");
vi.mock("../../store/useCartStore");

describe("Homepage component", () => {
  let mockLoadCart: Mock;
  let mockAddToCart: Mock;

  beforeEach(() => {
    vi.mocked(axios.get).mockImplementation(async (urlPath: string): Promise<{data: Product[]}> => {
      if (urlPath === "/api/products") {
        return {
          data: [
            {
              id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
              image: "images/products/athletic-cotton-socks-6-pairs.jpg",
              name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
              rating: {
                stars: 4.5,
                count: 87,
              },
              priceCents: 1090,
              keywords: ["socks", "sports", "apparel"],
            },
            {
              id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
              image: "images/products/intermediate-composite-basketball.jpg",
              name: "Intermediate Size Basketball",
              rating: {
                stars: 4,
                count: 127,
              },
              priceCents: 2095,
              keywords: ["sports", "basketballs"],
            },
          ]
        };
      }
      return { data: [] };
    });

    mockLoadCart = vi.fn();
    mockAddToCart = vi.fn(async (itemId: string, quantity: number = 1) => {
      await axios.post('/api/cart-items', {
        productId: itemId,
        quantity: quantity,
      });

      await mockLoadCart();
    });


     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useCartStore).mockImplementation((selector?: any) => {
      const mockStore : CartStore = {
        cart: [],
        isLoading: false,
        error: null,

        loadCart: mockLoadCart,
        addItem: mockAddToCart,
        updateItem: vi.fn(),
        deleteItem: vi.fn()
      }

      if (selector){
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  it("display the products correct", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const productContainers = await screen.findAllByTestId('product-container');
    expect(productContainers.length).toBe(2);

    expect(
      within(productContainers[0]).getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')
    ).toBeInTheDocument();

    expect(
      within(productContainers[1]).getByText('Intermediate Size Basketball')
    ).toBeInTheDocument();
  });

  it('adds each product to the cart', async () => {
    render(
      <MemoryRouter>
        <HomePage  />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const productContainers = await screen.findAllByTestId('product-container');
    expect(productContainers.length).toBe(2);

    let addToCartButton = within(productContainers[0]).getByTestId('add-to-cart-button');
    let quantitySelector = within(productContainers[0]).getByTestId('product-quantity-selector');
    await user.selectOptions(quantitySelector, '2');
    await user.click(addToCartButton);

    addToCartButton = within(productContainers[1]).getByTestId('add-to-cart-button');
    quantitySelector = within(productContainers[1]).getByTestId('product-quantity-selector');
    await user.selectOptions(quantitySelector, '3');
    await user.click(addToCartButton);

    expect(axios.post).toHaveBeenNthCalledWith(1, '/api/cart-items', {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2
    });
  
    expect(axios.post).toHaveBeenNthCalledWith(2, '/api/cart-items', {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 3
    });

    expect(mockLoadCart).toHaveBeenCalledTimes(2);

  });
});
