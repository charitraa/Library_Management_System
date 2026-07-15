import Layout from "@/components/Layout";
import NotificationList from "@/components/NotificationList";

export default function Notifications() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">
            Stay updated with latest library activities and system alerts.
          </p>
        </div>
        <NotificationList />
      </div>
    </Layout>
  );
}
