import Layout from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const users = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@college.edu",
    role: "Student",
    status: "Active",
    joinedDate: "2023-09-12",
    avatar: "JD",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@college.edu",
    role: "Staff",
    status: "Active",
    joinedDate: "2022-01-20",
    avatar: "JS",
  },
  {
    id: "USR-003",
    name: "Robert Brown",
    email: "robert.b@college.edu",
    role: "Student",
    status: "Suspended",
    joinedDate: "2023-10-05",
    avatar: "RB",
  },
  {
    id: "USR-004",
    name: "Alice Johnson",
    email: "alice.j@college.edu",
    role: "Student",
    status: "Active",
    joinedDate: "2024-02-14",
    avatar: "AJ",
  },
  {
    id: "USR-005",
    name: "Michael Wilson",
    email: "m.wilson@college.edu",
    role: "Faculty",
    status: "Active",
    joinedDate: "2021-08-30",
    avatar: "MW",
  },
];

export default function Users() {
  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage library members, their access levels, and account status.
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link to="/users/add">
              <Plus className="h-4 w-4" />
              Add New User
            </Link>
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or ID..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Role
            </Button>
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? "default" : "destructive"}
                      className={user.status === "Active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2">
                          <Mail className="h-4 w-4" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link to={`/users/${user.id}`}>
                            <Edit className="h-4 w-4" /> Edit User
                          </Link>
                        </DropdownMenuItem>
                        {user.status === "Active" ? (
                          <DropdownMenuItem className="gap-2 text-amber-600">
                            <UserX className="h-4 w-4" /> Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="gap-2 text-emerald-600">
                            <UserCheck className="h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t bg-slate-50/30">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </Layout>
  );
}
