import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const loanTrend = [
  { day: "Mon", loans: 45 },
  { day: "Tue", loans: 52 },
  { day: "Wed", loans: 68 },
  { day: "Thu", loans: 42 },
  { day: "Fri", loans: 84 },
  { day: "Sat", loans: 32 },
  { day: "Sun", loans: 18 },
];

const categoryData = [
  { name: "Fiction", value: 400 },
  { name: "Science", value: 300 },
  { name: "History", value: 200 },
  { name: "Philosophy", value: 100 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

export default function Analytics() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Deep dive into library usage, loan trends, and member engagement.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
           <Card>
              <CardHeader>
                <CardTitle>Daily Loan Activity</CardTitle>
                <CardDescription>Number of books borrowed over the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer config={{ loans: { label: "Loans", color: "hsl(var(--primary))" } }}>
                    <AreaChart data={loanTrend}>
                      <defs>
                        <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="loans" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLoans)" strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
           </Card>

           <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Distribution of loans across different genres.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                   </ResponsiveContainer>
                   <div className="space-y-2 ml-4">
                      {categoryData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2">
                           <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                           <span className="text-sm font-medium">{item.name}</span>
                           <span className="text-sm text-muted-foreground">{item.value}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </CardContent>
           </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
            <CardDescription>New registrations over the past 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
                <ChartContainer config={{ members: { label: "New Members", color: "#10b981" } }}>
                   <LineChart data={[
                     { month: "Oct", members: 45 },
                     { month: "Nov", members: 62 },
                     { month: "Dec", members: 85 },
                     { month: "Jan", members: 110 },
                     { month: "Feb", members: 95 },
                     { month: "Mar", members: 124 },
                   ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="members" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
                   </LineChart>
                </ChartContainer>
             </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
