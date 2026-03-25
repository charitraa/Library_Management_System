import {
  Book,
  Users,
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  Receipt,
  Bell,
  BarChart3,
  Settings,
  Library,
  History,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Books",
    url: "/books",
    icon: Book,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Loans",
    url: "/loans",
    icon: ClipboardList,
  },
  {
    title: "Physical Loan",
    url: "/loans/new",
    icon: Library,
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: CalendarCheck,
  },
  {
    title: "Fines",
    url: "/fines",
    icon: Receipt,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: History,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Library className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">LibAdmin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
