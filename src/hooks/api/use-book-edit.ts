import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BOOKS_CACHE_KEY } from "@/api/constants";
import { ErrorRes } from "@/api/entities";
import { bookEditService } from "@/api/services";

export interface BookEditInput {
  bookInfoId: string;
  title: string;
  subTitle?: string;
  callNumber?: string;
  editionStatement?: string;
  seriesStatement?: string;
  publicationYear?: string;
  numberOfPages?: string;
  publisherId?: string;
}

/** Full book-info edit (title, publisher, year, pages, etc). */
export const useUpdateBookInfo = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, BookEditInput>({
    mutationFn: (body) => {
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      return bookEditService.put(body.bookInfoId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useUpdateBookAuthors = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { infoId: string; authors: string[] }>({
    mutationFn: ({ infoId, authors }) =>
      bookEditService.put(`${infoId}/authors`, { bookAuthors: authors }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY }),
  });
};

export const useUpdateBookGenres = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { infoId: string; genres: string[] }>({
    mutationFn: ({ infoId, genres }) =>
      bookEditService.put(`${infoId}/genres`, { bookGenres: genres }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY }),
  });
};

export const useUpdateBookIsbns = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { infoId: string; isbns: string[] }>({
    mutationFn: ({ infoId, isbns }) => bookEditService.put(`${infoId}/isbns`, { isbns }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY }),
  });
};

export const useUpdateBookKeywords = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { infoId: string; keywords: string[] }>({
    mutationFn: ({ infoId, keywords }) =>
      bookEditService.put(`${infoId}/keywords`, { keywords }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY }),
  });
};
