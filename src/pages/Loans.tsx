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
import {
  Search,
  Plus,
  MoreHorizontal,
  RotateCcw,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useIssues, useRenew, useReturn } from "@/hooks/api/use-circulation";
import { DEFAULT_PAGE_SIZE } from "@/api/constants";
import { useToast } from "@/hooks/use-toast";

function isOverdue(dueDate: string, status: string) {
  return status === "Active" && new Date(dueDate).getTime() < Date.now();
}

export default function Loans() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("Active");
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useIssues({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(status !== "All" ? { status } : {}),
    ...(search.trim() ? { seed: search.trim() } : {}),
  });

  const onActionError = (err: any) =>
    toast({
      title: "Action failed",
      description: err.response?.data?.error ?? err.message,
      variant: "destructive",
    });

  const { mutate: renew, isPending: isRenewing } = useRenew({
    onSuccess: () => toast({ title: "Loan renewed" }),
    onError: onActionError,
  });
  const { mutate: returnBook, isPending: isReturning } = useReturn({
    onSuccess: () => toast({ title: "Book returned" }),
    onError: onActionError,
  });

  const loans = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
            <p className="text-muted-foreground">
              Track borrowed books, manage return dates, and handle overdue items.
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link to="/loans/new">
              <Plus className="h-4 w-4" />
              New Physical Loan
            </Link>
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by book or borrower..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loan Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Renewals</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-destructive">
                    Failed to load loans{error?.message ? `: ${error.message}` : "."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No loans found.
                  </TableCell>
                </TableRow>
              )}
              {loans.map((loan) => {
                const overdue = isOverdue(loan.dueDate, loan.status);
                return (
                  <TableRow key={loan.issueId}>
                    <TableCell className="font-medium">
                      {loan.book?.bookInfo?.title ?? loan.bookId}
                    </TableCell>
                    <TableCell>{loan.user?.fullName ?? loan.userId}</TableCell>
                    <TableCell>
                      {loan.checkInDate ? new Date(loan.checkInDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>{loan.renewalCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          overdue
                            ? "destructive"
                            : loan.status === "Returned"
                              ? "secondary"
                              : "default"
                        }
                        className={
                          overdue
                            ? ""
                            : loan.status === "Active"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : loan.status === "Returned"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none"
                                : ""
                        }
                      >
                        {overdue ? "Overdue" : loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isRenewing || isReturning}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {loan.status === "Active" && (
                            <>
                              <DropdownMenuItem
                                className="gap-2 text-emerald-600"
                                onSelect={() => returnBook({ issueId: loan.issueId })}
                              >
                                <CheckCircle2 className="h-4 w-4" /> Return Book
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onSelect={() => renew({ issueId: loan.issueId })}
                              >
                                <RotateCcw className="h-4 w-4" /> Renew Loan
                              </DropdownMenuItem>
                            </>
                          )}
                          {loan.status !== "Active" && (
                            <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
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
