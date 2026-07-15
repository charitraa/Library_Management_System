import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DAY, ONLINE_BOOKS_CACHE_KEY } from "@/api/constants";
import { ErrorRes, OnlineBookType, PaginationParams, PaginationResponse } from "@/api/entities";
import { onlineBooksService } from "@/api/services";

export const useOnlineBooks = (params: PaginationParams) => {
  return useQuery<PaginationResponse<OnlineBookType>, AxiosError>({
    queryKey: [...ONLINE_BOOKS_CACHE_KEY, params],
    queryFn: () => onlineBooksService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
  });
};

export const useAddOnlineBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, FormData>({
    mutationFn: (formData) =>
      onlineBooksService.post(formData, {
        headers: { "Content-Type": "multipart/form-data", Accept: "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONLINE_BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export interface UpdateOnlineBookInput {
  onlineBookId: string;
  title: string;
  purchaseUrl: string;
  resourceUrl: string;
}

export const useUpdateOnlineBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, UpdateOnlineBookInput>({
    mutationFn: (body) => {
      const formData = new FormData();
      formData.append("title", body.title);
      formData.append("purchaseUrl", body.purchaseUrl);
      formData.append("resourceUrl", body.resourceUrl);
      return onlineBooksService.put(body.onlineBookId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONLINE_BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useDeleteOnlineBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (onlineBookId) => onlineBooksService.delete(onlineBookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONLINE_BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};
