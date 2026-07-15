import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BOOKS_CACHE_KEY, DAY, LOST_CACHE_KEY } from "@/api/constants";
import { ErrorRes, Lost, PaginationParams, PaginationResponse } from "@/api/entities";
import { lostBooksService, markBookFoundService } from "@/api/services";

export const useLostBooks = (params: PaginationParams) => {
  return useQuery<PaginationResponse<Lost>, AxiosError>({
    queryKey: [...LOST_CACHE_KEY, params],
    queryFn: () => lostBooksService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
  });
};

export const useAddLostBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, Lost>({
    mutationFn: (body) => lostBooksService.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOST_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

/** Removes a barcode from the lost-books list entirely (writes it off). */
export const useDeleteLostBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (bookInfoId) => lostBooksService.setSubroute(bookInfoId).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOST_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useMarkBookFound = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (bookInfoId) => markBookFoundService.setSubroute(bookInfoId).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOST_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};
