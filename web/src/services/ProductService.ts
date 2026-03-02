import axiosClient from "../api/axiosClient";
import type { Product } from "../types";

export const productService = {
  getProduct: (searchText: string | null) => {
    const url = (searchText && searchText.trim().length > 0) ? `/api/products?search=${searchText}` : '/api/products';
    return axiosClient.get<Product[]>(url);
  }
}
