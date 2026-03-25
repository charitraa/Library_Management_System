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
  Edit,
  Trash2,
  Eye,
  Library,
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

const books = [
  {
    id: "BK-001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic Literature",
    status: "Available",
    isbn: "978-0743273565",
    copies: 5,
  },
  {
    id: "BK-002",
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    status: "On Loan",
    isbn: "978-0451524935",
    copies: 3,
  },
  {
    id: "BK-003",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Classic Literature",
    status: "Available",
    isbn: "978-0316769488",
    copies: 4,
  },
  {
    id: "BK-004",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    status: "Reserved",
    isbn: "978-0061120084",
    copies: 2,
  },
  {
    id: "BK-005",
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "Dystopian",
    status: "Available",
    isbn: "978-0060850524",
    copies: 6,
  },
  {
    id: "BK-006",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    status: "On Loan",
    isbn: "978-0547928227",
    copies: 8,
  },
];

export default function Books() {
  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Book Management</h1>
            <p className="text-muted-foreground">
              Manage library inventory, add new titles, and track book status.
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link to="/books/new">
              <Plus className="h-4 w-4" />
              Add New Book
            </Link>
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, author, or ISBN..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Sort
            </Button>
          </div>
        </div>

        {/* Book Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title & Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-mono text-xs">{book.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{book.title}</span>
                      <span className="text-xs text-muted-foreground">{book.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        book.status === "Available"
                          ? "outline"
                          : book.status === "On Loan"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        book.status === "Available"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : ""
                      }
                    >
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{book.copies}</TableCell>
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
                          <Link to={`/books/${book.id}`}>
                            <Eye className="h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link to={`/books/${book.id}`}>
                            <Edit className="h-4 w-4" /> Edit Book
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link to={`/books/${book.id}/copies`}>
                            <Library className="h-4 w-4" /> Manage Copies
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive focus:bg-red-50">
                          <Trash2 className="h-4 w-4" /> Delete
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
