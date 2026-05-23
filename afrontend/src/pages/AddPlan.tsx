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
            <Typography sx={pageTitleSx}>
              Subscription Plans
            </Typography>
            <Typography sx={{ color: "text.secondary", ml: 5 }}>
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