import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  AlertCircle,
  Barcode,
  BookCheck,
  CalendarClock,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ScanLine,
  User,
} from "lucide-react";
import {
  useIssueFromReservation,
  useManualIssue,
  useRenew,
  useReturn,
  useScanBarcode,
  useScanCard,
} from "@/hooks/api/use-circulation";
import { useAdminReservation } from "@/hooks/api/use-reservations";
import { AssignableBook, BookIssue, Reservation } from "@/api/entities";
import { useToast } from "@/hooks/use-toast";

interface ScannedCopy {
  barcode: string;
  status: string;
  isReference: boolean;
  bookInfo?: {
    title?: string;
    subTitle?: string;
    editionStatement?: string;
    numberOfPages?: number;
    publicationYear?: number;
    classNumber?: string;
    addedDate?: string;
  };
  reservations?: Reservation[];
  issues?: BookIssue[];
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

/** Scan input with a search button; submits on Enter for barcode-scanner support. */
function ScanField({
  id,
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  onSubmit,
}: {
  id: string;
  label: string;
  placeholder: string;
  icon: typeof User;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Icon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id={id}
            placeholder={placeholder}
            className="pl-9 font-mono"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
        </div>
        <Button variant="secondary" onClick={onSubmit}>
          Scan
        </Button>
      </div>
    </div>
  );
}

function CopySummary({ copy }: { copy: ScannedCopy }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xl font-bold">{copy.bookInfo?.title ?? "Unknown title"}</h3>
        {copy.bookInfo?.subTitle && (
          <p className="text-sm text-muted-foreground italic">{copy.bookInfo.subTitle}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg bg-muted/50 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Barcode</span>
          <span className="font-mono">{copy.barcode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <Badge
            className={
              copy.status === "Available"
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none"
                : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none"
            }
          >
            {copy.status ?? "Unknown"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Edition</span>
          <span>{copy.bookInfo?.editionStatement ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Reference</span>
          <Badge
            variant={copy.isReference ? "destructive" : "outline"}
            className={copy.isReference ? "" : "border-emerald-200 text-emerald-700"}
          >
            {copy.isReference ? "Reference only" : "Circulating"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Year</span>
          <span>{copy.bookInfo?.publicationYear ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Class No.</span>
          <span>{copy.bookInfo?.classNumber ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}

export default function CirculationDesk() {
  const { toast } = useToast();

  // ----- Issue desk state -----
  const [cardInput, setCardInput] = useState("");
  const [cardId, setCardId] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcode, setBarcode] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // ----- Return & renew state -----
  const [returnInput, setReturnInput] = useState("");
  const [returnBarcode, setReturnBarcode] = useState("");
  const [issueToRenew, setIssueToRenew] = useState<string | null>(null);
  const [issueToReturn, setIssueToReturn] = useState<string | null>(null);

  // ----- Reserve-instead dialog (manual issue hit a 409 with assignable copies) -----
  const [assignables, setAssignables] = useState<AssignableBook[]>([]);
  const [selectedAssignable, setSelectedAssignable] = useState<AssignableBook | null>(null);
  const [autoDate, setAutoDate] = useState(true);
  const [reservationDate, setReservationDate] = useState("");

  const {
    data: member,
    isFetching: isLoadingMember,
    isError: memberError,
    error: memberErrorObj,
  } = useScanCard(cardId);
  const {
    data: scannedCopy,
    isFetching: isLoadingCopy,
    isError: copyError,
    error: copyErrorObj,
  } = useScanBarcode(barcode) as {
    data: ScannedCopy | undefined;
    isFetching: boolean;
    isError: boolean;
    error: { response?: { data?: { error?: string } }; message?: string } | null;
  };
  const {
    data: returnCopy,
    isFetching: isLoadingReturnCopy,
    isError: returnCopyError,
    error: returnCopyErrorObj,
  } = useScanBarcode(returnBarcode) as {
    data: ScannedCopy | undefined;
    isFetching: boolean;
    isError: boolean;
    error: { response?: { data?: { error?: string } }; message?: string } | null;
  };

  const onActionError = (err: any) =>
    toast({
      title: "Action failed",
      description: err.response?.data?.error ?? err.message,
      variant: "destructive",
    });

  const { mutate: issueFromReservation, isPending: isIssuingReserved } =
    useIssueFromReservation({
      onSuccess: () => {
        toast({ title: "Book issued", description: "Issued against the selected reservation." });
        setSelectedReservation(null);
      },
      onError: onActionError,
    });

  const { mutate: manualIssue, isPending: isIssuingManual } = useManualIssue({
    onSuccess: () => toast({ title: "Book issued", description: `Issued to ${member?.fullName ?? cardId}.` }),
    onError: (err) => {
      const offered = err.response?.status === 409 ? (err.response.data as any)?.assignables : null;
      if (Array.isArray(offered) && offered.length > 0) {
        setAssignables(offered);
        setSelectedAssignable(null);
        setAutoDate(true);
        setReservationDate("");
      } else {
        onActionError(err);
      }
    },
  });

  const { mutate: adminReserve, isPending: isReserving } = useAdminReservation();

  const { mutate: renew, isPending: isRenewing } = useRenew({
    onSuccess: () => {
      toast({ title: "Loan renewed" });
      setIssueToRenew(null);
    },
    onError: (err) => {
      onActionError(err);
      setIssueToRenew(null);
    },
  });
  const { mutate: returnBook, isPending: isReturning } = useReturn({
    onSuccess: () => {
      toast({ title: "Book returned" });
      setIssueToReturn(null);
    },
    onError: (err) => {
      onActionError(err);
      setIssueToReturn(null);
    },
  });

  const handleIssueFromReservation = () => {
    if (!selectedReservation || !scannedCopy?.barcode) {
      toast({
        title: "Select a reservation first",
        description: "Scan the member card and select one of their reservations.",
        variant: "destructive",
      });
      return;
    }
    issueFromReservation({
      reservationId: selectedReservation.reservationId,
      barcode: scannedCopy.barcode,
    });
  };

  const handleManualIssue = () => {
    if (!member?.cardId || !scannedCopy?.barcode) {
      toast({
        title: "Scan a member card first",
        description: "A valid card is required for a manual issue.",
        variant: "destructive",
      });
      return;
    }
    manualIssue({ cardId: member.cardId, barcode: scannedCopy.barcode });
  };

  const confirmReserve = () => {
    if (!member?.cardId || !selectedAssignable) return;
    adminReserve(
      {
        cardId: member.cardId,
        assignData: {
          barcode: selectedAssignable.barcode,
          reservationDate: autoDate ? null : reservationDate || null,
          autoDate,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Reservation created" });
          setAssignables([]);
        },
        onError: onActionError,
      },
    );
  };

  const activeReturnIssues = (returnCopy?.issues ?? []).filter((i) => i.status === "Active");

  return (
    <Layout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Circulation Desk</h1>
          <p className="text-muted-foreground">
            Scan member cards and book barcodes to issue, return, and renew books.
          </p>
        </div>

        <Tabs defaultValue="issue">
          <TabsList>
            <TabsTrigger value="issue" className="gap-2">
              <ScanLine className="h-4 w-4" /> Issue Desk
            </TabsTrigger>
            <TabsTrigger value="return" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Return & Renew
            </TabsTrigger>
          </TabsList>

          {/* ---------------- Issue desk ---------------- */}
          <TabsContent value="issue" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Member panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" /> Scan Card
                  </CardTitle>
                  <CardDescription>
                    Look up the member and pick a reservation to fulfil.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScanField
                    id="desk-card"
                    label="Card ID"
                    placeholder="Scan or type card ID"
                    icon={User}
                    value={cardInput}
                    onChange={setCardInput}
                    onSubmit={() => {
                      setCardId(cardInput.trim());
                      setSelectedReservation(null);
                    }}
                  />
                  {isLoadingMember && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Looking up member...
                    </div>
                  )}
                  {cardId && memberError && !isLoadingMember && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {memberErrorObj?.response?.data?.error ?? `No member found for “${cardId}”.`}
                    </p>
                  )}
                  {member && !memberError && (
                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-semibold">{member.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.cardId} • {member.issueCount} on loan • {member.reservationCount}{" "}
                          reservations
                        </p>
                      </div>
                      <Tabs defaultValue="reservations">
                        <TabsList className="w-full">
                          <TabsTrigger value="reservations" className="flex-1">
                            Reservations
                          </TabsTrigger>
                          <TabsTrigger value="loans" className="flex-1">
                            Loans
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="reservations" className="mt-3">
                          {(member.reservations ?? []).length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No reservations for this member.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {member.reservations.map((res) => {
                                const isSelected =
                                  selectedReservation?.reservationId === res.reservationId;
                                return (
                                  <button
                                    key={res.reservationId}
                                    onClick={() =>
                                      setSelectedReservation(isSelected ? null : res)
                                    }
                                    className={`w-full flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors ${
                                      isSelected
                                        ? "border-primary bg-primary/5"
                                        : "hover:bg-muted"
                                    }`}
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {res.bookInfo?.title ?? res.bookInfoId}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDate(res.reservationDate)} • {res.status}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="loans" className="mt-3">
                          {(member.issues ?? []).length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No active loans.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {member.issues.map((issue) => (
                                <div
                                  key={issue.issueId}
                                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {issue.book?.bookInfo?.title ?? issue.bookId}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Due {formatDate(issue.dueDate ?? issue.due)}
                                    </p>
                                  </div>
                                  <Badge variant="outline">{issue.status}</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Book panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Barcode className="h-5 w-5 text-primary" /> Scan Book
                  </CardTitle>
                  <CardDescription>
                    Check the copy's details and history, then issue it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScanField
                    id="desk-barcode"
                    label="Book Barcode"
                    placeholder="Scan barcode..."
                    icon={Barcode}
                    value={barcodeInput}
                    onChange={setBarcodeInput}
                    onSubmit={() => setBarcode(barcodeInput.trim())}
                  />
                  {isLoadingCopy && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Looking up copy...
                    </div>
                  )}
                  {barcode && copyError && !isLoadingCopy && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {copyErrorObj?.response?.data?.error ?? `No copy matches “${barcode}”.`}
                    </p>
                  )}
                  {scannedCopy && !copyError && (
                    <div className="space-y-4">
                      <CopySummary copy={scannedCopy} />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          className="gap-2"
                          disabled={!selectedReservation || isIssuingReserved}
                          onClick={handleIssueFromReservation}
                        >
                          {isIssuingReserved ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <BookCheck className="h-4 w-4" />
                          )}
                          Issue to Reservation
                        </Button>
                        <Button
                          variant="secondary"
                          className="gap-2"
                          disabled={!member || isIssuingManual}
                          onClick={handleManualIssue}
                        >
                          {isIssuingManual ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Manual Issue
                        </Button>
                      </div>
                      {selectedReservation && (
                        <p className="text-xs text-muted-foreground">
                          Issuing against reservation for “
                          {selectedReservation.bookInfo?.title ?? selectedReservation.bookInfoId}
                          ”.
                        </p>
                      )}
                      {(scannedCopy.issues ?? []).length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Issue History
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {scannedCopy.issues!.map((issue) => (
                              <div
                                key={issue.issueId}
                                className="flex items-center justify-between rounded-lg border p-3 text-sm"
                              >
                                <div>
                                  <p className="font-medium">{issue.user?.fullName ?? "—"}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(issue.checkInDate)} → due {formatDate(issue.dueDate)}
                                  </p>
                                </div>
                                <Badge variant="outline">{issue.status}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {(scannedCopy.reservations ?? []).length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Reservations on this title
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {scannedCopy.reservations!.map((res, index) => (
                              <div
                                key={res.reservationId ?? index}
                                className="flex items-center justify-between rounded-lg border p-3 text-sm"
                              >
                                <span>{res.user?.fullName ?? res.userId}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(res.reservationDate)} • {res.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---------------- Return & renew ---------------- */}
          <TabsContent value="return" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <RotateCcw className="h-5 w-5 text-primary" /> Return or Renew by Scan
                </CardTitle>
                <CardDescription>
                  Scan the returned copy's barcode to see its active loan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-xl">
                  <ScanField
                    id="return-barcode"
                    label="Book Barcode"
                    placeholder="Scan barcode..."
                    icon={Barcode}
                    value={returnInput}
                    onChange={setReturnInput}
                    onSubmit={() => setReturnBarcode(returnInput.trim())}
                  />
                </div>
                {isLoadingReturnCopy && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Looking up copy...
                  </div>
                )}
                {returnBarcode && returnCopyError && !isLoadingReturnCopy && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {returnCopyErrorObj?.response?.data?.error ??
                      `No copy matches “${returnBarcode}”.`}
                  </p>
                )}
                {returnCopy && !returnCopyError && (
                  <div className="space-y-4">
                    <CopySummary copy={returnCopy} />
                    {activeReturnIssues.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        This copy has no active loan to return or renew.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Borrower</TableHead>
                            <TableHead>Checked In</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Renewals</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeReturnIssues.map((issue) => (
                            <TableRow key={issue.issueId}>
                              <TableCell className="font-medium">
                                {issue.user?.fullName ?? "—"}
                              </TableCell>
                              <TableCell>{formatDate(issue.checkInDate)}</TableCell>
                              <TableCell>{formatDate(issue.dueDate)}</TableCell>
                              <TableCell>{issue.renewalCount}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    disabled={isRenewing || isReturning}
                                    onClick={() => setIssueToRenew(issue.issueId)}
                                  >
                                    <RotateCcw className="h-4 w-4" /> Renew
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                                    disabled={isRenewing || isReturning}
                                    onClick={() => setIssueToReturn(issue.issueId)}
                                  >
                                    <CheckCircle2 className="h-4 w-4" /> Return
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm renew */}
      <AlertDialog open={!!issueToRenew} onOpenChange={(open) => !open && setIssueToRenew(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Renew loan</AlertDialogTitle>
            <AlertDialogDescription>
              Renew this loan for another period?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRenewing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isRenewing}
              onClick={(e) => {
                e.preventDefault();
                if (issueToRenew) renew({ issueId: issueToRenew });
              }}
            >
              {isRenewing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Renew
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm return */}
      <AlertDialog open={!!issueToReturn} onOpenChange={(open) => !open && setIssueToReturn(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return book</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this copy as returned?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReturning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isReturning}
              onClick={(e) => {
                e.preventDefault();
                if (issueToReturn) returnBook({ issueId: issueToReturn });
              }}
            >
              {isReturning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Return
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* No copy available — offer to reserve a future-available copy instead */}
      <Dialog open={assignables.length > 0} onOpenChange={(open) => !open && setAssignables([])}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-500" />
              No Copy Available
            </DialogTitle>
            <DialogDescription>
              All copies are currently on loan. Reserve one of the copies below for{" "}
              {member?.fullName ?? cardId} instead?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {assignables.map((assignable) => (
                <button
                  key={assignable.barcode}
                  onClick={() => setSelectedAssignable(assignable)}
                  className={`w-full flex items-center justify-between rounded-lg border p-3 text-sm transition-colors ${
                    selectedAssignable?.barcode === assignable.barcode
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-mono">{assignable.barcode}</span>
                  <span className="text-muted-foreground">
                    {assignable.dueDate
                      ? `Due back ${formatDate(assignable.dueDate)}`
                      : "Available soon"}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="desk-auto-date"
                checked={autoDate}
                onCheckedChange={(checked) => setAutoDate(checked === true)}
              />
              <Label htmlFor="desk-auto-date" className="font-normal">
                Automatically assign reservation date by the system
              </Label>
            </div>
            {!autoDate && (
              <div className="space-y-2">
                <Label htmlFor="desk-reservation-date">Reservation Date</Label>
                <Input
                  id="desk-reservation-date"
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignables([])} disabled={isReserving}>
              Skip
            </Button>
            <Button onClick={confirmReserve} disabled={!selectedAssignable || isReserving}>
              {isReserving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
