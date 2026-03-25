import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  Clock, 
  RotateCcw, 
  History, 
  Calendar,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";

const currentLoans = [
  {
    id: "LN-8401",
    title: "Design Systems",
    author: "Alla Kholmatova",
    borrowedDate: "2024-05-10",
    dueDate: "2024-05-24",
    status: "Active",
    daysRemaining: 12,
  },
  {
    id: "LN-8402",
    title: "Refactoring UI",
    author: "Adam Wathan",
    borrowedDate: "2024-05-15",
    dueDate: "2024-05-22",
    status: "Due Soon",
    daysRemaining: 2,
  },
];

const loanHistory = [
  {
    id: "LN-8350",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrowedDate: "2024-04-01",
    returnedDate: "2024-04-14",
    status: "Returned",
  },
  {
    id: "LN-8290",
    title: "Atomic Habits",
    author: "James Clear",
    borrowedDate: "2024-03-05",
    returnedDate: "2024-03-19",
    status: "Returned",
  },
  {
    id: "LN-8120",
    title: "Dune",
    author: "Frank Herbert",
    borrowedDate: "2024-02-10",
    returnedDate: "2024-02-24",
    status: "Returned",
  },
];

export default function PortalLoans() {
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

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
              Current Loans
            </TabsTrigger>
            <TabsTrigger value="history" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Reading History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentLoans.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {currentLoans.map((loan) => (
                  <Card key={loan.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-12 bg-slate-100 rounded-xl flex items-center justify-center border shadow-sm group-hover:bg-primary/5 transition-colors">
                          <Book className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-black text-slate-900 leading-tight">
                            {loan.title}
                          </CardTitle>
                          <CardDescription className="text-sm font-medium">
                            {loan.author}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={
                        loan.status === "Due Soon" 
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                      }>
                        {loan.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6 px-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Borrowed On</p>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                            <Calendar className="h-3.5 w-3.5" />
                            {loan.borrowedDate}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Due Date</p>
                          <div className={`flex items-center gap-1.5 text-sm font-bold ${loan.status === "Due Soon" ? "text-amber-600" : "text-slate-600"}`}>
                            <Clock className="h-3.5 w-3.5" />
                            {loan.dueDate}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${loan.status === "Due Soon" ? "bg-amber-500" : "bg-primary"}`}
                          style={{ width: `${Math.max(0, 100 - (loan.daysRemaining / 14 * 100))}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[10px] font-bold text-slate-400 text-right uppercase tracking-widest">
                        {loan.daysRemaining} days remaining
                      </p>
                    </CardContent>
                    <CardFooter className="bg-slate-50 p-4 px-6 flex justify-between gap-3">
                      <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2 text-slate-600 hover:bg-white hover:text-primary transition-all">
                        <RotateCcw className="h-4 w-4" />
                        Renew
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="rounded-xl font-black bg-white text-primary border border-slate-200 hover:bg-slate-50 transition-all gap-2" onClick={() => setSelectedLoan(loan)}>
                            View Details
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem]">
                          <DialogHeader className="p-6 pb-0">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="h-16 w-12 bg-slate-100 rounded-xl flex items-center justify-center border shadow-sm">
                                <Book className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <DialogTitle className="text-2xl font-black text-slate-900">{selectedLoan?.title}</DialogTitle>
                                <DialogDescription className="text-sm font-bold text-slate-500">{selectedLoan?.author}</DialogDescription>
                              </div>
                            </div>
                          </DialogHeader>
                          <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                              <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Loan ID</p>
                                <p className="text-sm font-black text-slate-700">{selectedLoan?.id}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Status</p>
                                <Badge className="bg-blue-50 text-blue-700 border-none font-black text-[10px]">{selectedLoan?.status}</Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Borrowed Date</p>
                                <p className="text-sm font-black text-slate-700">{selectedLoan?.borrowedDate}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Due Date</p>
                                <p className="text-sm font-black text-primary">{selectedLoan?.dueDate}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                               <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Library Rules</h4>
                               <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                     Maximum 2 renewals allowed
                                  </li>
                                  <li className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                     Daily fine of $0.50 after due date
                                  </li>
                               </ul>
                            </div>
                          </div>
                          <DialogFooter className="p-6 bg-slate-50 rounded-b-[2.5rem]">
                            <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20">
                               <RotateCcw className="h-5 w-5" />
                               Renew Book Now
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Book className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900">No active loans</h3>
                <p className="text-slate-500 max-w-xs text-center mt-2 font-medium">
                  Your reading list is empty. Explore the catalog and find your next favorite book.
                </p>
                <Button className="mt-6 rounded-2xl h-12 px-8 font-black shadow-lg shadow-primary/20" asChild>
                  <Link to="/portal/browse">Browse Catalog</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Book Title</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Borrowed</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Returned</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-8 py-5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loanHistory.map((loan) => (
                      <tr key={loan.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 group-hover:text-primary transition-colors">{loan.title}</span>
                            <span className="text-sm font-medium text-slate-500">{loan.author}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {loan.borrowedDate}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <History className="h-4 w-4 text-slate-400" />
                            {loan.returnedDate}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3">
                            {loan.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white transition-all text-slate-400 hover:text-primary" onClick={() => setSelectedLoan(loan)}>
                                <ExternalLink className="h-5 w-5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem]">
                              <DialogHeader className="p-6 pb-0">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="h-16 w-12 bg-slate-100 rounded-xl flex items-center justify-center border shadow-sm">
                                    <Book className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-2xl font-black text-slate-900">{selectedLoan?.title}</DialogTitle>
                                    <DialogDescription className="text-sm font-bold text-slate-500">{selectedLoan?.author}</DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>
                              <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Transaction ID</p>
                                    <p className="text-sm font-black text-slate-700">{selectedLoan?.id}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Final Status</p>
                                    <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[10px]">{selectedLoan?.status}</Badge>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Borrowed Date</p>
                                    <p className="text-sm font-black text-slate-700">{selectedLoan?.borrowedDate}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Returned Date</p>
                                    <p className="text-sm font-black text-emerald-600">{selectedLoan?.returnedDate}</p>
                                  </div>
                                </div>

                                <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                                   <p className="text-sm font-bold text-slate-500 italic">"Returned in excellent condition. No damages reported."</p>
                                </div>
                              </div>
                              <DialogFooter className="p-6 bg-slate-50 rounded-b-[2.5rem]">
                                <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20" asChild>
                                   <Link to={`/portal/books/BK-001`}>
                                      View Book in Catalog
                                   </Link>
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 flex justify-center pb-12">
               <Button variant="outline" className="rounded-2xl px-12 h-12 font-black border-slate-200 bg-white hover:bg-slate-50 transition-all">
                 Load More Records
               </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
