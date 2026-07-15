import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyDues, useMyPayments } from "@/hooks/api/use-me";

export default function PortalFines() {
  const { data: dues, isLoading: isLoadingDues } = useMyDues();
  const { data: payments, isLoading: isLoadingPayments } = useMyPayments();

  const dueRows = dues?.data ?? [];
  const paymentRows = payments?.data ?? [];
  const pendingDues = dueRows.filter((due) => due.status === "Pending");
  const settledDues = dueRows.filter((due) => due.status !== "Pending");
  const outstanding = pendingDues.reduce((sum, due) => sum + Number(due.amount ?? 0), 0);
  const totalPaid = paymentRows.reduce((sum, p) => sum + Number(p.amountPaid ?? 0), 0);

  if (isLoadingDues || isLoadingPayments) {
    return (
      <PortalLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Fines & Payments</h1>
          <p className="text-slate-500">View outstanding balances and your payment history.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
              <CreditCard className="h-40 w-40" />
            </div>
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <div className="text-6xl font-black tracking-tight flex items-start gap-1">
                <span className="text-2xl mt-2 text-slate-500">Rs.</span>
                {outstanding.toFixed(2)}
              </div>
              <p className="mt-4 text-slate-400 font-bold flex items-center gap-2">
                {outstanding > 0 ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Please settle your dues at the library desk.
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    You have no outstanding fines. Great job!
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem] bg-emerald-50 text-emerald-900 overflow-hidden group">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Total Paid</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <div className="text-6xl font-black tracking-tight flex items-start gap-1">
                <span className="text-2xl mt-2 text-emerald-500">Rs.</span>
                {totalPaid.toFixed(2)}
              </div>
              <p className="mt-4 text-emerald-700 font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                {paymentRows.length} payment{paymentRows.length === 1 ? "" : "s"} on record
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dues" className="w-full">
          <TabsList className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-6">
            <TabsTrigger value="dues" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              My Dues ({pendingDues.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Payment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dues" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {dueRows.length === 0 && (
              <div className="rounded-[2rem] border-2 border-dashed p-12 text-center text-slate-500">
                No fines on your account. Keep it up!
              </div>
            )}
            {[...pendingDues, ...settledDues].map((due) => (
              <div key={due.penaltyId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    due.status === "Pending" ? "bg-red-50" : "bg-emerald-50"
                  }`}>
                    <Receipt className={`h-5 w-5 ${due.status === "Pending" ? "text-red-500" : "text-emerald-500"}`} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{due.description ?? due.penaltyType}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {due.penaltyType}
                      {due.createdAt && ` · ${new Date(due.createdAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-slate-900">
                    Rs. {Number(due.amount ?? 0).toFixed(2)}
                  </span>
                  <Badge className={
                    due.status === "Pending"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }>
                    {due.status}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {paymentRows.length === 0 && (
              <div className="rounded-[2rem] border-2 border-dashed p-12 text-center text-slate-500">
                No payments recorded yet.
              </div>
            )}
            {paymentRows.map((payment, index) => (
              <div key={payment.paymentId ?? index} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{payment.paymentType ?? "Payment"}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-black text-emerald-700">
                  Rs. {Number(payment.amountPaid ?? 0).toFixed(2)}
                </span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
