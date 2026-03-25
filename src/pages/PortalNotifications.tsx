import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Search, 
  Filter, 
  Check, 
  Trash2, 
  MoreVertical,
  AlertTriangle,
  Info,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const initialNotifications = [
  {
    id: 1,
    title: "Overdue Reminder",
    message: "Your loan for 'Design Systems' is now 1 day overdue. Please return it to avoid further fines.",
    time: "2 hours ago",
    type: "overdue",
    read: false,
  },
  {
    id: 2,
    title: "Reservation Ready",
    message: "'Dune' is now available for pickup at the main library desk. Your reservation is valid until May 25.",
    time: "5 hours ago",
    type: "ready",
    read: false,
  },
  {
    id: 3,
    title: "Account Fine Recorded",
    message: "A fine of $5.50 has been recorded for damaged pages in 'Atomic Habits'.",
    time: "1 day ago",
    type: "fine",
    read: true,
  },
  {
    id: 4,
    title: "New Book Arrival",
    message: "We've added 10 new titles to the Computer Science section. Check them out!",
    time: "2 days ago",
    type: "system",
    read: true,
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "overdue": return <AlertTriangle className="h-6 w-6 text-red-500" />;
    case "ready": return <BookOpen className="h-6 w-6 text-emerald-500" />;
    case "fine": return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    case "system": return <Info className="h-6 w-6 text-blue-500" />;
    default: return <Bell className="h-6 w-6 text-slate-400" />;
  }
};

export default function PortalNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const { toast } = useToast();

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    toast({
      title: "Marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "All marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Notification deleted",
      variant: "destructive",
    });
  };

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Notifications</h1>
            <p className="text-slate-500">Stay updated with your library activity and alerts.</p>
          </div>
          <Button variant="outline" size="lg" onClick={markAllAsRead} className="rounded-2xl font-black gap-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all h-14 px-8">
            <Check className="h-5 w-5" />
            Mark all as read
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search notifications..." 
              className="h-14 pl-12 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-base"
            />
          </div>
          <Button variant="outline" size="icon" className="h-14 w-14 shrink-0 rounded-2xl bg-white border-none shadow-sm text-slate-600">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`group relative flex items-start gap-6 rounded-[2.5rem] border p-8 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  !notif.read ? "bg-primary/5 border-primary/20 shadow-primary/5" : "bg-white border-slate-100 shadow-sm"
                }`}
              >
                <div className={`mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-white shadow-sm transition-all group-hover:scale-110 ${!notif.read ? "border-primary/30" : "border-slate-100"}`}>
                  {getTypeIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className={`text-lg leading-tight ${!notif.read ? "font-black text-slate-900" : "font-bold text-slate-600"}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && <Badge className="bg-primary hover:bg-primary font-black text-[10px] uppercase tracking-wider px-2">New</Badge>}
                  </div>
                  <p className={`text-base leading-relaxed ${!notif.read ? "text-slate-700 font-medium" : "text-slate-500 font-medium"}`}>
                    {notif.message}
                  </p>
                  <span className="text-sm font-bold text-slate-400 block pt-2">{notif.time}</span>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   {!notif.read && (
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                       onClick={() => markAsRead(notif.id)}
                       title="Mark as read"
                     >
                       <Check className="h-5 w-5" />
                     </Button>
                   )}
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                     onClick={() => deleteNotification(notif.id)}
                     title="Delete"
                   >
                     <Trash2 className="h-5 w-5" />
                   </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Bell className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900">No notifications</h3>
              <p className="text-slate-500 max-w-xs text-center mt-2 font-medium">
                You're all caught up! We'll notify you when something important happens.
              </p>
            </div>
          )}
        </div>

        {notifications.length > 5 && (
          <div className="flex justify-center pt-8 pb-12">
             <Button variant="ghost" className="rounded-2xl px-12 h-14 font-black text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
               Load More Notifications
             </Button>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
