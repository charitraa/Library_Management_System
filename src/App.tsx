import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import ManageCopies from "./pages/ManageCopies";
import AuditLogs from "./pages/AuditLogs";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import AddUser from "./pages/AddUser";
import Loans from "./pages/Loans";
import LoanDetails from "./pages/LoanDetails";
import PhysicalLoan from "./pages/PhysicalLoan";
import Reservations from "./pages/Reservations";
import Fines from "./pages/Fines";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AdminProfile from "./pages/AdminProfile";
import ManageAdmins from "./pages/ManageAdmins";
import Login from "./pages/Login";
import PortalDashboard from "./pages/PortalDashboard";
import PortalBrowse from "./pages/PortalBrowse";
import PortalLoans from "./pages/PortalLoans";
import PortalReservations from "./pages/PortalReservations";
import PortalFines from "./pages/PortalFines";
import PortalNotifications from "./pages/PortalNotifications";
import PortalProfile from "./pages/PortalProfile";
import PortalBookDetails from "./pages/PortalBookDetails";
import Placeholder from "./pages/Placeholder";
import PortalLayout from "./components/PortalLayout";
import NotFound from "./pages/NotFound";

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

          {/* Admin Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<AddBook />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/books/:id/copies" element={<ManageCopies />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loans/:id" element={<LoanDetails />} />
          <Route path="/loans/new" element={<PhysicalLoan />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/fines" element={<Fines />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/admins" element={<ManageAdmins />} />

          {/* User Portal Routes */}
          <Route path="/portal" element={<PortalDashboard />} />
          <Route path="/portal/browse" element={<PortalBrowse />} />
          <Route path="/portal/loans" element={<PortalLoans />} />
          <Route path="/portal/reservations" element={<PortalReservations />} />
          <Route path="/portal/fines" element={<PortalFines />} />
          <Route path="/portal/notifications" element={<PortalNotifications />} />
          <Route path="/portal/profile" element={<PortalProfile />} />
          <Route path="/portal/books/:id" element={<PortalBookDetails />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
