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
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Pencil, Loader2, ExternalLink, Link as LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useAddOnlineBook,
  useDeleteOnlineBook,
  useOnlineBooks,
  useUpdateOnlineBook,
} from "@/hooks/api/use-online-books";
import { DEFAULT_PAGE_SIZE } from "@/api/constants";
import { OnlineBookType } from "@/api/entities";
import { useToast } from "@/hooks/use-toast";

export default function OnlineBooks() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<OnlineBookType | null>(null);
  const [toDelete, setToDelete] = useState<OnlineBookType | null>(null);
  const [form, setForm] = useState({ title: "", purchaseUrl: "", resourceUrl: "", bookInfoId: "" });

  const { data, isLoading, isError, error } = useOnlineBooks({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(search.trim() ? { seed: search.trim() } : {}),
  });

  const { mutate: addOnlineBook, isPending: isAdding } = useAddOnlineBook(() => {
    toast({ title: "Online book added" });
    setAddOpen(false);
    setForm({ title: "", purchaseUrl: "", resourceUrl: "", bookInfoId: "" });
  });
  const { mutate: deleteOnlineBook, isPending: isDeleting } = useDeleteOnlineBook(() => {
    toast({ title: "Online book removed" });
    setToDelete(null);
  });
  const { mutate: updateOnlineBook, isPending: isUpdating } = useUpdateOnlineBook(() => {
    toast({ title: "Online book updated" });
    setEditing(null);
  });

  const books = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;

  const handleAdd = () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("purchaseUrl", form.purchaseUrl);
    formData.append("resourceUrl", form.resourceUrl);
    if (form.bookInfoId) formData.append("bookInfoId", form.bookInfoId);
    addOnlineBook(formData, {
      onError: (err) =>
        toast({
          title: "Failed to add online book",
          description: err.response?.data?.error ?? err.message,
          variant: "destructive",
        }),
    });
  };

  const startEdit = (book: OnlineBookType) => {
    setEditing(book);
    setForm({
      title: book.title,
      purchaseUrl: book.purchaseUrl,
      resourceUrl: book.resourceUrl,
      bookInfoId: book.bookInfoId ?? "",
    });
  };

  const handleUpdate = () => {
    if (!editing?.onlineBookId || !form.title.trim()) return;
    updateOnlineBook(
      { onlineBookId: editing.onlineBookId, title: form.title, purchaseUrl: form.purchaseUrl, resourceUrl: form.resourceUrl },
      {
        onError: (err) =>
          toast({
            title: "Failed to update online book",
            description: err.response?.data?.error ?? err.message,
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Online Books</h1>
            <p className="text-muted-foreground">
              Manage e-book purchase and resource links available to members.
            </p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Online Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Online Book</DialogTitle>
                <DialogDescription>Link an e-book purchase or resource URL.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ob-title">Title *</Label>
                  <Input
                    id="ob-title"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-bookinfoid">Linked Catalog Book ID (optional)</Label>
                  <Input
                    id="ob-bookinfoid"
                    placeholder="bookInfoId"
                    value={form.bookInfoId}
                    onChange={(e) => setForm((prev) => ({ ...prev, bookInfoId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-purchase">Purchase URL</Label>
                  <Input
                    id="ob-purchase"
                    placeholder="https://..."
                    value={form.purchaseUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, purchaseUrl: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-resource">Resource URL</Label>
                  <Input
                    id="ob-resource"
                    placeholder="https://..."
                    value={form.resourceUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, resourceUrl: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} disabled={isAdding}>
                  {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search online books..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Purchase Link</TableHead>
                <TableHead>Resource Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-destructive">
                    Failed to load online books{error?.message ? `: ${error.message}` : "."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && books.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No online books found.
                  </TableCell>
                </TableRow>
              )}
              {books.map((book) => (
                <TableRow key={book.onlineBookId}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>
                    {book.purchaseUrl ? (
                      <a
                        href={book.purchaseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Purchase
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {book.resourceUrl ? (
                      <a
                        href={book.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        <LinkIcon className="h-3.5 w-3.5" /> Resource
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEdit(book)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-red-50"
                        onClick={() => setToDelete(book)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Online Book</DialogTitle>
            <DialogDescription>Update the links for “{editing?.title}”.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ob-edit-title">Title *</Label>
              <Input
                id="ob-edit-title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ob-edit-purchase">Purchase URL</Label>
              <Input
                id="ob-edit-purchase"
                value={form.purchaseUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, purchaseUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ob-edit-resource">Resource URL</Label>
              <Input
                id="ob-edit-resource"
                value={form.resourceUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, resourceUrl: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove online book</AlertDialogTitle>
            <AlertDialogDescription>
              Remove “{toDelete?.title}” from the online books list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                if (toDelete?.onlineBookId) deleteOnlineBook(toDelete.onlineBookId);
              }}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
