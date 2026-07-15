import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePendingEnrollments, useApproveEnrollment } from "@/hooks/api/use-enrollments";
import { useDetailedRoles } from "@/hooks/api/use-users";
import { useMembershipTypes } from "@/hooks/api/use-attributes";
import { Enrollment, resUrl } from "@/api/entities";
import { useToast } from "@/hooks/use-toast";

function todayPlusMonths(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split("T")[0];
}

export default function EnrollmentApprovals() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Enrollment | null>(null);

  const { data, isLoading, isError, error } = usePendingEnrollments({
    page: 1,
    pageSize: 50,
    ...(search.trim() ? { seed: search.trim() } : {}),
  });
  const { data: roles } = useDetailedRoles();
  const { data: membershipTypes } = useMembershipTypes();
  const { mutate: approve, isPending: isApproving } = useApproveEnrollment();

  const [form, setForm] = useState({
    roleId: "",
    membershipTypeId: "",
    rollNumber: "",
    password: "",
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: todayPlusMonths(12),
    accountStatus: "Active",
  });

  const openApprove = (enrollment: Enrollment) => {
    setSelected(enrollment);
    setForm({
      roleId: enrollment.roleId ?? "",
      membershipTypeId: "",
      rollNumber: "",
      password: "",
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: todayPlusMonths(12),
      accountStatus: "Active",
    });
  };

  const handleApprove = () => {
    if (!selected) return;
    if (!form.roleId || !form.membershipTypeId) {
      toast({ title: "Role and membership type are required", variant: "destructive" });
      return;
    }
    approve(
      {
        userId: selected.userId,
        fullName: selected.fullName,
        dob: selected.dob,
        address: selected.address,
        contactNo: selected.contactNo,
        enrollmentYear: selected.enrollmentYear,
        gender: selected.gender,
        email: selected.email,
        universityId: selected.universityId,
        collegeId: selected.collegeId,
        profilePicUrl: selected.profilePicUrl,
        roleId: form.roleId,
        membershipTypeId: form.membershipTypeId,
        rollNumber: form.rollNumber,
        password: form.password,
        accountStatus: form.accountStatus,
        startDate: form.startDate,
        expiryDate: form.expiryDate,
      },
      {
        onSuccess: () => {
          toast({ title: "Enrollment approved", description: `${selected.fullName} is now a member.` });
          setSelected(null);
        },
        onError: (err) =>
          toast({
            title: "Failed to approve enrollment",
            description: err.response?.data?.error ?? err.message,
            variant: "destructive",
          }),
      },
    );
  };

  const enrollments = data?.data ?? [];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enrollment Approvals</h1>
          <p className="text-muted-foreground">
            Review new member sign-ups and activate their accounts.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>College ID</TableHead>
                <TableHead>Enrollment Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-destructive">
                    Failed to load enrollments{error?.message ? `: ${error.message}` : "."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && enrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No pending enrollment requests.
                  </TableCell>
                </TableRow>
              )}
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={resUrl(enrollment.profilePicUrl)} />
                        <AvatarFallback>{enrollment.fullName?.[0] ?? "?"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{enrollment.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{enrollment.email}</TableCell>
                  <TableCell className="font-mono text-xs">{enrollment.collegeId}</TableCell>
                  <TableCell>{enrollment.enrollmentYear}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => openApprove(enrollment)}
                    >
                      <UserCheck className="h-4 w-4" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Approve Enrollment</DialogTitle>
            <DialogDescription>
              Assign a role and membership for {selected?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Contact</p>
                <p>{selected?.contactNo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Address</p>
                <p>{selected?.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="app-role">Role *</Label>
                <Select value={form.roleId} onValueChange={(v) => setForm((prev) => ({ ...prev, roleId: v }))}>
                  <SelectTrigger id="app-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(roles ?? []).map((role) => (
                      <SelectItem key={role.roleId} value={role.roleId}>
                        {role.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-membership">Membership Type *</Label>
                <Select
                  value={form.membershipTypeId}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, membershipTypeId: v }))}
                >
                  <SelectTrigger id="app-membership">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(membershipTypes ?? []).map((type) => (
                      <SelectItem key={type.membershipTypeId} value={type.membershipTypeId}>
                        {type.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="app-roll">Roll Number</Label>
                <Input
                  id="app-roll"
                  value={form.rollNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, rollNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-password">Set Password</Label>
                <Input
                  id="app-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="app-start">Membership Start</Label>
                <Input
                  id="app-start"
                  type="date"
                  value={form.startDate as string}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-expiry">Membership Expiry</Label>
                <Input
                  id="app-expiry"
                  type="date"
                  value={form.expiryDate as string}
                  onChange={(e) => setForm((prev) => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)} disabled={isApproving}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isApproving} className="bg-emerald-600 hover:bg-emerald-700">
              {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve & Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
