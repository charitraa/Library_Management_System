// Entity types ported from ShelfWise-Client (the old frontend of the same backend).

export interface Info {
  total: number;
  lastPage: number;
  prev: number | null;
  next: number | null;
}

export interface PaginationResponse<T> {
  data: T[];
  info: Info;
}

export enum ReservationStatus {
  Pending = "Pending",
  Cancelled = "Cancelled",
  Confirmed = "Confirmed",
}

export enum IssuanceStatus {
  Active = "Active",
  Returned = "Returned",
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  seed?: string;
  author?: string;
  publisher?: string;
  genre?: string;
  keyword?: string;
  status?: string;
  year?: string;
  expired?: boolean;
  sort?: string;
}

export interface ErrorRes {
  error?: string;
  message?: string;
}

// ---------- Users / auth ----------

export interface UserRole {
  roleId: string;
  role: "Member" | "Faculty" | "Coordinator" | "AssistantManager" | "Manager";
  precedence: number;
}

/** GET /attributes/roles: a map of role name -> precedence, used to compare a user's role against others. */
export type UserRolesMap = Record<string, number>;

export interface MembershipType {
  membershipTypeId: string;
  type: string;
  precedence?: number;
}

export interface Membership {
  membershipId: string;
  startDate: string;
  expiryDate: string;
  renewalCount: number;
  lastRenewalDate: string;
  status: "Active" | "Inactive";
  membershipTypeId: string;
  type?: MembershipType;
}

export interface UserData {
  userId?: string;
  cardId?: string;
  fullName: string;
  dob: string;
  address: string;
  contactNo: string;
  profilePicUrl: string;
  accountCreationDate: string;
  enrollMentYear: string;
  gender: "Male" | "Female" | "Others";
  roleId: string;
  role?: UserRole;
  membershipId: string;
  membership?: Membership;
  membershipValidUntil?: string;
  rollNumber: string;
  email: string;
  accountStatus: "Pending" | "Active" | "Inactive" | "Rejected" | "Suspended";
  startDate: string;
  expiryDate: string;
}

export interface User {
  data?: UserData;
}

export interface UserSummary {
  accountCreationDate: string;
  cardId: string;
  fullName: string;
  userId: string;
  profilePicUrl: string;
  status?: string;
}

export interface UserOverview {
  userId: string;
  fullName: string;
  cardId: string;
  profilePicUrl: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role: { roleId: string; role: string; precedence: number };
  penalties: Penalty[];
  reservations: Reservation[];
  issues: BookIssue[];
}

// ---------- Books ----------

export interface Author {
  authorId: string;
  title?: string;
  fullName: string;
}

export interface Genre {
  genreId: string;
  genre: string;
}

export interface Keyword {
  keywordId: string;
  keyword: string;
}

export interface Publisher {
  publisherId: string;
  publisherName?: string;
  name?: string;
  address?: string;
}

export interface Isbn {
  isbnId: string;
  bookInfoId: string;
  isbn: string;
}

export interface BookCopy {
  bookId: string;
  status: string;
  barcode: string;
  isReference: boolean;
  damagedOn?: string | null;
}

export interface BookImage {
  bookImageId: string;
  bookInfoId: string;
  imageUrl: string;
  isProfile: boolean;
}

export interface BookInfo {
  bookInfoId: string;
  callNumber?: string;
  classNumber?: string;
  bookNumber?: string;
  title: string;
  subTitle?: string;
  editionStatement?: string;
  numberOfPages?: number;
  publicationYear?: number;
  seriesStatement?: string;
  addedDate?: string;
  coverPhoto?: string | null;
  createdAt?: string;
  updatedAt?: string;
  bookAuthors?: { bookAuthorId: string; authorId: string; author: Author }[];
  publisherId?: string;
  publisher?: Publisher;
  isbns?: Isbn[];
  bookGenres?: { bookGenreId: string; genreId: string; genre: Genre }[];
  bookKeywords?: { keywordId: string; keyword: Keyword }[];
  books?: BookCopy[];
  bookImages?: BookImage[];
  ratings?: { ratingId: string; userId: string; rating: number }[];
  score?: { score: number; averageScore: number };
  reference?: string;
  total?: number;
  available?: number;
  issued?: number;
}

export interface BookStatusUser {
  fullName: string;
  profilePicUrl: string;
  userId: string;
  cardId: string;
}

export interface BookStatusResponse {
  issued: {
    issueId: string;
    checkInDate: string;
    checkOutDate: string | null;
    dueDate: string;
    renewalCount: number;
    status: string;
    bookId: string;
    userId: string;
    user: BookStatusUser;
  }[];
  reserved: {
    reservationId: string;
    userId: string;
    reservationDate: string;
    status: string;
    bookId: string;
    bookInfoId: string;
    user: BookStatusUser;
  }[];
  available: { barcode: string; isReference: boolean }[];
}

// ---------- Circulation ----------

export interface BookIssue {
  issueId: string;
  checkInDate: string;
  checkOutDate: string | null;
  dueDate: string;
  lastRenewedAt: string | null;
  renewalCount: number;
  status: "Active" | "Returned" | "Overdue" | string;
  bookId: string;
  userId: string;
  issuedBy: string;
  createdAt: string;
  updatedAt: string;
  user?: { fullName: string; profilePicUrl: string; cardId?: string };
  book?: {
    barcode?: string;
    bookInfo: { title: string; bookInfoId?: string; classNumber?: string };
  };
}

export interface Reservation {
  reservationId: string;
  userId: string;
  reservationDate: string | null;
  status: "Pending" | "Confirmed" | "Cancelled" | string;
  bookId: string | null;
  bookInfoId: string;
  createdAt: string;
  updatedAt: string;
  bookInfo?: BookInfo;
  book?: BookCopy | null;
  user?: { userId: string; cardId: string; fullName: string; profilePicUrl: string | null };
}

export interface AssignableBook {
  barcode: string;
  dueDate: string | null;
}

/** Result of scanning a member card in the circulation desk. */
export interface Circulation {
  fullName: string;
  cardId: string;
  reservationCount: number;
  issueCount: number;
  reservations: Reservation[];
  issues: (BookIssue & { due?: string })[];
}

// ---------- Payments / penalties ----------

export enum EPenaltyTypes {
  PropertyDamage = "PropertyDamage",
  Overdue = "Overdue",
}

export enum EPaymentTypes {
  Membership = "Membership",
  Penalty = "Penalty",
}

export interface AddPenalty {
  userId?: string;
  barcode: string;
  description: string;
  amount: number;
  penaltyType: EPenaltyTypes;
}

export interface MakePayment {
  userId?: string;
  amountPaid: number;
  paymentType: EPaymentTypes;
}

export interface Penalty {
  penaltyId: string;
  description: string;
  amount: number;
  status: "Pending" | "Paid" | "Cancelled" | string;
  penaltyType: "PropertyDamage" | "Overdue" | string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: UserData;
}

export interface Payment {
  paymentId: string;
  amountPaid: number;
  paymentType: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: UserData;
}

// ---------- Me (member portal) ----------

export interface MyDue {
  penaltyId?: string;
  description?: string;
  amount?: string | null;
  penaltyType?: string;
  userId?: string;
  createdAt?: string;
  status?: string;
  updatedAt?: string;
}

export interface MyPayment {
  paymentId?: string;
  amountPaid?: number;
  paymentType?: string;
  createdAt?: string;
  status?: string;
}

// ---------- Notifications ----------

export interface Notification {
  notificationId: string;
  title: string;
  body: string;
  icon: string;
  userId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  data: Notification[];
  info: {
    total: number;
    lastPage: number;
    prev: string | null;
    next: string | null;
  };
}

// ---------- Cover photos ----------

export interface CoverPhoto {
  bookImageId: string;
  bookInfoId: string;
  imageUrl: string;
  isProfile: boolean;
  createdAt?: string;
}

// ---------- Online books ----------

export interface OnlineBookType {
  onlineBookId?: string;
  bookInfoId?: string;
  title: string;
  purchaseUrl: string;
  resourceUrl: string;
}

// ---------- Book requests ----------

export enum BookRequestStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Closed = "Closed",
  Resolved = "Resolved",
}

export interface BookRequestType {
  bookRequestId: string;
  title: string;
  publisher: string;
  publicationYear: string;
  editionStatement: string;
  authors: string;
  status: string;
  user: { fullName?: string; cardId: string; profilePicUrl: string };
}

// ---------- Lost books ----------

export interface Lost {
  bookInfoId: string;
  title?: string;
  barcode: string;
  lostOn: string;
  isReference: boolean;
}

// ---------- Purchase entries ----------

export interface BookPurchase {
  purchaseId: string;
  bookInfoId: string;
  pricePerPiece: number;
  totalPieces: number;
  createdAt: string;
  updatedAt: string;
  bookInfo: { title: string; subTitle?: string };
}

// ---------- Enrollment (admin approval) ----------

export interface Enrollment {
  userId: string;
  fullName: string;
  dob: string | null;
  address: string;
  contactNo: string;
  enrollmentYear: string;
  gender: string;
  collegeId: string;
  universityId: string;
  email: string;
  roleId: string;
  profilePicUrl?: string;
}

export interface EnrollmentApproveData {
  userId: string;
  fullName: string;
  dob: string | null;
  address: string;
  contactNo: string;
  enrollmentYear: string;
  gender: string;
  rollNumber?: string;
  password?: string;
  email: string;
  roleId: string;
  universityId: string;
  collegeId: string;
  profilePicUrl?: string;
  accountStatus: string;
  startDate: string | Date;
  expiryDate: string | Date;
  membershipTypeId: string;
}

// ---------- Global attributes / membership types ----------

export interface MembershipTypeDetail {
  membershipTypeId: string;
  type: "Employee" | "Staff" | "Faculty" | "Tutor" | string;
  precedence: number;
}

export interface GlobalAttribute {
  globalAttributeId?: string;
  penaltyPerDay?: number;
  issueValidityDays?: number;
  membershipValidityMonths?: number;
  reservationLimits?: number;
  renewLimits?: number;
  issuesLimits?: number;
  facultyPenaltyPerDay?: number;
  facultyMembershipValidityMonths?: number;
  facultyIssueValidityDays?: number;
  facultyReservationLimits?: number;
  facultyRenewLimits?: number;
  facultyIssuesLimits?: number;
  updatedAt?: string;
}

/** Builds an absolute URL for images served from the backend /res/ folder. */
export function resUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  // Lazy import to avoid a cycle; RES_URL already ends with '/'.
  return `${import.meta.env.VITE_RES_URL ?? "https://libraryapi.patancollege.edu.np/res/"}${path.replace(/^\//, "")}`;
}
