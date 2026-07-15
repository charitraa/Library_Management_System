// API endpoints of the PCPS College LMS backend (same backend as ShelfWise-Client).
export const BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://libraryapi.patancollege.edu.np/api";
// Static resources (cover photos, profile pictures) are served from /res/.
export const RES_URL =
  import.meta.env.VITE_RES_URL ?? "https://libraryapi.patancollege.edu.np/res/";

export enum EUserRoles {
  Manager = "Manager",
  AssistantManager = "AssistantManager",
  Coordinator = "Coordinator",
  Faculty = "Faculty",
  Member = "Member",
}

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;
export const DEFAULT_PAGE_SIZE = 15;

// React Query cache keys
export const USER_CACHE_KEY = ["me"];
export const USER_ROLES_KEY = ["roles"];
export const DETAILED_USER_ROLES_KEY = ["roles_detailed"];
export const BOOKS_CACHE_KEY = ["books"];
export const BOOK_OVERVIEW_CACHE_KEY = ["book-overview"];
export const AUTHORS_CACHE_KEY = ["authors"];
export const GENRES_CACHE_KEY = ["genres"];
export const KEYWORD_CACHE_KEY = ["keywords"];
export const PUBLISHERS_CACHE_KEY = ["publishers"];
export const USERS_CACHE_KEY = ["users"];
export const USER_OVERVIEW_CACHE_KEY = ["user-overview"];
export const ISSUANCE_CACHE_KEY = ["issuance"];
export const RENEWAL_CACHE_KEY = ["renewal"];
export const CIRCULATION_CACHE_KEY = ["circulation"];
export const RESERVATION_CACHE_KEY = ["reservations"];
export const ASSIGNABLE_RESERVATION_CACHE_KEY = ["assignable_reservations"];
export const PAYMENT_CACHE_KEY = ["payments"];
export const PENALTIES_CACHE_KEY = ["penalties"];
export const RESOLVE_CACHE_KEY = ["resolves"];
export const NOTIFICATION_CACHE_KEY = ["notifications"];
export const NOTIFICATION_COUNT_CACHE_KEY = ["notification_count"];
export const MY_BOOKS_CACHE_KEY = ["mybook"];
export const MY_DUES_CACHE_KEY = ["dues"];
export const MY_PAYMENT_CACHE_KEY = ["payment"];
export const ENROLL_CACHE_KEY = ["enrollments"];
export const DETAILED_MEMBER_TYPE_KEY = ["memberTypes_detailed"];
export const ONLINE_BOOKS_CACHE_KEY = ["online-books"];
export const BOOK_REQUEST_CACHE_KEY = ["book_requests"];
export const LOST_CACHE_KEY = ["lost_books"];
export const PURCHASE_CACHE_KEY = ["purchase_entry"];
export const GLOBAL_ATTRIBUTES_CACHE_KEY = ["global_attributes"];
