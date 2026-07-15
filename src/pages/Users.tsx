import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Eye, UserCheck, UserX, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useUsers, useUpdateAccountStatus } from "@/hooks/api/use-users";
import { resUrl } from "@/api/entities";
import { DEFAULT_PAGE_SIZE } from "@/api/constants";
import { useToast } from "@/hooks/use-toast";

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

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useUsers({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(search.trim() ? { seed: search.trim() } : {}),
  });

  const { mutate: updateStatus } = useUpdateAccountStatus();

  const users = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;

  const setStatus = (userId: string, status: string) => {
    updateStatus(
      { userId, status },
      {
        onSuccess: () => toast({ title: `Account ${status.toLowerCase()}` }),
        onError: (err) =>
          toast({
            title: "Failed to update status",
            description: err.response?.data?.error ?? err.message,
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage library members, their access levels, and account status.
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link to="/users/add">
              <Plus className="h-4 w-4" />
              Add New User
            </Link>
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or card ID..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Card ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-destructive">
                    Failed to load users{error?.message ? `: ${error.message}` : "."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-mono text-xs">{user.cardId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={resUrl(user.profilePicUrl)} />
                        <AvatarFallback>{initialsOf(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? "default" : "destructive"}
                      className={
                        user.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : user.status === "Pending"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            : ""
                      }
                    >
                      {user.status ?? "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.accountCreationDate
                      ? new Date(user.accountCreationDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link to={`/users/${user.userId}`}>
                            <Eye className="h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        {user.status === "Active" ? (
                          <DropdownMenuItem
                            className="gap-2 text-amber-600"
                            onSelect={() => setStatus(user.userId, "Suspended")}
                          >
                            <UserX className="h-4 w-4" /> Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="gap-2 text-emerald-600"
                            onSelect={() => setStatus(user.userId, "Active")}
                          >
                            <UserCheck className="h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t bg-slate-50/30">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={page >= lastPage ? "pointer-events-none opacity-50" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(lastPage, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </Layout>
  );
}
