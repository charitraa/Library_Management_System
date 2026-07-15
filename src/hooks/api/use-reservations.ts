import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ASSIGNABLE_RESERVATION_CACHE_KEY,
  CIRCULATION_CACHE_KEY,
  DAY,
  RESERVATION_CACHE_KEY,
  USERS_CACHE_KEY,
  USER_OVERVIEW_CACHE_KEY,
} from "@/api/constants";
import {
  AssignableBook,
  ErrorRes,
  PaginationParams,
  PaginationResponse,
  Reservation,
} from "@/api/entities";
import {
  assignableBooksService,
  myReservationsService,
  reservationsService,
} from "@/api/services";

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ErrorRes>) => void;
}

// ---------- Admin ----------

export const useReservations = (params: PaginationParams) => {
  return useQuery<PaginationResponse<Reservation>, AxiosError>({
    queryKey: [...RESERVATION_CACHE_KEY, "all", params],
    queryFn: () => reservationsService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
  });
};

/** Copies (barcodes) that can be assigned to fulfil a reservation for a title. */
export const useAssignableBooks = (bookInfoId?: string) => {
  return useQuery<AssignableBook[], AxiosError>({
    queryKey: [...ASSIGNABLE_RESERVATION_CACHE_KEY, bookInfoId],
    queryFn: () => assignableBooksService.get(bookInfoId),
    staleTime: DAY,
    enabled: !!bookInfoId,
  });
};

export const useAssignReservation = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ErrorRes>,
    {
      reservationId: string;
      barcode: string;
      assignData: { reservationDate?: string; autoDate: boolean };
    }
  >({
    mutationFn: ({ reservationId, barcode, assignData }) =>
      reservationsService.put(`assign-book/${reservationId}/${barcode}`, assignData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATION_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: CIRCULATION_CACHE_KEY });
      onSuccess?.();
    },
    onError: (error) => onError?.(error),
  });
};

export const useDeleteReservation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (reservationId) => reservationsService.delete(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATION_CACHE_KEY });
      onSuccess?.();
    },
  });
};

/** Staff creates a reservation for a member at the circulation desk (used when no copy is immediately available). */
export const useAdminReservation = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ErrorRes>,
    {
      cardId: string;
      assignData: { barcode: string; reservationDate: string | null; autoDate: boolean };
    }
  >({
    mutationFn: ({ cardId, assignData }) =>
      reservationsService.postUrl(`admin/${cardId}`, assignData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATION_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: CIRCULATION_CACHE_KEY });
      onSuccess?.();
    },
    onError: (error) => onError?.(error),
  });
};

// ---------- Member portal ----------

export const useMyReservations = (params: PaginationParams) => {
  return useQuery<PaginationResponse<Reservation>, AxiosError>({
    queryKey: [...RESERVATION_CACHE_KEY, "my", params],
    queryFn: () => myReservationsService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
  });
};

export const useAddMyReservation = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { bookInfoId: string }>({
    mutationFn: ({ bookInfoId }) =>
      reservationsService.setSubroute(`/${bookInfoId}`).post(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATION_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USER_OVERVIEW_CACHE_KEY });
      onSuccess?.();
    },
    onError: (error) => onError?.(error),
  });
};

export const useCancelMyReservation = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { reservationId: string }>({
    mutationFn: ({ reservationId }) =>
      myReservationsService.setSubroute(`/${reservationId}`).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATION_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USER_OVERVIEW_CACHE_KEY });
      onSuccess?.();
    },
    onError: (error) => onError?.(error),
  });
};
