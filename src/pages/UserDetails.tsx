import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  History, 
  Book, 
  Mail,
  Phone,
  Calendar,
  Shield,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data
  const user = {
    id: id || "USR-001",
    name: "John Doe",
    email: "john.doe@college.edu",
    phone: "+1 (555) 012-3456",
    role: "Student",
    status: "Active",
    joinedDate: "2023-09-12",
    totalLoans: 12,
    outstandingFines: 0.00,
    address: "123 Campus Hall, Room 402",
    avatar: "JD"
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                Edit Member
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={() => setIsEditing(false)} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Profile Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-3xl">{user.avatar}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role}
                </CardDescription>
                <Badge 
                  className={`mt-2 ${user.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}`}
                >
                  {user.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {user.joinedDate}</span>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-center">
                   <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Loans</p>
                      <p className="text-lg font-bold">{user.totalLoans}</p>
                   </div>
                   <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fine Balance</p>
                      <p className="text-lg font-bold text-emerald-600">${user.outstandingFines.toFixed(2)}</p>
                   </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 gap-2">
                <Button variant="outline" className="flex-1 text-xs">Reset Password</Button>
                <Button variant="outline" className="flex-1 text-xs text-destructive hover:text-destructive">Suspend</Button>
              </CardFooter>
            </Card>
          </div>

          {/* User Details Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="loans">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                    <TabsTrigger value="loans" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-8">Current Loans</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-8">Loan History</TabsTrigger>
                    <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-8">Personal Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="loans" className="p-6">
                    <div className="space-y-4">
                      {[
                        { title: "Design Systems", date: "Mar 10, 2024", due: "Mar 24, 2024", status: "Active" },
                        { title: "Refactoring UI", date: "Mar 14, 2024", due: "Mar 28, 2024", status: "Active" },
                      ].map((loan, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Book className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{loan.title}</p>
                              <p className="text-xs text-muted-foreground">Borrowed on {loan.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-medium text-emerald-600">Due {loan.due}</p>
                             <Button variant="link" className="h-auto p-0 text-[10px] text-primary">Extend Loan</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="info" className="p-6 space-y-6">
                    <div className="grid gap-6">
                       <div className="grid gap-2">
                          <Label>Address</Label>
                          <p className="text-sm border p-3 rounded-lg bg-muted/20">{user.address}</p>
                       </div>
                       <Separator />
                       <div className="grid gap-2">
                          <Label>Account Security</Label>
                          <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                            <Shield className="h-4 w-4" />
                            2FA Enabled
                          </div>
                       </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
               <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Fines History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm text-muted-foreground mb-4">No outstanding fines for this member.</p>
                     <Button variant="ghost" className="w-full text-xs text-primary">View Payment History</Button>
                  </CardContent>
               </Card>

               <Card className="border-amber-100 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                      <AlertCircle className="h-5 w-5" />
                      Admin Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-xs text-amber-800">Member mentioned interest in UI/UX collection. Recommended upcoming design workshops.</p>
                  </CardContent>
               </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
