import PortalLayout from "@/components/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  BookOpen,
  CheckCircle2,
  Info,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBookInfo } from "@/hooks/api/use-books";
import { useAddMyReservation } from "@/hooks/api/use-reservations";
import { usePostComment, useRateBook } from "@/hooks/api/use-comments";
import { resUrl } from "@/api/entities";
import CommentSection from "@/components/CommentSection";

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-px w-full ${className}`} />
);

export default function PortalBookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isReserved, setIsReserved] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  const { data: book, isLoading, isError, error } = useBookInfo(id);

  const { mutate: reserve, isPending: isReserving } = useAddMyReservation({
    onSuccess: () => {
      setIsReserved(true);
      toast({
        title: "Book Reserved",
        description: `You've successfully reserved “${book?.title}”. We'll notify you when it's ready for pickup.`,
      });
    },
    onError: (err) =>
      toast({
        title: "Reservation failed",
        description: err.response?.data?.error ?? err.message,
        variant: "destructive",
      }),
  });

  const { mutate: rate, isPending: isRating } = useRateBook();
  const { mutate: postComment, isPending: isCommenting } = usePostComment(() => {
    setReviewText("");
    toast({ title: "Review submitted" });
  });

  const submitReview = () => {
    if (!id) return;
    if (reviewRating > 0) {
      rate({ bookInfoId: id, rating: reviewRating });
    }
    if (reviewText.trim()) {
      postComment({ bookInfoId: id, comment: reviewText.trim() });
    }
    if (reviewRating === 0 && !reviewText.trim()) {
      toast({ title: "Add a rating or comment first", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
        </div>
      </PortalLayout>
    );
  }

  if (isError || !book) {
    return (
      <PortalLayout>
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <p className="text-destructive">
            Failed to load book{error?.message ? `: ${error.message}` : "."}
          </p>
          <Button variant="outline" onClick={() => navigate("/portal/browse")}>
            Back to Catalog
          </Button>
        </div>
      </PortalLayout>
    );
  }

  const cover =
    resUrl(book.coverPhoto) ??
    resUrl(book.bookImages?.find((img) => img.isProfile)?.imageUrl ?? book.bookImages?.[0]?.imageUrl);
  const authors =
    book.bookAuthors?.map((ba) => ba.author?.fullName).filter(Boolean).join(", ") ||
    "Unknown author";
  const totalCopies = book.total ?? book.books?.length ?? 0;
  const availableCopies =
    book.available ?? book.books?.filter((copy) => copy.status === "Available").length ?? 0;
  const rating = book.score?.averageScore;
  const ratingCount = book.ratings?.length ?? 0;
  const firstGenre = book.bookGenres?.[0]?.genre?.genre;
  const isbn = book.isbns?.map((i) => i.isbn).join(", ");

  return (
    <PortalLayout>
      <div className="space-y-10 max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="rounded-2xl font-black gap-2 text-slate-500 hover:bg-slate-50 hover:text-primary transition-all" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
            Back to Catalog
          </Button>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: Book Cover and Quick Info */}
          <div className="space-y-8">
            <div className="aspect-[3/4] relative rounded-[3rem] bg-slate-100 overflow-hidden shadow-2xl border-8 border-white group">
              {cover ? (
                <img src={cover} alt={book.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-all duration-700" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-black text-slate-300 text-3xl">
                  NO COVER
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Library Status</span>
                  <Badge className={
                    availableCopies > 0
                      ? "bg-emerald-100 text-emerald-700 border-none font-black text-[10px]"
                      : "bg-amber-100 text-amber-700 border-none font-black text-[10px]"
                  }>
                    {availableCopies > 0 ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-500">Available Copies</span>
                    <span className="text-slate-900">{availableCopies} of {totalCopies}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${totalCopies ? (availableCopies / totalCopies) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <Separator className="bg-slate-100" />
                <Button
                  className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  disabled={isReserved || isReserving}
                  onClick={() => reserve({ bookInfoId: book.bookInfoId })}
                >
                  {isReserving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isReserved ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Reserved Successfully
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-5 w-5" />
                      Reserve This Book
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                  You'll be notified when a copy is assigned
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Book Details */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {firstGenre && (
                    <Badge className="bg-primary/10 text-primary border-none font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
                      {firstGenre}
                    </Badge>
                  )}
                  {!!rating && (
                    <div className="flex items-center gap-1.5 bg-slate-100 px-4 py-1.5 rounded-full">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-black text-slate-900">{Number(rating).toFixed(1)}</span>
                      <span className="text-xs font-bold text-slate-400 ml-1">({ratingCount} Ratings)</span>
                    </div>
                  )}
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  {book.title}
                </h1>
                {book.subTitle && <p className="text-xl text-slate-500">{book.subTitle}</p>}
                <p className="text-2xl font-bold text-slate-500">by {authors}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Published</p>
                  <p className="text-lg font-black text-slate-900">{book.publicationYear ?? "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pages</p>
                  <p className="text-lg font-black text-slate-900">{book.numberOfPages ?? "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Publisher</p>
                  <p className="text-lg font-black text-slate-900 line-clamp-1">
                    {book.publisher?.publisherName ?? book.publisher?.name ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ISBN</p>
                  <p className="text-base font-black text-slate-900 font-mono tracking-tight">{isbn || "—"}</p>
                </div>
              </div>

              {(book.bookKeywords?.length ?? 0) > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.bookKeywords!.map((bk) => (
                      <Badge key={bk.keywordId} variant="outline" className="rounded-full px-4 py-1">
                        {bk.keyword?.keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Reader Reviews
              </h3>

              {/* Add Review Form */}
              <Card className="border-none shadow-sm rounded-[2rem] bg-primary/5 p-8 border border-primary/10">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-black text-slate-900">Write a Review</h4>
                    <p className="text-sm font-bold text-slate-500">Share your thoughts with the community.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => setReviewRating(s)}
                            className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 hover:border-primary transition-all"
                          >
                            <Star
                              className={`h-5 w-5 transition-colors ${
                                s <= reviewRating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-slate-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Comment</Label>
                      <Textarea
                        placeholder="What did you think of this book?..."
                        className="min-h-[120px] rounded-[1.5rem] bg-white border-none shadow-sm p-6 text-base font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20"
                      onClick={submitReview}
                      disabled={isRating || isCommenting}
                    >
                      {(isRating || isCommenting) && <Loader2 className="h-5 w-5 animate-spin" />}
                      Submit Review
                    </Button>
                  </div>
                </div>
              </Card>

              <CommentSection bookInfoId={book.bookInfoId} />
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
