import { useEffect, useState } from "react";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  pageWrapperSx,
  pageHeaderSx,
  pageTitleSx,
  addPlanBtnSx,
  filterRowSx,
  filterButtonSx,
  dialogBtnSx,
  loadingWrapperSx,
  brandColors,
} from "@/theme";

import {
  Power,
  Eye,
  Trash2,
  Ticket,
  Calendar,
  Percent,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import {
  AddCoupon,
  GetAllCoupon,
  GetAllPlan,
  DeleteCoupon,
  UpdateCouponStatus,
  updateCouponData,
} from "@/services/api";

/* ================= TYPES ================= */

type Coupon = {
  _id: string;
  couponCode: string;
  description: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  instituteType?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  coupanUsed?: number;
  perUserLimit: number;
  status: "1" | "0";
  applicablePlanId?: string[];
};

type Plan = {
  _id: string;
  planName: string;
};

/* ================= COMPONENT ================= */

export default function CouponManager() {
  const { toast } = useToast();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "expired"
  >("all");

  /* ================= FORM STATE ================= */

  const initialFormState = {
    couponCode: "",
    isVisible: "1",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minOrderAmount: "",
    description: "",
    category: "school",
    startDate: "",
    endDate: "",
    usageLimit: "",
    perUserLimit: "",
    status: "1",
    planId: [] as string[],
  };

  const [formData, setFormData] = useState(initialFormState);

  /* ================= FETCH DATA ================= */

  const loadData = async () => {
    try {
      const [couponRes, planRes] = await Promise.all([
        GetAllCoupon(),
        GetAllPlan(),
      ]);
      setCoupons(Array.isArray(couponRes) ? couponRes : []);
      setPlans(Array.isArray(planRes) ? planRes : []);
    } catch {
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= PLAN TOGGLE ================= */

  const togglePlanSelection = (planId: string) => {
    setFormData((prev) => ({
      ...prev,
      planId: prev.planId.includes(planId)
        ? prev.planId.filter((id) => id !== planId)
        : [...prev.planId, planId],
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("couponCode", formData.couponCode);
      fd.append("isVisible", formData.isVisible);
      fd.append("discountType", formData.discountType);
      fd.append("discountValue", formData.discountValue);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("startDate", formData.startDate);
      fd.append("endDate", formData.endDate);
      fd.append("usageLimit", formData.usageLimit);
      fd.append("perUserLimit", formData.perUserLimit);
      fd.append("status", formData.status);
      if (formData.maxDiscount) fd.append("maxDiscount", formData.maxDiscount);
      if (formData.minOrderAmount)
        fd.append("minOrderAmount", formData.minOrderAmount);
      formData.planId.forEach((id) => fd.append("planId", id));

      if (editingId) {
        await updateCouponData(editingId, fd);
      } else {
        await AddCoupon(fd);
      }

      toast({ title: editingId ? "Coupon Updated" : "Coupon Added" });
      setOpenForm(false);
      setEditingId(null);
      setFormData(initialFormState);
      loadData();
    } catch {
      toast({ title: "Failed to save coupon", variant: "destructive" });
    }
  };

  /* ================= ACTIONS ================= */

  const toggleStatus = async (id: string, status: "1" | "0") => {
    await UpdateCouponStatus(id, status === "1" ? "0" : "1");
    loadData();
  };

  const deleteCoupon = async (id: string) => {
    await DeleteCoupon(id);
    toast({ title: "Coupon deleted" });
    loadData();
  };

  const editCoupon = (c: Coupon) => {
    setEditingId(c._id);
    setFormData({
      couponCode: c.couponCode,
      isVisible: "1",
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      maxDiscount: String(c.maxDiscount || ""),
      minOrderAmount: String(c.minOrderAmount || ""),
      description: c.description,
      category: c.instituteType || "school",
      startDate: c.startDate.split("T")[0],
      endDate: c.endDate.split("T")[0],
      usageLimit: String(c.usageLimit),
      perUserLimit: String(c.perUserLimit),
      status: c.status,
      planId: c.applicablePlanId || [],
    });
    setOpenForm(true);
  };

  /* ================= STATS ================= */

  const inactiveCount = coupons.filter(
    (c) => c.status === "0" && new Date(c.endDate) >= new Date()
  ).length;
  const activeCount = coupons.filter((c) => c.status === "1").length;
  const expiredCount = coupons.filter(
    (c) => new Date(c.endDate) < new Date()
  ).length;
  const usedCount = coupons.reduce((a, c) => a + (c.coupanUsed || 0), 0);

  const viewCoupon = (c: Coupon) => {
    setSelectedCoupon(c);
    setOpenView(true);
  };

  const getStatusChip = (coupon: Coupon) => {
    if (new Date(coupon.endDate) < new Date()) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    if (coupon.status === "1") {
      return <Chip label="Active" color="success" size="small" />;
    }
    return <Chip label="Inactive" color="error" size="small" />;
  };

  const filteredCoupons = coupons.filter((c) => {
    const isExpired = new Date(c.endDate) < new Date();
    if (filterStatus === "active") return c.status === "1" && !isExpired;
    if (filterStatus === "inactive") return c.status === "0" && !isExpired;
    if (filterStatus === "expired") return isExpired;
    return true;
  });

  /* ================= UI ================= */

  return (
    <AdminLayout>
      <Box sx={pageWrapperSx}>

        {/* HEADER */}
        <Box sx={pageHeaderSx}>
          <Typography sx={pageTitleSx}>Coupons & Discounts</Typography>
          <Button variant="contained" sx={addPlanBtnSx} onClick={() => setOpenForm(true)}>
            Add Coupon
          </Button>
        </Box>

        {/* STATS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(5, 1fr)",
            },
            gap: 2,
          }}
        >
          <StatCard title="Total Coupons" value={coupons.length} icon={Ticket} />
          <StatCard title="Active" value={activeCount} icon={Power} />
          <StatCard title="Inactive" value={inactiveCount} icon={Power} />
          <StatCard title="Expired" value={expiredCount} icon={Calendar} />
          <StatCard title="Used" value={usedCount} icon={Percent} />
        </Box>

        {/* FILTER BAR */}
        <Box sx={filterRowSx}>
          {(["all", "active", "inactive", "expired"] as const).map((f) => (
            <Button
              key={f}
              variant="outlined"
              sx={filterButtonSx(filterStatus === f)}
              onClick={() => setFilterStatus(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Box>

        {/* TABLE CARD */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              All Coupons
            </Typography>

            {loading ? (
              <Box sx={loadingWrapperSx}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Associated Plans</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredCoupons.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                          No coupons found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCoupons.map((c) => (
                        <TableRow key={c._id}>

                          <TableCell>
                            <Typography sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem" }}>
                              {c.couponCode}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {c.discountType === "percentage"
                              ? `${c.discountValue}%`
                              : `₹${c.discountValue}`}
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {c.applicablePlanId && c.applicablePlanId.length > 0 ? (
                                c.applicablePlanId.map((id) => {
                                  const plan = plans.find((p) => p._id === id);
                                  return plan ? (
                                    <Chip
                                      key={id}
                                      label={plan.planName}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: "0.7rem" }}
                                    />
                                  ) : null;
                                })
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  —
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell>{getStatusChip(c)}</TableCell>

                          <TableCell align="right">
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>

                              {/* VIEW */}
                              <IconButton size="small" onClick={() => viewCoupon(c)}>
                                <Eye size={16} />
                              </IconButton>

                              {/* EDIT */}
                              <IconButton size="small" onClick={() => editCoupon(c)}>
                                ✏️
                              </IconButton>

                              {/* TOGGLE STATUS */}
                              <Tooltip
                                title={
                                  new Date(c.endDate) < new Date()
                                    ? "Expired coupon cannot be activated"
                                    : "Toggle Status"
                                }
                              >
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={new Date(c.endDate) < new Date()}
                                    onClick={() => toggleStatus(c._id, c.status)}
                                    sx={{
                                      opacity: new Date(c.endDate) < new Date() ? 0.4 : 1,
                                    }}
                                  >
                                    <Power size={16} />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              {/* DELETE */}
                              <IconButton
                                size="small"
                                sx={{ color: "error.main" }}
                                onClick={() => deleteCoupon(c._id)}
                              >
                                <Trash2 size={16} />
                              </IconButton>

                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* ADD / EDIT DIALOG */}
        <Dialog
          open={openForm}
          onClose={() => setOpenForm(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { maxHeight: "90vh" } }}
        >
          <DialogTitle>
            {editingId ? "Edit Coupon" : "Add New Coupon"}
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Coupon Code"
                  fullWidth
                  size="small"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Discount Value"
                  type="number"
                  fullWidth
                  size="small"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Max Discount"
                  type="number"
                  fullWidth
                  size="small"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Min Order Amount"
                  type="number"
                  fullWidth
                  size="small"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Usage Limit"
                  type="number"
                  fullWidth
                  size="small"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Per User Limit"
                  type="number"
                  fullWidth
                  size="small"
                  value={formData.perUserLimit}
                  onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                />
              </Grid>

              {/* DESCRIPTION */}
              <Grid size={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>

              {/* PLANS */}
              <Grid size={12}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Associated Plans
                </Typography>
                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 1.5,
                    maxHeight: 160,
                    overflowY: "auto",
                  }}
                >
                  <FormGroup>
                    {plans.map((p) => (
                      <FormControlLabel
                        key={p._id}
                        control={
                          <Checkbox
                            size="small"
                            checked={formData.planId.includes(p._id)}
                            onChange={() => togglePlanSelection(p._id)}
                          />
                        }
                        label={<Typography variant="body2">{p.planName}</Typography>}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenForm(false);
                setEditingId(null);
                setFormData(initialFormState);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" sx={dialogBtnSx} onClick={handleSubmit}>
              {editingId ? "Update Coupon" : "Add Coupon"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* VIEW DETAILS DIALOG */}
        <Dialog
          open={openView}
          onClose={() => setOpenView(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Coupon Details</DialogTitle>
          <DialogContent dividers>
            {selectedCoupon && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                {/* Coupon Code */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    component="code"
                    sx={{
                      bgcolor: "rgba(4,159,153,0.1)",
                      color: brandColors.primary,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1.25rem",
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    {selectedCoupon.couponCode}
                  </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" align="center">
                  {selectedCoupon.description}
                </Typography>

                {/* Details Grid */}
                <Grid container spacing={2}>
                  {[
                    {
                      label: "Discount",
                      value:
                        selectedCoupon.discountType === "percentage"
                          ? `${selectedCoupon.discountValue}%${selectedCoupon.maxDiscount ? ` (Max ₹${selectedCoupon.maxDiscount})` : ""}`
                          : `₹${selectedCoupon.discountValue}`,
                    },
                    { label: "Min Order", value: `₹${selectedCoupon.minOrderAmount || 0}` },
                    { label: "Usage", value: `${selectedCoupon.coupanUsed || 0} / ${selectedCoupon.usageLimit}` },
                    { label: "Per User", value: String(selectedCoupon.perUserLimit) },
                    { label: "Start Date", value: new Date(selectedCoupon.startDate).toLocaleDateString() },
                    { label: "End Date", value: new Date(selectedCoupon.endDate).toLocaleDateString() },
                    { label: "Category", value: selectedCoupon.instituteType || "-" },
                    { label: "Visible to Users", value: "" },
                  ].map(({ label, value }) => (
                    <Grid size={6} key={label}>
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.25, textTransform: "capitalize" }}>
                        {value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {/* Associated Plans */}
                {selectedCoupon.applicablePlanId &&
                  selectedCoupon.applicablePlanId.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        Associated Plans
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedCoupon.applicablePlanId.map((id, idx) => {
                          const plan = plans.find((p) => p._id === id);
                          return plan ? (
                            <Box
                              key={idx}
                              sx={{
                                bgcolor: "rgba(4,159,153,0.1)",
                                color: brandColors.primary,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: "0.75rem",
                              }}
                            >
                              {plan.planName}
                            </Box>
                          ) : null;
                        })}
                      </Box>
                    </Box>
                  )}

                {/* Status */}
                <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                  {getStatusChip(selectedCoupon)}
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

      </Box>
    </AdminLayout>
  );
}

/* ================= HELPERS ================= */

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <Card>
      <CardContent
        sx={{
          pt: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          "&:last-child": { pb: 3 },
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: "rgba(4,159,153,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={brandColors.primary} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}