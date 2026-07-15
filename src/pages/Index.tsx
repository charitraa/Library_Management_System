import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Book, Users, ClipboardList, CalendarCheck, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMe } from "@/hooks/api/use-auth";
import { useBooks } from "@/hooks/api/use-books";
import { useIssues } from "@/hooks/api/use-circulation";
import { useUsers } from "@/hooks/api/use-users";
import { useReservations } from "@/hooks/api/use-reservations";
import { resUrl } from "@/api/entities";

function initialsOf(name?: string) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export default function Index() {
  const { data: me } = useMe();
  const { data: books, isLoading: isLoadingBooks } = useBooks({ page: 1, pageSize: 1 });
  const { data: activeLoans, isLoading: isLoadingLoans } = useIssues({
    page: 1,
    pageSize: 1,
    status: "Active",
  });
  const { data: users, isLoading: isLoadingUsers } = useUsers({ page: 1, pageSize: 5 });
  const { data: pendingReservations, isLoading: isLoadingReservations } = useReservations({
    page: 1,
    pageSize: 5,
    status: "Pending",
  });

  const stats = [
    {
      title: "Total Books",
      value: books?.info?.total,
      icon: Book,
      color: "text-blue-600",
      bg: "bg-blue-100",
      isLoading: isLoadingBooks,
    },
    {
      title: "Active Loans",
      value: activeLoans?.info?.total,
      icon: ClipboardList,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      isLoading: isLoadingLoans,
    },
    {
      title: "Total Members",
      value: users?.info?.total,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
      isLoading: isLoadingUsers,
    },
    {
      title: "Pending Reservations",
      value: pendingReservations?.info?.total,
      icon: CalendarCheck,
      color: "text-amber-600",
      bg: "bg-amber-100",
      isLoading: isLoadingReservations,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back, {me?.data?.fullName ?? "Admin"}. Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="gap-2" asChild>
              <Link to="/loans/new">
                <Plus className="h-4 w-4" />
                New Loan
              </Link>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/books/new">
                <Plus className="h-4 w-4" />
                Add Book
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className={`rounded-lg ${stat.bg} p-2 w-fit`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {stat.isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      stat.value ?? "—"
                    )}
                  </h2>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Members</CardTitle>
              <CardDescription>Most recently added library members.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingUsers && (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                )}
                {!isLoadingUsers && (users?.data ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No members yet.</p>
                )}
                {(users?.data ?? []).map((user) => (
                  <div key={user.userId} className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={resUrl(user.profilePicUrl)} />
                        <AvatarFallback>{initialsOf(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{user.fullName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{user.cardId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">
                        {user.accountCreationDate
                          ? new Date(user.accountCreationDate).toLocaleDateString()
                          : ""}
                      </span>
                      <Button variant="link" size="sm" className="h-auto p-0 text-[10px]" asChild>
                        <Link to={`/users/${user.userId}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="ghost" className="w-full text-xs" asChild>
                <Link to="/users">View All Members</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Reservations</CardTitle>
              <CardDescription>Awaiting a copy to be assigned.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingReservations && (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                )}
                {!isLoadingReservations && (pendingReservations?.data ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pending reservations.
                  </p>
                )}
                {(pendingReservations?.data ?? []).map((reservation) => (
                  <div key={reservation.reservationId} className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-medium leading-none">
                        <span className="font-bold text-foreground">{reservation.user?.fullName}</span>{" "}
                        reserved{" "}
                        <span className="italic text-muted-foreground text-[10px]">
                          "{reservation.bookInfo?.title}"
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {reservation.reservationDate
                          ? new Date(reservation.reservationDate).toLocaleDateString()
                          : new Date(reservation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {reservation.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="ghost" className="w-full text-xs" asChild>
                <Link to="/reservations">View All Reservations</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
