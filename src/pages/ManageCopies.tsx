import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Loader2, BookMarked } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddCopies,
  useBookCopies,
  useBookInfo,
  useDeleteCopy,
  BookCopyRow,
} from "@/hooks/api/use-books";

function getStatusBadge(status: string) {
  switch (status) {
    case "Available":
      return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Available</Badge>;
    case "Issued":
    case "On Loan":
      return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">Issued</Badge>;
    case "Damaged":
    case "Lost":
      return <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">{status}</Badge>;
    case "Reserved":
      return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">Reserved</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

const ManageCopies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: book } = useBookInfo(id);
  const { data: copies, isLoading, isError, error } = useBookCopies(id);

  const [addOpen, setAddOpen] = useState(false);
  const [barcodesInput, setBarcodesInput] = useState("");
  const [pricePerPiece, setPricePerPiece] = useState("");
  const [copyToDelete, setCopyToDelete] = useState<BookCopyRow | null>(null);

  const { mutate: addCopies, isPending: isAdding } = useAddCopies(() => {
    toast({ title: "Copies added successfully" });
    setAddOpen(false);
    setBarcodesInput("");
    setPricePerPiece("");
  });

  const { mutate: deleteCopy, isPending: isDeleting } = useDeleteCopy(() => {
    toast({ title: "Copy removed" });
    setCopyToDelete(null);
  });

  const handleAddCopies = () => {
    const barcodes = barcodesInput
      .split(/[,\n]/)
      .map((b) => b.trim())
      .filter(Boolean);
    if (barcodes.length === 0) {
      toast({ title: "Enter at least one barcode", variant: "destructive" });
      return;
    }
    addCopies(
      {
        bookInfoId: id!,
        totalPieces: barcodes.length,
        pricePerPiece: Number(pricePerPiece || 0),
        barcodes,
      },
      {
        onError: (err) =>
          toast({
            title: "Failed to add copies",
            description: err.response?.data?.error ?? err.message,
            variant: "destructive",
          }),
      },
    );
  };

  const copyRows = copies ?? [];
  const availableCount = copyRows.filter((c) => c.status === "Available").length;
  const issuedCount = copyRows.filter((c) => c.status !== "Available").length;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Copies</h1>
              <p className="text-muted-foreground mt-1">
                {book?.title ?? "Loading title..."}
              </p>
            </div>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Copies
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Copies</DialogTitle>
                <DialogDescription>
                  Enter one barcode per new physical copy of this book.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="barcodes">Barcodes (comma or newline separated)</Label>
                  <Textarea
                    id="barcodes"
                    placeholder={"100001\n100002"}
                    value={barcodesInput}
                    onChange={(e) => setBarcodesInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price Per Copy</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="500"
                    value={pricePerPiece}
                    onChange={(e) => setPricePerPiece(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCopies} disabled={isAdding}>
                  {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Copies
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Copies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{copyRows.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableCount}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Issued / Other</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issuedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Physical Inventory</CardTitle>
            <CardDescription>Individual copies of this book in the library system.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference Copy</TableHead>
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
                      Failed to load copies{error?.message ? `: ${error.message}` : "."}
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !isError && copyRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No physical copies registered.
                    </TableCell>
                  </TableRow>
                )}
                {copyRows.map((copy) => (
                  <TableRow key={copy.bookId} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-sm">{copy.barcode}</TableCell>
                    <TableCell>{getStatusBadge(copy.status)}</TableCell>
                    <TableCell>
                      {copy.isReference ? (
                        <span className="flex items-center gap-1 text-sm text-amber-700">
                          <BookMarked className="h-3.5 w-3.5" /> Reference only
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Circulating</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 text-red-600 hover:text-red-700"
                        title="Remove Copy"
                        onClick={() => setCopyToDelete(copy)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!copyToDelete} onOpenChange={(open) => !open && setCopyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove copy</AlertDialogTitle>
            <AlertDialogDescription>
              Remove copy with barcode “{copyToDelete?.barcode}”? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                if (copyToDelete) deleteCopy(copyToDelete.bookId);
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
};

export default ManageCopies;
