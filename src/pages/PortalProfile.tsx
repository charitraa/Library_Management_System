import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Bell, 
  Lock, 
  Edit2, 
  Save,
  Clock,
  BookOpen,
  Trophy,
  LogOut,
  Camera
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function PortalProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@college.edu",
    phone: "+1 (555) 012-3456",
    memberId: "ST-2024-001",
    department: "Computer Science",
    joinedDate: "September 2023",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved successfully.",
    });
  };

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
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">JD</AvatarFallback>
             </Avatar>
             <button className="absolute bottom-2 right-2 h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center border-4 border-white shadow-xl hover:scale-110 transition-all hover:bg-primary">
                <Camera className="h-5 w-5" />
             </button>
           </div>
           <div className="flex-1 space-y-4 text-center md:text-left relative">
              <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                 <h1 className="text-4xl font-black tracking-tight text-slate-900">{profile.name}</h1>
                 <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">Premium Member</Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-bold">
                 <div className="flex items-center gap-2">
                    <User className="h-5 w-5 opacity-50" />
                    {profile.memberId}
                 </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 opacity-50" />
                    Joined {profile.joinedDate}
                 </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <Button className="h-12 px-8 rounded-2xl font-black gap-2 shadow-lg shadow-primary/20" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                 </Button>
                 <Button variant="outline" size="lg" className="rounded-2xl h-12 px-6 font-black border-slate-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-100 transition-all gap-2" asChild>
                    <Link to="/login">
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Link>
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
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-800 mb-2">Total Books Read</p>
              <div className="text-4xl font-black text-blue-900">142</div>
           </Card>
           <Card className="border-none shadow-sm rounded-[2.5rem] p-10 group hover:shadow-xl hover:-translate-y-2 transition-all bg-emerald-50">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-all">
                <Clock className="h-7 w-7" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800 mb-2">Current Loans</p>
              <div className="text-4xl font-black text-emerald-900">2</div>
           </Card>
           <Card className="border-none shadow-sm rounded-[2.5rem] p-10 group hover:shadow-xl hover:-translate-y-2 transition-all bg-purple-50">
              <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-all">
                <Calendar className="h-7 w-7" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-800 mb-2">Reservations</p>
              <div className="text-4xl font-black text-purple-900">1</div>
           </Card>
           <Card className="border-none shadow-sm rounded-[2.5rem] p-10 group hover:shadow-xl hover:-translate-y-2 transition-all bg-amber-50 text-amber-900">
              <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-all">
                <Trophy className="h-7 w-7" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800 mb-2">Achievements</p>
              <div className="text-4xl font-black text-amber-900">12</div>
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
                       <CardDescription className="text-base font-bold text-slate-400">Manage your contact details.</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-10 pt-8 space-y-8">
                 <div className="grid gap-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="h-14 px-6 rounded-2xl bg-slate-50 border-none shadow-sm text-base font-bold disabled:opacity-100 disabled:text-slate-500"
                    />
                 </div>
                 <div className="grid gap-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={profile.email} 
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="h-14 px-6 rounded-2xl bg-slate-50 border-none shadow-sm text-base font-bold disabled:opacity-100 disabled:text-slate-500"
                    />
                 </div>
                 <div className="grid gap-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={profile.phone} 
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="h-14 px-6 rounded-2xl bg-slate-50 border-none shadow-sm text-base font-bold disabled:opacity-100 disabled:text-slate-500"
                    />
                 </div>
                 <div className="grid gap-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Department / Major</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={profile.department} 
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                      className="h-14 px-6 rounded-2xl bg-slate-50 border-none shadow-sm text-base font-bold disabled:opacity-100 disabled:text-slate-500"
                    />
                 </div>
              </CardContent>
              {isEditing && (
                 <CardFooter className="p-10 pt-0">
                    <Button size="lg" className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20" onClick={handleSave}>
                       <Save className="h-5 w-5" />
                       Save Information
                    </Button>
                 </CardFooter>
              )}
           </Card>

           {/* Account Settings */}
           <div className="space-y-10">
              <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden bg-white">
                <CardHeader className="p-10 pb-0">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">Notifications</CardTitle>
                      <CardDescription className="text-base font-bold text-slate-400">Manage your alerts.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-8 space-y-6">
                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                      <div className="space-y-1">
                         <h4 className="font-black text-slate-900">Email Notifications</h4>
                         <p className="text-sm font-bold text-slate-400">Reminders for due dates and loans.</p>
                      </div>
                      <Switch defaultChecked />
                   </div>
                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                      <div className="space-y-1">
                         <h4 className="font-black text-slate-900">Reservation Alerts</h4>
                         <p className="text-sm font-bold text-slate-400">When a book is ready for pickup.</p>
                      </div>
                      <Switch defaultChecked />
                   </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden bg-slate-900 text-white relative">
                <CardHeader className="p-10 pb-0 relative z-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white/50">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-white">Security</CardTitle>
                      <CardDescription className="text-base font-bold text-white/40">Protect your account.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-8 space-y-4 relative z-10">
                   <p className="text-white/60 font-medium">Keep your account safe by updating your password regularly and enabling two-factor authentication.</p>
                   <div className="flex flex-col gap-3 pt-4">
                      <Button className="h-14 rounded-2xl font-black bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-white/5">
                         Change Account Password
                      </Button>
                      <Button variant="ghost" className="h-14 rounded-2xl font-black text-white hover:bg-white/10">
                         Enable Two-Factor Auth
                      </Button>
                   </div>
                </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </PortalLayout>
  );
}
