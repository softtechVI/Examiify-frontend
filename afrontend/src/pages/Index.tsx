// import { AdminLayout } from "@/Components/layout/AdminLayout";
// import { Box, Card, CardContent, Grid as Grid, Typography } from "@mui/material";
// import BusinessIcon from "@mui/icons-material/Business";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
// import { pageWrapperSx } from "@/theme";
// import { brandColors } from "@/theme";

// // ─── Stat Card ───────────────────────────────────────────────
// interface StatCardProps {
//   icon: React.ElementType;
//   value: number;
//   label: string;
// }

// const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
//   <Card>
//     <CardContent>
//       <Box display="flex" alignItems="center" gap={2}>
//         {/* Icon bubble */}
//         <Box
//           sx={{
//             p: 1.5,
//             borderRadius: 2,
//             backgroundColor: brandColors.lightBg,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Icon sx={{ fontSize: 36, color: brandColors.primary }} />
//         </Box>

//         {/* Text */}
//         <Box>
//           <Typography variant="h4" fontWeight={700} color="text.primary">
//             {value}
//           </Typography>
//           <Typography variant="subtitle2" color="primary">
//             {label}
//           </Typography>
//         </Box>
//       </Box>
//     </CardContent>
//   </Card>
// );

// // ─── Dashboard Page ───────────────────────────────────────────
// const Index = () => {
//   return (
//     <AdminLayout>
//       <Box sx={pageWrapperSx}>
//         {/* Header */}
//         <Box>
//           <Typography variant="h4" fontStyle="italic">
//             Welcome to the Dashboard
//           </Typography>
//         </Box>

//         {/* Stat Cards */}
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={4}>
//             <StatCard icon={BusinessIcon} value={25} label="Total Institute" />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <StatCard icon={AddCircleOutlineIcon} value={25} label="Add Plan" />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <StatCard icon={ArticleOutlinedIcon} value={25} label="Exams Conduct" />
//           </Grid>
//         </Grid>
//       </Box>
//     </AdminLayout>
//   );
// };

// export default Index;