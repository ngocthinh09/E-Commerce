import axiosClient from "../api/axiosClient";
import { type DeliveryOption } from "../types";

export const deliveryOptionsService = {
  getDeliveryOptions: () => {
    return axiosClient.get<DeliveryOption[]>('/api/delivery-options?expand=estimatedDeliveryTime');
  }
};
