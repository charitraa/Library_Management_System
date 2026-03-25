import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Book, Star, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

export default function PortalBrowse() {
  const categories = ["All", "Fiction", "Science", "History", "Design", "Philosophy"];
  const books = [
    { title: "Design Systems", author: "Alla Kholmatova", rating: 4.8, category: "Design", image: "DS" },
    { title: "Refactoring UI", author: "Adam Wathan", rating: 4.9, category: "Design", image: "RUI" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4.5, category: "Fiction", image: "GG" },
    { title: "Atomic Habits", author: "James Clear", rating: 4.9, category: "Philosophy", image: "AH" },
    { title: "Dune", author: "Frank Herbert", rating: 4.7, category: "Fiction", image: "DN" },
    { title: "Sapiens", author: "Yuval Noah Harari", rating: 4.6, category: "History", image: "SP" },
  ];

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Explore Catalog</h1>
          <p className="text-slate-500">Discover your next read from our curated collection.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by title, author, or genre..." 
              className="h-14 pl-12 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-base"
            />
          </div>
          <Button className="h-14 px-8 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Search className="h-5 w-5" />
            Find Book
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  i === 0 ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-xl bg-white border-slate-200">
            <Filter className="h-5 w-5 text-slate-600" />
          </Button>
        </div>

        {/* Book Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book, i) => (
            <div key={i} className="group flex flex-col gap-4 cursor-pointer">
              <div className="aspect-[3/4] relative rounded-[2rem] bg-slate-200 overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4">
                   <button className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all">
                      <Bookmark className="h-5 w-5" />
                   </button>
                </div>
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                   <Button className="w-full bg-white text-primary hover:bg-slate-100 rounded-xl font-bold" asChild>
                      <Link to={`/portal/books/BK-001`}>
                        View Details
                      </Link>
                   </Button>
                </div>
              </div>
              <div className="space-y-1 px-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-primary border-primary/20 bg-primary/5">
                    {book.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-black">{book.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">{book.author}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-8 pb-12">
           <Button variant="outline" size="lg" className="rounded-2xl px-12 font-bold border-slate-200 bg-white hover:bg-slate-50">
             Load More Books
           </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
