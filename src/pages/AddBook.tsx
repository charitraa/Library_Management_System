import { useRef, useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookPlus, ChevronDown, ImageIcon, Loader2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAddBook } from "@/hooks/api/use-books";
import { useAuthors, useGenres, usePublishers } from "@/hooks/api/use-attributes";

/** Splits a comma/newline separated input into trimmed non-empty values. */
function splitList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const AddBook = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: authors } = useAuthors();
  const { data: genres } = useGenres();
  const { data: publishers } = usePublishers();

  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    callNumber: "",
    editionStatement: "",
    seriesStatement: "",
    publicationYear: "",
    numberOfPages: "",
    pricePerPiece: "",
    totalPieces: "",
    publisherId: "",
    isbns: "",
    barcodes: "",
    keywords: "",
  });
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const { mutate: addBook, isPending } = useAddBook();

  const handleSave = () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    if (!form.publisherId) {
      toast({ title: "Publisher is required", variant: "destructive" });
      return;
    }
    if (selectedAuthors.length === 0) {
      toast({ title: "Select at least one author", variant: "destructive" });
      return;
    }
    if (selectedGenres.length === 0) {
      toast({ title: "Select at least one genre", variant: "destructive" });
      return;
    }
    const isbns = splitList(form.isbns);
    if (isbns.length === 0) {
      toast({ title: "At least one ISBN is required", variant: "destructive" });
      return;
    }
    const barcodes = splitList(form.barcodes);
    const totalPieces = parseInt(form.totalPieces || "0", 10);
    if (totalPieces > 0 && barcodes.length === 0) {
      toast({
        title: "Barcodes required",
        description: "Provide one barcode per physical copy.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("subTitle", form.subTitle);
    data.append("callNumber", form.callNumber);
    data.append("editionStatement", form.editionStatement);
    data.append("seriesStatement", form.seriesStatement);
    data.append("publicationYear", form.publicationYear);
    data.append("numberOfPages", form.numberOfPages);
    data.append("pricePerPiece", form.pricePerPiece);
    data.append("totalPieces", form.totalPieces);
    data.append("publisherId", form.publisherId);
    isbns.forEach((isbn) => data.append("isbns[]", isbn));
    barcodes.forEach((barcode) => data.append("barcodes[]", barcode));
    selectedGenres.forEach((genreId) => data.append("bookGenres[]", genreId));
    selectedAuthors.forEach((authorId) => data.append("bookAuthors[]", authorId));
    splitList(form.keywords).forEach((keyword) => data.append("keywords[]", keyword));
    if (coverPhoto) data.append("coverPhoto", coverPhoto);

    addBook(data, {
      onSuccess: () => {
        toast({
          title: "Book added successfully",
          description: "The new book has been added to the catalog.",
        });
        navigate("/books");
      },
      onError: (error) => {
        toast({
          title: "Failed to add book",
          description: error.response?.data?.error ?? error.message,
          variant: "destructive",
        });
      },
    });
  };

  const authorOptions = authors?.data ?? [];
  const genreOptions = genres?.data ?? [];
  const publisherOptions = publishers?.data ?? [];

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
                    <Label htmlFor="title">Book Title *</Label>
                    <Input id="title" placeholder="e.g. The Great Gatsby" value={form.title} onChange={set("title")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subTitle">Sub Title</Label>
                    <Input id="subTitle" placeholder="Optional subtitle" value={form.subTitle} onChange={set("subTitle")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Authors *</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between font-normal">
                          {selectedAuthors.length > 0
                            ? `${selectedAuthors.length} selected`
                            : "Select authors"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto">
                        {authorOptions.map((author) => (
                          <DropdownMenuCheckboxItem
                            key={author.authorId}
                            checked={selectedAuthors.includes(author.authorId!)}
                            onCheckedChange={(checked) =>
                              setSelectedAuthors((prev) =>
                                checked
                                  ? [...prev, author.authorId!]
                                  : prev.filter((id) => id !== author.authorId),
                              )
                            }
                          >
                            {author.title ? `${author.title} ` : ""}
                            {author.fullName}
                          </DropdownMenuCheckboxItem>
                        ))}
                        {authorOptions.length === 0 && (
                          <p className="p-2 text-sm text-muted-foreground">No authors found.</p>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex flex-wrap gap-1">
                      {selectedAuthors.map((id) => {
                        const author = authorOptions.find((a) => a.authorId === id);
                        return author ? (
                          <Badge key={id} variant="secondary">{author.fullName}</Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Genres *</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between font-normal">
                          {selectedGenres.length > 0
                            ? `${selectedGenres.length} selected`
                            : "Select genres"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto">
                        {genreOptions.map((genre) => (
                          <DropdownMenuCheckboxItem
                            key={genre.genreId}
                            checked={selectedGenres.includes(genre.genreId!)}
                            onCheckedChange={(checked) =>
                              setSelectedGenres((prev) =>
                                checked
                                  ? [...prev, genre.genreId!]
                                  : prev.filter((id) => id !== genre.genreId),
                              )
                            }
                          >
                            {genre.genre}
                          </DropdownMenuCheckboxItem>
                        ))}
                        {genreOptions.length === 0 && (
                          <p className="p-2 text-sm text-muted-foreground">No genres found.</p>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex flex-wrap gap-1">
                      {selectedGenres.map((id) => {
                        const genre = genreOptions.find((g) => g.genreId === id);
                        return genre ? (
                          <Badge key={id} variant="secondary">{genre.genre}</Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="isbns">ISBNs * (comma separated)</Label>
                    <Input id="isbns" placeholder="978-3-16-148410-0, ..." value={form.isbns} onChange={set("isbns")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="callNumber">Call Number</Label>
                    <Input id="callNumber" placeholder="e.g. 813.52 F553g" value={form.callNumber} onChange={set("callNumber")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Input id="keywords" placeholder="e.g. jazz age, tragedy" value={form.keywords} onChange={set("keywords")} />
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
                    <Label htmlFor="publisher">Publisher *</Label>
                    <Select value={form.publisherId} onValueChange={(value) => setForm((prev) => ({ ...prev, publisherId: value }))}>
                      <SelectTrigger id="publisher">
                        <SelectValue placeholder="Select publisher" />
                      </SelectTrigger>
                      <SelectContent>
                        {publisherOptions.map((publisher) => (
                          <SelectItem key={publisher.publisherId} value={publisher.publisherId!}>
                            {publisher.publisherName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Publication *</Label>
                    <Input id="year" type="number" placeholder="2024" value={form.publicationYear} onChange={set("publicationYear")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pages">Number of Pages *</Label>
                    <Input id="pages" type="number" placeholder="320" value={form.numberOfPages} onChange={set("numberOfPages")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edition">Edition</Label>
                    <Input id="edition" placeholder="e.g. 2nd ed." value={form.editionStatement} onChange={set("editionStatement")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="series">Series</Label>
                    <Input id="series" placeholder="Optional series" value={form.seriesStatement} onChange={set("seriesStatement")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="copies">Total Copies *</Label>
                    <Input id="copies" type="number" placeholder="1" value={form.totalPieces} onChange={set("totalPieces")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price Per Copy *</Label>
                    <Input id="price" type="number" placeholder="500" value={form.pricePerPiece} onChange={set("pricePerPiece")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcodes">Barcodes (one per copy, comma or newline separated)</Label>
                  <Textarea
                    id="barcodes"
                    placeholder={"e.g. 100001, 100002"}
                    className="min-h-[80px]"
                    value={form.barcodes}
                    onChange={set("barcodes")}
                  />
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setCoverPhoto(e.target.files?.[0] ?? null)}
                />
                <div
                  className="w-full aspect-[2/3] max-w-[200px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2 mb-4 group cursor-pointer hover:bg-slate-100 hover:border-primary/50 transition-all overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {coverPhoto ? (
                    <img
                      src={URL.createObjectURL(coverPhoto)}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">Click to upload</span>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  {coverPhoto ? coverPhoto.name : "Select Image"}
                </Button>
                <p className="text-[10px] text-muted-foreground mt-3 text-center">
                  Recommended size: 600x900px. JPG, PNG supported.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button className="w-full h-11 gap-2 text-base shadow-sm" onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BookPlus className="w-5 h-5" />
                )}
                Add Book to Catalog
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 text-base shadow-sm"
                onClick={() => navigate("/books")}
                disabled={isPending}
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
