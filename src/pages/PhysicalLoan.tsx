import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Barcode, User, Book, CheckCircle2, AlertCircle, Trash2, Loader2, CalendarClock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useManualIssue, useScanCard } from "@/hooks/api/use-circulation";
import { useAdminReservation } from "@/hooks/api/use-reservations";
import { useToast } from "@/hooks/use-toast";
import { scanBarcodeService } from "@/api/services";
import { AssignableBook } from "@/api/entities";

interface ScannedBook {
  barcode: string;
  title: string;
  status: string;
  isReference: boolean;
}

interface ReserveOffer {
  barcode: string;
  title: string;
  assignables: AssignableBook[];
}

export default function PhysicalLoan() {
  const [barcode, setBarcode] = useState("");
  const [cardInput, setCardInput] = useState("");
  const [cardId, setCardId] = useState("");
  const [loanItems, setLoanItems] = useState<ScannedBook[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reserveOffer, setReserveOffer] = useState<ReserveOffer | null>(null);
  const [selectedAssignable, setSelectedAssignable] = useState<AssignableBook | null>(null);
  const [reservationDate, setReservationDate] = useState("");
  const [autoDate, setAutoDate] = useState(true);
  const { toast } = useToast();

  const { data: member, isFetching: isLoadingMember, isError: memberError } = useScanCard(cardId);
  const { mutateAsync: manualIssue } = useManualIssue();
  const { mutate: adminReserve, isPending: isReserving } = useAdminReservation();

  const addToLoan = async () => {
    const code = barcode.trim();
    if (!code) return;
    if (loanItems.some((item) => item.barcode === code)) {
      toast({ title: "Already added", description: `Barcode ${code} is already in this session.` });
      return;
    }
    setIsScanning(true);
    try {
      const book: any = await scanBarcodeService.get(code);
      setLoanItems((items) => [
        ...items,
        {
          barcode: code,
          title: book?.bookInfo?.title ?? "Unknown title",
          status: book?.status ?? "Unknown",
          isReference: !!book?.isReference,
        },
      ]);
      setBarcode("");
    } catch (err: any) {
      toast({
        title: "Book not found",
        description: err.response?.data?.error ?? `No copy matches barcode ${code}.`,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const removeLoanItem = (code: string) => {
    setLoanItems((items) => items.filter((item) => item.barcode !== code));
  };

  const processLoan = async () => {
    if (!cardId || loanItems.length === 0) return;
    setIsProcessing(true);
    const remaining = [...loanItems];
    const failed: string[] = [];

    while (remaining.length > 0) {
      const item = remaining[0];
      try {
        await manualIssue({ cardId, barcode: item.barcode });
        remaining.shift();
        setLoanItems((items) => items.filter((i) => i.barcode !== item.barcode));
      } catch (err: any) {
        const assignables = err.response?.data?.assignables;
        if (err.response?.status === 409 && Array.isArray(assignables) && assignables.length > 0) {
          // No copy available right now — offer to reserve a future-available copy instead.
          setReserveOffer({ barcode: item.barcode, title: item.title, assignables });
          setIsProcessing(false);
          return;
        }
        failed.push(`${item.title} (${item.barcode}): ${err.response?.data?.error ?? err.message}`);
        remaining.shift();
      }
    }

    setIsProcessing(false);
    if (failed.length === 0) {
      toast({
        title: "Loan processed",
        description: `Book(s) issued to ${member?.fullName ?? cardId}.`,
      });
    } else {
      toast({
        title: `${failed.length} issue(s) failed`,
        description: failed.join("\n"),
        variant: "destructive",
      });
    }
  };

  const closeReserveOffer = () => {
    setReserveOffer(null);
    setSelectedAssignable(null);
    setReservationDate("");
    setAutoDate(true);
  };

  const confirmReserve = () => {
    if (!reserveOffer || !selectedAssignable) return;
    adminReserve(
      {
        cardId,
        assignData: {
          barcode: selectedAssignable.barcode,
          reservationDate: autoDate ? null : reservationDate || null,
          autoDate,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Reservation created",
            description: `“${reserveOffer.title}” reserved for ${member?.fullName ?? cardId}.`,
          });
          setLoanItems((items) => items.filter((i) => i.barcode !== reserveOffer.barcode));
          closeReserveOffer();
        },
        onError: (err) =>
          toast({
            title: "Failed to create reservation",
            description: err.response?.data?.error ?? err.message,
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Physical Book Loaning</h1>
          <p className="text-muted-foreground">Process immediate loans for walk-in users using barcode scanning.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Step 1: Identify User
                </CardTitle>
                <CardDescription>Enter library card ID and press Enter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">Card ID</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="userId"
                        placeholder="Scan or type card ID"
                        className="pl-9"
                        value={cardInput}
                        onChange={(e) => setCardInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setCardId(cardInput.trim())}
                      />
                    </div>
                    <Button variant="secondary" onClick={() => setCardId(cardInput.trim())}>
                      Find
                    </Button>
                  </div>
                </div>
                {isLoadingMember && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Looking up member...
                  </div>
                )}
                {cardId && memberError && !isLoadingMember && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> No member found for “{cardId}”.
                  </p>
                )}
                {member && !memberError && (
                  <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{member.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.issueCount} on loan • {member.reservationCount} reservations
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Barcode className="h-5 w-5 text-primary" />
                  Step 2: Scan Books
                </CardTitle>
                <CardDescription>Scan the barcode of each physical copy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode">Book Barcode</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Barcode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="barcode"
                        placeholder="Scan barcode..."
                        className="pl-9 font-mono"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addToLoan()}
                        disabled={isScanning}
                      />
                    </div>
                    <Button onClick={addToLoan} variant="secondary" disabled={isScanning}>
                      {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
                  <AlertCircle className="h-3 w-3" />
                  Tip: Auto-submits on barcode scanner carriage return
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Loan Summary</CardTitle>
                  <CardDescription>Review and finalize loan for walk-in session</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono">{loanItems.length} Items</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loanItems.length === 0 ? (
                <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
                  <Book className="h-12 w-12 mb-2 opacity-20" />
                  <p>No books added to this session yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loanItems.map((item) => (
                    <div key={item.barcode} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-9 bg-muted rounded-sm border shadow-sm flex items-center justify-center">
                          <Book className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-[10px] font-mono mt-1 uppercase">{item.barcode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          className={
                            item.status === "Available"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                          }
                        >
                          {item.isReference ? "Reference" : item.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeLoanItem(item.barcode)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-6 flex flex-col gap-4">
              <div className="flex justify-between w-full items-center">
                <div className="text-sm text-muted-foreground">
                  Due dates are assigned automatically by the library system.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setLoanItems([])} disabled={isProcessing}>
                    Clear All
                  </Button>
                  <Button
                    disabled={loanItems.length === 0 || !member || isProcessing}
                    className="gap-2"
                    onClick={processLoan}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Process Loan
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* No copy available right now — offer to reserve a future-available copy instead */}
      <Dialog open={!!reserveOffer} onOpenChange={(open) => !open && closeReserveOffer()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-500" />
              No Copy Available
            </DialogTitle>
            <DialogDescription>
              All copies of “{reserveOffer?.title}” are currently on loan. Reserve one of the
              copies below for {member?.fullName ?? cardId} instead?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Available Copy (by return date)</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {reserveOffer?.assignables.map((assignable) => (
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
                        ? `Due back ${new Date(assignable.dueDate).toLocaleDateString()}`
                        : "Available soon"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="auto-date"
                checked={autoDate}
                onCheckedChange={(checked) => setAutoDate(checked === true)}
              />
              <Label htmlFor="auto-date" className="font-normal">
                Automatically assign reservation date by the system
              </Label>
            </div>
            {!autoDate && (
              <div className="space-y-2">
                <Label htmlFor="reservation-date">Reservation Date</Label>
                <Input
                  id="reservation-date"
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeReserveOffer} disabled={isReserving}>
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
