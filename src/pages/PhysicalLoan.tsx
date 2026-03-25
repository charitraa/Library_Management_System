import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Barcode, User, Book, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PhysicalLoan() {
  const [barcode, setBarcode] = useState("");
  const [userId, setUserId] = useState("");
  const [loanItems, setLoanItems] = useState<any[]>([]);

  const addToLoan = () => {
    if (!barcode) return;
    // Simulate finding a book
    setLoanItems([...loanItems, {
      id: barcode,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      status: "Available"
    }]);
    setBarcode("");
  };

  const removeLoanItem = (id: string) => {
    setLoanItems(loanItems.filter(item => item.id !== id));
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Physical Book Loaning</h1>
          <p className="text-muted-foreground">Process immediate loans for walk-in users using barcode scanning.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Step 1: Identify User
                </CardTitle>
                <CardDescription>Enter Student/Staff ID or Scan ID Card</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="userId" 
                      placeholder="e.g. ST-2024-001" 
                      className="pl-9"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                </div>
                {userId && (
                  <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">John Doe</p>
                      <p className="text-xs text-muted-foreground">Active • 2 books currently on loan</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Barcode className="h-5 w-5 text-primary" />
                  Step 2: Scan Books
                </CardTitle>
                <CardDescription>Scan book barcode or enter ISBN</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode">Book Barcode</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Barcode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="barcode" 
                        placeholder="Scan barcode..." 
                        className="pl-9 font-mono"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addToLoan()}
                      />
                    </div>
                    <Button onClick={addToLoan} variant="secondary">Add</Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
                  <AlertCircle className="h-3 w-3" />
                  Tip: Auto-submits on barcode scanner carriage return
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Loan Summary</CardTitle>
                  <CardDescription>Review and finalize loan for walk-in session</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono">{loanItems.length} Items</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loanItems.length === 0 ? (
                <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
                  <Book className="h-12 w-12 mb-2 opacity-20" />
                  <p>No books added to this session yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loanItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-9 bg-muted rounded-sm border shadow-sm flex items-center justify-center text-[8px] font-bold text-muted-foreground text-center">
                          BOOK COVER
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.author}</p>
                          <p className="text-[10px] font-mono mt-1 uppercase">{item.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                          {item.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeLoanItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-6 flex flex-col gap-4">
              <div className="flex justify-between w-full items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">Due Date: </span>
                  <span className="font-bold">April 14, 2024</span>
                  <span className="text-xs text-muted-foreground block">(Standard 14-day loan)</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Clear All</Button>
                  <Button disabled={loanItems.length === 0 || !userId} className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Process Loan
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
