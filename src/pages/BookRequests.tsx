import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, X, RotateCcw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useBookRequests, useMarkBookRequest } from "@/hooks/api/use-book-requests";
import { BookRequestStatus, resUrl } from "@/api/entities";
import { DEFAULT_PAGE_SIZE } from "@/api/constants";
import { useToast } from "@/hooks/use-toast";

export default function BookRequests() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(BookRequestStatus.Pending);

  const { data, isLoading, isError, error } = useBookRequests({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    status,
    ...(search.trim() ? { seed: search.trim() } : {}),
  });

  const { mutate: markRequest, isPending: isMarking } = useMarkBookRequest();

  const onError = (err: any) =>
    toast({
      title: "Action failed",
      description: err.response?.data?.error ?? err.message,
      variant: "destructive",
    });

  const requests = data?.data ?? [];
  const lastPage = data?.info?.lastPage ?? 1;

  const setRequestStatus = (id: string, newStatus: string) => {
    markRequest(
      { id, status: newStatus },
      {
        onSuccess: () => toast({ title: `Request marked ${newStatus.toLowerCase()}` }),
        onError,
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Requests</h1>
          <p className="text-muted-foreground">
            Review titles members would like the library to acquire.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value={BookRequestStatus.Pending}>Pending</TabsTrigger>
              <TabsTrigger value={BookRequestStatus.Accepted}>Accepted</TabsTrigger>
              <TabsTrigger value={BookRequestStatus.Resolved}>Resolved</TabsTrigger>
              <TabsTrigger value={BookRequestStatus.Closed}>Closed</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or requester..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-destructive">
                    Failed to load requests{error?.message ? `: ${error.message}` : "."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No {status.toLowerCase()} requests.
                  </TableCell>
                </TableRow>
              )}
              {requests.map((request) => (
                <TableRow key={request.bookRequestId}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{request.title}</span>
                      <span className="text-xs text-muted-foreground">{request.authors}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={resUrl(request.user?.profilePicUrl)} />
                        <AvatarFallback className="text-[10px]">
                          {request.user?.fullName?.[0] ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm">{request.user?.fullName ?? "Unknown"}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {request.user?.cardId}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.publisher}</TableCell>
                  <TableCell>{request.publicationYear}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {status === BookRequestStatus.Pending && (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            disabled={isMarking}
                            title="Accept request"
                            onClick={() => setRequestStatus(request.bookRequestId, BookRequestStatus.Accepted)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                            disabled={isMarking}
                            title="Close request"
                            onClick={() => setRequestStatus(request.bookRequestId, BookRequestStatus.Closed)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {status === BookRequestStatus.Accepted && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            disabled={isMarking}
                            onClick={() => setRequestStatus(request.bookRequestId, BookRequestStatus.Resolved)}
                          >
                            <Check className="h-3.5 w-3.5" /> Resolved
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                            disabled={isMarking}
                            title="Close request"
                            onClick={() => setRequestStatus(request.bookRequestId, BookRequestStatus.Closed)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {(status === BookRequestStatus.Resolved || status === BookRequestStatus.Closed) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1"
                          disabled={isMarking}
                          onClick={() => setRequestStatus(request.bookRequestId, BookRequestStatus.Pending)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reopen
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t bg-slate-50/30">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={page >= lastPage ? "pointer-events-none opacity-50" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(lastPage, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </Layout>
  );
}
