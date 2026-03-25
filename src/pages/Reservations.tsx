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
  Check,
  X,
  Clock,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const reservations = [
  {
    id: "RES-901",
    book: "Atomic Habits",
    user: "John Doe",
    requestDate: "2024-03-12",
    position: 1,
    status: "Pending",
  },
  {
    id: "RES-902",
    book: "The Silent Patient",
    user: "Jane Smith",
    requestDate: "2024-03-10",
    position: 2,
    status: "Approved",
  },
  {
    id: "RES-903",
    book: "Psychology of Money",
    user: "Robert Brown",
    requestDate: "2024-03-14",
    position: 1,
    status: "Pending",
  },
  {
    id: "RES-904",
    book: "Dune",
    user: "Alice Johnson",
    requestDate: "2024-03-08",
    position: 3,
    status: "Expired",
  },
];

export default function Reservations() {
  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Reservations Queue</h1>
          <p className="text-muted-foreground">
            Manage book reservations and waiting lists.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
           <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Total Pending</span>
              <span className="text-2xl font-bold">12</span>
           </div>
           <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ready for Pickup</span>
              <span className="text-2xl font-bold text-emerald-600">5</span>
           </div>
           <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Avg. Wait Time</span>
              <span className="text-2xl font-bold">4 Days</span>
           </div>
           <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Expired Requests</span>
              <span className="text-2xl font-bold text-destructive">2</span>
           </div>
        </div>

        {/* Reservations Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Queue Pos.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell className="font-medium">{res.book}</TableCell>
                  <TableCell>{res.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {res.requestDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">#{res.position}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        res.status === "Approved"
                          ? "default"
                          : res.status === "Expired"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        res.status === "Pending"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none"
                          : res.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none"
                          : ""
                      }
                    >
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {res.status === "Pending" && (
                        <>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Clock className="h-4 w-4" />
                      </Button>
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
