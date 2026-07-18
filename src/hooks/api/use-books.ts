import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  BOOKS_CACHE_KEY,
  BOOK_OVERVIEW_CACHE_KEY,
  DAY,
} from "@/api/constants";
import {
  BookInfo,
  BookStatusResponse,
  ErrorRes,
  PaginationParams,
  PaginationResponse,
} from "@/api/entities";
import {
  addBookService,
  bookDeleteService,
  bookSingleService,
  booksService,
  bookTrackService,
  markReferenceService,
} from "@/api/services";

export const useBooks = (params: PaginationParams, enabled = true) => {
  return useQuery<PaginationResponse<BookInfo>, AxiosError>({
    queryKey: [...BOOKS_CACHE_KEY, params],
    queryFn: () => booksService.get("", params),
    staleTime: DAY,
    placeholderData: (prev) => prev,
    enabled,
  });
};

export const useBookInfo = (bookInfoId?: string) => {
  return useQuery<BookInfo, AxiosError>({
    queryKey: [...BOOKS_CACHE_KEY, bookInfoId],
    queryFn: () => bookSingleService.get(bookInfoId),
    staleTime: DAY,
    enabled: !!bookInfoId,
  });
};

/** Live issued/reserved/available status of every copy of a title. */
export const useBookOverview = (bookInfoId?: string | null) => {
  return useQuery<BookStatusResponse, AxiosError>({
    queryKey: [...BOOK_OVERVIEW_CACHE_KEY, bookInfoId],
    queryFn: () => bookTrackService.get("", { bookInfoId }),
    enabled: !!bookInfoId,
  });
};

export const useAddBook = (onSuccess?: (data: unknown) => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, FormData>({
    mutationFn: (newBook) =>
      addBookService.post(newBook, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.(data);
    },
  });
};

export const useDeleteBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (bookInfoId) => bookDeleteService.setSubroute(`/whole/${bookInfoId}`).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

// ---------- Physical copies ----------

export interface BookCopyRow {
  bookInfoId: string;
  bookId: string;
  barcode: string;
  status: string;
  isReference: boolean;
}

export const useBookCopies = (bookInfoId?: string) => {
  return useQuery<BookCopyRow[], AxiosError>({
    queryKey: [...BOOKS_CACHE_KEY, "copies", bookInfoId],
    queryFn: () =>
      booksService.setSubroute(`/${bookInfoId}/copies`).get() as unknown as Promise<
        BookCopyRow[]
      >,
    staleTime: DAY,
    enabled: !!bookInfoId,
  });
};

export interface AddCopiesInput {
  bookInfoId: string;
  totalPieces: number;
  pricePerPiece: number;
  barcodes: string[];
}

export const useAddCopies = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, AddCopiesInput>({
    mutationFn: (input) =>
      booksService.setSubroute(`/add-existing/${input.bookInfoId}`).post(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

export const useDeleteCopy = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, string>({
    mutationFn: (bookId) => booksService.setSubroute(`/single/${bookId}`).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};

/** Flags a copy as reference-only (PUT books/:bookId/mark-reference) or clears the flag. */
export const useSetReference = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ErrorRes>, { bookId: string; isReference: boolean }>({
    mutationFn: ({ bookId, isReference }) =>
      isReference
        ? markReferenceService(bookId).put("mark-reference", {})
        : markReferenceService(bookId).delete("mark-reference"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_CACHE_KEY });
      onSuccess?.();
    },
  });
};
