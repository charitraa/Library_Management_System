import Layout from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Download,
  DollarSign,
  AlertCircle,
  Search,
  MoreVertical,
  Receipt,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Book } from "lucide-react";

const initialFines = [
  {
    id: "FIN-1001",
    user: "John Doe",
    userId: "USR-001",
    book: "The Great Gatsby",
    reason: "Late Return (3 days)",
    amount: 15.00,
    status: "Unpaid",
    date: "2024-03-10",
  },
  {
    id: "FIN-1002",
    user: "Jane Smith",
    userId: "USR-005",
    book: "Introduction to Algorithms",
    reason: "Damaged Page",
    amount: 5.50,
    status: "Paid",
    date: "2024-03-05",
  },
  {
    id: "FIN-1003",
    user: "Robert Brown",
    userId: "USR-012",
    book: "Atomic Habits",
    reason: "Lost Book Replacement",
    amount: 45.00,
    status: "Unpaid",
    date: "2024-03-12",
  },
  {
    id: "FIN-1004",
    user: "Alice Johnson",
    userId: "USR-008",
    book: "The Psychology of Money",
    reason: "Late Return (1 day)",
    amount: 5.00,
    status: "Paid",
    date: "2024-03-01",
  },
  {
    id: "FIN-1005",
    user: "Michael Chen",
    userId: "USR-022",
    book: "Clean Code",
    reason: "Late Return (5 days)",
    amount: 25.00,
    status: "Unpaid",
    date: "2024-03-15",
  },
];

export default function Fines() {
  const { toast } = useToast();
  const [fines, setFines] = useState(initialFines);
  const [selectedFine, setSelectedFine] = useState<any>(null);

  const handlePayNow = (id: string) => {
    setFines(fines.map(f => f.id === id ? { ...f, status: "Paid" } : f));
    toast({
      title: "Payment Successful",
      description: `Fine ${id} has been marked as paid.`,
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fines & Payments</h1>
            <p className="text-muted-foreground">
              Monitor outstanding fines, record payments, and manage financial records.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Records
            </Button>
            <Button className="gap-2">
              <Receipt className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold">$4,250.00</h3>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Outstanding Fines</p>
              <h3 className="text-2xl font-bold text-amber-600">$85.00</h3>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
              <h3 className="text-2xl font-bold text-emerald-600">98.2%</h3>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by user, book or fine ID..." className="pl-10 max-w-md" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        {/* Fines Table */}
        <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Fine ID</TableHead>
                <TableHead>User Details</TableHead>
                <TableHead>Reason & Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fines.map((fine) => (
                <TableRow key={fine.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-primary">{fine.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{fine.user}</span>
                      <span className="text-xs text-muted-foreground">{fine.userId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{fine.reason}</span>
                      <span className="text-xs text-muted-foreground">{fine.book}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">${fine.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-slate-500">{fine.date}</TableCell>
                  <TableCell>
                    <Badge
                      className={fine.status === "Paid" 
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" 
                        : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      }
                    >
                      {fine.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {fine.status === "Unpaid" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setSelectedFine(fine)}>
                              <CreditCard className="h-3.5 w-3.5" />
                              Pay Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Process Fine Payment</DialogTitle>
                              <DialogDescription>
                                Confirm payment for fine <strong>{selectedFine?.id}</strong>.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">User:</span>
                                <span className="font-medium">{selectedFine?.user}</span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Amount:</span>
                                <span className="font-bold text-lg">${selectedFine?.amount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Reason:</span>
                                <span className="font-medium">{selectedFine?.reason}</span>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedFine(null)}>Cancel</Button>
                              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handlePayNow(selectedFine.id)}>Confirm Payment</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2" onClick={() => setSelectedFine(fine)}>
                              <Eye className="h-3.5 w-3.5" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Fine Details - {selectedFine?.id}</DialogTitle>
                              <DialogDescription>
                                Full breakdown of the fine record.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="flex items-center justify-between">
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Payment Completed</Badge>
                                <span className="text-sm font-medium text-slate-500">Receipt #RCP-552</span>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-bold">
                                    <User className="h-3 w-3" /> Member
                                  </p>
                                  <p className="text-sm font-medium">{selectedFine?.user}</p>
                                  <p className="text-[10px] text-muted-foreground">{selectedFine?.userId}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-bold">
                                    <Calendar className="h-3 w-3" /> Date Issued
                                  </p>
                                  <p className="text-sm font-medium">{selectedFine?.date}</p>
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-bold">
                                  <Book className="h-3 w-3" /> Item / Reason
                                </p>
                                <p className="text-sm font-bold">{selectedFine?.book}</p>
                                <p className="text-sm text-slate-600 italic">"{selectedFine?.reason}"</p>
                              </div>

                              <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                                <span className="text-sm font-bold">Total Amount Paid</span>
                                <span className="text-xl font-bold text-emerald-600">${selectedFine?.amount.toFixed(2)}</span>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" className="w-full gap-2">
                                <Download className="h-4 w-4" />
                                Download Receipt
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Waive Fine</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        </div>
      </div>
    </Layout>
  );
}
