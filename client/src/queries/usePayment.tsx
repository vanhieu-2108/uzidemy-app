import { paymentsApi } from "@/apiRequests/payments";
import { useMutation } from "@tanstack/react-query";

export default function useCreatePayment() {
  return useMutation({
    mutationFn: (body: any) => paymentsApi.createPayment(body),
  });
}
