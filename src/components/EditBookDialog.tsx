import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2 } from "lucide-react";
import { BookInfo } from "@/api/entities";
import { useAuthors, useGenres, usePublishers } from "@/hooks/api/use-attributes";
import {
  useUpdateBookAuthors,
  useUpdateBookGenres,
  useUpdateBookInfo,
  useUpdateBookIsbns,
  useUpdateBookKeywords,
} from "@/hooks/api/use-book-edit";
import { useToast } from "@/hooks/use-toast";

function splitList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

interface EditBookDialogProps {
  book: BookInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditBookDialog({ book, open, onOpenChange }: EditBookDialogProps) {
  const { toast } = useToast();
  const { data: authorsData } = useAuthors();
  const { data: genresData } = useGenres();
  const { data: publishersData } = usePublishers();

  const [form, setForm] = useState({
    title: book.title,
    subTitle: book.subTitle ?? "",
    callNumber: book.callNumber ?? book.classNumber ?? "",
    editionStatement: book.editionStatement ?? "",
    seriesStatement: book.seriesStatement ?? "",
    publicationYear: String(book.publicationYear ?? ""),
    numberOfPages: String(book.numberOfPages ?? ""),
    publisherId: book.publisherId ?? "",
  });
  const [authorIds, setAuthorIds] = useState<string[]>(
    book.bookAuthors?.map((ba) => ba.authorId) ?? [],
  );
  const [genreIds, setGenreIds] = useState<string[]>(
    book.bookGenres?.map((bg) => bg.genreId) ?? [],
  );
  const [isbns, setIsbns] = useState(book.isbns?.map((i) => i.isbn).join(", ") ?? "");
  const [keywords, setKeywords] = useState(
    book.bookKeywords?.map((bk) => bk.keyword?.keyword).filter(Boolean).join(", ") ?? "",
  );

  useEffect(() => {
    if (!open) return;
    setForm({
      title: book.title,
      subTitle: book.subTitle ?? "",
      callNumber: book.callNumber ?? book.classNumber ?? "",
      editionStatement: book.editionStatement ?? "",
      seriesStatement: book.seriesStatement ?? "",
      publicationYear: String(book.publicationYear ?? ""),
      numberOfPages: String(book.numberOfPages ?? ""),
      publisherId: book.publisherId ?? "",
    });
    setAuthorIds(book.bookAuthors?.map((ba) => ba.authorId) ?? []);
    setGenreIds(book.bookGenres?.map((bg) => bg.genreId) ?? []);
    setIsbns(book.isbns?.map((i) => i.isbn).join(", ") ?? "");
    setKeywords(book.bookKeywords?.map((bk) => bk.keyword?.keyword).filter(Boolean).join(", ") ?? "");
  }, [open, book]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const { mutateAsync: updateInfo, isPending: isSavingInfo } = useUpdateBookInfo();
  const { mutateAsync: updateAuthors, isPending: isSavingAuthors } = useUpdateBookAuthors();
  const { mutateAsync: updateGenres, isPending: isSavingGenres } = useUpdateBookGenres();
  const { mutateAsync: updateIsbns, isPending: isSavingIsbns } = useUpdateBookIsbns();
  const { mutateAsync: updateKeywords, isPending: isSavingKeywords } = useUpdateBookKeywords();

  const isSaving = isSavingInfo || isSavingAuthors || isSavingGenres || isSavingIsbns || isSavingKeywords;

  const handleSave = async () => {
    try {
      await Promise.all([
        updateInfo({ bookInfoId: book.bookInfoId, ...form }),
        updateAuthors({ infoId: book.bookInfoId, authors: authorIds }),
        updateGenres({ infoId: book.bookInfoId, genres: genreIds }),
        updateIsbns({ infoId: book.bookInfoId, isbns: splitList(isbns) }),
        updateKeywords({ infoId: book.bookInfoId, keywords: splitList(keywords) }),
      ]);
      toast({ title: "Book updated" });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Failed to update book",
        description: error.response?.data?.error ?? error.message,
        variant: "destructive",
      });
    }
  };

  const authorOptions = authorsData?.data ?? [];
  const genreOptions = genresData?.data ?? [];
  const publisherOptions = publishersData?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book Details</DialogTitle>
          <DialogDescription>Update the catalog record for “{book.title}”.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={form.title} onChange={set("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subtitle">Sub Title</Label>
              <Input id="edit-subtitle" value={form.subTitle} onChange={set("subTitle")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Authors</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    {authorIds.length > 0 ? `${authorIds.length} selected` : "Select authors"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto">
                  {authorOptions.map((author) => (
                    <DropdownMenuCheckboxItem
                      key={author.authorId}
                      checked={authorIds.includes(author.authorId!)}
                      onCheckedChange={(checked) =>
                        setAuthorIds((prev) =>
                          checked ? [...prev, author.authorId!] : prev.filter((id) => id !== author.authorId),
                        )
                      }
                    >
                      {author.fullName}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-wrap gap-1">
                {authorIds.map((id) => {
                  const author = authorOptions.find((a) => a.authorId === id);
                  return author ? <Badge key={id} variant="secondary">{author.fullName}</Badge> : null;
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Genres</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    {genreIds.length > 0 ? `${genreIds.length} selected` : "Select genres"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto">
                  {genreOptions.map((genre) => (
                    <DropdownMenuCheckboxItem
                      key={genre.genreId}
                      checked={genreIds.includes(genre.genreId!)}
                      onCheckedChange={(checked) =>
                        setGenreIds((prev) =>
                          checked ? [...prev, genre.genreId!] : prev.filter((id) => id !== genre.genreId),
                        )
                      }
                    >
                      {genre.genre}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-wrap gap-1">
                {genreIds.map((id) => {
                  const genre = genreOptions.find((g) => g.genreId === id);
                  return genre ? <Badge key={id} variant="secondary">{genre.genre}</Badge> : null;
                })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-publisher">Publisher</Label>
              <Select
                value={form.publisherId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, publisherId: value }))}
              >
                <SelectTrigger id="edit-publisher">
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
              <Label htmlFor="edit-year">Publication Year</Label>
              <Input id="edit-year" type="number" value={form.publicationYear} onChange={set("publicationYear")} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-callnumber">Call Number</Label>
              <Input id="edit-callnumber" value={form.callNumber} onChange={set("callNumber")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pages">Pages</Label>
              <Input id="edit-pages" type="number" value={form.numberOfPages} onChange={set("numberOfPages")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-edition">Edition</Label>
              <Input id="edit-edition" value={form.editionStatement} onChange={set("editionStatement")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-series">Series</Label>
              <Input id="edit-series" value={form.seriesStatement} onChange={set("seriesStatement")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-isbns">ISBNs (comma separated)</Label>
              <Input id="edit-isbns" value={isbns} onChange={(e) => setIsbns(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-keywords">Keywords (comma separated)</Label>
            <Input id="edit-keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
