import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure library rules, manage roles, and system preferences.</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="rules">Library Rules</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Library Information</CardTitle>
                <CardDescription>Update your library's public details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Library Name</Label>
                  <Input id="name" defaultValue="Central College Library" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Support Email</Label>
                  <Input id="email" defaultValue="library.support@college.edu" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Control how the system behaves.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label>Automatic Notifications</Label>
                       <p className="text-sm text-muted-foreground">Send email reminders for overdue books automatically.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label>Allow Public Registration</Label>
                       <p className="text-sm text-muted-foreground">Allow students to create accounts without admin approval.</p>
                    </div>
                    <Switch />
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
             <Card>
                <CardHeader>
                  <CardTitle>Loan & Fine Rules</CardTitle>
                  <CardDescription>Define borrowing limits and fine amounts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="maxBooks">Max Books per User</Label>
                      <Input id="maxBooks" type="number" defaultValue="5" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="loanPeriod">Default Loan Period (Days)</Label>
                      <Input id="loanPeriod" type="number" defaultValue="14" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fineAmount">Daily Fine Amount ($)</Label>
                    <Input id="fineAmount" type="number" step="0.5" defaultValue="0.5" />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                   <Button>Update Rules</Button>
                </CardFooter>
             </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
             <Card>
                <CardHeader>
                   <CardTitle>Roles & Permissions</CardTitle>
                   <CardDescription>Manage administrative access levels.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground mb-4">You have 3 active administrator accounts.</p>
                   <Button variant="outline">Manage Administrators</Button>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
