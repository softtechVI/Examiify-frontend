// import { AdminLayout } from "@/Components/layout/AdminLayout";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
// import { 
//   Users, 
//   CreditCard, 
//   Ticket, 
//   Brain, 
//   TrendingUp, 
//   ArrowUpRight,
//   ArrowDownRight,
//   Activity
// } from "lucide-react";

// const stats = [
//   {
//     title: "Total Users",
//     value: "12,847",
//     change: "+12.5%",
//     trend: "up",
//     icon: Users,
//     description: "Active users this month",
//   },
//   {
//     title: "Active Plans",
//     value: "48",
//     change: "+3.2%",
//     trend: "up",
//     icon: CreditCard,
//     description: "Subscription plans",
//   },
//   {
//     title: "Active Coupons",
//     value: "23",
//     change: "-2.1%",
//     trend: "down",
//     icon: Ticket,
//     description: "Running promotions",
//   },
//   {
//     title: "AI Analysis Usage",
//     value: "8,432",
//     change: "+18.7%",
//     trend: "up",
//     icon: Brain,
//     description: "Requests this month",
//   },
// ];

// const recentActivity = [
//   { action: "New plan created", item: "Premium Yearly", time: "2 hours ago" },
//   { action: "Coupon redeemed", item: "WELCOME20", time: "4 hours ago" },
//   { action: "User registered", item: "john@example.com", time: "5 hours ago" },
//   { action: "AI analysis completed", item: "Batch #4521", time: "6 hours ago" },
//   { action: "Plan updated", item: "Basic Monthly", time: "8 hours ago" },
// ];

// const Dashboard = () => {
//   return (
//     <AdminLayout>
//       <div className="p-6 lg:p-8 space-y-8">
//         {/* Header */}
//         <div className="space-y-2">
//           <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
//           <p className="text-muted-foreground">
//             Welcome back! Here's an overview of your platform.
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//           {stats.map((stat) => (
//             <Card key={stat.title} className="relative overflow-hidden">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {stat.title}
//                 </CardTitle>
//                 <div className="p-2 rounded-lg bg-primary/10">
//                   <stat.icon className="h-4 w-4 text-primary" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//                 <div className="flex items-center gap-1 mt-1">
//                   {stat.trend === "up" ? (
//                     <ArrowUpRight className="h-4 w-4 text-success" />
//                   ) : (
//                     <ArrowDownRight className="h-4 w-4 text-destructive" />
//                   )}
//                   <span
//                     className={`text-xs font-medium ${
//                       stat.trend === "up" ? "text-success" : "text-destructive"
//                     }`}
//                   >
//                     {stat.change}
//                   </span>
//                   <span className="text-xs text-muted-foreground ml-1">
//                     vs last month
//                   </span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   {stat.description}
//                 </p>
//               </CardContent>
//               <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
//             </Card>
//           ))}
//         </div>

//         {/* Content Grid */}
//         <div className="grid gap-6 lg:grid-cols-2">
//           {/* Recent Activity */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Activity className="h-5 w-5 text-primary" />
//                 <CardTitle>Recent Activity</CardTitle>
//               </div>
//               <CardDescription>Latest actions across the platform</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentActivity.map((activity, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between py-3 border-b border-border last:border-0"
//                   >
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium">{activity.action}</p>
//                       <p className="text-xs text-muted-foreground">{activity.item}</p>
//                     </div>
//                     <span className="text-xs text-muted-foreground">{activity.time}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Stats */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="h-5 w-5 text-primary" />
//                 <CardTitle>Performance Overview</CardTitle>
//               </div>
//               <CardDescription>Key metrics at a glance</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Revenue Growth</span>
//                     <span className="font-medium">78%</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div className="h-full w-[78%] bg-primary rounded-full" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">User Retention</span>
//                     <span className="font-medium">92%</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div className="h-full w-[92%] bg-success rounded-full" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Coupon Redemption</span>
//                     <span className="font-medium">45%</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div className="h-full w-[45%] bg-warning rounded-full" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">AI Feature Adoption</span>
//                     <span className="font-medium">67%</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div className="h-full w-[67%] bg-primary rounded-full" />
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default Dashboard;

import { AdminLayout } from "@/Components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
} from "@mui/material";
import {
  Users,
  CreditCard,
  Ticket,
  Brain,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { brandColors } from "@/theme"; // adjust path if needed

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
      <Box sx={{ p: { xs: 3, lg: 4 }, display: "flex", flexDirection: "column", gap: 4 }}>

        {/* ── Header ── */}
        <Box sx={{ ml: { xs: 0, sm: "40px" } }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 0.5 }}
          >
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Welcome back! Here&apos;s an overview of your platform.
          </Typography>
        </Box>

        {/* ── Stats Grid ── */}
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
          }}
        >
          {stats.map((stat) => (
            <Card
              key={stat.title}
              sx={{ position: "relative", overflow: "hidden" }}
            >
              <CardHeader
                title={
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 800, color: "text.secondary" }}
                  >
                    {stat.title}
                  </Typography>
                }
                action={
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: `${brandColors.primary}1A`, // ~10% opacity
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <stat.icon size={16} color={brandColors.primary} />
                  </Box>
                }
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Typography
                  sx={{ fontSize: "1.75rem", fontWeight: "bold", color: "text.primary" }}
                >
                  {stat.value}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight size={16} color="#2e7d32" />
                  ) : (
                    <ArrowDownRight size={16} color="#d32f2f" />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      color: stat.trend === "up" ? "success.main" : "error.main",
                    }}
                  >
                    {stat.change}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", ml: 0.5 }}>
                    vs last month
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block" }}>
                  {stat.description}
                </Typography>
              </CardContent>

              {/* Bottom gradient accent */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(to right, ${brandColors.primary}33, ${brandColors.primary}0D)`,
                }}
              />
            </Card>
          ))}
        </Box>

        {/* ── Content Grid ── */}
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          }}
        >
          {/* Recent Activity */}
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Activity size={20} color={brandColors.primary} />
                  <Typography variant="h6">Recent Activity</Typography>
                </Box>
              }
              subheader={
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Latest actions across the platform
                </Typography>
              }
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {recentActivity.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.5,
                      borderBottom:
                        index < recentActivity.length - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: "text.primary" }}
                      >
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {activity.item}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TrendingUp size={20} color={brandColors.primary} />
                  <Typography variant="h6">Performance Overview</Typography>
                </Box>
              }
              subheader={
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Key metrics at a glance
                </Typography>
              }
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  { label: "Revenue Growth",     value: 78, color: brandColors.primary },
                  { label: "User Retention",     value: 92, color: "#2e7d32" },
                  { label: "Coupon Redemption",  value: 45, color: "#ed6c02" },
                  { label: "AI Feature Adoption",value: 67, color: brandColors.primary },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {item.value}%
                      </Typography>
                    </Box>
                    {/* Progress bar track */}
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 99,
                        backgroundColor: "action.hover",
                        overflow: "hidden",
                      }}
                    >
                      {/* Progress bar fill */}
                      <Box
                        sx={{
                          height: "100%",
                          width: `${item.value}%`,
                          borderRadius: 99,
                          backgroundColor: item.color,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

      </Box>
    </AdminLayout>
  );
};

export default Dashboard; 