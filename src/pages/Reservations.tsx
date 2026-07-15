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
import { Button } from "@/components/ui/button";
import { Check, X, CalendarDays, Loader2, BookCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAssignableBooks,
  useAssignReservation,
  useDeleteReservation,
  useReservations,
} from "@/hooks/api/use-reservations";
import { useIssueFromReservation } from "@/hooks/api/use-circulation";
import { Reservation } from "@/api/entities";
import { DEFAULT_PAGE_SIZE } from "@/api/constants";
import { useToast } from "@/hooks/use-toast";

export default function Reservations() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("Pending");
  const [assignTarget, setAssignTarget] = useState<Reservation | null>(null);
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useReservations({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    status,
  });

  const { data: assignableBooks, isLoading: isLoadingAssignable } = useAssignableBooks(
    assignTarget?.bookInfoId,
  );

  const onActionError = (err: any) =>
    toast({
      title: "Action failed",
      description: err.response?.data?.error ?? err.message,
      variant: "destructive",
    });

  const { mutate: assignReservation, isPending: isAssigning } = useAssignReservation({
    onSuccess: () => {
      toast({ title: "Book assigned", description: "The reservation is now confirmed." });
      setAssignTarget(null);
      setSelectedBarcode("");
    },
    onError: onActionError,
  });

  const { mutate: cancelReservation } = useDeleteReservation(() =>
    toast({ title: "Reservation cancelled" }),
  );

  const { mutate: issueFromReservation, isPending: isIssuing } = useIssueFromReservation({
    onSuccess: () => toast({ title: "Book issued from reservation" }),
    onError: onActionError,
  });

  const reservations = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;
  const total = data?.info?.total ?? 0;

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Reservations Queue</h1>
          <p className="text-muted-foreground">
            Manage book reservations and waiting lists.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-sm text-muted-foreground">
            {total} {status.toLowerCase()} reservation{total === 1 ? "" : "s"}
          </span>
        </div>

        {/* Reservations Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Assigned Copy</TableHead>
                <TableHead>Status</TableHead>
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
                    Failed to load reservations{error?.message ? `: ${error.message}` : "."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && reservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No {status.toLowerCase()} reservations.
                  </TableCell>
                </TableRow>
              )}
              {reservations.map((res) => (
                <TableRow key={res.reservationId}>
                  <TableCell className="font-medium">
                    {res.bookInfo?.title ?? res.bookInfoId}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{res.user?.fullName ?? res.userId}</span>
                      <span className="text-xs text-muted-foreground">{res.user?.cardId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {res.reservationDate
                        ? new Date(res.reservationDate).toLocaleDateString()
                        : new Date(res.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {res.book?.barcode ? (
                      <Badge variant="outline" className="font-mono">{res.book.barcode}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        res.status === "Confirmed"
                          ? "default"
                          : res.status === "Cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        res.status === "Pending"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none"
                          : res.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none"
                            : ""
                      }
                    >
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {res.status === "Pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            title="Assign a copy"
                            onClick={() => {
                              setAssignTarget(res);
                              setSelectedBarcode("");
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                            title="Cancel reservation"
                            onClick={() => cancelReservation(res.reservationId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {res.status === "Confirmed" && res.book?.barcode && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          disabled={isIssuing}
                          onClick={() =>
                            issueFromReservation({
                              reservationId: res.reservationId,
                              barcode: res.book!.barcode,
                            })
                          }
                        >
                          <BookCheck className="h-4 w-4" /> Issue
                        </Button>
                      )}
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

      {/* Assign copy dialog */}
      <Dialog open={!!assignTarget} onOpenChange={(open) => !open && setAssignTarget(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign a copy</DialogTitle>
            <DialogDescription>
              Choose an available copy of “{assignTarget?.bookInfo?.title}” for{" "}
              {assignTarget?.user?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingAssignable ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading available copies...
              </div>
            ) : (assignableBooks ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No copies are currently assignable for this title.
              </p>
            ) : (
              <Select value={selectedBarcode} onValueChange={setSelectedBarcode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select barcode" />
                </SelectTrigger>
                <SelectContent>
                  {(assignableBooks ?? []).map((book) => (
                    <SelectItem key={book.barcode} value={book.barcode}>
                      {book.barcode}
                      {book.dueDate
                        ? ` (due ${new Date(book.dueDate).toLocaleDateString()})`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignTarget(null)} disabled={isAssigning}>
              Cancel
            </Button>
            <Button
              disabled={!selectedBarcode || isAssigning}
              onClick={() =>
                assignTarget &&
                assignReservation({
                  reservationId: assignTarget.reservationId,
                  barcode: selectedBarcode,
                  assignData: { autoDate: true },
                })
              }
            >
              {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
