import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Clock, History, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyBooks } from "@/hooks/api/use-me";

function daysLeft(dueDate?: string) {
  if (!dueDate) return 0;
  return Math.ceil((new Date(dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

export default function PortalLoans() {
  const { data, isLoading, isError, error } = useMyBooks();

  const allLoans = data?.data ?? [];
  const currentLoans = allLoans.filter((loan) => loan.status === "Active");
  const loanHistory = allLoans.filter((loan) => loan.status !== "Active");

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
        </div>
      </PortalLayout>
    );
  }

  if (isError) {
    return (
      <PortalLayout>
        <p className="py-32 text-center text-destructive">
          Failed to load your loans{error?.message ? `: ${error.message}` : "."}
        </p>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">My Loans</h1>
          <p className="text-slate-500">Track your currently borrowed books and reading history.</p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-6">
            <TabsTrigger value="current" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Current Loans ({currentLoans.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Reading History ({loanHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentLoans.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {currentLoans.map((loan) => {
                  const remaining = daysLeft(loan.dueDate);
                  const dueSoon = remaining <= 3;
                  return (
                    <Card key={loan.issueId} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
                      <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-12 bg-slate-100 rounded-xl flex items-center justify-center border shadow-sm group-hover:bg-primary/5 transition-colors">
                            <Book className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-black text-slate-900 leading-tight">
                              {loan.book?.bookInfo?.title ?? "Unknown title"}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium font-mono">
                              {loan.book?.barcode}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={
                          dueSoon
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        }>
                          {remaining < 0 ? "Overdue" : dueSoon ? "Due Soon" : "Active"}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-slate-500 font-medium">
                            <Calendar className="h-4 w-4" /> Borrowed
                          </span>
                          <span className="font-bold text-slate-900">
                            {loan.checkInDate ? new Date(loan.checkInDate).toLocaleDateString() : "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-slate-500 font-medium">
                            <Clock className="h-4 w-4" /> Due Date
                          </span>
                          <span className={`font-bold ${dueSoon ? "text-amber-600" : "text-slate-900"}`}>
                            {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Renewals</span>
                          <span className="font-bold text-slate-900">{loan.renewalCount ?? 0}</span>
                        </div>
                        <p className={`text-xs font-bold ${remaining < 0 ? "text-red-600" : dueSoon ? "text-amber-600" : "text-emerald-600"}`}>
                          {remaining >= 0
                            ? `${remaining} day${remaining === 1 ? "" : "s"} remaining`
                            : `${-remaining} day${remaining === -1 ? "" : "s"} overdue — please return this book`}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[2rem] border-2 border-dashed p-12 text-center text-slate-500">
                You have no books on loan.{" "}
                <Link to="/portal/browse" className="text-primary font-bold hover:underline">
                  Browse the catalog
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {loanHistory.length > 0 ? (
              <div className="space-y-4">
                {loanHistory.map((loan) => (
                  <div key={loan.issueId} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <History className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900">
                          {loan.book?.bookInfo?.title ?? "Unknown title"}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Borrowed {loan.checkInDate ? new Date(loan.checkInDate).toLocaleDateString() : "—"}
                          {loan.checkOutDate &&
                            ` · Returned ${new Date(loan.checkOutDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {loan.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border-2 border-dashed p-12 text-center text-slate-500">
                No reading history yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
