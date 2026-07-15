import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  DAY,
  NOTIFICATION_CACHE_KEY,
  NOTIFICATION_COUNT_CACHE_KEY,
} from "@/api/constants";
import { ErrorRes, NotificationResponse } from "@/api/entities";
import {
  notificationCountService,
  notificationService,
} from "@/api/services";

export const useNotifications = () => {
  return useQuery<NotificationResponse, AxiosError>({
    queryKey: NOTIFICATION_CACHE_KEY,
    queryFn: () => notificationService.get(),
    staleTime: DAY,
  });
};

export const useNotificationCount = () => {
  return useQuery<{ count: number }, AxiosError>({
    queryKey: NOTIFICATION_COUNT_CACHE_KEY,
    queryFn: () => notificationCountService.get(),
    staleTime: DAY,
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { notificationId: string }>({
    mutationFn: ({ notificationId }) =>
      notificationService.put(`read/${notificationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_COUNT_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_CACHE_KEY });
    },
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { timestamp: string }>({
    mutationFn: ({ timestamp }) => notificationService.put(`readall/${timestamp}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_COUNT_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_CACHE_KEY });
    },
  });
};
