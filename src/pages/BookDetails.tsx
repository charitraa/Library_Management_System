import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  Book as BookIcon,
  Tag,
  Loader2,
  CalendarCheck,
  Pencil,
  Images,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBookInfo, useBookOverview, useDeleteBook } from "@/hooks/api/use-books";
import { resUrl } from "@/api/entities";
import { useToast } from "@/hooks/use-toast";
import EditBookDialog from "@/components/EditBookDialog";
import CoverPhotosDialog from "@/components/CoverPhotosDialog";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);

  const { data: book, isLoading, isError, error } = useBookInfo(id);
  const { data: overview } = useBookOverview(id);
  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook(() => {
    toast({ title: "Book deleted" });
    navigate("/books");
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (isError || !book) {
    return (
      <Layout>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-destructive">
            Failed to load book{error?.message ? `: ${error.message}` : "."}
          </p>
          <Button variant="outline" onClick={() => navigate("/books")}>
            Back to Catalog
          </Button>
        </div>
      </Layout>
    );
  }

  const authors =
    book.bookAuthors
      ?.map((ba) => ba.author?.fullName)
      .filter(Boolean)
      .join(", ") || "Unknown author";
  const isbns = book.isbns?.map((i) => i.isbn).join(", ");
  const cover =
    resUrl(book.coverPhoto) ??
    resUrl(book.bookImages?.find((img) => img.isProfile)?.imageUrl ?? book.bookImages?.[0]?.imageUrl);

  const availableCount = overview?.available?.length ?? book.available ?? 0;
  const issuedCount = overview?.issued?.length ?? book.issued ?? 0;
  const reservedCount = overview?.reserved?.length ?? 0;
  const totalCopies = book.total ?? book.books?.length ?? availableCount + issuedCount;

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setCoverOpen(true)}>
              <Images className="h-4 w-4" />
              Cover Photos
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit Details
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete book</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete “{book.title}”? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => deleteBook(book.bookInfoId)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start gap-6">
                <div className="h-48 w-32 shrink-0 overflow-hidden rounded-md border bg-muted shadow-md">
                  {cover ? (
                    <img src={cover} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                      NO COVER
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {book.bookGenres?.map((bg) => (
                        <Badge key={bg.bookGenreId} variant="outline">
                          {bg.genre?.genre}
                        </Badge>
                      ))}
                    </div>
                    <Badge
                      className={
                        availableCount > 0
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                          : ""
                      }
                    >
                      {availableCount > 0 ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold">{book.title}</h1>
                  {book.subTitle && (
                    <p className="text-muted-foreground">{book.subTitle}</p>
                  )}
                  <p className="text-xl text-muted-foreground">{authors}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookIcon className="h-4 w-4" />
                      {book.callNumber ?? book.classNumber ?? book.bookInfoId}
                    </span>
                    {isbns && (
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" /> ISBN: {isbns}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">Overview</TabsTrigger>
                    <TabsTrigger value="issued" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">Issued</TabsTrigger>
                    <TabsTrigger value="reserved" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">Reserved</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="py-6 space-y-6">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Publisher</span>
                        <span className="font-medium">
                          {book.publisher?.publisherName ?? book.publisher?.name ?? "—"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium">{book.publicationYear ?? "—"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Pages</span>
                        <span className="font-medium">{book.numberOfPages ?? "—"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Edition</span>
                        <span className="font-medium">{book.editionStatement ?? "—"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Series</span>
                        <span className="font-medium">{book.seriesStatement ?? "—"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Total Copies</span>
                        <span className="font-medium">{totalCopies}</span>
                      </div>
                    </div>
                    {book.bookKeywords && book.bookKeywords.length > 0 && (
                      <>
                        <Separator />
                        <div className="flex flex-wrap gap-1">
                          {book.bookKeywords.map((bk) => (
                            <Badge key={bk.keywordId} variant="secondary">
                              {bk.keyword?.keyword}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </TabsContent>
                  <TabsContent value="issued" className="py-6">
                    <div className="space-y-4">
                      {(overview?.issued ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No copies currently issued.
                        </p>
                      )}
                      {overview?.issued?.map((issue) => (
                        <div key={issue.issueId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{issue.user?.fullName}</span>
                            <span className="text-xs text-muted-foreground">{issue.user?.cardId}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Due {new Date(issue.dueDate).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="bg-muted">{issue.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="reserved" className="py-6">
                    <div className="space-y-4">
                      {(overview?.reserved ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No active reservations.
                        </p>
                      )}
                      {overview?.reserved?.map((reservation) => (
                        <div key={reservation.reservationId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{reservation.user?.fullName}</span>
                            <span className="text-xs text-muted-foreground">{reservation.user?.cardId}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {reservation.reservationDate
                              ? new Date(reservation.reservationDate).toLocaleDateString()
                              : "—"}
                          </span>
                          <Badge variant="outline" className="bg-muted">{reservation.status}</Badge>
                        </div>
                      ))}
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
                      <p className="text-lg font-bold">{availableCount} Copies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">On Loan</p>
                      <p className="text-lg font-bold">{issuedCount} Copies</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reservations</span>
                    <span className="font-bold">{reservedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Copies</span>
                    <span className="font-bold">{totalCopies}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4">
                <Button className="w-full" asChild>
                  <Link to={`/books/${book.bookInfoId}/copies`}>Manage Copies</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <EditBookDialog book={book} open={editOpen} onOpenChange={setEditOpen} />
      <CoverPhotosDialog bookInfoId={book.bookInfoId} open={coverOpen} onOpenChange={setCoverOpen} />
    </Layout>
  );
}
