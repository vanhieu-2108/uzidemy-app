import http from "@/lib/http";
import { Response } from "@/types/res";

export const paymentsApi = {
  createPayment: (body: any) =>
    http.post<
      Response<{
        checkoutURL: string;
      }>
    >("/payment/create-payment-link", body),
};
