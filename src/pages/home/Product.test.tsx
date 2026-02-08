import { it, expect, describe, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import axios from 'axios';
import Product from './Product';
import type { Product as ProductType } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import type { CartStore } from '../../store/useCartStore';

vi.mock('axios');
vi.mock('../../store/useCartStore');

describe('Product component', () => {
    let user: UserEvent;
    let product: ProductType;
    let mockAddToCart: Mock;
    let mockLoadCart: Mock;

    // TEST HOOK: beforeEach(), afterEach(), beforeAll(), afterAll()
    beforeEach(() => {
        user = userEvent.setup();
        product =  {
            id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            image: "images/products/athletic-cotton-socks-6-pairs.jpg",
            name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
            rating: {
            stars: 4.5,
            count: 87
            },
            priceCents: 1090,
            keywords: ["socks", "sports", "apparel"]
        };

        mockLoadCart = vi.fn();
        mockAddToCart = vi.fn(async (itemId: string, quantity: number = 1) => {
            await axios.post('/api/cart-items', {
                productId: itemId,
                quantity: quantity
            });
            await mockLoadCart();
        });

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

    it('display the product details correctly', () => {
        render(<Product product={product} />);
        expect(screen.getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')).toBeInTheDocument();
        expect(screen.getByText('$10.90')).toBeInTheDocument();
        expect(screen.getByTestId("product-image")).toHaveAttribute('src', 'images/products/athletic-cotton-socks-6-pairs.jpg');
        expect(screen.getByTestId('product-rating-stars-image')).toHaveAttribute('src', 'images/ratings/rating-45.png');
        expect(screen.getByText('87')).toBeInTheDocument();
    });


    it("adds a product to the cart", async () => {
        render(<Product product={product} />);

        const addToCartButton = screen.getByTestId('add-to-cart-button');
        await user.click(addToCartButton);

        expect(mockAddToCart).toHaveBeenCalledWith('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
        expect(axios.post).toHaveBeenCalledWith('/api/cart-items', {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 1
        });

        expect(mockLoadCart).toHaveBeenCalled();
    });

    it('selects a quantity', async () => {
        render(<Product product={product} />);

        const addToCartButton = screen.getByTestId('add-to-cart-button');
        const quantitySelector = screen.getByTestId('product-quantity-selector');
        await user.selectOptions(quantitySelector, '3');
        await user.click(addToCartButton);
        
        expect(quantitySelector).toHaveValue('3');
        expect(mockAddToCart).toHaveBeenCalledWith('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 3);

        expect(axios.post).toHaveBeenCalledWith('/api/cart-items', {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 3
        })
        expect(mockLoadCart).toHaveBeenCalled();
    })

});