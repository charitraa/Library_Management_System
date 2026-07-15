import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  DAY,
  DETAILED_USER_ROLES_KEY,
  ENROLL_CACHE_KEY,
  USERS_CACHE_KEY,
  USER_OVERVIEW_CACHE_KEY,
} from "@/api/constants";
import {
  ErrorRes,
  PaginationParams,
  PaginationResponse,
  UserOverview,
  UserRole,
  UserSummary,
} from "@/api/entities";
import {
  detailedRolesService,
  registrationService,
  usersService,
  userTrackService,
} from "@/api/services";

export const useUsers = (params: PaginationParams) => {
  return useQuery<PaginationResponse<UserSummary>, AxiosError>({
    queryKey: [...USERS_CACHE_KEY, params],
    queryFn: () => usersService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
  });
};

/** Full overview (role, penalties, reservations, issues) of one user by id/cardId. */
export const useUserOverview = (userId?: string) => {
  return useQuery<UserOverview, AxiosError>({
    queryKey: [...USER_OVERVIEW_CACHE_KEY, userId],
    queryFn: () => userTrackService(userId!).get(),
    staleTime: DAY,
    enabled: !!userId,
  });
};

/** All assignable roles with their ids (GET /attributes/roles/detailed returns a flat array). */
export const useDetailedRoles = () => {
  return useQuery<UserRole[], AxiosError>({
    queryKey: DETAILED_USER_ROLES_KEY,
    queryFn: () => detailedRolesService.get(),
    staleTime: DAY,
  });
};

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { userId: string; status: string }>({
    mutationFn: ({ userId, status }) =>
      usersService.setSubroute("account-status").put(userId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USER_OVERVIEW_CACHE_KEY });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { userId: string; roleId: string }>({
    mutationFn: ({ userId, roleId }) =>
      usersService.setSubroute("role").put(`${userId}/${roleId}`),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: USER_OVERVIEW_CACHE_KEY });
      queryClient.refetchQueries({ queryKey: USERS_CACHE_KEY });
    },
  });
};

export const useRenewMembership = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { userId: string }>({
    mutationFn: ({ userId }) =>
      usersService.setSubroute("renew-membership").put(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USER_OVERVIEW_CACHE_KEY });
    },
  });
};

// ---------- Enrollments (new member registration) ----------

export interface EnrollmentRequest {
  fullName: string;
  dob: string | null;
  address: string;
  contactNo: string;
  enrollmentYear: string;
  gender: string;
  password: string;
  collegeId: string;
  universityId: string;
  email: string;
  roleId: string;
}

export const useRequestEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, EnrollmentRequest>({
    mutationFn: (body) => registrationService.setSubroute("/request").post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLL_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_CACHE_KEY });
    },
  });
};
