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
import {
  CreditCard,
  AlertCircle,
  Search,
  Receipt,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUsers } from "@/hooks/api/use-users";
import {
  useAddPenalty,
  useMakePayment,
  usePaymentHistory,
  usePenalties,
  useResolvePenalty,
} from "@/hooks/api/use-payments";
import { EPaymentTypes, EPenaltyTypes, resUrl, UserSummary } from "@/api/entities";

function initialsOf(name?: string) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export default function Fines() {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [penaltyPage, setPenaltyPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);

  const [addPenaltyOpen, setAddPenaltyOpen] = useState(false);
  const [penaltyForm, setPenaltyForm] = useState({
    barcode: "",
    description: "",
    amount: "",
    penaltyType: EPenaltyTypes.Overdue as EPenaltyTypes,
  });

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amountPaid: "",
    paymentType: EPaymentTypes.Penalty as EPaymentTypes,
  });

  const { data: usersData, isFetching: isSearching } = useUsers({
    page: 1,
    pageSize: 8,
    ...(search.trim() ? { seed: search.trim() } : {}),
  });

  const userId = selectedUser?.userId;
  const { data: penalties, isLoading: isLoadingPenalties } = usePenalties({
    userId,
    page: penaltyPage,
    pageSize: 10,
  });
  const { data: payments, isLoading: isLoadingPayments } = usePaymentHistory({
    userId,
    page: paymentPage,
    pageSize: 10,
  });

  const { mutate: addPenalty, isPending: isAddingPenalty } = useAddPenalty();
  const { mutate: resolvePenalty, isPending: isResolving } = useResolvePenalty();
  const { mutate: makePayment, isPending: isPaying } = useMakePayment();

  const penaltyRows = penalties?.data ?? [];
  const paymentRows = payments?.data ?? [];
  const pendingTotal = penaltyRows
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  const paidTotal = paymentRows.reduce((sum, p) => sum + Number(p.amountPaid ?? 0), 0);

  const onError = (err: any) =>
    toast({
      title: "Action failed",
      description: err.response?.data?.error ?? err.message,
      variant: "destructive",
    });

  const submitPenalty = () => {
    if (!userId) return;
    if (!penaltyForm.description.trim() || !penaltyForm.amount) {
      toast({ title: "Description and amount are required", variant: "destructive" });
      return;
    }
    addPenalty(
      {
        userId,
        body: {
          barcode: penaltyForm.barcode,
          description: penaltyForm.description,
          amount: Number(penaltyForm.amount),
          penaltyType: penaltyForm.penaltyType,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Penalty added" });
          setAddPenaltyOpen(false);
          setPenaltyForm({ barcode: "", description: "", amount: "", penaltyType: EPenaltyTypes.Overdue });
        },
        onError,
      },
    );
  };

  const submitPayment = () => {
    if (!userId) return;
    if (!paymentForm.amountPaid) {
      toast({ title: "Amount is required", variant: "destructive" });
      return;
    }
    makePayment(
      {
        userId,
        body: {
          amountPaid: Number(paymentForm.amountPaid),
          paymentType: paymentForm.paymentType,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Payment recorded" });
          setPaymentOpen(false);
          setPaymentForm({ amountPaid: "", paymentType: EPaymentTypes.Penalty });
        },
        onError,
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fines & Payments</h1>
            <p className="text-muted-foreground">
              Monitor outstanding fines, record payments, and manage financial records.
            </p>
          </div>
          {selectedUser && (
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => setAddPenaltyOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Penalty
              </Button>
              <Button className="gap-2" onClick={() => setPaymentOpen(true)}>
                <CreditCard className="h-4 w-4" />
                Record Payment
              </Button>
            </div>
          )}
        </div>

        {/* Member picker */}
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search member by name or card ID..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {(usersData?.data ?? []).map((user) => (
              <button
                key={user.userId}
                onClick={() => {
                  setSelectedUser(user);
                  setPenaltyPage(1);
                  setPaymentPage(1);
                }}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selectedUser?.userId === user.userId
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={resUrl(user.profilePicUrl)} />
                  <AvatarFallback className="text-[9px]">{initialsOf(user.fullName)}</AvatarFallback>
                </Avatar>
                {user.fullName}
                <span className="opacity-70 font-mono text-xs">{user.cardId}</span>
              </button>
            ))}
          </div>
        </div>

        {!selectedUser ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-16 text-muted-foreground">
            <Receipt className="h-10 w-10 opacity-30" />
            <p>Select a member above to view their fines and payment history.</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-6 flex items-center gap-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Fines</p>
                  <h3 className="text-2xl font-bold text-amber-600">Rs. {pendingTotal.toFixed(2)}</h3>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-6 flex items-center gap-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payments (this page)</p>
                  <h3 className="text-2xl font-bold text-emerald-600">Rs. {paidTotal.toFixed(2)}</h3>
                </div>
              </div>
            </div>

            <Tabs defaultValue="penalties">
              <TabsList>
                <TabsTrigger value="penalties">Penalties</TabsTrigger>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
              </TabsList>

              <TabsContent value="penalties" className="mt-4">
                <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead>Reason</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date Issued</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingPenalties && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      )}
                      {!isLoadingPenalties && penaltyRows.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                            No penalties for {selectedUser.fullName}.
                          </TableCell>
                        </TableRow>
                      )}
                      {penaltyRows.map((fine) => (
                        <TableRow key={fine.penaltyId} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium">{fine.description}</TableCell>
                          <TableCell>{fine.penaltyType}</TableCell>
                          <TableCell className="font-bold">Rs. {Number(fine.amount).toFixed(2)}</TableCell>
                          <TableCell className="text-sm text-slate-500">
                            {fine.createdAt ? new Date(fine.createdAt).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                fine.status !== "Pending"
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                                  : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                              }
                            >
                              {fine.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {fine.status === "Pending" && (
                              <Button
                                size="sm"
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                disabled={isResolving}
                                onClick={() =>
                                  resolvePenalty(
                                    { userId: userId!, penaltyId: fine.penaltyId },
                                    {
                                      onSuccess: () => toast({ title: "Penalty resolved" }),
                                      onError,
                                    },
                                  )
                                }
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Resolve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="mt-4">
                <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingPayments && (
                        <TableRow>
                          <TableCell colSpan={3} className="h-32 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      )}
                      {!isLoadingPayments && paymentRows.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                            No payments recorded for {selectedUser.fullName}.
                          </TableCell>
                        </TableRow>
                      )}
                      {paymentRows.map((payment) => (
                        <TableRow key={payment.paymentId} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium">{payment.paymentType}</TableCell>
                          <TableCell className="font-bold text-emerald-700">
                            Rs. {Number(payment.amountPaid).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">
                            {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Add penalty dialog */}
      <Dialog open={addPenaltyOpen} onOpenChange={setAddPenaltyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Penalty</DialogTitle>
            <DialogDescription>
              Charge a fine to {selectedUser?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="penalty-type">Penalty Type</Label>
              <Select
                value={penaltyForm.penaltyType}
                onValueChange={(value) =>
                  setPenaltyForm((prev) => ({ ...prev, penaltyType: value as EPenaltyTypes }))
                }
              >
                <SelectTrigger id="penalty-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EPenaltyTypes.Overdue}>Overdue</SelectItem>
                  <SelectItem value={EPenaltyTypes.PropertyDamage}>Property Damage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="penalty-barcode">Book Barcode (if applicable)</Label>
              <Input
                id="penalty-barcode"
                placeholder="e.g. 100001"
                value={penaltyForm.barcode}
                onChange={(e) => setPenaltyForm((prev) => ({ ...prev, barcode: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="penalty-description">Description *</Label>
              <Input
                id="penalty-description"
                placeholder="Reason for the fine"
                value={penaltyForm.description}
                onChange={(e) =>
                  setPenaltyForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="penalty-amount">Amount (Rs.) *</Label>
              <Input
                id="penalty-amount"
                type="number"
                placeholder="100"
                value={penaltyForm.amount}
                onChange={(e) => setPenaltyForm((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPenaltyOpen(false)} disabled={isAddingPenalty}>
              Cancel
            </Button>
            <Button onClick={submitPenalty} disabled={isAddingPenalty}>
              {isAddingPenalty && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Penalty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment received from {selectedUser?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-type">Payment Type</Label>
              <Select
                value={paymentForm.paymentType}
                onValueChange={(value) =>
                  setPaymentForm((prev) => ({ ...prev, paymentType: value as EPaymentTypes }))
                }
              >
                <SelectTrigger id="payment-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EPaymentTypes.Penalty}>Penalty</SelectItem>
                  <SelectItem value={EPaymentTypes.Membership}>Membership</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Amount (Rs.) *</Label>
              <Input
                id="payment-amount"
                type="number"
                placeholder="100"
                value={paymentForm.amountPaid}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, amountPaid: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)} disabled={isPaying}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={submitPayment} disabled={isPaying}>
              {isPaying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
