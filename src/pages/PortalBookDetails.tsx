import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Bookmark, 
  Star, 
  Share2, 
  BookOpen, 
  Clock, 
  Calendar,
  User,
  ExternalLink,
  CheckCircle2,
  Info
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function PortalBookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isReserved, setIsReserved] = useState(false);

  // Mock data
  const book = {
    id: id || "BK-001",
    title: "Design Systems",
    author: "Alla Kholmatova",
    rating: 4.8,
    reviews: 124,
    category: "Design",
    publishedYear: "2017",
    pages: 312,
    language: "English",
    isbn: "978-3-945749-58-6",
    status: "Available",
    availableCopies: 3,
    totalCopies: 5,
    description: "Design Systems is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    summary: "A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications. Alla Kholmatova's book is the first book to focus on the approach to building these systems.",
  };

  const handleReserve = () => {
    setIsReserved(true);
    toast({
      title: "Book Reserved",
      description: "You've successfully reserved 'Design Systems'. We'll notify you when it's ready for pickup.",
    });
  };

  return (
    <PortalLayout>
      <div className="space-y-10 max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="rounded-2xl font-black gap-2 text-slate-500 hover:bg-slate-50 hover:text-primary transition-all" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
            Back to Catalog
          </Button>
          <div className="flex gap-3">
             <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200 bg-white shadow-sm hover:scale-110 transition-all">
                <Bookmark className="h-5 w-5 text-slate-400" />
             </Button>
             <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200 bg-white shadow-sm hover:scale-110 transition-all">
                <Share2 className="h-5 w-5 text-slate-400" />
             </Button>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: Book Cover and Quick Info */}
          <div className="space-y-8">
            <div className="aspect-[3/4] relative rounded-[3rem] bg-slate-100 overflow-hidden shadow-2xl border-8 border-white group">
               <div className="absolute inset-0 flex items-center justify-center font-black text-slate-300 text-3xl group-hover:scale-110 transition-all duration-700">
                  COVER ART
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Library Status</span>
                     <Badge className={
                       book.status === "Available" 
                         ? "bg-emerald-100 text-emerald-700 border-none font-black text-[10px]"
                         : "bg-amber-100 text-amber-700 border-none font-black text-[10px]"
                     }>
                        {book.status}
                     </Badge>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-slate-500">Available Copies</span>
                        <span className="text-slate-900">{book.availableCopies} of {book.totalCopies}</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                        />
                     </div>
                  </div>
                  <Separator className="bg-slate-100" />
                  <Button 
                    className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    disabled={isReserved}
                    onClick={handleReserve}
                  >
                    {isReserved ? (
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
                     Ready for pickup in 1-2 hours
                  </p>
               </div>
            </Card>
          </div>

          {/* Right: Book Details */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-none font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
                     {book.category}
                  </Badge>
                  <div className="flex items-center gap-1.5 bg-slate-100 px-4 py-1.5 rounded-full">
                     <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                     <span className="text-sm font-black text-slate-900">{book.rating}</span>
                     <span className="text-xs font-bold text-slate-400 ml-1">({book.reviews} Reviews)</span>
                  </div>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight uppercase italic underline decoration-primary/20 decoration-8 underline-offset-8">
                  {book.title}
                </h1>
                <p className="text-2xl font-bold text-slate-500">by {book.author}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6">
                 <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Published</p>
                    <p className="text-lg font-black text-slate-900">{book.publishedYear}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pages</p>
                    <p className="text-lg font-black text-slate-900">{book.pages}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Language</p>
                    <p className="text-lg font-black text-slate-900">{book.language}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ISBN</p>
                    <p className="text-base font-black text-slate-900 font-mono tracking-tight">{book.isbn}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Synopsis
                 </h3>
                 <div className="text-lg text-slate-600 font-medium leading-relaxed bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    {book.summary}
                    <br /><br />
                    {book.description}
                 </div>
              </div>
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
                                 <button key={s} className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 hover:border-primary transition-all group">
                                    <Star className="h-5 w-5 text-slate-200 group-hover:text-yellow-400 group-hover:fill-yellow-400 transition-colors" />
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Comment</Label>
                           <Textarea
                              placeholder="What did you think of this book?..."
                              className="min-h-[120px] rounded-[1.5rem] bg-white border-none shadow-sm p-6 text-base font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                           />
                        </div>
                        <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20">
                           Submit Review
                        </Button>
                     </div>
                  </div>
               </Card>

               <div className="space-y-4">
                  {[
                    { user: "Alex J.", rating: 5, comment: "Absolutely essential reading for anyone building digital products. This is the gold standard of design system guides.", date: "May 12, 2024" },
                    { user: "Sarah M.", rating: 4, comment: "Great practical advice and examples. Highly recommended!", date: "April 28, 2024" },
                  ].map((review, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col gap-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500">
                               {review.user[0]}
                             </div>
                             <div>
                                <h4 className="font-black text-slate-900 text-sm">{review.user}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</p>
                             </div>
                          </div>
                          <div className="flex gap-0.5">
                             {[...Array(5)].map((_, j) => (
                               <Star key={j} className={`h-3 w-3 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} />
                             ))}
                          </div>
                       </div>
                       <p className="text-slate-600 font-medium leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full py-8 font-black text-slate-400 hover:text-primary transition-all">
                  Read More Reviews
               </Button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-px w-full ${className}`} />
);
