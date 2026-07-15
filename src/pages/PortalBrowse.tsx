import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBooks } from "@/hooks/api/use-books";
import { useGenres } from "@/hooks/api/use-attributes";
import { resUrl } from "@/api/entities";

const PAGE_SIZE = 12;

export default function PortalBrowse() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<string>("");

  const { data: genresData } = useGenres();
  const { data, isLoading, isError, error, isFetching } = useBooks({
    page,
    pageSize: PAGE_SIZE,
    ...(search ? { seed: search } : {}),
    ...(genre ? { genre } : {}),
  });

  const genres = (genresData?.data ?? []).slice(0, 6);
  const books = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;

  const applySearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

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
              placeholder="Search by title, author, or keyword..."
              className="h-14 pl-12 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-base"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
          </div>
          <Button className="h-14 px-8 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20" onClick={applySearch}>
            <Search className="h-5 w-5" />
            Find Book
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                genre === "" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => {
                setGenre("");
                setPage(1);
              }}
            >
              All
            </button>
            {genres.map((g) => (
              <button
                key={g.genreId}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  genre === g.genre ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
                onClick={() => {
                  setGenre(g.genre);
                  setPage(1);
                }}
              >
                {g.genre}
              </button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
          </div>
        ) : isError ? (
          <p className="py-24 text-center text-destructive">
            Failed to load books{error?.message ? `: ${error.message}` : "."}
          </p>
        ) : books.length === 0 ? (
          <p className="py-24 text-center text-slate-500">No books match your search.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => {
              const cover =
                resUrl(book.coverPhoto) ??
                resUrl(book.bookImages?.find((img) => img.isProfile)?.imageUrl ?? book.bookImages?.[0]?.imageUrl);
              const rating = book.score?.averageScore;
              const firstGenre = book.bookGenres?.[0]?.genre?.genre;
              return (
                <Link key={book.bookInfoId} to={`/portal/books/${book.bookInfoId}`} className="group flex flex-col gap-4 cursor-pointer">
                  <div className="aspect-[3/4] relative rounded-[2rem] bg-slate-200 overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                    {cover && (
                      <img src={cover} alt={book.title} className="absolute inset-0 h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                      <span className="block w-full bg-white text-primary hover:bg-slate-100 rounded-xl font-bold text-center py-2 text-sm">
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <div className="flex items-center justify-between">
                      {firstGenre ? (
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-primary border-primary/20 bg-primary/5">
                          {firstGenre}
                        </Badge>
                      ) : (
                        <span />
                      )}
                      {!!rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-black">{Number(rating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-1">
                      {book.bookAuthors?.map((ba) => ba.author?.fullName).filter(Boolean).join(", ") || "Unknown author"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 pt-8 pb-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 font-bold border-slate-200 bg-white hover:bg-slate-50 gap-2"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-sm font-bold text-slate-500">
            Page {page} of {lastPage}
          </span>
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 font-bold border-slate-200 bg-white hover:bg-slate-50 gap-2"
            disabled={page >= lastPage || isFetching}
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
