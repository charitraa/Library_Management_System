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
  SelectValue 
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function AddUser() {
  const navigate = useNavigate();

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
            <CardDescription>Register a new student, staff, or faculty member to the library system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="e.g. John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="e.g. Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="student@college.edu" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role">Member Role</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff Member</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="external">External Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id">Member ID / Roll No.</Label>
                <Input id="id" placeholder="e.g. ST-2024-001" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 px-6 py-4 flex justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Register Member
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
