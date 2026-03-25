import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Receipt, 
  History, 
  Calendar,
  AlertCircle,
  Download,
  Info,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const unpaidFines = [
  {
    id: "FIN-1001",
    book: "The Great Gatsby",
    reason: "Late Return (3 days)",
    amount: 15.00,
    dueDate: "May 10, 2024",
    status: "Unpaid",
  },
  {
    id: "FIN-1002",
    book: "Atomic Habits",
    reason: "Damaged Page",
    amount: 5.50,
    dueDate: "May 15, 2024",
    status: "Unpaid",
  },
];

const paymentHistory = [
  {
    id: "PAY-5520",
    date: "April 01, 2024",
    amount: 10.00,
    method: "Credit Card (**** 4421)",
    status: "Completed",
    receipt: "REC-4421",
  },
  {
    id: "PAY-5410",
    date: "March 15, 2024",
    amount: 5.00,
    method: "E-Wallet",
    status: "Completed",
    receipt: "REC-4410",
  },
];

export default function PortalFines() {
  const { toast } = useToast();

  const handlePayment = (amount: number) => {
    toast({
      title: "Redirecting to payment...",
      description: `Processing payment for $${amount.toFixed(2)}. This will take you to our secure payment gateway.`,
    });
  };

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
                  <span className="text-2xl mt-2 text-slate-500">$</span>
                  {(20.50).toFixed(2)}
               </div>
               <p className="mt-4 text-slate-400 font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Due by end of month to avoid membership suspension.
               </p>
               <Button className="mt-8 rounded-2xl h-14 px-10 font-black bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-xl shadow-white/10 gap-2" onClick={() => handlePayment(20.50)}>
                  <CreditCard className="h-5 w-5" />
                  Pay Full Balance
               </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem] bg-emerald-50 text-emerald-900 overflow-hidden group">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0">
               <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Account Clear</h3>
                    <p className="text-sm font-bold text-emerald-600/80">No overdue payments flagged.</p>
                  </div>
               </div>
               <Separator className="bg-emerald-100 mb-6" />
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-emerald-700">Total Paid (Lifetime)</span>
                     <span className="text-xl font-black">$145.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-emerald-700">Last Payment</span>
                     <span className="text-sm font-black">April 01, 2024</span>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="unpaid" className="w-full">
          <TabsList className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-6">
            <TabsTrigger value="unpaid" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Unpaid Fines
            </TabsTrigger>
            <TabsTrigger value="history" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Payment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unpaid" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {unpaidFines.map((fine) => (
              <Card key={fine.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
                <CardHeader className="flex flex-row items-center justify-between p-8 px-10">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center border-2 border-red-100 shadow-sm group-hover:bg-red-100 transition-colors">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-none font-black text-[10px] uppercase tracking-wider">
                          {fine.status}
                        </Badge>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fine ID: {fine.id}</span>
                      </div>
                      <CardTitle className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                        {fine.book}
                      </CardTitle>
                      <CardDescription className="text-base font-bold text-slate-500">
                        {fine.reason}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Due Date</span>
                     <span className="text-base font-black text-slate-700">{fine.dueDate}</span>
                  </div>
                </CardHeader>
                <CardFooter className="bg-slate-50/50 p-6 px-10 flex justify-between items-center border-t">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Amount Due:</span>
                     <span className="text-3xl font-black text-slate-900">${fine.amount.toFixed(2)}</span>
                  </div>
                  <Button className="rounded-2xl h-12 px-8 font-black bg-white text-primary border-2 border-slate-200 hover:bg-slate-50 hover:border-primary/20 transition-all shadow-sm gap-2" onClick={() => handlePayment(fine.amount)}>
                    <CreditCard className="h-5 w-5" />
                    Pay Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Method</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                      <th className="px-8 py-5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentHistory.map((pay) => (
                      <tr key={pay.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900">{pay.id}</span>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{pay.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {pay.date}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-slate-600">{pay.method}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-lg font-black text-slate-900">${pay.amount.toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2 text-primary hover:bg-white transition-all">
                            <Download className="h-4 w-4" />
                            Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-px w-full ${className}`} />
);
