import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Book,
  Users,
  ClipboardList,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const stats = [
  {
    title: "Total Books",
    value: "12,482",
    description: "+124 from last month",
    icon: Book,
    color: "text-blue-600",
    bg: "bg-blue-100",
    trend: "up",
  },
  {
    title: "Active Loans",
    value: "842",
    description: "+42 since yesterday",
    icon: ClipboardList,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    trend: "up",
  },
  {
    title: "Overdue Books",
    value: "28",
    description: "-5 from last week",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-100",
    trend: "down",
  },
  {
    title: "Total Fines",
    value: "$1,240.50",
    description: "+$12.00 today",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100",
    trend: "up",
  },
];

const chartData = [
  { month: "Jan", loans: 450 },
  { month: "Feb", loans: 520 },
  { month: "Mar", loans: 610 },
  { month: "Apr", loans: 580 },
  { month: "May", loans: 690 },
  { month: "Jun", loans: 842 },
];

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "borrowed",
    book: "The Great Gatsby",
    time: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "returned",
    book: "1984",
    time: "3 hours ago",
    status: "returned",
  },
  {
    id: 3,
    user: "Robert Brown",
    action: "reserved",
    book: "Brave New World",
    time: "5 hours ago",
    status: "pending",
  },
  {
    id: 4,
    user: "Alice Johnson",
    action: "paid fine",
    book: "N/A",
    time: "1 day ago",
    status: "completed",
  },
];

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back, Admin. Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="gap-2" asChild>
              <Link to="/loans/new">
                <Plus className="h-4 w-4" />
                New Loan
              </Link>
            </Button>
            <Button variant="outline" className="gap-2">
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg ${stat.bg} p-2`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.trend === "up" ? (
                    <div className="flex items-center text-xs font-medium text-emerald-600">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      Trend Up
                    </div>
                  ) : (
                    <div className="flex items-center text-xs font-medium text-amber-600">
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                      Trend Down
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h2 className="text-3xl font-bold tracking-tight">{stat.value}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
           <Card>
              <CardHeader>
                <CardTitle>Newly Registered Members</CardTitle>
                <CardDescription>Members who joined in the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Alice Johnson", email: "alice.j@college.edu", date: "Today", avatar: "AJ" },
                    { name: "Michael Wilson", email: "m.wilson@college.edu", date: "Yesterday", avatar: "MW" },
                    { name: "Sarah Miller", email: "s.miller@college.edu", date: "2 days ago", avatar: "SM" },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{user.name}</span>
                          <span className="text-[10px] text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground block">{user.date}</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-[10px]" asChild>
                          <Link to="/users/1">View Profile</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                 <Button variant="ghost" className="w-full text-xs" asChild>
                   <Link to="/users">View All Members</Link>
                 </Button>
              </CardFooter>
           </Card>

           <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions from library members.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs font-medium leading-none">
                          <span className="font-bold text-foreground">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="italic text-muted-foreground text-[10px]">"{activity.book}"</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge
                        variant={
                          activity.status === "active"
                            ? "default"
                            : activity.status === "returned"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                 <Button variant="ghost" className="w-full text-xs">View Full Audit Log</Button>
              </CardFooter>
           </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          {/* Chart Section */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Loan Statistics</CardTitle>
              <CardDescription>
                Monthly loan activity for the current year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  loans: {
                    label: "Loans",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="loans" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === chartData.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
