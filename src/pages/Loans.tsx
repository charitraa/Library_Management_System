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
  Filter,
  MoreHorizontal,
  RotateCcw,
  Clock,
  CheckCircle2,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

const loans = [
  {
    id: "LN-8401",
    book: "The Great Gatsby",
    borrower: "John Doe",
    issueDate: "2024-03-01",
    dueDate: "2024-03-15",
    status: "Active",
  },
  {
    id: "LN-8402",
    book: "1984",
    borrower: "Jane Smith",
    issueDate: "2024-02-15",
    dueDate: "2024-03-01",
    status: "Overdue",
  },
  {
    id: "LN-8403",
    book: "The Hobbit",
    borrower: "Alice Johnson",
    issueDate: "2024-03-05",
    dueDate: "2024-03-19",
    status: "Active",
  },
  {
    id: "LN-8404",
    book: "Brave New World",
    borrower: "Michael Wilson",
    issueDate: "2024-03-10",
    dueDate: "2024-03-24",
    status: "Active",
  },
  {
    id: "LN-8405",
    book: "To Kill a Mockingbird",
    borrower: "Robert Brown",
    issueDate: "2024-02-10",
    dueDate: "2024-02-24",
    status: "Returned",
  },
];

export default function Loans() {
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Loan Request
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-sm md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by book or borrower..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Status
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Clock className="h-4 w-4" />
              History
            </Button>
          </div>
        </div>

        {/* Loan Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Loan ID</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-mono text-xs">{loan.id}</TableCell>
                  <TableCell className="font-medium">{loan.book}</TableCell>
                  <TableCell>{loan.borrower}</TableCell>
                  <TableCell>{loan.issueDate}</TableCell>
                  <TableCell>{loan.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        loan.status === "Overdue"
                          ? "destructive"
                          : loan.status === "Returned"
                          ? "secondary"
                          : "default"
                      }
                      className={
                        loan.status === "Active"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : loan.status === "Returned"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none"
                          : ""
                      }
                    >
                      {loan.status}
                    </Badge>
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
                        {loan.status !== "Returned" && (
                          <DropdownMenuItem className="gap-2 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" /> Return Book
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2">
                          <RotateCcw className="h-4 w-4" /> Renew Loan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link to={`/loans/${loan.id}`}>
                            <Eye className="h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
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
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </Layout>
  );
}
