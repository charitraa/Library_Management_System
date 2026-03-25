import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookPlus, ImageIcon, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AddBook = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Book added successfully",
      description: "The new book has been added to the catalog.",
    });
    navigate("/books");
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/books")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Book</h1>
            <p className="text-muted-foreground mt-1">Register a new title in the library catalog.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Book Information</CardTitle>
                <CardDescription>Enter the primary details of the book.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Book Title</Label>
                    <Input id="title" placeholder="e.g. The Great Gatsby" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" placeholder="e.g. F. Scott Fitzgerald" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN-13</Label>
                    <Input id="isbn" placeholder="978-3-16-148410-0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category / Genre</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="biography">Biography</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description / Synopsis</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a brief overview of the book..."
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Publishing Details</CardTitle>
                <CardDescription>Specify publication information and initial stock.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input id="publisher" placeholder="e.g. Penguin Books" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Publication</Label>
                    <Input id="year" type="number" placeholder="2024" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" placeholder="English" defaultValue="English" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="copies">Initial Copies</Label>
                    <Input id="copies" type="number" placeholder="1" defaultValue="1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Book Cover</CardTitle>
                <CardDescription>Upload a high-quality cover image.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="w-full aspect-[2/3] max-w-[200px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2 mb-4 group cursor-pointer hover:bg-slate-100 hover:border-primary/50 transition-all">
                  <ImageIcon className="w-10 h-10 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Click to upload</span>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Upload className="w-4 h-4" />
                  Select Image
                </Button>
                <p className="text-[10px] text-muted-foreground mt-3 text-center">
                  Recommended size: 600x900px. JPG, PNG supported.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button className="w-full h-11 gap-2 text-base shadow-sm" onClick={handleSave}>
                <BookPlus className="w-5 h-5" />
                Add Book to Catalog
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 text-base shadow-sm"
                onClick={() => navigate("/books")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddBook;
