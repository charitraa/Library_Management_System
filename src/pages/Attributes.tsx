import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import {
  Author,
  Genre,
  Keyword,
  Publisher,
  useAddAuthor,
  useAddGenre,
  useAddKeyword,
  useAddPublisher,
  useAuthors,
  useDeleteAuthor,
  useDeleteGenre,
  useDeleteKeyword,
  useDeletePublisher,
  useGenres,
  useGlobalAttributes,
  useKeywords,
  useMembershipTypes,
  usePublishers,
  useUpdateAuthor,
  useUpdateGenre,
  useUpdateGlobalAttributes,
  useUpdateKeyword,
  useUpdatePublisher,
} from "@/hooks/api/use-attributes";
import { useToast } from "@/hooks/use-toast";

function AuthorsPanel() {
  const { toast } = useToast();
  const { data, isLoading } = useAuthors();
  const { mutate: add, isPending: isAdding } = useAddAuthor(() => {
    setTitle("");
    setFullName("");
    toast({ title: "Author added" });
  });
  const { mutate: update } = useUpdateAuthor();
  const { mutate: remove } = useDeleteAuthor(() => toast({ title: "Author deleted" }));

  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState({ title: "", fullName: "" });

  const authors = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authors</CardTitle>
        <CardDescription>Manage the author list used in book cataloging.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Title (e.g. Dr.)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-32" />
          <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Button
            className="gap-2 shrink-0"
            disabled={isAdding || !fullName.trim()}
            onClick={() => add({ title, fullName } as Author)}
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </div>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
        ) : (
          <div className="divide-y rounded-md border">
            {authors.length === 0 && <p className="p-4 text-sm text-muted-foreground">No authors yet.</p>}
            {authors.map((author) => (
              <div key={author.authorId} className="flex items-center justify-between p-3">
                {editingId === author.authorId ? (
                  <div className="flex flex-1 gap-2">
                    <Input value={editValue.title} onChange={(e) => setEditValue((p) => ({ ...p, title: e.target.value }))} className="w-24" />
                    <Input value={editValue.fullName} onChange={(e) => setEditValue((p) => ({ ...p, fullName: e.target.value }))} />
                  </div>
                ) : (
                  <span className="text-sm">{author.title ? `${author.title} ` : ""}{author.fullName}</span>
                )}
                <div className="flex gap-1">
                  {editingId === author.authorId ? (
                    <>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => {
                        update({ authorId: author.authorId, ...editValue });
                        setEditingId(null);
                      }}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                      setEditingId(author.authorId!);
                      setEditValue({ title: author.title ?? "", fullName: author.fullName });
                    }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(author.authorId!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GenresPanel() {
  const { toast } = useToast();
  const { data, isLoading } = useGenres();
  const { mutate: add, isPending: isAdding } = useAddGenre(() => {
    setValue("");
    toast({ title: "Genre added" });
  });
  const { mutate: update } = useUpdateGenre();
  const { mutate: remove } = useDeleteGenre(() => toast({ title: "Genre deleted" }));

  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const genres = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genres</CardTitle>
        <CardDescription>Manage book genres/categories.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Genre name" value={value} onChange={(e) => setValue(e.target.value)} />
          <Button className="gap-2 shrink-0" disabled={isAdding || !value.trim()} onClick={() => add({ genre: value } as Genre)}>
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </div>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
        ) : (
          <div className="divide-y rounded-md border">
            {genres.length === 0 && <p className="p-4 text-sm text-muted-foreground">No genres yet.</p>}
            {genres.map((genre) => (
              <div key={genre.genreId} className="flex items-center justify-between p-3">
                {editingId === genre.genreId ? (
                  <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 mr-2" />
                ) : (
                  <span className="text-sm">{genre.genre}</span>
                )}
                <div className="flex gap-1">
                  {editingId === genre.genreId ? (
                    <>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => {
                        update({ genreId: genre.genreId, genre: editValue });
                        setEditingId(null);
                      }}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                      setEditingId(genre.genreId!);
                      setEditValue(genre.genre);
                    }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(genre.genreId!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PublishersPanel() {
  const { toast } = useToast();
  const { data, isLoading } = usePublishers();
  const { mutate: add, isPending: isAdding } = useAddPublisher(() => {
    setName("");
    setAddress("");
    toast({ title: "Publisher added" });
  });
  const { mutate: update } = useUpdatePublisher();
  const { mutate: remove } = useDeletePublisher(() => toast({ title: "Publisher deleted" }));

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState({ publisherName: "", address: "" });

  const publishers = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishers</CardTitle>
        <CardDescription>Manage the publisher list.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Publisher name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Button
            className="gap-2 shrink-0"
            disabled={isAdding || !name.trim()}
            onClick={() => add({ publisherName: name, address } as Publisher)}
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </div>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
        ) : (
          <div className="divide-y rounded-md border">
            {publishers.length === 0 && <p className="p-4 text-sm text-muted-foreground">No publishers yet.</p>}
            {publishers.map((publisher) => (
              <div key={publisher.publisherId} className="flex items-center justify-between p-3">
                {editingId === publisher.publisherId ? (
                  <div className="flex flex-1 gap-2">
                    <Input value={editValue.publisherName} onChange={(e) => setEditValue((p) => ({ ...p, publisherName: e.target.value }))} />
                    <Input value={editValue.address} onChange={(e) => setEditValue((p) => ({ ...p, address: e.target.value }))} />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{publisher.publisherName}</span>
                    {publisher.address && <span className="text-xs text-muted-foreground">{publisher.address}</span>}
                  </div>
                )}
                <div className="flex gap-1">
                  {editingId === publisher.publisherId ? (
                    <>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => {
                        update({ publisherId: publisher.publisherId, ...editValue });
                        setEditingId(null);
                      }}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                      setEditingId(publisher.publisherId!);
                      setEditValue({ publisherName: publisher.publisherName, address: publisher.address ?? "" });
                    }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(publisher.publisherId!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function KeywordsPanel() {
  const { toast } = useToast();
  const { data, isLoading } = useKeywords();
  const { mutate: add, isPending: isAdding } = useAddKeyword(() => {
    setValue("");
    toast({ title: "Keyword added" });
  });
  const { mutate: update } = useUpdateKeyword();
  const { mutate: remove } = useDeleteKeyword(() => toast({ title: "Keyword deleted" }));

  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const keywords = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keywords</CardTitle>
        <CardDescription>Manage searchable keywords/tags for books.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Keyword" value={value} onChange={(e) => setValue(e.target.value)} />
          <Button className="gap-2 shrink-0" disabled={isAdding || !value.trim()} onClick={() => add({ keyword: value } as Keyword)}>
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </div>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
        ) : (
          <div className="divide-y rounded-md border">
            {keywords.length === 0 && <p className="p-4 text-sm text-muted-foreground">No keywords yet.</p>}
            {keywords.map((keyword) => (
              <div key={keyword.keywordId} className="flex items-center justify-between p-3">
                {editingId === keyword.keywordId ? (
                  <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 mr-2" />
                ) : (
                  <span className="text-sm">{keyword.keyword}</span>
                )}
                <div className="flex gap-1">
                  {editingId === keyword.keywordId ? (
                    <>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => {
                        update({ keywordId: keyword.keywordId, keyword: editValue });
                        setEditingId(null);
                      }}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                      setEditingId(keyword.keywordId!);
                      setEditValue(keyword.keyword);
                    }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(keyword.keywordId!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MembershipTypesPanel() {
  const { data, isLoading } = useMembershipTypes();
  const types = data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Types</CardTitle>
        <CardDescription>Read-only list of membership tiers configured on the backend.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
        ) : (
          <div className="divide-y rounded-md border">
            {types.length === 0 && <p className="p-4 text-sm text-muted-foreground">No membership types configured.</p>}
            {types.map((type) => (
              <div key={type.membershipTypeId} className="flex items-center justify-between p-3 text-sm">
                <span className="font-medium">{type.type}</span>
                <span className="text-muted-foreground">Precedence {type.precedence}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GlobalSettingsPanel() {
  const { toast } = useToast();
  const { data, isLoading } = useGlobalAttributes();
  const { mutate: update, isPending: isSaving } = useUpdateGlobalAttributes();
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    setForm(
      Object.fromEntries(
        Object.entries(data).map(([key, val]) => [key, val === undefined || val === null ? "" : String(val)]),
      ),
    );
  }, [data]);

  const field = (key: string, label: string) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type="number"
        value={form[key] ?? ""}
        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
      />
    </div>
  );

  const handleSave = () => {
    const payload: Record<string, number | string> = { globalAttributeId: data?.globalAttributeId ?? "" };
    Object.entries(form).forEach(([key, val]) => {
      if (key === "globalAttributeId" || key === "updatedAt") return;
      payload[key] = val === "" ? undefined : Number(val);
    });
    update(payload as any, {
      onSuccess: () => toast({ title: "Global settings updated" }),
      onError: (err) =>
        toast({
          title: "Failed to update settings",
          description: err.response?.data?.error ?? err.message,
          variant: "destructive",
        }),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Library Rules</CardTitle>
        <CardDescription>Loan, renewal, reservation, and penalty defaults.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
        ) : (
          <>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Members</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {field("penaltyPerDay", "Penalty Per Day")}
                {field("issueValidityDays", "Loan Period (Days)")}
                {field("membershipValidityMonths", "Membership Validity (Months)")}
                {field("reservationLimits", "Reservation Limit")}
                {field("renewLimits", "Renewal Limit")}
                {field("issuesLimits", "Issue Limit")}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Faculty</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {field("facultyPenaltyPerDay", "Penalty Per Day")}
                {field("facultyIssueValidityDays", "Loan Period (Days)")}
                {field("facultyMembershipValidityMonths", "Membership Validity (Months)")}
                {field("facultyReservationLimits", "Reservation Limit")}
                {field("facultyRenewLimits", "Renewal Limit")}
                {field("facultyIssuesLimits", "Issue Limit")}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSave} disabled={isSaving || isLoading}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Rules
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Attributes() {
  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library Attributes</h1>
          <p className="text-muted-foreground">
            Manage the metadata catalog and global rules used across the library system.
          </p>
        </div>

        <Tabs defaultValue="authors">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="genres">Genres</TabsTrigger>
            <TabsTrigger value="publishers">Publishers</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="membership">Membership Types</TabsTrigger>
            <TabsTrigger value="global">Global Rules</TabsTrigger>
          </TabsList>
          <TabsContent value="authors" className="mt-6"><AuthorsPanel /></TabsContent>
          <TabsContent value="genres" className="mt-6"><GenresPanel /></TabsContent>
          <TabsContent value="publishers" className="mt-6"><PublishersPanel /></TabsContent>
          <TabsContent value="keywords" className="mt-6"><KeywordsPanel /></TabsContent>
          <TabsContent value="membership" className="mt-6"><MembershipTypesPanel /></TabsContent>
          <TabsContent value="global" className="mt-6"><GlobalSettingsPanel /></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
