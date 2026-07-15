import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookPlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateBookRequest } from "@/hooks/api/use-book-requests";
import { useToast } from "@/hooks/use-toast";

export default function PortalRequestBook() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    authors: "",
    publisher: "",
    publicationYear: "",
    editionStatement: "",
  });

  const { mutate: createRequest, isPending } = useCreateBookRequest();

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    createRequest(form, {
      onSuccess: () => {
        toast({
          title: "Request submitted",
          description: "The library team will review your request soon.",
        });
        navigate("/portal/browse");
      },
      onError: (err) =>
        toast({
          title: "Failed to submit request",
          description: err.response?.data?.error ?? err.message,
          variant: "destructive",
        }),
    });
  };

  return (
    <PortalLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Request a Book</h1>
          <p className="text-slate-500">
            Can't find what you're looking for? Ask the library to add it to the collection.
          </p>
        </div>

        <Card className="border-none shadow-sm rounded-[2rem]">
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
            <CardDescription>Give us as much detail as you can.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="req-title">Title *</Label>
              <Input id="req-title" value={form.title} onChange={set("title")} placeholder="e.g. Deep Work" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-authors">Author(s)</Label>
              <Input id="req-authors" value={form.authors} onChange={set("authors")} placeholder="e.g. Cal Newport" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="req-publisher">Publisher</Label>
                <Input id="req-publisher" value={form.publisher} onChange={set("publisher")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-year">Publication Year</Label>
                <Input id="req-year" value={form.publicationYear} onChange={set("publicationYear")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-edition">Edition (optional)</Label>
              <Input id="req-edition" value={form.editionStatement} onChange={set("editionStatement")} />
            </div>
            <Button className="w-full h-12 rounded-2xl gap-2 font-bold" onClick={handleSubmit} disabled={isPending}>
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <BookPlus className="h-5 w-5" />}
              Submit Request
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
