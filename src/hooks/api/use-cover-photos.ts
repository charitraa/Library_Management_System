import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BOOKS_CACHE_KEY, DAY } from "@/api/constants";
import { CoverPhoto, ErrorRes } from "@/api/entities";
import {
  coverPhotoDeleteService,
  coverPhotoListService,
  coverPhotoMarkProfileService,
  coverPhotoUploadService,
} from "@/api/services";

export const COVER_CACHE_KEY = ["covers"];

export const useCoverPhotos = (bookInfoId?: string) => {
  return useQuery<CoverPhoto[], AxiosError>({
    queryKey: [...COVER_CACHE_KEY, bookInfoId],
    queryFn: () => coverPhotoListService(bookInfoId!).get(),
    staleTime: DAY,
    enabled: !!bookInfoId,
  });
};

export const useUploadCoverPhotos = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { bookInfoId: string; formData: FormData }>({
    mutationFn: ({ bookInfoId, formData }) =>
      coverPhotoUploadService(bookInfoId).post(formData, {
        headers: { "Content-Type": "multipart/form-data", Accept: "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COVER_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useDeleteCoverPhoto = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (imageId) => coverPhotoDeleteService(imageId).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COVER_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useMarkProfilePhoto = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (imageId) => coverPhotoMarkProfileService.put(imageId, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COVER_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};
