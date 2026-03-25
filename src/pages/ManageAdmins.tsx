import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, UserPlus, MoreHorizontal, Mail, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ManageAdmins() {
  const admins = [
    { name: "Sofia Davis", role: "Head Librarian", email: "sofia.d@library.edu", status: "Active" },
    { name: "Alex Johnson", role: "System Admin", email: "alex.j@library.edu", status: "Active" },
    { name: "Robert Reed", role: "Assistant Librarian", email: "robert.r@library.edu", status: "Away" },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Administrators</h1>
            <p className="text-muted-foreground">Control administrative access and roles for the library staff.</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Administrator
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Current Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{admin.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{admin.name}</span>
                            <span className="text-xs text-muted-foreground">{admin.role}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.status === "Active" ? "default" : "secondary"}>{admin.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Access Roles</CardTitle>
              <CardDescription>Definitions of available admin levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-bold flex items-center gap-2">
                  <Shield className="h-3 w-3 text-primary" />
                  Super Admin
                </p>
                <p className="text-xs text-muted-foreground">Full access to system settings, billing, and all modules.</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold flex items-center gap-2">
                  <Shield className="h-3 w-3 text-blue-500" />
                  Librarian
                </p>
                <p className="text-xs text-muted-foreground">Access to book, user, and loan management modules.</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold flex items-center gap-2">
                  <Shield className="h-3 w-3 text-slate-400" />
                  Staff
                </p>
                <p className="text-xs text-muted-foreground">Read-only access to catalog and limited loan processing.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
