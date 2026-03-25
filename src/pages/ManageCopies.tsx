import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  History,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockCopies = [
  {
    id: "CP-001-A",
    barcode: "1002231-A",
    status: "Available",
    condition: "Excellent",
    location: "Shelf A-12",
    lastChecked: "2024-05-10",
  },
  {
    id: "CP-001-B",
    barcode: "1002231-B",
    status: "On Loan",
    condition: "Good",
    location: "N/A",
    lastChecked: "2024-05-15",
    dueDate: "2024-06-05",
  },
  {
    id: "CP-001-C",
    barcode: "1002231-C",
    status: "Available",
    condition: "Excellent",
    location: "Shelf A-12",
    lastChecked: "2024-05-12",
  },
  {
    id: "CP-001-D",
    barcode: "1002231-D",
    status: "Damaged",
    condition: "Poor",
    location: "Repair Bin",
    lastChecked: "2024-05-01",
  },
  {
    id: "CP-001-E",
    barcode: "1002231-E",
    status: "Reserved",
    condition: "New",
    location: "Hold Shelf",
    lastChecked: "2024-05-18",
  },
];

const ManageCopies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Available</Badge>;
      case "On Loan":
        return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">On Loan</Badge>;
      case "Damaged":
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">Damaged</Badge>;
      case "Reserved":
        return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">Reserved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddCopy = () => {
    toast({
      title: "Copies added successfully",
      description: "5 new copies have been added to the system.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Copies</h1>
              <p className="text-muted-foreground mt-1">Book ID: {id || "BK-001"} | Title: The Great Gatsby</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Copy
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Copies</DialogTitle>
                <DialogDescription>
                  Enter the details for the new physical copies of this book.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="num-copies" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="num-copies"
                    type="number"
                    defaultValue="1"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="condition" className="text-right">
                    Condition
                  </Label>
                  <Select defaultValue="excellent">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    defaultValue="Shelf A-12"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddCopy}>Add Copies</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Copies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-emerald-600 mt-1">+1 since last month</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">20% of inventory</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Under Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Physical Inventory</CardTitle>
            <CardDescription>Individual copies of this book in the library system.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[150px]">Copy ID</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Check</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCopies.map((copy) => (
                  <TableRow key={copy.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-primary">{copy.id}</TableCell>
                    <TableCell className="font-mono text-sm">{copy.barcode}</TableCell>
                    <TableCell>{getStatusBadge(copy.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{copy.condition}</span>
                        {copy.condition === "Excellent" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                        {copy.condition === "Poor" && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {copy.status === "On Loan" ? (
                          <div className="flex items-center gap-1 text-slate-500 italic">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Due: {copy.dueDate}</span>
                          </div>
                        ) : (
                          <span>{copy.location}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{copy.lastChecked}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" title="Edit Condition">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" title="Print Barcode">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" title="Loan History">
                          <History className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 text-red-600 hover:text-red-700" title="Remove Copy">
                          <Trash2 className="h-4 w-4" />
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManageCopies;
