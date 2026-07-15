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
  Trash2,
  Eye,
  Library,
  Loader2,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useBooks, useDeleteBook } from "@/hooks/api/use-books";
import { BookInfo } from "@/api/entities";
import { DEFAULT_PAGE_SIZE } from "@/api/constants";
import { useToast } from "@/hooks/use-toast";
import EditBookDialog from "@/components/EditBookDialog";

function bookAvailability(book: BookInfo) {
  const total = book.total ?? book.books?.length ?? 0;
  const available =
    book.available ??
    book.books?.filter((copy) => copy.status === "Available").length ??
    0;
  return { total, available };
}

export default function Books() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [bookToDelete, setBookToDelete] = useState<BookInfo | null>(null);
  const [bookToEdit, setBookToEdit] = useState<BookInfo | null>(null);
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useBooks({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(search.trim() ? { seed: search.trim() } : {}),
  });

  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook(() => {
    toast({ title: "Book deleted", description: "The title was removed from the catalog." });
    setBookToDelete(null);
  });

  const books = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;

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
              placeholder="Search by title, author, or keyword..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Book Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title & Author</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-destructive">
                    Failed to load books{error?.message ? `: ${error.message}` : "."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && books.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No books found.
                  </TableCell>
                </TableRow>
              )}
              {books.map((book) => {
                const { total, available } = bookAvailability(book);
                return (
                  <TableRow key={book.bookInfoId}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{book.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {book.bookAuthors
                            ?.map((ba) => ba.author?.fullName)
                            .filter(Boolean)
                            .join(", ") || "Unknown author"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {book.bookGenres?.slice(0, 2).map((bg) => (
                          <Badge key={bg.bookGenreId} variant="secondary">
                            {bg.genre?.genre}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {book.publisher?.publisherName ?? book.publisher?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={available > 0 ? "outline" : "default"}
                        className={
                          available > 0
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : ""
                        }
                      >
                        {available > 0 ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {available}/{total}
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
                            <Link to={`/books/${book.bookInfoId}`}>
                              <Eye className="h-4 w-4" /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2"
                            onSelect={() => setBookToEdit(book)}
                          >
                            <Pencil className="h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" asChild>
                            <Link to={`/books/${book.bookInfoId}/copies`}>
                              <Library className="h-4 w-4" /> Manage Copies
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive focus:bg-red-50"
                            onSelect={() => setBookToDelete(book)}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
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
                    aria-disabled={page <= 1}
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
                    aria-disabled={page >= lastPage}
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

      {/* Delete confirmation */}
      <AlertDialog open={!!bookToDelete} onOpenChange={(open) => !open && setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete “{bookToDelete?.title}”? This removes the
              title and its copies from the catalog and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                if (bookToDelete) deleteBook(bookToDelete.bookInfoId);
              }}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {bookToEdit && (
        <EditBookDialog
          book={bookToEdit}
          open={!!bookToEdit}
          onOpenChange={(open) => !open && setBookToEdit(null)}
        />
      )}
    </Layout>
  );
}
