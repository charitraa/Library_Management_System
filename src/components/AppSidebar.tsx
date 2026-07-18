import {
  Book,
  Users,
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  Receipt,
  Bell,
  Library,
  BookOpen,
  MessageSquareText,
  AlertTriangle,
  ShoppingCart,
  UserCheck,
  Tags,
  ScanLine,
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
import pcpsLogo from "@/assets/pcpsLogo.png";

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
    title: "Circulation Desk",
    url: "/circulation",
    icon: ScanLine,
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
];

const catalogItems = [
  {
    title: "Online Books",
    url: "/online-books",
    icon: BookOpen,
  },
  {
    title: "Book Requests",
    url: "/book-requests",
    icon: MessageSquareText,
  },
  {
    title: "Lost Books",
    url: "/lost-books",
    icon: AlertTriangle,
  },
  {
    title: "Purchase Entries",
    url: "/purchase-entries",
    icon: ShoppingCart,
  },
  {
    title: "Enrollments",
    url: "/enrollments",
    icon: UserCheck,
  },
  {
    title: "Attributes",
    url: "/attributes",
    icon: Tags,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <img
            src={pcpsLogo}
            alt="PCPS College"
            className="h-8 w-8 rounded-lg object-contain bg-white"
          />
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
        <SidebarGroup>
          <SidebarGroupLabel>Catalog & Members</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {catalogItems.map((item) => (
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
