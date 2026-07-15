import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Book,
  Calendar,
  Shield,
  CreditCard,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDetailedRoles,
  useUpdateAccountStatus,
  useUpdateUserRole,
  useUserOverview,
} from "@/hooks/api/use-users";
import { resUrl } from "@/api/entities";
import { useToast } from "@/hooks/use-toast";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: user, isLoading, isError, error } = useUserOverview(id);
  const { data: roles } = useDetailedRoles();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateAccountStatus();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (isError || !user) {
    return (
      <Layout>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-destructive">
            Failed to load user{error?.message ? `: ${error.message}` : "."}
          </p>
          <Button variant="outline" onClick={() => navigate("/users")}>
            Back to Users
          </Button>
        </div>
      </Layout>
    );
  }

  const initials =
    user.fullName
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const pendingPenalties = (user.penalties ?? []).filter((p) => p.status === "Pending");
  const pendingTotal = pendingPenalties.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  const activeIssues = (user.issues ?? []).filter((i) => i.status === "Active");

  const handleRoleChange = (roleId: string) => {
    updateRole(
      { userId: user.userId, roleId },
      {
        onSuccess: () => toast({ title: "Role updated" }),
        onError: (err) =>
          toast({
            title: "Failed to update role",
            description: err.response?.data?.error ?? err.message,
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Profile Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg mb-4">
                  <AvatarImage src={resUrl(user.profilePicUrl)} />
                  <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role?.role ?? "Member"}
                </CardDescription>
                <Badge className="mt-2" variant="outline">
                  {user.cardId}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Joined{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Active Loans</p>
                    <p className="text-lg font-bold">{activeIssues.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pending Fines</p>
                    <p className={`text-lg font-bold ${pendingTotal > 0 ? "text-destructive" : "text-emerald-600"}`}>
                      Rs. {pendingTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Role</p>
                  <Select
                    value={user.roleId}
                    onValueChange={handleRoleChange}
                    disabled={isUpdatingRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {(roles ?? []).map((role) => (
                        <SelectItem key={role.roleId} value={role.roleId}>
                          {role.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 gap-2">
                <Button
                  variant="outline"
                  className="flex-1 text-xs"
                  disabled={isUpdatingStatus}
                  onClick={() =>
                    updateStatus(
                      { userId: user.userId, status: "Active" },
                      { onSuccess: () => toast({ title: "Account activated" }) },
                    )
                  }
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-xs text-destructive hover:text-destructive"
                  disabled={isUpdatingStatus}
                  onClick={() =>
                    updateStatus(
                      { userId: user.userId, status: "Suspended" },
                      { onSuccess: () => toast({ title: "Account suspended" }) },
                    )
                  }
                >
                  Suspend
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* User Details Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="loans">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                    <TabsTrigger value="loans" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-8">Loans</TabsTrigger>
                    <TabsTrigger value="reservations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-8">Reservations</TabsTrigger>
                    <TabsTrigger value="penalties" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-8">Penalties</TabsTrigger>
                  </TabsList>

                  <TabsContent value="loans" className="p-6">
                    <div className="space-y-4">
                      {(user.issues ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No loans recorded for this member.
                        </p>
                      )}
                      {(user.issues ?? []).map((issue) => (
                        <div key={issue.issueId} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Book className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {issue.book?.bookInfo?.title ?? issue.bookId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Borrowed on {new Date(issue.checkInDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-emerald-600">
                              Due {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : "—"}
                            </p>
                            <Badge variant="outline" className="mt-1">{issue.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="reservations" className="p-6">
                    <div className="space-y-4">
                      {(user.reservations ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No reservations for this member.
                        </p>
                      )}
                      {(user.reservations ?? []).map((reservation) => (
                        <div key={reservation.reservationId} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <CalendarCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {reservation.bookInfo?.title ?? reservation.bookInfoId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {reservation.reservationDate
                                  ? new Date(reservation.reservationDate).toLocaleDateString()
                                  : "Date not set"}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{reservation.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="penalties" className="p-6">
                    <div className="space-y-4">
                      {(user.penalties ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No penalties for this member.
                        </p>
                      )}
                      {(user.penalties ?? []).map((penalty) => (
                        <div key={penalty.penaltyId} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{penalty.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {penalty.penaltyType} ·{" "}
                                {penalty.createdAt
                                  ? new Date(penalty.createdAt).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">Rs. {penalty.amount}</p>
                            <Badge
                              variant={penalty.status === "Pending" ? "destructive" : "outline"}
                              className="mt-1"
                            >
                              {penalty.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
