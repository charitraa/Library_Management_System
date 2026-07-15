import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DAY, PURCHASE_CACHE_KEY } from "@/api/constants";
import { BookPurchase, ErrorRes, PaginationParams, PaginationResponse } from "@/api/entities";
import { purchaseEntriesService } from "@/api/services";

export const usePurchaseEntries = (params: PaginationParams) => {
  return useQuery<PaginationResponse<BookPurchase>, AxiosError>({
    queryKey: [...PURCHASE_CACHE_KEY, params],
    queryFn: () => purchaseEntriesService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
  });
};

export const useUpdatePurchaseEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { purchaseId: string; pricePerPiece: string }>({
    mutationFn: ({ purchaseId, pricePerPiece }) =>
      purchaseEntriesService.put(purchaseId, { pricePerPiece }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PURCHASE_CACHE_KEY }),
  });
};

export const useDeletePurchaseEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { purchaseId: string }>({
    mutationFn: ({ purchaseId }) => purchaseEntriesService.setSubroute(`/${purchaseId}`).delete(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PURCHASE_CACHE_KEY }),
  });
};
