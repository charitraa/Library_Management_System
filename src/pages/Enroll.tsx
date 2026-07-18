import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { useDetailedRoles, useRequestEnrollment } from "@/hooks/api/use-users";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import pcpsLogo from "@/assets/pcpsLogo.png";

/** Public self-enrollment: visitors request a library account, staff approve it later. */
export default function Enroll() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: roles } = useDetailedRoles();
  const { mutate: enroll, isPending } = useRequestEnrollment();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    contactNo: "",
    address: "",
    dob: "",
    gender: "",
    enrollmentYear: "",
    collegeId: "",
    universityId: "",
    roleId: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Visitors may only request the low-privilege roles; staff roles are assigned by admins.
  const requestableRoles = (roles ?? []).filter(
    (role) => role.role === "Member" || role.role === "Faculty",
  );

  const handleSubmit = () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.address.trim() ||
      !form.contactNo.trim() ||
      !form.enrollmentYear ||
      !form.gender ||
      !form.roleId
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in every field marked with *.",
        variant: "destructive",
      });
      return;
    }

    enroll(
      { ...form, dob: form.dob || null },
      {
        onSuccess: () => setSubmitted(true),
        onError: (error) =>
          toast({
            title: "Enrollment failed",
            description: error.response?.data?.error ?? error.message,
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/browse" className="flex items-center gap-2">
            <img
              src={pcpsLogo}
              alt="PCPS College"
              className="h-9 w-9 rounded-lg object-contain bg-white p-0.5 shadow-sm"
            />
            <span className="text-xl font-bold tracking-tight hidden sm:block">PCPS Library</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-10 mx-auto">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/browse")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Join the Library</h1>
          </div>

          {submitted ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold">Enrollment request submitted</h2>
                <p className="text-muted-foreground max-w-md">
                  Your request has been sent to the library staff for approval. Once approved,
                  you'll be able to sign in with your card ID and the password you chose.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" asChild>
                    <Link to="/browse">Browse the Catalog</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/login">Go to Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Membership Enrollment</CardTitle>
                <CardDescription>
                  Request a library account. Staff review every enrollment before it becomes
                  active.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" placeholder="e.g. John Doe" value={form.fullName} onChange={set("fullName")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="student@college.edu" value={form.email} onChange={set("email")} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type="password" placeholder="Choose a password" value={form.password} onChange={set("password")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Preferred Role *</Label>
                    <Select value={form.roleId} onValueChange={(value) => setForm((prev) => ({ ...prev, roleId: value }))}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestableRoles.map((role) => (
                          <SelectItem key={role.roleId} value={role.roleId}>
                            {role.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="collegeId">College ID</Label>
                    <Input id="collegeId" placeholder="e.g. PCPS-2024-001" value={form.collegeId} onChange={set("collegeId")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universityId">University ID</Label>
                    <Input id="universityId" placeholder="University registration number" value={form.universityId} onChange={set("universityId")} />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={form.dob} onChange={set("dob")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={form.gender} onValueChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentYear">Enrollment Year *</Label>
                    <Input id="enrollmentYear" type="number" placeholder="2024" value={form.enrollmentYear} onChange={set("enrollmentYear")} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactNo">Phone Number *</Label>
                    <Input id="contactNo" type="tel" placeholder="+977 98XXXXXXXX" value={form.contactNo} onChange={set("contactNo")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" placeholder="City, District" value={form.address} onChange={set("address")} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 px-6 py-4 flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Already a member?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
                <Button className="gap-2" onClick={handleSubmit} disabled={isPending}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Request Enrollment
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
