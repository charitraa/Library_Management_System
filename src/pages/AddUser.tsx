import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { useDetailedRoles, useRequestEnrollment } from "@/hooks/api/use-users";
import { useToast } from "@/hooks/use-toast";

export default function AddUser() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: roles } = useDetailedRoles();
  const { mutate: enroll, isPending } = useRequestEnrollment();

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

  const handleSubmit = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.roleId) {
      toast({
        title: "Missing required fields",
        description: "Full name, email, password, and role are required.",
        variant: "destructive",
      });
      return;
    }

    enroll(
      { ...form, dob: form.dob || null },
      {
        onSuccess: () => {
          toast({
            title: "Enrollment request submitted",
            description:
              "The member was registered. The account may need approval before it becomes active.",
          });
          navigate("/users");
        },
        onError: (error) =>
          toast({
            title: "Failed to register member",
            description: error.response?.data?.error ?? error.message,
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Member</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Member Registration</CardTitle>
            <CardDescription>
              Register a new student, staff, or faculty member to the library system.
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
                <Input id="password" type="password" placeholder="Initial password" value={form.password} onChange={set("password")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Member Role *</Label>
                <Select value={form.roleId} onValueChange={(value) => setForm((prev) => ({ ...prev, roleId: value }))}>
                  <SelectTrigger id="role">
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
                <Label htmlFor="gender">Gender</Label>
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
                <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                <Input id="enrollmentYear" type="number" placeholder="2024" value={form.enrollmentYear} onChange={set("enrollmentYear")} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactNo">Phone Number</Label>
                <Input id="contactNo" type="tel" placeholder="+977 98XXXXXXXX" value={form.contactNo} onChange={set("contactNo")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="City, District" value={form.address} onChange={set("address")} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 px-6 py-4 flex justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)} disabled={isPending}>
              Cancel
            </Button>
            <Button className="gap-2" onClick={handleSubmit} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Register Member
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
