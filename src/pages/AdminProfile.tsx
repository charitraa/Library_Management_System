import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Calendar, MapPin } from "lucide-react";

export default function AdminProfile() {
  return (
    <Layout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback className="text-2xl">AD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin User</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Senior Librarian
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Administrator</Badge>
                <Badge variant="outline">Superuser</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact details and bio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue="admin@library.college.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <textarea 
                  id="bio" 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="Head librarian with over 10 years of experience in academic library management and digital archiving."
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined October 2022</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Central Campus Library</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Security</p>
                  <Button variant="link" className="p-0 h-auto text-primary">Change Password</Button>
                  <br />
                  <Button variant="link" className="p-0 h-auto text-primary">Two-Factor Auth</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Approved 3 reservations",
                    "Added new book: 'The Great Gatsby'",
                    "Updated library rules",
                  ].map((activity, i) => (
                    <div key={i} className="flex gap-3 text-sm items-start">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <p>{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
