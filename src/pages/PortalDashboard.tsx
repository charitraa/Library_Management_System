import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  Clock, 
  Calendar, 
  ArrowRight, 
  BookOpen, 
  Star,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PortalDashboard() {
  const activeLoans = [
    { title: "Design Systems", author: "Alla Kholmatova", dueDate: "Mar 24, 2024", daysLeft: 4 },
    { title: "Refactoring UI", author: "Adam Wathan", dueDate: "Mar 28, 2024", daysLeft: 8 },
  ];

  return (
    <PortalLayout>
      <div className="space-y-10">
        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 md:p-12 text-primary-foreground shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Hello, Student! 👋</h1>
            <p className="text-lg opacity-90 mb-8">
              Welcome to your personal library dashboard. You have <span className="font-bold underline">2 books</span> currently borrowed and no outstanding fines.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-2xl px-8 font-bold">
                <Link to="/portal/browse">Browse Books</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 rounded-2xl px-8" asChild>
                <Link to="/portal/loans">View My History</Link>
              </Button>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10" />
          <div className="absolute right-20 -bottom-10 h-64 w-64 rounded-full bg-white/10" />
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Stats & Loans */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Active Borrowed Books</h2>
              <Link to="/portal/loans" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View all loans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {activeLoans.map((loan, i) => (
                <Link key={i} to="/portal/books/BK-001">
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden group h-full">
                    <CardContent className="p-0 flex h-full">
                      <div className="w-1/3 bg-slate-100 flex items-center justify-center p-4">
                        <Book className="h-12 w-12 text-slate-300 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="w-2/3 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1 line-clamp-1">{loan.title}</h3>
                          <p className="text-sm text-slate-500 mb-4">{loan.author}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <Clock className={`h-3 w-3 ${loan.daysLeft < 5 ? "text-orange-500" : "text-emerald-500"}`} />
                            <span className={loan.daysLeft < 5 ? "text-orange-600" : "text-emerald-600"}>
                              {loan.daysLeft} days left
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">Due: {loan.dueDate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <Link key={item} to="/portal/books/BK-001" className="flex flex-col gap-3 group">
                    <div className="aspect-[3/4] rounded-2xl bg-slate-200 shadow-inner group-hover:shadow-lg transition-all overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Digital Minimalism</h4>
                      <p className="text-xs text-slate-500">Cal Newport</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-bold">4.8</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Portal Stats */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
                <CardDescription className="text-slate-400">Your activity this semester</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Books Read</span>
                  </div>
                  <span className="font-bold">14</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Reservations</span>
                  </div>
                  <span className="font-bold">1</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Star className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Fines Paid</span>
                  </div>
                  <span className="font-bold">$0.00</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-amber-50 border-amber-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                  <Calendar className="h-5 w-5" />
                  Due Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-2xl bg-white shadow-sm border border-amber-200">
                  <p className="text-sm font-bold text-slate-900">Design Systems</p>
                  <p className="text-xs text-slate-500 mt-1">Return by Thursday, March 24</p>
                  <Button size="sm" variant="outline" className="w-full mt-4 border-amber-200 hover:bg-amber-50 text-amber-900 rounded-xl">
                    Renew Loan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-3xl bg-indigo-600 p-8 text-white relative overflow-hidden group">
               <h4 className="text-xl font-bold mb-2 relative z-10">Lost a book?</h4>
               <p className="text-sm opacity-80 mb-6 relative z-10">Report it immediately to avoid excessive late fees.</p>
               <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100 rounded-2xl relative z-10 font-bold">
                 Contact Help
               </Button>
               <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
