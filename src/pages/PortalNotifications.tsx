import PortalLayout from "@/components/PortalLayout";
import NotificationList from "@/components/NotificationList";

export default function PortalNotifications() {
  return (
    <PortalLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
          <p className="text-muted-foreground">
            Reminders about your loans, reservations, and account.
          </p>
        </div>
        <NotificationList />
      </div>
    </PortalLayout>
  );
}
