import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DAY, ENROLL_CACHE_KEY, USERS_CACHE_KEY } from "@/api/constants";
import { Enrollment, EnrollmentApproveData, ErrorRes, PaginationParams, PaginationResponse } from "@/api/entities";
import { enrollmentApproveService, enrollmentFetchService } from "@/api/services";

/** Pending enrollment (new member) requests awaiting admin approval. */
export const usePendingEnrollments = (params: PaginationParams = { page: 1, pageSize: 20 }) => {
  return useQuery<PaginationResponse<Enrollment>, AxiosError>({
    queryKey: [...ENROLL_CACHE_KEY, params],
    queryFn: () => enrollmentFetchService.get("", params),
    staleTime: DAY,
  });
};

export const useApproveEnrollment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, EnrollmentApproveData>({
    mutationFn: (body) => enrollmentApproveService.setSubroute(`/${body.userId}`).post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLL_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_CACHE_KEY });
      onSuccess?.();
    },
  });
};
