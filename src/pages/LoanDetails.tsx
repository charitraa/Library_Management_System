import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Book,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  RotateCcw,
  Printer,
  Mail,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const loan = {
    id: id || "LN-8401",
    bookTitle: "The Great Gatsby",
    bookId: "BK-001",
    copyId: "CP-001-A",
    borrower: "John Doe",
    borrowerId: "USR-001",
    borrowerEmail: "john.doe@example.com",
    issueDate: "2024-03-01",
    dueDate: "2024-03-15",
    returnDate: null,
    status: "Active",
    librarian: "Admin Sarah",
    notes: "Student requested 1 week extension on initial checkout.",
    renewals: 1,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Active</Badge>;
      case "Overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "Returned":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Returned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Loan Details</h1>
              <p className="text-muted-foreground mt-1">Transaction ID: {loan.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
            {loan.status !== "Returned" && (
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Mark as Returned
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Loan Information</CardTitle>
                  <CardDescription>Details about the borrowing period and status.</CardDescription>
                </div>
                {getStatusBadge(loan.status)}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Issue Date
                    </p>
                    <p className="font-medium">{loan.issueDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> Due Date
                    </p>
                    <p className="font-bold text-blue-600">{loan.dueDate}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Renewals Remaining</span>
                    <span className="font-medium">{2 - loan.renewals} of 2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Issued By</span>
                    <span className="font-medium">{loan.librarian}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Librarian Notes</p>
                  <div className="bg-slate-50 p-3 rounded-lg border text-sm text-slate-600 italic">
                    "{loan.notes}"
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 flex justify-between">
                <Button variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Renew Loan
                </Button>
                <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  Report Problem
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Activity history for this loan transaction.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-8 ring-white">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Book Issued</p>
                      <p className="text-xs text-muted-foreground">March 1, 2024 at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-8 ring-white">
                      <RotateCcw className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Loan Renewed</p>
                      <p className="text-xs text-muted-foreground">March 8, 2024 at 11:15 AM</p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Due Date Reminder Sent</p>
                      <p className="text-xs text-muted-foreground">March 13, 2024 at 09:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Book className="h-4 w-4 text-primary" /> Book Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center border text-slate-400 font-bold text-xs uppercase tracking-widest">
                  Cover Art
                </div>
                <div className="space-y-1">
                  <Link to={`/books/${loan.bookId}`} className="font-bold hover:text-primary transition-colors block">
                    {loan.bookTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">Copy ID: {loan.copyId}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/books/${loan.bookId}`}>View Catalog Page</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Borrower Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    JD
                  </div>
                  <div className="space-y-0.5">
                    <Link to={`/users/${loan.borrowerId}`} className="text-sm font-bold hover:text-primary transition-colors">
                      {loan.borrower}
                    </Link>
                    <p className="text-xs text-muted-foreground">{loan.borrowerEmail}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    Contact Member
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/users/${loan.borrowerId}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {loan.status === "Overdue" && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-red-700 flex items-center gap-2">
                    <Receipt className="h-4 w-4" /> Pending Fine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">$15.00</div>
                  <p className="text-xs text-red-600 mt-1">Accruing $0.50 per day</p>
                  <Button size="sm" className="w-full mt-4 bg-red-600 hover:bg-red-700">
                    View Fine Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanDetails;
