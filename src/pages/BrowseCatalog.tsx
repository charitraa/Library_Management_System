import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Loader2, ChevronLeft, ChevronRight, LogIn, UserPlus } from "lucide-react";
import { useBooks } from "@/hooks/api/use-books";
import { useMe } from "@/hooks/api/use-auth";
import { resUrl } from "@/api/entities";
import { useToast } from "@/hooks/use-toast";
import CatalogFilters, {
  CatalogFilterValues,
  EMPTY_CATALOG_FILTERS,
} from "@/components/CatalogFilters";
import ThemeToggle from "@/components/ThemeToggle";
import pcpsLogo from "@/assets/pcpsLogo.png";

const PAGE_SIZE = 12;

/** Public (logged-out) catalog: anyone can browse; details require signing in. */
export default function BrowseCatalog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CatalogFilterValues>(EMPTY_CATALOG_FILTERS);

  const { data: me } = useMe();
  const isLoggedIn = !!me?.data?.userId;

  const { data, isLoading, isError, error, isFetching } = useBooks({
    page,
    pageSize: PAGE_SIZE,
    ...(search ? { seed: search } : {}),
    ...(filters.author ? { author: filters.author } : {}),
    ...(filters.genre ? { genre: filters.genre } : {}),
    ...(filters.publisher ? { publisher: filters.publisher } : {}),
    ...(filters.keyword ? { keyword: filters.keyword } : {}),
  });

  const books = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;

  const applySearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const openBook = (bookInfoId: string) => {
    if (isLoggedIn) {
      navigate(`/portal/books/${bookInfoId}`);
    } else {
      toast({
        title: "Sign in required",
        description: "Log in to view book details and make reservations.",
      });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/browse" className="flex items-center gap-2">
            <img
              src={pcpsLogo}
              alt="PCPS College"
              className="h-9 w-9 rounded-lg object-contain bg-white p-0.5 shadow-sm"
            />
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              PCPS Library
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button variant="outline" className="gap-2" asChild>
                <Link to="/portal">My Portal</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="gap-2" asChild>
                  <Link to="/enroll">
                    <UserPlus className="h-4 w-4" /> Join the Library
                  </Link>
                </Button>
                <Button className="gap-2" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-8 mx-auto space-y-8">
        <div className="flex flex-col gap-2 text-center py-6">
          <h1 className="text-4xl font-black tracking-tight">Explore the Catalog</h1>
          <p className="text-muted-foreground">
            Browse the full PCPS College library collection — no account needed.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or keyword..."
              className="h-12 pl-12 rounded-2xl"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
          </div>
          <Button className="h-12 px-8 rounded-2xl gap-2 font-bold" onClick={applySearch}>
            <Search className="h-5 w-5" />
            Find Book
          </Button>
        </div>

        <div className="flex justify-center">
          <CatalogFilters
            value={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <p className="py-24 text-center text-destructive">
            Failed to load books{error?.message ? `: ${error.message}` : "."}
          </p>
        ) : books.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">No books match your search.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => {
              const cover =
                resUrl(book.coverPhoto) ??
                resUrl(
                  book.bookImages?.find((img) => img.isProfile)?.imageUrl ??
                    book.bookImages?.[0]?.imageUrl,
                );
              const rating = book.score?.averageScore;
              const firstGenre = book.bookGenres?.[0]?.genre?.genre;
              return (
                <button
                  key={book.bookInfoId}
                  onClick={() => openBook(book.bookInfoId)}
                  className="group flex flex-col gap-4 cursor-pointer text-left"
                >
                  <div className="aspect-[3/4] relative rounded-[2rem] bg-muted overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                    {cover && (
                      <img
                        src={cover}
                        alt={book.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                      <span className="block w-full bg-white text-primary rounded-xl font-bold text-center py-2 text-sm">
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <div className="flex items-center justify-between">
                      {firstGenre ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold uppercase tracking-widest text-primary border-primary/20 bg-primary/5"
                        >
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
                    <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                      {book.bookAuthors
                        ?.map((ba) => ba.author?.fullName)
                        .filter(Boolean)
                        .join(", ") || "Unknown author"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 pt-8 pb-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 font-bold gap-2"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-sm font-bold text-muted-foreground">
            Page {page} of {lastPage}
          </span>
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 font-bold gap-2"
            disabled={page >= lastPage || isFetching}
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 PCPS College Library. <Link to="/enroll" className="text-primary hover:underline">Become a member</Link> to borrow and reserve books.
          </p>
        </div>
      </footer>
    </div>
  );
}
