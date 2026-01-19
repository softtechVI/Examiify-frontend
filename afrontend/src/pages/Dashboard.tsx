import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  CreditCard, 
  Ticket, 
  Brain, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active users this month",
  },
  {
    title: "Active Plans",
    value: "48",
    change: "+3.2%",
    trend: "up",
    icon: CreditCard,
    description: "Subscription plans",
  },
  {
    title: "Active Coupons",
    value: "23",
    change: "-2.1%",
    trend: "down",
    icon: Ticket,
    description: "Running promotions",
  },
  {
    title: "AI Analysis Usage",
    value: "8,432",
    change: "+18.7%",
    trend: "up",
    icon: Brain,
    description: "Requests this month",
  },
];

const recentActivity = [
  { action: "New plan created", item: "Premium Yearly", time: "2 hours ago" },
  { action: "Coupon redeemed", item: "WELCOME20", time: "4 hours ago" },
  { action: "User registered", item: "john@example.com", time: "5 hours ago" },
  { action: "AI analysis completed", item: "Batch #4521", time: "6 hours ago" },
  { action: "Plan updated", item: "Basic Monthly", time: "8 hours ago" },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    vs last month
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <CardDescription>Latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.item}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Performance Overview</CardTitle>
              </div>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue Growth</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-primary rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">User Retention</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-success rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coupon Redemption</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-warning rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">AI Feature Adoption</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[67%] bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
