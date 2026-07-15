import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Loader2 } from "lucide-react";
import {
  useNotifications,
  useReadAllNotifications,
  useReadNotification,
} from "@/hooks/api/use-notifications";
import { useToast } from "@/hooks/use-toast";

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(dateString).toLocaleDateString();
}

/** Shared notification feed used by both the admin and portal notification pages. */
export default function NotificationList() {
  const { toast } = useToast();
  const { data, isLoading, isError, error } = useNotifications();
  const { mutate: readOne } = useReadNotification();
  const { mutate: readAll, isPending: isMarkingAll } = useReadAllNotifications();

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    readAll(
      { timestamp: new Date().toISOString() },
      {
        onSuccess: () => toast({ title: "All notifications marked as read" }),
        onError: (err) =>
          toast({
            title: "Failed to mark all as read",
            description: err.response?.data?.error ?? err.message,
            variant: "destructive",
          }),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-destructive">
        Failed to load notifications{error?.message ? `: ${error.message}` : "."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={isMarkingAll}
            className="gap-2"
          >
            {isMarkingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Mark all as read ({unreadCount})
          </Button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Bell className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold">No notifications</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            You're all caught up! No new notifications at the moment.
          </p>
        </div>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.notificationId}
            className={`group relative flex items-start gap-4 rounded-xl border p-6 transition-all hover:bg-slate-50 ${
              !notif.read ? "bg-primary/5 border-primary/20" : "bg-card"
            }`}
          >
            <div
              className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm ${
                !notif.read ? "border-primary/30" : ""
              }`}
            >
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className={`text-sm ${!notif.read ? "font-bold" : "font-medium"}`}>
                  {notif.title}
                </h4>
                {!notif.read && (
                  <Badge className="h-1.5 w-1.5 rounded-full p-0 bg-primary" />
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{notif.body}</p>
              <span className="text-xs font-medium text-slate-400">
                {timeAgo(notif.createdAt)}
              </span>
            </div>
            {!notif.read && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => readOne({ notificationId: notif.notificationId })}
              >
                <Check className="h-3.5 w-3.5" /> Mark read
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
