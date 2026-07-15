import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BOOK_REQUEST_CACHE_KEY, DAY } from "@/api/constants";
import {
  BookRequestType,
  ErrorRes,
  PaginationParams,
  PaginationResponse,
} from "@/api/entities";
import { bookRequestMarkService, bookRequestsService } from "@/api/services";

export const useBookRequests = (params: PaginationParams) => {
  return useQuery<PaginationResponse<BookRequestType>, AxiosError>({
    queryKey: [...BOOK_REQUEST_CACHE_KEY, params],
    queryFn: () => bookRequestsService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
  });
};

export interface CreateBookRequestInput {
  title: string;
  publisher?: string;
  publicationYear?: string;
  editionStatement?: string;
  authors?: string;
}

export const useCreateBookRequest = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, CreateBookRequestInput>({
    mutationFn: (body) => bookRequestsService.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOK_REQUEST_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useMarkBookRequest = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { id: string; status: string }>({
    mutationFn: ({ id, status }) => bookRequestMarkService(id).put("", { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOK_REQUEST_CACHE_KEY });
      onSuccess?.();
    },
  });
};
