import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DAY, EUserRoles, HOUR, USER_CACHE_KEY, USER_ROLES_KEY } from "@/api/constants";
import { ErrorRes, User, UserRolesMap } from "@/api/entities";
import { AuthRequest, authService, meService, rolesService } from "@/api/services";

export const useMe = () => {
  return useQuery<User, AxiosError>({
    queryKey: USER_CACHE_KEY,
    queryFn: () => meService.get(),
    staleTime: HOUR,
    retry: false,
  });
};

/** Role name -> precedence map (GET /attributes/roles), used to rank a user's role against others. */
export const useUserRoles = () => {
  return useQuery<UserRolesMap, AxiosError>({
    queryKey: USER_ROLES_KEY,
    queryFn: () => rolesService.get(),
    staleTime: DAY,
  });
};

/**
 * True when the logged-in user gets the staff navigation/dashboard rather than the member portal.
 *
 * The old app has two different role checks in its codebase — a precedence-based `useIsEmployee`
 * hook (never actually called anywhere) and the `SideDrawer` component's exact-string check
 * (`role !== "Member" && role !== "Faculty"`), which is the one that actually runs and decides
 * which set of pages/menu a logged-in user sees. This mirrors the latter, since it's the real flow.
 */
export const useIsStaff = () => {
  const { data, ...rest } = useMe();
  const role = data?.data?.role?.role;
  const isStaff = !!role && role !== EUserRoles.Member && role !== EUserRoles.Faculty;
  return {
    ...rest,
    isStaff,
    role,
    user: data?.data,
  };
};

export const useLogin = (
  onSuccess?: (user: User) => void,
  onError?: (error: AxiosError<ErrorRes>) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError<ErrorRes>, AuthRequest>({
    mutationFn: (body) => authService.setSubroute("/login").post(body),
    onSuccess: async () => {
      // Don't trust the login response body for role data — the old app never did either
      // (its onSuccess callback ignored the response entirely). Fetch /me fresh instead,
      // since that's the endpoint every role check in this app is actually built on.
      await queryClient.invalidateQueries({ queryKey: USER_CACHE_KEY });
      const me = await queryClient.fetchQuery<User>({
        queryKey: USER_CACHE_KEY,
        queryFn: () => meService.get(),
      });
      onSuccess?.(me);
    },
    onError: (error) => onError?.(error),
  });
};

export const useLogout = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>>({
    mutationFn: () => authService.setSubroute("/logout").delete(),
    onSuccess: () => {
      queryClient.removeQueries();
      onSuccess?.();
    },
  });
};
