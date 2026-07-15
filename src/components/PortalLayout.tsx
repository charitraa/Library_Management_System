import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMe, useLogout } from "@/hooks/api/use-auth";
import { useNotificationCount } from "@/hooks/api/use-notifications";
import { resUrl } from "@/api/entities";
import { 
  Home, 
  Search as SearchIcon, 
  Library, 
  History, 
  Calendar, 
  Receipt, 
  Bell, 
  User, 
  LogOut,
  Menu,
  BookPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import pcpsLogo from "@/assets/pcpsLogo.png";

const navItems = [
  { title: "Dashboard", url: "/portal", icon: Home },
  { title: "Browse Books", url: "/portal/browse", icon: Library },
  { title: "My Loans", url: "/portal/loans", icon: History },
  { title: "Reservations", url: "/portal/reservations", icon: Calendar },
  { title: "Fines & History", url: "/portal/fines", icon: Receipt },
  { title: "Request a Book", url: "/portal/request-book", icon: BookPlus },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: notificationCount } = useNotificationCount();
  const { mutate: logout } = useLogout(() => navigate("/login", { replace: true }));

  const user = me?.data;
  const initials = user?.fullName
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/portal" className="flex items-center gap-2">
              <img src={pcpsLogo} alt="PCPS College" className="h-9 w-9 rounded-lg object-contain bg-white p-0.5 shadow-sm" />
              <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">StudentLib</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    location.pathname === item.url 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:flex items-center">
              <SearchIcon className="absolute left-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Find a book..." 
                className="w-64 pl-9 bg-slate-100 border-none rounded-full focus-visible:ring-1" 
              />
            </div>

            <Button variant="ghost" size="icon" className="relative text-slate-600 rounded-full" asChild>
              <Link to="/portal/notifications">
                <Bell className="h-5 w-5" />
                {(notificationCount?.count ?? 0) > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white border border-white">
                    {notificationCount!.count > 99 ? "99+" : notificationCount!.count}
                  </span>
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ring-offset-2 hover:ring-2 hover:ring-primary/20 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={resUrl(user?.profilePicUrl)} />
                    <AvatarFallback>{initials || "ST"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName ?? "Student"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email ?? ""}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/portal/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/portal/notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" /> Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 flex items-center gap-2"
                  onSelect={() => logout()}
                >
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-600 rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Navigation menu for the student portal</SheetDescription>
                <div className="flex flex-col gap-6 py-4">
                  <Link to="/portal" className="flex items-center gap-2 px-2">
                    <img src={pcpsLogo} alt="PCPS College" className="h-8 w-8 rounded-lg object-contain bg-white p-0.5 shadow-sm" />
                    <span className="text-xl font-bold">StudentLib</span>
                  </Link>
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.url}
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                          location.pathname === item.url 
                          ? "bg-primary text-primary-foreground" 
                          : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 py-8 mx-auto">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container px-4 text-center">
          <p className="text-sm text-slate-500">
            © 2024 College Library Management System. Built for students.
          </p>
        </div>
      </footer>
    </div>
  );
}
