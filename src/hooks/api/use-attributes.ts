import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  AUTHORS_CACHE_KEY,
  DAY,
  DETAILED_MEMBER_TYPE_KEY,
  GENRES_CACHE_KEY,
  GLOBAL_ATTRIBUTES_CACHE_KEY,
  KEYWORD_CACHE_KEY,
  PUBLISHERS_CACHE_KEY,
} from "@/api/constants";
import {
  ErrorRes,
  GlobalAttribute,
  MembershipTypeDetail,
  PaginationParams,
  PaginationResponse,
} from "@/api/entities";
import {
  authorsService,
  genresService,
  globalAttributesService,
  keywordsService,
  membershipTypesService,
  publishersService,
} from "@/api/services";

const defaultParams: PaginationParams = { page: 1, pageSize: 100 };

export interface Author {
  authorId?: string;
  title: string;
  fullName: string;
}
export interface Genre {
  genreId?: string;
  genre: string;
}
export interface Publisher {
  publisherId?: string;
  publisherName: string;
  address?: string;
}
export interface Keyword {
  keywordId?: string;
  keyword: string;
}

export const useAuthors = (params: PaginationParams = defaultParams) => {
  return useQuery<PaginationResponse<Author>, AxiosError>({
    queryKey: [...AUTHORS_CACHE_KEY, params],
    queryFn: () => authorsService.get("", params),
    staleTime: DAY,
  });
};

export const useAddAuthor = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, Author>({
    mutationFn: (body) => authorsService.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTHORS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, Author>({
    mutationFn: (body) => authorsService.put(body.authorId ?? "", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AUTHORS_CACHE_KEY }),
  });
};

export const useDeleteAuthor = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (authorId) => authorsService.delete(authorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTHORS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useGenres = (params: PaginationParams = defaultParams) => {
  return useQuery<PaginationResponse<Genre>, AxiosError>({
    queryKey: [...GENRES_CACHE_KEY, params],
    queryFn: () => genresService.get("", params),
    staleTime: DAY,
  });
};

export const useAddGenre = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, Genre>({
    mutationFn: (body) => genresService.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GENRES_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, Genre>({
    mutationFn: (body) => genresService.put(body.genreId ?? "", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GENRES_CACHE_KEY }),
  });
};

export const useDeleteGenre = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (genreId) => genresService.delete(genreId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GENRES_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const usePublishers = (params: PaginationParams = defaultParams) => {
  return useQuery<PaginationResponse<Publisher>, AxiosError>({
    queryKey: [...PUBLISHERS_CACHE_KEY, params],
    queryFn: () => publishersService.get("", params),
    staleTime: DAY,
  });
};

export const useAddPublisher = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, Publisher>({
    mutationFn: (body) => publishersService.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLISHERS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useUpdatePublisher = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, Publisher>({
    mutationFn: (body) => publishersService.put(body.publisherId ?? "", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PUBLISHERS_CACHE_KEY }),
  });
};

export const useDeletePublisher = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (publisherId) => publishersService.delete(publisherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLISHERS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useKeywords = (params: PaginationParams = defaultParams) => {
  return useQuery<PaginationResponse<Keyword>, AxiosError>({
    queryKey: [...KEYWORD_CACHE_KEY, params],
    queryFn: () => keywordsService.get("", params),
    staleTime: DAY,
  });
};

export const useAddKeyword = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, Keyword>({
    mutationFn: (body) => keywordsService.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYWORD_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useUpdateKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, Keyword>({
    mutationFn: (body) => keywordsService.put(body.keywordId ?? "", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYWORD_CACHE_KEY }),
  });
};

export const useDeleteKeyword = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (keywordId) => keywordsService.delete(keywordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYWORD_CACHE_KEY });
      onSuccess?.();
    },
  });
};

/** Membership types are read-only in the current backend contract (no add/edit/delete). */
export const useMembershipTypes = () => {
  return useQuery<MembershipTypeDetail[], AxiosError>({
    queryKey: DETAILED_MEMBER_TYPE_KEY,
    queryFn: () => membershipTypesService.get(),
    staleTime: DAY,
  });
};

export const useGlobalAttributes = () => {
  return useQuery<GlobalAttribute, AxiosError>({
    queryKey: GLOBAL_ATTRIBUTES_CACHE_KEY,
    queryFn: () => globalAttributesService.get(),
    staleTime: DAY,
  });
};

export const useUpdateGlobalAttributes = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorRes>, GlobalAttribute>({
    mutationFn: (body) => globalAttributesService.put(body.globalAttributeId ?? "", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GLOBAL_ATTRIBUTES_CACHE_KEY }),
  });
};
