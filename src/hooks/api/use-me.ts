import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  DAY,
  MY_BOOKS_CACHE_KEY,
  MY_DUES_CACHE_KEY,
  MY_PAYMENT_CACHE_KEY,
} from "@/api/constants";
import { BookIssue, MyDue, MyPayment } from "@/api/entities";
import {
  myBooksService,
  myDuesService,
  myPaymentsService,
} from "@/api/services";

/** Current + past issues of the logged-in member (GET /me/book-status). */
export const useMyBooks = () => {
  return useQuery<{ data: BookIssue[] }, AxiosError>({
    queryKey: MY_BOOKS_CACHE_KEY,
    queryFn: () => myBooksService.get("") as Promise<{ data: BookIssue[] }>,
    staleTime: DAY,
  });
};

export const useMyDues = () => {
  return useQuery<{ data: MyDue[] }, AxiosError>({
    queryKey: MY_DUES_CACHE_KEY,
    queryFn: () => myDuesService.get(""),
    staleTime: DAY,
  });
};

export const useMyPayments = () => {
  return useQuery<{ data: MyPayment[] }, AxiosError>({
    queryKey: MY_PAYMENT_CACHE_KEY,
    queryFn: () => myPaymentsService.get(""),
    staleTime: DAY,
  });
};
