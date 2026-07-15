import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CIRCULATION_CACHE_KEY,
  DAY,
  ISSUANCE_CACHE_KEY,
  RENEWAL_CACHE_KEY,
  RESERVATION_CACHE_KEY,
} from "@/api/constants";
import {
  BookIssue,
  Circulation,
  ErrorRes,
  PaginationParams,
  PaginationResponse,
} from "@/api/entities";
import {
  issuanceService,
  issueFromReservationService,
  manualIssueService,
  renewService,
  returnService,
  scanBarcodeService,
  scanCardService,
} from "@/api/services";

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ErrorRes>) => void;
}

export const useIssues = (params: PaginationParams) => {
  return useQuery<PaginationResponse<BookIssue>, AxiosError>({
    queryKey: [...ISSUANCE_CACHE_KEY, params],
    queryFn: () => issuanceService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
  });
};

const invalidateCirculation = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: RENEWAL_CACHE_KEY });
  queryClient.invalidateQueries({ queryKey: CIRCULATION_CACHE_KEY });
  queryClient.invalidateQueries({ queryKey: ISSUANCE_CACHE_KEY });
};

export const useRenew = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ErrorRes>, { issueId: string }>({
    mutationFn: ({ issueId }) => renewService.postUrl(issueId),
    onSuccess: () => {
      invalidateCirculation(queryClient);
      onSuccess?.();
    },
    onError: (error) => onError?.(error),
  });
};

export const useReturn = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ErrorRes>, { issueId: string }>({
    mutationFn: ({ issueId }) => returnService.postUrl(issueId),
    onSuccess: () => {
      invalidateCirculation(queryClient);
      onSuccess?.();
    },
    onError: (error) => onError?.(error),
  });
};

/** Look up a member and their reservations/issues by library card id. */
export const useScanCard = (cardId: string) => {
  return useQuery<Circulation, AxiosError<ErrorRes>>({
    queryKey: [...CIRCULATION_CACHE_KEY, "card", cardId],
    queryFn: () => scanCardService.get(cardId),
    staleTime: DAY,
    enabled: !!cardId.trim(),
    retry: false,
  });
};

/** Look up a physical copy by its barcode. */
export const useScanBarcode = (barcode: string) => {
  return useQuery<any, AxiosError<ErrorRes>>({
    queryKey: [...CIRCULATION_CACHE_KEY, "barcode", barcode],
    queryFn: () => scanBarcodeService.get(barcode),
    staleTime: DAY,
    enabled: !!barcode.trim(),
    retry: false,
  });
};

export const useManualIssue = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ErrorRes>, { cardId: string; barcode: string }>({
    mutationFn: ({ cardId, barcode }) =>
      manualIssueService.postUrl(`${cardId}/${barcode}`),
    onSuccess: () => {
      invalidateCirculation(queryClient);
      onSuccess?.();
    },
    onError: (error) => onError?.(error),
  });
};

export const useIssueFromReservation = ({
  onSuccess,
  onError,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    AxiosError<ErrorRes>,
    { reservationId: string; barcode: string }
  >({
    mutationFn: ({ reservationId, barcode }) =>
      issueFromReservationService.postUrl(`${reservationId}/${barcode}`),
    onSuccess: () => {
      invalidateCirculation(queryClient);
      queryClient.invalidateQueries({ queryKey: RESERVATION_CACHE_KEY });
      onSuccess?.();
    },
    onError: (error) => onError?.(error),
  });
};
