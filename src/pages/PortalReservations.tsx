import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  Clock,
  Trash2,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCancelMyReservation, useMyReservations } from "@/hooks/api/use-reservations";
import { Reservation } from "@/api/entities";
import { useToast } from "@/hooks/use-toast";

export default function PortalReservations() {
  const { toast } = useToast();
  const [toCancel, setToCancel] = useState<Reservation | null>(null);

  const { data, isLoading, isError, error } = useMyReservations({ page: 1, pageSize: 50 });

  const { mutate: cancelReservation, isPending: isCancelling } = useCancelMyReservation({
    onSuccess: () => {
      toast({ title: "Reservation cancelled" });
      setToCancel(null);
    },
    onError: (err) =>
      toast({
        title: "Failed to cancel",
        description: err.response?.data?.error ?? err.message,
        variant: "destructive",
      }),
  });

  const reservations = data?.data ?? [];
  const pending = reservations.filter((r) => r.status === "Pending");
  const confirmed = reservations.filter((r) => r.status === "Confirmed");
  const active = [...confirmed, ...pending];
  const past = reservations.filter((r) => r.status !== "Pending" && r.status !== "Confirmed");

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
          Failed to load reservations{error?.message ? `: ${error.message}` : "."}
        </p>
      </PortalLayout>
    );
  }

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
              <div className="text-4xl font-black">{confirmed.length}</div>
              <p className="text-xs font-bold text-emerald-600 mt-2 uppercase tracking-widest">
                {confirmed.length > 0 ? "Action Required" : "Nothing waiting"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-[2rem] bg-blue-50 text-blue-900 overflow-hidden group">
            <CardHeader className="pb-2">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-blue-800">In Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">{pending.length}</div>
              <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-widest">Waiting for a copy</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-[2rem] bg-slate-100 text-slate-900 overflow-hidden group">
            <CardHeader className="pb-2">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-500 mb-2 group-hover:scale-110 transition-transform">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Past</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">{past.length}</div>
              <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Completed or cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Active reservations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">Active Reservations</h2>
          {active.length === 0 ? (
            <div className="rounded-[2rem] border-2 border-dashed p-12 text-center text-slate-500">
              No active reservations.{" "}
              <Link to="/portal/browse" className="text-primary font-bold hover:underline">
                Browse the catalog
              </Link>{" "}
              to reserve a book.
            </div>
          ) : (
            <div className="space-y-4">
              {active.map((reservation) => (
                <div key={reservation.reservationId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      reservation.status === "Confirmed" ? "bg-emerald-50" : "bg-blue-50"
                    }`}>
                      {reservation.status === "Confirmed" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">
                        {reservation.bookInfo?.title ?? "Unknown title"}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Requested{" "}
                        {new Date(
                          reservation.reservationDate ?? reservation.createdAt,
                        ).toLocaleDateString()}
                        {reservation.book?.barcode && (
                          <span className="font-mono ml-2">Copy: {reservation.book.barcode}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      reservation.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }>
                      {reservation.status === "Confirmed" ? "Ready for Pickup" : "In Queue"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:bg-red-50 rounded-xl"
                      title="Cancel reservation"
                      onClick={() => setToCancel(reservation)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past reservations */}
        {past.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Past Reservations</h2>
            <div className="space-y-4">
              {past.map((reservation) => (
                <div key={reservation.reservationId} className="flex items-center justify-between p-6 bg-white/60 border border-slate-100 rounded-[1.5rem]">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <CalendarCheck className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-700">
                        {reservation.bookInfo?.title ?? "Unknown title"}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {new Date(
                          reservation.reservationDate ?? reservation.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-slate-500">
                    {reservation.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Cancel confirmation */}
      <AlertDialog open={!!toCancel} onOpenChange={(open) => !open && setToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Cancel your reservation for “{toCancel?.bookInfo?.title}”? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isCancelling}
              onClick={(e) => {
                e.preventDefault();
                if (toCancel) cancelReservation({ reservationId: toCancel.reservationId });
              }}
            >
              {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PortalLayout>
  );
}
