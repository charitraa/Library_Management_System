import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import APIClient from "@/api/client";
import { BOOKS_CACHE_KEY, DAY } from "@/api/constants";
import { ErrorRes, PaginationParams, PaginationResponse } from "@/api/entities";
import {
  commentDeleteReplyService,
  commentDeleteService,
  commentReplyService,
} from "@/api/services";

export const COMMENTS_CACHE_KEY = ["comments"];
export const RATING_CACHE_KEY = ["rate"];
export const REPLIES_CACHE_KEY = ["replies"];

const commentService = new APIClient<any, any>("/comments");
const rateService = new APIClient<any, any>("/ratings");

export interface BookComment {
  commentId: string;
  comment: string;
  userId: string;
  bookInfoId: string;
  createdAt: string;
  user: {
    fullName: string;
    userId: string;
    profilePicUrl: string;
    ratings?: { rating: number }[];
  };
  replies: {
    commentReplyId: string;
    reply: string;
    createdAt: string;
    user: { fullName: string; profilePicUrl: string };
  }[];
}

export const useComments = (bookInfoId?: string, params: PaginationParams = { page: 1, pageSize: 10 }) => {
  return useQuery<PaginationResponse<BookComment>, AxiosError>({
    queryKey: [...COMMENTS_CACHE_KEY, bookInfoId, params],
    queryFn: () => commentService.get(bookInfoId, params),
    staleTime: DAY,
    enabled: !!bookInfoId,
  });
};

export const usePostComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { bookInfoId: string; comment: string }>({
    mutationFn: ({ bookInfoId, comment }) => commentService.postUrl(bookInfoId, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useRateBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { bookInfoId: string; rating: number }>({
    mutationFn: ({ bookInfoId, rating }) => rateService.postUrl(`${bookInfoId}/${rating}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: RATING_CACHE_KEY });
      queryClient.refetchQueries({ queryKey: COMMENTS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useReplyComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { commentId: string; reply: string }>({
    mutationFn: ({ commentId, reply }) => commentReplyService.postUrl(commentId, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_CACHE_KEY });
      queryClient.invalidateQueries({ queryKey: REPLIES_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useUpdateComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { commentId: string; comment: string }>({
    mutationFn: ({ commentId, comment }) =>
      commentService.put(`update/${commentId}`, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useUpdateReply = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { commentReplyId: string; reply: string }>({
    mutationFn: ({ commentReplyId, reply }) =>
      commentService.put(`update-reply/${commentReplyId}`, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useDeleteComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (commentId) => commentDeleteService(commentId).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useDeleteReply = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (commentReplyId) => commentDeleteReplyService(commentReplyId).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_CACHE_KEY });
      onSuccess?.();
    },
  });
};
