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
import { Search, Plus, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  Checkbox,
} from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAddLostBook, useDeleteLostBook, useLostBooks, useMarkBookFound } from "@/hooks/api/use-lost-books";
import { DEFAULT_PAGE_SIZE } from "@/api/constants";
import { useToast } from "@/hooks/use-toast";

export default function LostBooks() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ bookInfoId: "", barcode: "", isReference: false });

  const { data, isLoading, isError, error } = useLostBooks({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(search.trim() ? { seed: search.trim() } : {}),
  });

  const { mutate: addLostBook, isPending: isAdding } = useAddLostBook(() => {
    toast({ title: "Book marked as lost" });
    setAddOpen(false);
    setForm({ bookInfoId: "", barcode: "", isReference: false });
  });
  const { mutate: markFound, isPending: isMarkingFound } = useMarkBookFound(() =>
    toast({ title: "Book marked as found" }),
  );
  const { mutate: deleteLost, isPending: isDeleting } = useDeleteLostBook(() =>
    toast({ title: "Entry removed" }),
  );

  const entries = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;

  const handleAdd = () => {
    if (!form.bookInfoId.trim() || !form.barcode.trim()) {
      toast({ title: "Book ID and barcode are required", variant: "destructive" });
      return;
    }
    addLostBook(
      {
        bookInfoId: form.bookInfoId,
        barcode: form.barcode,
        isReference: form.isReference,
        lostOn: new Date().toISOString(),
      },
      {
        onError: (err) =>
          toast({
            title: "Failed to report lost book",
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
            <h1 className="text-3xl font-bold tracking-tight">Lost Books</h1>
            <p className="text-muted-foreground">
              Track copies reported missing and mark them found once returned.
            </p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Report Lost Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Lost Book</DialogTitle>
                <DialogDescription>Mark a physical copy as lost by its barcode.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="lost-bookinfoid">Book ID (bookInfoId) *</Label>
                  <Input
                    id="lost-bookinfoid"
                    value={form.bookInfoId}
                    onChange={(e) => setForm((prev) => ({ ...prev, bookInfoId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lost-barcode">Barcode *</Label>
                  <Input
                    id="lost-barcode"
                    value={form.barcode}
                    onChange={(e) => setForm((prev) => ({ ...prev, barcode: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="lost-reference"
                    checked={form.isReference}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({ ...prev, isReference: checked === true }))
                    }
                  />
                  <Label htmlFor="lost-reference" className="font-normal">
                    This is a reference-only copy
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} disabled={isAdding}>
                  {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Report Lost
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or barcode..."
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
                <TableHead>Barcode</TableHead>
                <TableHead>Lost On</TableHead>
                <TableHead>Type</TableHead>
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
                    Failed to load lost books{error?.message ? `: ${error.message}` : "."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No lost books reported.
                  </TableCell>
                </TableRow>
              )}
              {entries.map((entry) => (
                <TableRow key={entry.barcode}>
                  <TableCell className="font-medium">{entry.title ?? entry.bookInfoId}</TableCell>
                  <TableCell className="font-mono text-sm">{entry.barcode}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {entry.lostOn ? new Date(entry.lostOn).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    {entry.isReference ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Reference
                      </Badge>
                    ) : (
                      <Badge variant="outline">Circulating</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        disabled={isMarkingFound}
                        onClick={() => markFound(entry.bookInfoId)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Found
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-red-50"
                        disabled={isDeleting}
                        onClick={() => deleteLost(entry.bookInfoId)}
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
    </Layout>
  );
}
