import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  Shield,
  Clock,
  BookOpen,
  Trophy,
  LogOut,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useMe, useLogout } from "@/hooks/api/use-auth";
import { useMyBooks, useMyDues } from "@/hooks/api/use-me";
import { useMyReservations } from "@/hooks/api/use-reservations";
import { resUrl } from "@/api/entities";

export default function PortalProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: me, isLoading } = useMe();
  const { data: myBooks } = useMyBooks();
  const { data: myDues } = useMyDues();
  const { data: myReservations } = useMyReservations({ page: 1, pageSize: 1 });
  const { mutate: logout } = useLogout(() => navigate("/login", { replace: true }));

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
        </div>
      </PortalLayout>
    );
  }

  const user = me?.data;
  const initials =
    user?.fullName
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  const allLoans = myBooks?.data ?? [];
  const returnedCount = allLoans.filter((loan) => loan.status !== "Active").length;
  const activeCount = allLoans.filter((loan) => loan.status === "Active").length;
  const reservationCount = myReservations?.info?.total ?? 0;
  const pendingDues = (myDues?.data ?? [])
    .filter((due) => due.status === "Pending")
    .reduce((sum, due) => sum + Number(due.amount ?? 0), 0);

  const infoField = (label: string, value?: string | null) => (
    <div className="grid gap-4">
      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</Label>
      <Input
        disabled
        value={value || "—"}
        className="h-14 px-6 rounded-2xl bg-slate-50 border-none shadow-sm text-base font-bold disabled:opacity-100 disabled:text-slate-500"
      />
    </div>
  );

  return (
    <PortalLayout>
      <div className="space-y-10 max-w-6xl mx-auto pb-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-10 rounded-[3rem] border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
            <Trophy className="h-60 w-60" />
          </div>
          <div className="relative">
            <Avatar className="h-44 w-44 rounded-[2.5rem] border-4 border-white shadow-2xl">
              <AvatarImage src={resUrl(user?.profilePicUrl)} />
              <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left relative">
            <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">{user?.fullName}</h1>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
                {user?.role?.role ?? "Member"}
              </Badge>
              <Badge className={`border-none px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest ${
                user?.accountStatus === "Active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {user?.accountStatus}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-bold">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 opacity-50" />
                {user?.cardId ?? "—"}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 opacity-50" />
                Joined{" "}
                {user?.accountCreationDate
                  ? new Date(user.accountCreationDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })
                  : "—"}
              </div>
              {user?.membership?.expiryDate && (
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 opacity-50" />
                  Membership until {new Date(user.membership.expiryDate as string).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl h-12 px-6 font-black border-slate-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-100 transition-all gap-2"
                onClick={() => logout()}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm rounded-[2.5rem] p-10 group hover:shadow-xl hover:-translate-y-2 transition-all bg-blue-50">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-all">
              <BookOpen className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-800 mb-2">Books Returned</p>
            <div className="text-4xl font-black text-blue-900">{returnedCount}</div>
          </Card>
          <Card className="border-none shadow-sm rounded-[2.5rem] p-10 group hover:shadow-xl hover:-translate-y-2 transition-all bg-emerald-50">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-all">
              <Clock className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800 mb-2">Current Loans</p>
            <div className="text-4xl font-black text-emerald-900">{activeCount}</div>
          </Card>
          <Card className="border-none shadow-sm rounded-[2.5rem] p-10 group hover:shadow-xl hover:-translate-y-2 transition-all bg-purple-50">
            <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-all">
              <Calendar className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-800 mb-2">Reservations</p>
            <div className="text-4xl font-black text-purple-900">{reservationCount}</div>
          </Card>
          <Card className="border-none shadow-sm rounded-[2.5rem] p-10 group hover:shadow-xl hover:-translate-y-2 transition-all bg-amber-50 text-amber-900">
            <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-all">
              <Trophy className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800 mb-2">Pending Fines</p>
            <div className="text-4xl font-black text-amber-900">Rs. {pendingDues.toFixed(0)}</div>
          </Card>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Personal Info */}
          <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="p-10 pb-0">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Personal Information</CardTitle>
                  <CardDescription className="text-base font-bold text-slate-400">
                    Contact the library desk to update these details.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-8 space-y-8">
              {infoField("Full Name", user?.fullName)}
              {infoField("Email Address", user?.email)}
              {infoField("Phone Number", user?.contactNo)}
              {infoField("Address", user?.address)}
            </CardContent>
          </Card>

          {/* Membership Info */}
          <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="p-10 pb-0">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Library Membership</CardTitle>
                  <CardDescription className="text-base font-bold text-slate-400">
                    Your account and membership details.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-8 space-y-8">
              {infoField("Card ID", user?.cardId)}
              {infoField("Roll Number", user?.rollNumber)}
              {infoField("Enrollment Year", user?.enrollMentYear)}
              {infoField(
                "Membership Valid Until",
                user?.membershipValidUntil ?? (user?.membership?.expiryDate as string | undefined)
                  ? new Date(
                      (user?.membershipValidUntil ?? user?.membership?.expiryDate) as string,
                    ).toLocaleDateString()
                  : undefined,
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
