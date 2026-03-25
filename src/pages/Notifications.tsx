import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Info,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  MoreVertical,
  Check,
  Search,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const initialNotifications = [
  {
    id: 1,
    title: "Overdue Alert",
    message: "John Doe's loan for 'The Great Gatsby' is now 3 days overdue.",
    time: "10 minutes ago",
    type: "overdue",
    read: false,
  },
  {
    id: 2,
    title: "New Reservation",
    message: "A new reservation has been placed for 'Atomic Habits'.",
    time: "1 hour ago",
    type: "info",
    read: false,
  },
  {
    id: 3,
    title: "System Update",
    message: "Library management system will undergo maintenance at 12 AM tonight.",
    time: "5 hours ago",
    type: "system",
    read: true,
  },
  {
    id: 4,
    title: "Fine Paid",
    message: "Alice Johnson has successfully paid her fine of $5.00.",
    time: "1 day ago",
    type: "success",
    read: true,
  },
  {
    id: 5,
    title: "Membership Renewal",
    message: "Robert Brown's membership will expire in 7 days.",
    time: "2 days ago",
    type: "info",
    read: false,
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "overdue": return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "info": return <Info className="h-5 w-5 text-blue-500" />;
    case "system": return <Bell className="h-5 w-5 text-purple-500" />;
    case "success": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    default: return <Bell className="h-5 w-5" />;
  }
};

export default function Notifications() {
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
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
            <p className="text-muted-foreground">Stay updated with latest library activities and system alerts.</p>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notifications..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`group relative flex items-start gap-4 rounded-xl border p-6 transition-all hover:bg-slate-50 ${
                  !notif.read ? "bg-primary/5 border-primary/20" : "bg-card"
                }`}
              >
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm ${!notif.read ? "border-primary/30" : ""}`}>
                  {getTypeIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm ${!notif.read ? "font-bold" : "font-medium"}`}>{notif.title}</h4>
                    {!notif.read && <Badge className="h-1.5 w-1.5 rounded-full p-0 bg-primary" />}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-xs font-medium text-slate-400">{notif.time}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                         <MoreVertical className="h-4 w-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-48">
                       <DropdownMenuLabel>Notification Options</DropdownMenuLabel>
                       <DropdownMenuSeparator />
                       {!notif.read && (
                         <DropdownMenuItem onClick={() => markAsRead(notif.id)} className="gap-2">
                           <Check className="h-4 w-4" />
                           Mark as read
                         </DropdownMenuItem>
                       )}
                       <DropdownMenuItem className="gap-2">
                         <Bell className="h-4 w-4" />
                         Mute alerts
                       </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem 
                         onClick={() => deleteNotification(notif.id)} 
                         className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                       >
                         <Trash2 className="h-4 w-4" />
                         Delete
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold">No notifications</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                You're all caught up! No new notifications at the moment.
              </p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="flex justify-center pt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </Layout>
  );
}
