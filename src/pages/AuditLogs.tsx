import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockLogs = [
  {
    id: "LOG-001",
    user: "Admin Sarah",
    action: "Book Added",
    details: "Added 'The Great Gatsby' to the collection",
    date: "2024-05-20 09:45 AM",
    type: "Create",
    status: "Success",
  },
  {
    id: "LOG-002",
    user: "Librarian John",
    action: "Loan Processed",
    details: "Loan #L-5521 for Student ID #S-102",
    date: "2024-05-20 10:15 AM",
    type: "Update",
    status: "Success",
  },
  {
    id: "LOG-003",
    user: "System Admin",
    action: "User Suspended",
    details: "User ID #S-205 suspended for overdue fines",
    date: "2024-05-20 11:30 AM",
    type: "Update",
    status: "Success",
  },
  {
    id: "LOG-004",
    user: "Librarian Emily",
    action: "Fine Paid",
    details: "Fine #F-442 ($15.00) paid by User ID #S-105",
    date: "2024-05-19 02:45 PM",
    type: "Update",
    status: "Success",
  },
  {
    id: "LOG-005",
    user: "Admin Sarah",
    action: "Settings Updated",
    details: "Updated overdue fine rate to $0.50/day",
    date: "2024-05-19 04:20 PM",
    type: "Update",
    status: "Success",
  },
  {
    id: "LOG-006",
    user: "System Admin",
    action: "Database Backup",
    details: "Automated weekly backup completed",
    date: "2024-05-18 11:59 PM",
    type: "System",
    status: "Success",
  },
  {
    id: "LOG-007",
    user: "Librarian John",
    action: "Reservation Cancelled",
    details: "Reservation #R-302 cancelled for User ID #S-331",
    date: "2024-05-18 10:10 AM",
    type: "Delete",
    status: "Success",
  },
];

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Create":
        return "default";
      case "Update":
        return "secondary";
      case "Delete":
        return "destructive";
      case "System":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Track system activities and administrator actions.</p>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>View all recent logs and actions.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-8 bg-slate-50 border-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-slate-50 border-slate-200 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Last 30 Days</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[100px]">Log ID</TableHead>
                  <TableHead>User / Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="max-w-[300px]">Details</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-primary">{log.id}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="max-w-[300px] text-slate-600 truncate">{log.details}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{log.date}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(log.type) as any}>{log.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium text-slate-700">{log.status}</span>
                      </div>
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AuditLogs;
