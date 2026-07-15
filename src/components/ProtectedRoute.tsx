import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useIsStaff } from "@/hooks/api/use-auth";

interface ProtectedRouteProps {
  /** Restrict to roles that outrank Member (Manager/AssistantManager/Coordinator, or any future staff role). */
  staffOnly?: boolean;
}

export default function ProtectedRoute({ staffOnly = false }: ProtectedRouteProps) {
  const { user, isStaff, isLoading, isError } = useIsStaff();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (staffOnly && !isStaff) {
    return <Navigate to="/portal" replace />;
  }

  return <Outlet />;
}
