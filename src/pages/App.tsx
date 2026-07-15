import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./Index";
import Books from "./Books";
import BookDetails from "./BookDetails";
import AddBook from "./AddBook";
import ManageCopies from "./ManageCopies";
import Users from "./Users";
import UserDetails from "./UserDetails";
import AddUser from "./AddUser";
import Loans from "./Loans";
import PhysicalLoan from "./PhysicalLoan";
import Reservations from "./Reservations";
import Fines from "./Fines";
import Notifications from "./Notifications";
import AdminProfile from "./AdminProfile";
import Login from "./Login";
import PortalDashboard from "./PortalDashboard";
import PortalBrowse from "./PortalBrowse";
import PortalLoans from "./PortalLoans";
import PortalReservations from "./PortalReservations";
import PortalFines from "./PortalFines";
import PortalNotifications from "./PortalNotifications";
import PortalProfile from "./PortalProfile";
import PortalBookDetails from "./PortalBookDetails";
import NotFound from "./NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import OnlineBooks from "./OnlineBooks";
import BookRequests from "./BookRequests";
import LostBooks from "./LostBooks";
import PurchaseEntries from "./PurchaseEntries";
import EnrollmentApprovals from "./EnrollmentApprovals";
import Attributes from "./Attributes";
import PortalRequestBook from "./PortalRequestBook";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes (staff only) */}
          <Route element={<ProtectedRoute staffOnly />}>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/new" element={<AddBook />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/books/:id/copies" element={<ManageCopies />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/new" element={<PhysicalLoan />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/fines" element={<Fines />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/online-books" element={<OnlineBooks />} />
            <Route path="/book-requests" element={<BookRequests />} />
            <Route path="/lost-books" element={<LostBooks />} />
            <Route path="/purchase-entries" element={<PurchaseEntries />} />
            <Route path="/enrollments" element={<EnrollmentApprovals />} />
            <Route path="/attributes" element={<Attributes />} />
          </Route>

          {/* User Portal Routes (any logged-in user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/portal" element={<PortalDashboard />} />
            <Route path="/portal/browse" element={<PortalBrowse />} />
            <Route path="/portal/loans" element={<PortalLoans />} />
            <Route path="/portal/reservations" element={<PortalReservations />} />
            <Route path="/portal/fines" element={<PortalFines />} />
            <Route path="/portal/notifications" element={<PortalNotifications />} />
            <Route path="/portal/profile" element={<PortalProfile />} />
            <Route path="/portal/books/:id" element={<PortalBookDetails />} />
            <Route path="/portal/request-book" element={<PortalRequestBook />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
