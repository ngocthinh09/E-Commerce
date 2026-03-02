import axiosClient from "../api/axiosClient";
import { type Order } from "../types";

export const orderService = {
  getAllOrders: () => {
    return axiosClient.get<Order[]>(`/api/orders?expand=products`);
  },
  getOrderById: (orderId?: string) => {
    return axiosClient.get<Order>(`/api/orders/${orderId}?expand=products`);
  },
  postOrder: () => {
    return axiosClient.post<void>("/api/orders");
  },
};
