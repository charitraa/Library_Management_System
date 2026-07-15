import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  DAY,
  PAYMENT_CACHE_KEY,
  PENALTIES_CACHE_KEY,
  USERS_CACHE_KEY,
  USER_OVERVIEW_CACHE_KEY,
} from "@/api/constants";
import {
  AddPenalty,
  ErrorRes,
  MakePayment,
  PaginationResponse,
  Payment,
  Penalty,
} from "@/api/entities";
import {
  makePaymentService,
  paymentHistoryService,
  penaltiesService,
  resolvePenaltyService,
} from "@/api/services";

interface ListParams {
  userId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  seed?: string;
}

/** Penalties of one user (userId set) — matches old GET /users/penalties/:userId. */
export const usePenalties = ({ userId, status, seed = "", page = 1, pageSize = 10 }: ListParams) => {
  const queryParams = { page, pageSize, seed, ...(status && { status }) };

  return useQuery<PaginationResponse<Penalty>, AxiosError>({
    queryKey: [...PENALTIES_CACHE_KEY, userId, status, page, pageSize, seed],
    queryFn: () => penaltiesService.get(userId, queryParams),
    staleTime: DAY,
    enabled: !!userId,
  });
};

export const useAddPenalty = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { userId: string; body: AddPenalty }>({
    mutationFn: ({ userId, body }) =>
      penaltiesService.setSubroute(`/${userId}`).post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: PENALTIES_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USER_OVERVIEW_CACHE_KEY });
    },
  });
};

export const useResolvePenalty = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { userId: string; penaltyId: string }>({
    mutationFn: ({ userId, penaltyId }) =>
      resolvePenaltyService.put(`${userId}/${penaltyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENALTIES_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USER_OVERVIEW_CACHE_KEY });
    },
  });
};

export const useMakePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { userId: string; body: MakePayment }>({
    mutationFn: ({ userId, body }) =>
      makePaymentService.setSubroute(`/${userId}`).post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USER_OVERVIEW_CACHE_KEY });
    },
  });
};

export const usePaymentHistory = ({ userId, status, seed = "", page = 1, pageSize = 10 }: ListParams) => {
  const queryParams = { page, pageSize, seed, ...(status && { status }) };

  return useQuery<PaginationResponse<Payment>, AxiosError>({
    queryKey: [...PAYMENT_CACHE_KEY, userId, status, page, pageSize, seed],
    queryFn: () => paymentHistoryService.get(userId, queryParams),
    staleTime: DAY,
    enabled: !!userId,
  });
};
