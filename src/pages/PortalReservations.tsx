import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarCheck, 
  Clock, 
  Trash2, 
  History, 
  Calendar,
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const reservations = [
  {
    id: "RES-9001",
    title: "Atomic Habits",
    author: "James Clear",
    requestDate: "2024-05-18",
    queuePosition: 2,
    status: "Pending",
    estimatedAvailable: "May 28, 2024",
  },
  {
    id: "RES-8950",
    title: "Dune",
    author: "Frank Herbert",
    requestDate: "2024-05-20",
    queuePosition: 1,
    status: "Ready for Pickup",
    pickupBy: "May 25, 2024",
  },
];

const completedReservations = [
  {
    id: "RES-8700",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    requestDate: "2024-04-10",
    completedDate: "2024-04-18",
    status: "Loaned",
  },
  {
    id: "RES-8520",
    title: "Clean Code",
    author: "Robert C. Martin",
    requestDate: "2024-03-20",
    completedDate: "2024-03-22",
    status: "Cancelled",
  },
];

export default function PortalReservations() {
  return (
    <PortalLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Reservations</h1>
          <p className="text-slate-500">Manage your book waiting list and pickup status.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
           <Card className="border-none shadow-sm rounded-[2rem] bg-emerald-50 text-emerald-900 overflow-hidden group">
              <CardHeader className="pb-2">
                 <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-800">Ready for Pickup</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-4xl font-black">1</div>
                 <p className="text-xs font-bold text-emerald-600 mt-2 uppercase tracking-widest">Action Required</p>
              </CardContent>
           </Card>
           <Card className="border-none shadow-sm rounded-[2rem] bg-blue-50 text-blue-900 overflow-hidden group">
              <CardHeader className="pb-2">
                 <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                    <Clock className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-blue-800">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-4xl font-black">1</div>
                 <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-widest">In Queue</p>
              </CardContent>
           </Card>
           <Card className="border-none shadow-sm rounded-[2rem] bg-slate-100 text-slate-900 overflow-hidden group">
              <CardHeader className="pb-2">
                 <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-600 mb-2 group-hover:scale-110 transition-transform">
                    <History className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">Total Completed</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-4xl font-black">42</div>
                 <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Lifetime History</p>
              </CardContent>
           </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-6">
            <TabsTrigger value="active" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Active Waiting List
            </TabsTrigger>
            <TabsTrigger value="history" className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Reservation History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {reservations.map((res) => (
              <Card key={res.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
                <CardHeader className="flex flex-row items-start justify-between pb-2 p-8 px-10">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-16 bg-slate-100 rounded-2xl flex items-center justify-center border shadow-sm group-hover:bg-primary/5 transition-colors">
                      <CalendarCheck className="h-8 w-8 text-slate-400 group-hover:text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Badge className={
                          res.status === "Ready for Pickup" 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-black text-[10px]"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-black text-[10px]"
                        }>
                          {res.status}
                        </Badge>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {res.id}</span>
                      </div>
                      <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                        {res.title}
                      </CardTitle>
                      <CardDescription className="text-base font-bold text-slate-500">
                        {res.author}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Queue Position</span>
                     <span className="text-3xl font-black text-primary">#{res.queuePosition}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-10 pb-8 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Requested Date</p>
                      <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {res.requestDate}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-1 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
                        {res.status === "Ready for Pickup" ? "Pickup Deadline" : "Estimated Availability"}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-black text-primary">
                        <Clock className="h-4 w-4" />
                        {res.status === "Ready for Pickup" ? res.pickupBy : res.estimatedAvailable}
                        <Info className="h-4 w-4 ml-1 opacity-50" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 p-6 px-10 flex justify-between gap-3 border-t">
                  <Button variant="ghost" size="lg" className="rounded-2xl font-black text-red-600 hover:bg-red-50 transition-all gap-2">
                    <Trash2 className="h-5 w-5" />
                    Cancel Reservation
                  </Button>
                  <Button size="lg" className="rounded-2xl h-14 px-8 font-black bg-white text-primary border-2 border-slate-200 hover:bg-slate-50 hover:border-primary/20 transition-all shadow-sm gap-2" asChild>
                    <Link to={`/portal/books/BK-001`}>
                      Book Details
                      <ChevronRight className="h-5 w-5" />
                    </Link>
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
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Book Title</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Requested</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Resolved</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedReservations.map((res) => (
                      <tr key={res.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 group-hover:text-primary transition-colors">{res.title}</span>
                            <span className="text-sm font-medium text-slate-500">{res.author}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {res.requestDate}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <CheckCircle2 className="h-4 w-4 text-slate-400" />
                            {res.completedDate}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <Badge variant="outline" className={`font-black px-3 ${
                            res.status === "Loaned" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {res.status}
                          </Badge>
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
