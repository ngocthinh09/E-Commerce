import axiosClient from "../api/axiosClient";
import { type PaymentSummary } from "../types";

export const paymentSummaryService = {
  getPaymentSummary: () => {
    return axiosClient.get<PaymentSummary>("/api/payment-summary");
  },
};
