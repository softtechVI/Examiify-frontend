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