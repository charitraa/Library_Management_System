import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  History, 
  Users, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  Book as BookIcon,
  Tag
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data
  const book = {
    id: id || "BK-001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0743273565",
    category: "Classic Literature",
    publisher: "Scribner",
    publishedYear: "1925",
    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    status: "Available",
    copies: 5,
    location: "Shelf A-12",
    totalLoans: 142
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                Edit Details
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={() => setIsEditing(false)} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start gap-6">
                <div className="h-48 w-32 bg-muted rounded-md shadow-md flex items-center justify-center text-xs font-bold text-muted-foreground border">
                  COVER
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{book.category}</Badge>
                    <Badge 
                      className={book.status === "Available" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" : ""}
                    >
                      {book.status}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold">{book.title}</h1>
                  <p className="text-xl text-muted-foreground">{book.author}</p>
                  <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><BookIcon className="h-4 w-4" /> {book.id}</span>
                    <span className="flex items-center gap-1"><Tag className="h-4 w-4" /> ISBN: {book.isbn}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">Overview</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">Loan History</TabsTrigger>
                    <TabsTrigger value="inventory" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">Inventory</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="py-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Description</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Publisher</span>
                        <span className="font-medium">{book.publisher}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium">{book.publishedYear}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Total Copies</span>
                        <span className="font-medium">{book.copies}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{book.location}</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="history" className="py-6">
                    <div className="space-y-4">
                      {[
                        { user: "John Doe", date: "Mar 12, 2024", status: "Returned" },
                        { user: "Jane Smith", date: "Feb 15, 2024", status: "Returned" },
                        { user: "Alice Johnson", date: "Jan 20, 2024", status: "Returned" },
                      ].map((loan, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{loan.user}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{loan.date}</span>
                          <Badge variant="outline" className="bg-muted">{loan.status}</Badge>
                        </div>
                      ))}
                      <Button variant="ghost" className="w-full text-primary text-xs">View Full History</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions / Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p className="text-lg font-bold">3 Copies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">On Loan</p>
                      <p className="text-lg font-bold">2 Copies</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Lifetime Loans</span>
                      <span className="font-bold">{book.totalLoans}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Loan Duration</span>
                      <span className="font-bold">12.4 Days</span>
                   </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4">
                <Button className="w-full" asChild>
                  <Link to={`/books/${id || "BK-001"}/copies`}>Manage Copies</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Librarian Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 h-11 bg-white">
                  <History className="h-4 w-4" />
                  Audit Logs
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 h-11 bg-white">
                  <ExternalLink className="h-4 w-4" />
                  View Public Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
