import APIClient from "./client";
import {
  AddPenalty,
  AssignableBook,
  BookInfo,
  BookIssue,
  BookPurchase,
  BookRequestType,
  BookStatusResponse,
  Circulation,
  CoverPhoto,
  Enrollment,
  GlobalAttribute,
  Lost,
  MakePayment,
  MembershipTypeDetail,
  MyDue,
  MyPayment,
  NotificationResponse,
  OnlineBookType,
  PaginationParams,
  PaginationResponse,
  Penalty,
  Payment,
  Reservation,
  User,
  UserOverview,
  UserRole,
  UserRolesMap,
  UserSummary,
} from "./entities";

// ---------- Auth / me ----------

export interface AuthRequest {
  cardId: string;
  password: string;
}

export const authService = new APIClient<User, AuthRequest>("/auth");
export const meService = new APIClient<User, Partial<User>>("/me");
export const myBooksService = new APIClient<{ data: unknown[] }>("/me/book-status");
export const myDuesService = new APIClient<{ data: MyDue[] }>("/me/dues");
export const myPaymentsService = new APIClient<{ data: MyPayment[] }>("/me/payments");
export const registrationService = new APIClient<User, unknown>("/enrollments");

// ---------- Books ----------

export const booksService = new APIClient<
  PaginationResponse<BookInfo>,
  unknown,
  PaginationParams
>("/books");
/** Same "/books" route as booksService, typed for a single-record GET (GET /books/:id). */
export const bookSingleService = new APIClient<BookInfo>("/books");
export const addBookService = new APIClient<unknown, FormData>("/books");
export const bookDeleteService = new APIClient<unknown>("/books");
export const bookTrackService = new APIClient<BookStatusResponse>("/books/track");
/** PUT/DELETE books/:bookId/mark-reference toggles the reference-only flag on a copy. */
export const markReferenceService = (bookId: string) =>
  new APIClient<unknown, unknown>(`/books/${bookId}`);

// ---------- Users (admin) ----------

export const usersService = new APIClient<
  PaginationResponse<UserSummary>,
  unknown,
  PaginationParams
>("/users/");
export const userTrackService = (userId: string) =>
  new APIClient<UserOverview>(`users/track/${userId}`);
export const detailedRolesService = new APIClient<UserRole[]>(
  "/attributes/roles/detailed",
);
/** GET /attributes/roles: a flat map of role name -> precedence (not a list). */
export const rolesService = new APIClient<UserRolesMap>("/attributes/roles");

// ---------- Circulation ----------

export const issuanceService = new APIClient<
  PaginationResponse<BookIssue>,
  unknown,
  PaginationParams
>("circulation/issues");
export const renewService = new APIClient<void>("/circulation/issues/renew");
export const returnService = new APIClient<void>("/circulation/issues/return");
export const scanCardService = new APIClient<Circulation>(
  "/circulation/issues/scan/card",
);
export const scanBarcodeService = new APIClient<unknown>(
  "/circulation/issues/scan/barcode",
);
export const manualIssueService = new APIClient<void>("/circulation/issues/manual");
export const issueFromReservationService = new APIClient<void>(
  "/circulation/issues/reserved",
);

// ---------- Reservations ----------

export const reservationsService = new APIClient<
  PaginationResponse<Reservation>,
  unknown,
  PaginationParams
>("/circulation/reservations");
export const assignableBooksService = new APIClient<AssignableBook[]>(
  "/circulation/reservations/assignable-books",
);
export const myReservationsService = new APIClient<
  PaginationResponse<Reservation>,
  unknown,
  PaginationParams
>("/circulation/reservations/my");

// ---------- Payments / penalties (admin) ----------

export const penaltiesService = new APIClient<
  PaginationResponse<Penalty>,
  AddPenalty,
  PaginationParams
>("/users/penalties");
export const resolvePenaltyService = new APIClient<unknown>("/users/resolve-penalty");
export const makePaymentService = new APIClient<unknown, MakePayment>(
  "/users/make-payment",
);
export const paymentHistoryService = new APIClient<
  PaginationResponse<Payment>,
  unknown,
  PaginationParams
>("/users/payment-history");

// ---------- Notifications ----------

export const notificationService = new APIClient<NotificationResponse>(
  "/notifications",
);
export const notificationCountService = new APIClient<{ count: number }>(
  "/notifications/count",
);

// ---------- Attributes (book metadata) ----------

export const authorsService = new APIClient<
  PaginationResponse<{ authorId?: string; title: string; fullName: string }>,
  { title: string; fullName: string },
  PaginationParams
>("/attributes/authors");
export const genresService = new APIClient<
  PaginationResponse<{ genreId?: string; genre: string }>,
  { genre: string },
  PaginationParams
>("/attributes/genres");
export const publishersService = new APIClient<
  PaginationResponse<{ publisherId?: string; publisherName: string; address?: string }>,
  { publisherName: string; address?: string },
  PaginationParams
>("/attributes/publishers");
export const keywordsService = new APIClient<
  PaginationResponse<{ keywordId?: string; keyword: string }>,
  { keyword: string },
  PaginationParams
>("/attributes/keywords");
export const membershipTypesService = new APIClient<MembershipTypeDetail[]>(
  "/attributes/membership_types",
);
export const globalAttributesService = new APIClient<GlobalAttribute, GlobalAttribute>(
  "/attributes/global",
);

// ---------- Book editing (info, authors, genres, ISBNs, keywords) ----------

export const bookEditService = new APIClient<unknown, FormData | unknown>("/books/info");

// ---------- Cover photos ----------

export const coverPhotoUploadService = (bookInfoId: string) =>
  new APIClient<unknown, FormData>(`books/coverphoto/${bookInfoId}`);
export const coverPhotoListService = (bookInfoId: string) =>
  new APIClient<CoverPhoto[]>(`books/coverphoto/${bookInfoId}`);
export const coverPhotoDeleteService = (imageId: string) =>
  new APIClient<unknown>(`books/coverphoto/${imageId}`);
export const coverPhotoMarkProfileService = new APIClient<unknown>("books/coverphoto");

// ---------- Online books ----------

export const onlineBooksService = new APIClient<
  PaginationResponse<OnlineBookType>,
  FormData,
  PaginationParams
>("/online-books");

// ---------- Book requests ----------

export const bookRequestsService = new APIClient<
  PaginationResponse<BookRequestType>,
  Partial<BookRequestType>,
  PaginationParams
>("/book-requests");
export const bookRequestMarkService = (id: string) => new APIClient<unknown>(`book-requests/mark/${id}`);

// ---------- Lost books ----------

export const lostBooksService = new APIClient<PaginationResponse<Lost>, Lost, PaginationParams>(
  "/lost-books/",
);
export const markBookFoundService = new APIClient<unknown>("/lost-books/found/");

// ---------- Purchase entries ----------

export const purchaseEntriesService = new APIClient<
  PaginationResponse<BookPurchase>,
  unknown,
  PaginationParams
>("/purchases");

// ---------- Enrollment approval ----------

export const enrollmentFetchService = new APIClient<
  PaginationResponse<Enrollment>,
  unknown,
  PaginationParams
>("/enrollments");
export const enrollmentApproveService = new APIClient<unknown, unknown>("/enrollments/approve");

// ---------- Comment replies ----------

export const commentReplyService = new APIClient<unknown, { reply: string }>("/comments/reply");
export const commentDeleteService = (commentId: string) =>
  new APIClient<unknown>(`comments/delete/${commentId}`);
export const commentDeleteReplyService = (commentReplyId: string) =>
  new APIClient<unknown>(`comments/delete-reply/${commentReplyId}`);
