// import { useEffect, useState } from "react";
// import { filterButtonSx } from "@/theme";
// import { AdminLayout } from "@/Components/layout/AdminLayout";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Chip,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Grid,
//   Card,
//   CardContent,
//   Box,
//   CircularProgress,
// } from "@mui/material";

// import {
//   Image,
//   Trash2,
//   Power,
//   Calendar,
//   IndianRupee,
//   Clock,
//   Building2,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// import { AddPlan, GetAllPlan, DeletePlan, UpdatePlanStatus } from "@/services/api";
// import type { Plan } from "@/types";

// const AddPlanPage = () => {
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [viewPlan, setViewPlan] = useState<Plan | null>(null);
//   const [planFilter, setPlanFilter] =
//   useState<"all" | "active" | "inactive" | "school" | "college">("all");


//   const filteredPlans = plans.filter((plan) => {
//   if (planFilter === "active") return plan.status === 1;
//   if (planFilter === "inactive") return plan.status === 0;
//   if (planFilter === "school") return plan.instituteType === 1;
//   if (planFilter === "college") return plan.instituteType === 2;
//   return true; // all
// });


//   const { toast } = useToast();

//   /* ================= FETCH PLANS ================= */
//   const fetchPlans = async () => {
//     setFetching(true);
//     try {
//       const res = await GetAllPlan();
//       setPlans(res);
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to fetch plans",
//         variant: "destructive",
//       });
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     fetchPlans();
//   },[]);

//   /* ================= Toggle plan ================= */

//   const togglePlanStatus = async (id: string, status: number) => {
//   const newStatus = status === 1 ? 0 : 1;

//   // 🔥 OPTIMISTIC UI UPDATE
//   setPlans((prev) =>
//     prev.map((plan) =>
//       plan._id === id ? { ...plan, status: newStatus } : plan
//     )
//   );

//   try {
//     await UpdatePlanStatus(id, newStatus);

//     toast({
//       title: "Success",
//       description: `Plan ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
//     });
//   } catch {
//     // ❌ rollback if API fails
//     setPlans((prev) =>
//       prev.map((plan) =>
//         plan._id === id ? { ...plan, status } : plan
//       )
//     );

//     toast({
//       title: "Error",
//       description: "Failed to update plan status",
//       variant: "destructive",
//     });
//   }
// };


//   /* ================= DELETE PLAN ================= */

//   const deletePlan = async (id: string) => {
//   // 🔥 remove from UI immediately
//   const previousPlans = plans;

//   setPlans((prev) => prev.filter((p) => p._id !== id));

//   try {
//     await DeletePlan(id);

//     toast({
//       title: "Deleted",
//       description: "Plan deleted successfully",
//     });
//   } catch {
//     // ❌ rollback if API fails
//     setPlans(previousPlans);

//     toast({
//       title: "Error",
//       description: "Failed to delete plan",
//       variant: "destructive",
//     });
//   }
// };




//   /* ================= FORM STATE (UNCHANGED UI) ================= */
//   const [formData, setFormData] = useState({
//     planName: "",
//     duration: "",
//     instituteType: "1",
//     price: "",
//     description: "",
//     image: null as File | null,
//   });

//   /* ================= ADD PLAN ================= */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const form = new FormData();
//       form.append("planName", formData.planName);
//       form.append("duration", formData.duration);
//       form.append("instituteType", formData.instituteType);
//       form.append("price", formData.price);
//       form.append("description", formData.description);

//       if (formData.image) {
//         form.append("plan_image", formData.image);
//       }

//       const res = await AddPlan(form);

//       toast({
//         title: "Plan Created",
//         description: res.message || "Plan added successfully",
//       });

//       setIsModalOpen(false);
//       setFormData({
//         planName: "",
//         duration: "",
//         instituteType: "1",
//         price: "",
//         description: "",
//         image: null,
//       });

//       fetchPlans();
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err?.message || "Failed to create plan",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= HELPERS (UNCHANGED UI) ================= */
//   const getDurationLabel = (months: number) =>
//     ({ 1: "Monthly", 3: "Quarterly", 6: "Half-Yearly", 12: "Yearly" }[months] ||
//     `${months} Month(s)`);

//   const getCategoryLabel = (type: number) =>
//     type === 1 ? "School" : "College & University";

//   /* ================= color style all button  ================= */
// //   const filterButtonStyle = (type) => ({
// //   color: planFilter === type ? "#fff" : "#049F99",
// //   backgroundColor: planFilter === type ? "#049F99" : "transparent",
// //   borderColor: "#049F99",
// //   "&:hover": {
// //     backgroundColor:
// //       planFilter === type ? "#038a85" : "rgba(4,159,153,0.1)",
// //     borderColor: "#049F99",
// //   },
// // });

//   /* ================= UI (100% SAME AS CODE 2) ================= */
//   return (
//     <AdminLayout>
//       <Box sx={{
//           p: { xs: 3, lg: 4 },
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//         }}>
//         {/* Header */}
//         <Box sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             justifyContent: "space-between",
//             alignItems: { xs: "flex-start", sm: "center" },
//             gap: 2,
//           }}>
//                   <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
//           <Typography
//             sx={{
//               fontSize: { xs: "24px", lg: "30px" },
//               fontWeight: "bold",
//               color: "text.primary",
//             }}
//           >
//             Subscription Plans
//           </Typography>

//           <Typography sx={{ color: "text.secondary" }}>
//             Manage your subscription plans and pricing
//           </Typography>
//         </Box>
//           <Button sx={{
//             height: "40px",
//             width: "150px",
//             background: "#049F99"
//           }}
//             variant="contained"
//             onClick={() => setIsModalOpen(true)}
//           >
//             Add New Plan
//           </Button>

//           <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
//             <DialogTitle>
//               Create New Plan
//               </DialogTitle>

//             <DialogContent>
//               <Typography variant="body2" sx={{ mb: 2 }}>
//                 Add a new subscription plan for your users.
//               </Typography>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Plan Name */}
//                 <TextField
//                   fullWidth
//                   label="Plan Name"
//                   value={formData.planName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, planName: e.target.value })
//                   }
//                   required
//                 />

//                 {/* Duration */}
//                 <FormControl fullWidth>
//                   <InputLabel>Duration</InputLabel>
//                   <Select
//                     value={formData.duration}
//                     label="Duration"
//                     onChange={(e) =>
//                       setFormData({ ...formData, duration: e.target.value })
//                     }
//                   >
//                     <MenuItem value="1">Monthly (1 Month)</MenuItem>
//                     <MenuItem value="3">Quarterly (3 Months)</MenuItem>
//                     <MenuItem value="6">Half-Yearly (6 Months)</MenuItem>
//                     <MenuItem value="12">Yearly (12 Months)</MenuItem>
//                   </Select>
//                 </FormControl>

//                 {/* Category */}
//                 <FormControl>
//                   <Typography>Category</Typography>
//                   <RadioGroup
//                     row
//                     value={formData.instituteType}
//                     onChange={(e) =>
//                       setFormData({ ...formData, instituteType: e.target.value })
//                     }
//                   >
//                     <FormControlLabel value="1" control={<Radio />} label="School" />
//                     <FormControlLabel value="2" control={<Radio />} label="College & University" />
//                   </RadioGroup>
//                 </FormControl>

//                 {/* Price */}
//                 <TextField
//                   fullWidth
//                   label="Price"
//                   type="number"
//                   value={formData.price}
//                   onChange={(e) =>
//                     setFormData({ ...formData, price: e.target.value })
//                   }
//                   required
//                 />

//                 {/* Description */}
//                 <TextField
//                   fullWidth
//                   label="Description"
//                   multiline
//                   rows={3}
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       description: e.target.value,
//                     })
//                   }
//                   required
//                 />

//                 {/* Image */}
//                 <TextField
//                   fullWidth
//                   type="file"
//                   inputProps={{ accept: "image/*" }}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       image: e.target.files?.[0] || null,
//                     })
//                   }
//                 />

//                 <DialogActions>
//                   <Button sx={{
//                     background: "#049F99"
//                   }}
//                     type="button"
//                     variant="contained"
//                     onClick={() => setIsModalOpen(false)}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </Button>

//                   <Button sx={{
//                     background: "#049F99"
//                   }}
//                     type="submit" variant="contained" disabled={loading}>
//                     {loading ? "Loading..." : "Create Plan"}
//                   </Button>
//                 </DialogActions>
//               </form>
//             </DialogContent>
            
//           </Dialog>


//         <Dialog
//           open={!!viewPlan}
//           onClose={() => setViewPlan(null)}
//           maxWidth="md"
//           fullWidth
//         >
//           <DialogTitle>{viewPlan?.planName}</DialogTitle>

//           <DialogContent>
//             {viewPlan && (
//               <Box sx={{ mt: 1 }}>
//           {viewPlan.plan_image && (
//             <Box
//               component="img"
//               src={viewPlan.plan_image}
//               alt={viewPlan.planName}
//               sx={{
//                 width: "100%",
//                 height: "240px",
//                 objectFit: "contain",
//                 border: "1px solid #ddd",
//                 borderRadius: "8px",
//                 mb: 2,
//               }}
//             />
//           )}

//           {/* Status + Price + Duration + Category */}
//           <Box
//             sx={{
//               display: "flex",
//               gap: "10px",
//               flexWrap: "wrap",
//               mb: 2,
//             }}
//           >
//             <Chip
//               label={viewPlan.status === 1 ? "Active" : "Inactive"}
//               color={viewPlan.status === 1 ? "success" : "error"}
//             />

//             <Chip label={`₹ ${viewPlan.price}`} />
//             <Chip label={getDurationLabel(viewPlan.duration)} />
//             <Chip label={getCategoryLabel(viewPlan.instituteType)} />
//           </Box>

//           {/* Description */}
//           <Box>
//             <Typography variant="subtitle2">Description</Typography>
//             <Typography variant="body2" color="text.secondary">
//               {viewPlan.description}
//             </Typography>
//           </Box>
//         </Box>
//             )}
//           </DialogContent>

//           <DialogActions>
//             <Button sx={{
//                             background: "#049F99"
//                           }}
//               onClick={() => setViewPlan(null)} variant="contained">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//         </Box>

//         <Grid container spacing={2}>
//           {[
//             { title: "Total Plans", value: plans.length },
//             { title: "Active Plans", value: plans.filter(p => p.status === 1).length },
//             { title: "Inactive Plans", value: plans.filter(p => p.status === 0).length },
//             { title: "School Plans", value: plans.filter(p => p.instituteType === 1).length },
//             { title: "College Plans", value: plans.filter(p => p.instituteType === 2).length },
//           ].map((item, index) => (
//             <Grid item xs={25} sm={6} md={4} lg={2.4} key={index}>
//               <Card sx={{ width: 200, borderRadius: 3, boxShadow: 3 }}>
//                 <CardContent sx={{ pt: 3 }}>
//                   <Typography variant="h4" fontWeight="bold">
//                     {item.value}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {item.title}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>


//         <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
//         <Button
//           variant={planFilter === "all" ? "contained" : "outlined"}
//           onClick={() => setPlanFilter("all")}
//           sx={filterButtonSx(planFilter === "all")}
//         >
//           All
//         </Button>

//         <Button
//           variant={planFilter === "active" ? "contained" : "outlined"}
//           onClick={() => setPlanFilter("active")}
//           sx={filterButtonSx(planFilter === "active")}
//         >
//           Active
//         </Button>

//         <Button
//           variant={planFilter === "inactive" ? "contained" : "outlined"}
//           onClick={() => setPlanFilter("inactive")}
//           sx={filterButtonSx(planFilter === "inactive")}
//         >
//           Inactive
//         </Button>

//         <Button
//           variant={planFilter === "school" ? "contained" : "outlined"}
//           onClick={() => setPlanFilter("school")}
//           sx={filterButtonSx(planFilter === "school")}
//         >
//           School
//         </Button>

//           <Button
//           sx={filterButtonSx(planFilter === "college")}
//             variant={planFilter === "college" ? "contained" : "outlined"}
//             onClick={() => setPlanFilter("college")}
//           >
//             College
//           </Button>
//         </Box>

//         {/* ===== PLAN LIST (UNCHANGED UI) ===== */}
//         {fetching ? (
//           <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             py: 10,
//           }}
//         >
//           <CircularProgress size={32} />
//         </Box>
//         ) : (
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//           {filteredPlans.map((plan) => (
//             <Card key={plan._id} sx={{ overflow: "hidden" }}>
//               <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" } }}>
                
//                 {/* IMAGE SECTION */}
//                 <Box
//                   sx={{
//                     width: { lg: 190 },
//                     bgcolor: "action.hover",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     p: 1,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: 160,
//                       height: 130,
//                       borderRadius: 2,
//                       bgcolor: "background.paper",
//                       border: "1px solid #ddd",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       overflow: "hidden",
//                     }}
//                   >
//                     {plan.plan_image ? (
//                       <Box
//                         component="img"
//                         src={plan.plan_image}
//                         alt={plan.planName}
//                         sx={{ width: "100%", height: "100%", objectFit: "contain" }}
//                       />
//                     ) : (
//                       <Image className="h-10 w-10 text-muted-foreground" />
//                     )}
//                   </Box>
//                 </Box>

//                 {/* CONTENT SECTION */}
//                 <CardContent sx={{ flex: 1, p: 3 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: { xs: "column", lg: "row" },
//                       justifyContent: "space-between",
//                       gap: 2,
//                     }}
//                   >
//                     {/* DETAILS */}
//                     <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
//                         <Typography variant="h6" fontWeight={600}>
//                           {plan.planName}
//                         </Typography>

//                         <Chip
//                           label={plan.status === 1 ? "Active" : "Inactive"}
//                           color={plan.status === 1 ? "success" : "error"}
//                           size="small"
//                         />
//                       </Box>

//                       <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
//                         {plan.description}
//                       </Typography>

//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, color: "text.secondary" }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <Clock size={16} />
//                           {getDurationLabel(plan.duration)}
//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <IndianRupee size={16} /> ₹{plan.price}
//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <Building2 size={16} />
//                           {getCategoryLabel(plan.instituteType)}
//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <Calendar size={16} />
//                           {new Date(plan.createdAt).toLocaleDateString("en-IN")}
//                         </Box>
//                       </Box>
//                     </Box>

//                     {/* ACTIONS */}
//                     <Box sx={{ display: "flex", gap: 1 }}>
//                       <Button
//                         variant="contained"
//                         sx={{
//                           height: 30,
//                           width: 60,
//                           color: "#fafafa",
//                           background: "#049F99",
//                         }}
//                         onClick={() => setViewPlan(plan)}
//                       >
//                         View
//                       </Button>

//                       <Button
//                         variant="contained"
//                         color="error"
//                         sx={{ height: 30, width: 70 }}
//                         onClick={() => deletePlan(plan._id)}
//                       >
//                         <Trash2 size={16} />
//                         Delete
//                       </Button>

//                       <Button
//                         variant="outlined"
//                         onClick={() => togglePlanStatus(plan._id, plan.status)}
//                         sx={{
//                           height: 30,
//                           width: 60,
//                           color: "#049F99",
//                           borderColor: "#049F99",
//                           "&:hover": {
//                             borderColor: "#049F99",
//                             backgroundColor: "rgba(4,159,153,0.08)",
//                           },
//                         }}
//                       >
//                         <Power size={16} />
//                       </Button>


//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Box>
//             </Card>
//           ))}
//         </Box>
//         )}
//       </Box>
//     </AdminLayout>
//   );
// };

// export default AddPlanPage;


import { useEffect, useState } from "react";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Chip, Button, TextField,
  FormControl, InputLabel, Select, MenuItem,
  RadioGroup, FormControlLabel, Radio,
  Grid, Card, CardContent, Box, CircularProgress,
} from "@mui/material";
import { Image, Trash2, Power, Calendar, IndianRupee, Clock, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddPlan, GetAllPlan, DeletePlan, UpdatePlanStatus } from "@/services/api";
import type { Plan } from "@/types";

// ── theme sx imports ──────────────────────────────────────────
import {
  pageWrapperSx,
  pageHeaderSx,
  pageTitleStackSx,
  pageTitleSx,
  addPlanBtnSx,
  filterRowSx,
  filterButtonSx,
  statCardSx,
  statCardContentSx,
  planListSx,
  planCardSx,
  planCardRowSx,
  planImagePanelSx,
  planImageBoxSx,
  planImgSx,
  planContentSx,
  planDetailsRowSx,
  planNameRowSx,
  planMetaRowSx,
  planMetaItemSx,
  planActionsSx,
  viewBtnSx,
  deleteBtnSx,
  powerBtnSx,
  dialogBtnSx,
  viewPlanImageSx,
  viewPlanChipRowSx,
  loadingWrapperSx,
} from "@/theme";

// ─────────────────────────────────────────────────────────────

const AddPlanPage = () => {
  const [plans, setPlans]           = useState<Plan[]>([]);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPlan, setViewPlan]     = useState<Plan | null>(null);
  const [planFilter, setPlanFilter] =
    useState<"all" | "active" | "inactive" | "school" | "college">("all");

  const filteredPlans = plans.filter((plan) => {
    if (planFilter === "active")   return plan.status === 1;
    if (planFilter === "inactive") return plan.status === 0;
    if (planFilter === "school")   return plan.instituteType === 1;
    if (planFilter === "college")  return plan.instituteType === 2;
    return true;
  });

  const { toast } = useToast();

  /* ── Fetch plans ─────────────────────────────── */
  const fetchPlans = async () => {
    setFetching(true);
    try {
      const res = await GetAllPlan();
      setPlans(res);
    } catch {
      toast({ title: "Error", description: "Failed to fetch plans", variant: "destructive" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  /* ── Toggle plan status ──────────────────────── */
  const togglePlanStatus = async (id: string, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    setPlans((prev) => prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)));
    try {
      await UpdatePlanStatus(id, newStatus);
      toast({ title: "Success", description: `Plan ${newStatus === 1 ? "activated" : "deactivated"} successfully` });
    } catch {
      setPlans((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
      toast({ title: "Error", description: "Failed to update plan status", variant: "destructive" });
    }
  };

  /* ── Delete plan ─────────────────────────────── */
  const deletePlan = async (id: string) => {
    const previousPlans = plans;
    setPlans((prev) => prev.filter((p) => p._id !== id));
    try {
      await DeletePlan(id);
      toast({ title: "Deleted", description: "Plan deleted successfully" });
    } catch {
      setPlans(previousPlans);
      toast({ title: "Error", description: "Failed to delete plan", variant: "destructive" });
    }
  };

  /* ── Form state ──────────────────────────────── */
  const [formData, setFormData] = useState({
    planName: "", duration: "", instituteType: "1",
    price: "", description: "", image: null as File | null,
  });

  /* ── Add plan ────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("planName",      formData.planName);
      form.append("duration",      formData.duration);
      form.append("instituteType", formData.instituteType);
      form.append("price",         formData.price);
      form.append("description",   formData.description);
      if (formData.image) form.append("plan_image", formData.image);

      const res = await AddPlan(form);
      toast({ title: "Plan Created", description: res.message || "Plan added successfully" });
      setIsModalOpen(false);
      setFormData({ planName: "", duration: "", instituteType: "1", price: "", description: "", image: null });
      fetchPlans();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to create plan", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ── Helpers ─────────────────────────────────── */
  const getDurationLabel = (months: number) =>
    ({ 1: "Monthly", 3: "Quarterly", 6: "Half-Yearly", 12: "Yearly" }[months] || `${months} Month(s)`);

  const getCategoryLabel = (type: number) =>
    type === 1 ? "School" : "College & University";

  /* ── UI ──────────────────────────────────────── */
  return (
    <AdminLayout>
      <Box sx={pageWrapperSx}>

        {/* ── Header ───────────────────────────── */}
        <Box sx={pageHeaderSx}>
          <Box sx={pageTitleStackSx}>
            <Typography sx={pageTitleSx}>Subscription Plans</Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Manage your subscription plans and pricing
            </Typography>
          </Box>

          <Button variant="contained" sx={addPlanBtnSx} onClick={() => setIsModalOpen(true)}>
            Add New Plan
          </Button>

          {/* ── Add Plan Dialog ───────────────── */}
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Add a new subscription plan for your users.
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth label="Plan Name" value={formData.planName} required
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                />

                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={formData.duration} label="Duration"
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  >
                    <MenuItem value="1">Monthly (1 Month)</MenuItem>
                    <MenuItem value="3">Quarterly (3 Months)</MenuItem>
                    <MenuItem value="6">Half-Yearly (6 Months)</MenuItem>
                    <MenuItem value="12">Yearly (12 Months)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl>
                  <Typography>Category</Typography>
                  <RadioGroup
                    row value={formData.instituteType}
                    onChange={(e) => setFormData({ ...formData, instituteType: e.target.value })}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="School" />
                    <FormControlLabel value="2" control={<Radio />} label="College & University" />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth label="Price" type="number" value={formData.price} required
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />

                <TextField
                  fullWidth label="Description" multiline rows={3}
                  value={formData.description} required
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <TextField
                  fullWidth type="file" inputProps={{ accept: "image/*" }}
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                />

                <DialogActions>
                  <Button variant="contained" sx={dialogBtnSx} type="button"
                    onClick={() => setIsModalOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button variant="contained" sx={dialogBtnSx} type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Create Plan"}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* ── View Plan Dialog ──────────────── */}
          <Dialog open={!!viewPlan} onClose={() => setViewPlan(null)} maxWidth="md" fullWidth>
            <DialogTitle>{viewPlan?.planName}</DialogTitle>
            <DialogContent>
              {viewPlan && (
                <Box sx={{ mt: 1 }}>
                  {viewPlan.plan_image && (
                    <Box component="img" src={viewPlan.plan_image}
                      alt={viewPlan.planName} sx={viewPlanImageSx} />
                  )}
                  <Box sx={viewPlanChipRowSx}>
                    <Chip
                      label={viewPlan.status === 1 ? "Active" : "Inactive"}
                      color={viewPlan.status === 1 ? "success" : "error"}
                    />
                    <Chip label={`₹ ${viewPlan.price}`} />
                    <Chip label={getDurationLabel(viewPlan.duration)} />
                    <Chip label={getCategoryLabel(viewPlan.instituteType)} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {viewPlan.description}
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button variant="contained" sx={dialogBtnSx} onClick={() => setViewPlan(null)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        {/* ── Stat cards ───────────────────────── */}
        <Grid container spacing={2}>
          {[
            { title: "Total Plans",    value: plans.length },
            { title: "Active Plans",   value: plans.filter((p) => p.status === 1).length },
            { title: "Inactive Plans", value: plans.filter((p) => p.status === 0).length },
            { title: "School Plans",   value: plans.filter((p) => p.instituteType === 1).length },
            { title: "College Plans",  value: plans.filter((p) => p.instituteType === 2).length },
          ].map((item, index) => (
            <Grid item xs={25} sm={6} md={4} lg={2.4} key={index}>
              <Card sx={statCardSx}>
                <CardContent sx={statCardContentSx}>
                  <Typography variant="h4" fontSize={30} fontWeight="bold">{item.value}</Typography>
                  <Typography variant="caption" fontSize={20} color="text.secondary">{item.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ── Filter buttons ───────────────────── */}
        <Box sx={filterRowSx}>
          {(["all", "active", "inactive", "school", "college"] as const).map((f) => (
            <Button
              key={f}
              variant={planFilter === f ? "contained" : "outlined"}
              onClick={() => setPlanFilter(f)}
              sx={filterButtonSx(planFilter === f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Box>

        {/* ── Plan list ────────────────────────── */}
        {fetching ? (
          <Box sx={loadingWrapperSx}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={planListSx}>
            {filteredPlans.map((plan) => (
              <Card key={plan._id} sx={planCardSx}>
                <Box sx={planCardRowSx}>

                  {/* Image */}
                  <Box sx={planImagePanelSx}>
                    <Box sx={planImageBoxSx}>
                      {plan.plan_image ? (
                        <Box component="img" src={plan.plan_image}
                          alt={plan.planName} sx={planImgSx} />
                      ) : (
                        <Image className="h-10 w-10 text-muted-foreground" />
                      )}
                    </Box>
                  </Box>

                  {/* Details */}
                  <CardContent sx={planContentSx}>
                    <Box sx={planDetailsRowSx}>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={planNameRowSx}>
                          <Typography variant="h6" fontWeight={600}>{plan.planName}</Typography>
                          <Chip
                            label={plan.status === 1 ? "Active" : "Inactive"}
                            color={plan.status === 1 ? "success" : "error"}
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                          {plan.description}
                        </Typography>

                        <Box sx={planMetaRowSx}>
                          <Box sx={planMetaItemSx}><Clock size={16} />{getDurationLabel(plan.duration)}</Box>
                          <Box sx={planMetaItemSx}><IndianRupee size={16} />₹{plan.price}</Box>
                          <Box sx={planMetaItemSx}><Building2 size={16} />{getCategoryLabel(plan.instituteType)}</Box>
                          <Box sx={planMetaItemSx}>
                            <Calendar size={16} />
                            {new Date(plan.createdAt).toLocaleDateString("en-IN")}
                          </Box>
                        </Box>
                      </Box>

                      {/* Actions */}
                      <Box sx={planActionsSx}>
                        <Button variant="contained" sx={viewBtnSx} onClick={() => setViewPlan(plan)}>
                          View
                        </Button>
                        <Button variant="contained" color="error" sx={deleteBtnSx}
                          onClick={() => deletePlan(plan._id)}>
                          <Trash2 size={16} /> Delete
                        </Button>
                        <Button variant="outlined" sx={powerBtnSx}
                          onClick={() => togglePlanStatus(plan._id, plan.status)}>
                          <Power size={16} />
                        </Button>
                      </Box>

                    </Box>
                  </CardContent>
                </Box>
              </Card>
            ))}
          </Box>
        )}

      </Box>
    </AdminLayout>
  );
};

export default AddPlanPage;