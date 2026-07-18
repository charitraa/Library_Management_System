import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import {
  useAuthors,
  useGenres,
  useKeywords,
  usePublishers,
} from "@/hooks/api/use-attributes";

/** Attribute filters applied to GET /books; values are attribute ids, "" = no filter. */
export interface CatalogFilterValues {
  author: string;
  genre: string;
  publisher: string;
  keyword: string;
}

export const EMPTY_CATALOG_FILTERS: CatalogFilterValues = {
  author: "",
  genre: "",
  publisher: "",
  keyword: "",
};

const ALL = "__all__";
const listParams = { page: 1, pageSize: 100 };

interface CatalogFiltersProps {
  value: CatalogFilterValues;
  onChange: (value: CatalogFilterValues) => void;
  className?: string;
}

export default function CatalogFilters({ value, onChange, className }: CatalogFiltersProps) {
  const { data: authors } = useAuthors(listParams);
  const { data: genres } = useGenres(listParams);
  const { data: publishers } = usePublishers(listParams);
  const { data: keywords } = useKeywords(listParams);

  const set = (key: keyof CatalogFilterValues) => (selected: string) =>
    onChange({ ...value, [key]: selected === ALL ? "" : selected });

  const hasFilters = Object.values(value).some(Boolean);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      <Select value={value.author || ALL} onValueChange={set("author")}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Author" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All authors</SelectItem>
          {(authors?.data ?? []).map((author) => (
            <SelectItem key={author.authorId} value={author.authorId!}>
              {author.fullName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.genre || ALL} onValueChange={set("genre")}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All genres</SelectItem>
          {(genres?.data ?? []).map((genre) => (
            <SelectItem key={genre.genreId} value={genre.genreId!}>
              {genre.genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.publisher || ALL} onValueChange={set("publisher")}>
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Publisher" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All publishers</SelectItem>
          {(publishers?.data ?? []).map((publisher) => (
            <SelectItem key={publisher.publisherId} value={publisher.publisherId!}>
              {publisher.publisherName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.keyword || ALL} onValueChange={set("keyword")}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Keyword" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All keywords</SelectItem>
          {(keywords?.data ?? []).map((keyword) => (
            <SelectItem key={keyword.keywordId} value={keyword.keywordId!}>
              {keyword.keyword}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => onChange(EMPTY_CATALOG_FILTERS)}
        >
          <FilterX className="h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
}
