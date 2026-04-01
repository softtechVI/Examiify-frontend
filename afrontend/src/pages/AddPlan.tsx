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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  Plus,
  Image,
  Trash2,
  Power,
  Calendar,
  IndianRupee,
  Clock,
  Building2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { AddPlan, GetAllPlan, DeletePlan, UpdatePlanStatus } from "@/services/api";
import type { Plan } from "@/types";

const AddPlanPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPlan, setViewPlan] = useState<Plan | null>(null);
  const [planFilter, setPlanFilter] =
  useState<"all" | "active" | "inactive" | "school" | "college">("all");


  const filteredPlans = plans.filter((plan) => {
  if (planFilter === "active") return plan.status === 1;
  if (planFilter === "inactive") return plan.status === 0;
  if (planFilter === "school") return plan.instituteType === 1;
  if (planFilter === "college") return plan.instituteType === 2;
  return true; // all
});




  const { toast } = useToast();

  /* ================= FETCH PLANS ================= */
  const fetchPlans = async () => {
    setFetching(true);
    try {
      const res = await GetAllPlan();
      setPlans(res);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch plans",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ================= Toggle plan ================= */

  const togglePlanStatus = async (id: string, status: number) => {
  const newStatus = status === 1 ? 0 : 1;

  // 🔥 OPTIMISTIC UI UPDATE
  setPlans((prev) =>
    prev.map((plan) =>
      plan._id === id ? { ...plan, status: newStatus } : plan
    )
  );

  try {
    await UpdatePlanStatus(id, newStatus);

    toast({
      title: "Success",
      description: `Plan ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
    });
  } catch {
    // ❌ rollback if API fails
    setPlans((prev) =>
      prev.map((plan) =>
        plan._id === id ? { ...plan, status } : plan
      )
    );

    toast({
      title: "Error",
      description: "Failed to update plan status",
      variant: "destructive",
    });
  }
};


  /* ================= DELETE PLAN ================= */

  const deletePlan = async (id: string) => {
  // 🔥 remove from UI immediately
  const previousPlans = plans;

  setPlans((prev) => prev.filter((p) => p._id !== id));

  try {
    await DeletePlan(id);

    toast({
      title: "Deleted",
      description: "Plan deleted successfully",
    });
  } catch {
    // ❌ rollback if API fails
    setPlans(previousPlans);

    toast({
      title: "Error",
      description: "Failed to delete plan",
      variant: "destructive",
    });
  }
};




  /* ================= FORM STATE (UNCHANGED UI) ================= */
  const [formData, setFormData] = useState({
    planName: "",
    duration: "",
    instituteType: "1",
    price: "",
    description: "",
    image: null as File | null,
  });

  /* ================= ADD PLAN ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("planName", formData.planName);
      form.append("duration", formData.duration);
      form.append("instituteType", formData.instituteType);
      form.append("price", formData.price);
      form.append("description", formData.description);

      if (formData.image) {
        form.append("plan_image", formData.image);
      }

      const res = await AddPlan(form);

      toast({
        title: "Plan Created",
        description: res.message || "Plan added successfully",
      });

      setIsModalOpen(false);
      setFormData({
        planName: "",
        duration: "",
        instituteType: "1",
        price: "",
        description: "",
        image: null,
      });

      fetchPlans();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to create plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS (UNCHANGED UI) ================= */
  const getDurationLabel = (months: number) =>
    ({ 1: "Monthly", 3: "Quarterly", 6: "Half-Yearly", 12: "Yearly" }[months] ||
    `${months} Month(s)`);

  const getCategoryLabel = (type: number) =>
    type === 1 ? "School" : "College & University";

  /* ================= color style all button  ================= */
  const filterButtonStyle = (type) => ({
  color: planFilter === type ? "#fff" : "#049F99",
  backgroundColor: planFilter === type ? "#049F99" : "transparent",
  borderColor: "#049F99",
  "&:hover": {
    backgroundColor:
      planFilter === type ? "#038a85" : "rgba(4,159,153,0.1)",
    borderColor: "#049F99",
  },
});

  /* ================= UI (100% SAME AS CODE 2) ================= */
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Subscription Plans
            </h1>
            <p className="text-muted-foreground">
              Manage your subscription plans and pricing
            </p>
          </div>
          <Button sx={{
            height: "40px",
            width: "150px",
            background: "#049F99"
          }}
            variant="contained"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Plan
          </Button>

          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              Create New Plan
              </DialogTitle>

            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Add a new subscription plan for your users.
              </Typography>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Plan Name */}
                <TextField
                  fullWidth
                  label="Plan Name"
                  value={formData.planName}
                  onChange={(e) =>
                    setFormData({ ...formData, planName: e.target.value })
                  }
                  required
                />

                {/* Duration */}
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={formData.duration}
                    label="Duration"
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  >
                    <MenuItem value="1">Monthly (1 Month)</MenuItem>
                    <MenuItem value="3">Quarterly (3 Months)</MenuItem>
                    <MenuItem value="6">Half-Yearly (6 Months)</MenuItem>
                    <MenuItem value="12">Yearly (12 Months)</MenuItem>
                  </Select>
                </FormControl>

                {/* Category */}
                <FormControl>
                  <Typography>Category</Typography>
                  <RadioGroup
                    row
                    value={formData.instituteType}
                    onChange={(e) =>
                      setFormData({ ...formData, instituteType: e.target.value })
                    }
                  >
                    <FormControlLabel value="1" control={<Radio />} label="School" />
                    <FormControlLabel value="2" control={<Radio />} label="College & University" />
                  </RadioGroup>
                </FormControl>

                {/* Price */}
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />

                {/* Description */}
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  required
                />

                {/* Image */}
                <TextField
                  fullWidth
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0] || null,
                    })
                  }
                />

                <DialogActions>
                  <Button sx={{
                    background: "#049F99"
                  }}
                    type="button"
                    variant="contained"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button sx={{
                    background: "#049F99"
                  }}
                    type="submit" variant="contained" disabled={loading}>
                    {loading ? "Loading..." : "Create Plan"}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
            
          </Dialog>


<Dialog
  open={!!viewPlan}
  onClose={() => setViewPlan(null)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>{viewPlan?.planName}</DialogTitle>

  <DialogContent>
    {viewPlan && (
      <div style={{ marginTop: "10px" }}>
        {viewPlan.plan_image && (
          <img
            src={viewPlan.plan_image}
            alt={viewPlan.planName}
            style={{
              width: "100%",
              height: "240px",
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          />
        )}

        {/* Status + Price + Duration + Category */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
          <Chip
            label={viewPlan.status === 1 ? "Active" : "Inactive"}
            color={viewPlan.status === 1 ? "success" : "error"}
          />

          <Chip label={`₹ ${viewPlan.price}`} />
          <Chip label={getDurationLabel(viewPlan.duration)} />
          <Chip label={getCategoryLabel(viewPlan.instituteType)} />
        </div>

        {/* Description */}
        <div>
          <Typography variant="subtitle2">Description</Typography>
          <Typography variant="body2" color="text.secondary">
            {viewPlan.description}
          </Typography>
        </div>
      </div>
    )}
  </DialogContent>

  <DialogActions>
    <Button sx={{
                    background: "#049F99"
                  }}
      onClick={() => setViewPlan(null)} variant="contained">
      Close
    </Button>
  </DialogActions>
</Dialog>



        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
  <Card>
    <CardContent className="pt-6">
      <div className="text-2xl font-bold">{plans.length}</div>
      <p className="text-xs text-muted-foreground">Total Plans</p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6">
      <div className="text-2xl font-bold text-success">
        {plans.filter((p) => p.status === 1).length}
      </div>
      <p className="text-xs text-muted-foreground">Active Plans</p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6">
      <div className="text-2xl font-bold text-muted-foreground">
        {plans.filter((p) => p.status === 0).length}
      </div>
      <p className="text-xs text-muted-foreground">Inactive Plans</p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6">
      <div className="text-2xl font-bold">
        {plans.filter((p) => p.instituteType === 1).length}
      </div>
      <p className="text-xs text-muted-foreground">School Plans</p>
    </CardContent>
  </Card>

  {/* ✅ NEW COLLEGE CARD */}
  <Card>
    <CardContent className="pt-6">
      <div className="text-2xl font-bold">
        {plans.filter((p) => p.instituteType === 2).length}
      </div>
      <p className="text-xs text-muted-foreground">College Plans</p>
    </CardContent>
  </Card>
</div>


        <div className="flex flex-wrap gap-2">
<Button
  variant={planFilter === "all" ? "contained" : "outlined"}
  onClick={() => setPlanFilter("all")}
  sx={filterButtonStyle("all")}
>
  All
</Button>

<Button
  variant={planFilter === "active" ? "contained" : "outlined"}
  onClick={() => setPlanFilter("active")}
  sx={filterButtonStyle("active")}
>
  Active
</Button>

<Button
  variant={planFilter === "inactive" ? "contained" : "outlined"}
  onClick={() => setPlanFilter("inactive")}
  sx={filterButtonStyle("inactive")}
>
  Inactive
</Button>

<Button
  variant={planFilter === "school" ? "contained" : "outlined"}
  onClick={() => setPlanFilter("school")}
  sx={filterButtonStyle("school")}
>
  School
</Button>



  <Button
  sx={{
    color: planFilter === "college" ? "#fff" : "#049F99",
    backgroundColor: planFilter === "college" ? "#049F99" : "transparent",
    borderColor: "#049F99",
    "&:hover": {
      backgroundColor:
        planFilter === "college" ? "#038a85" : "rgba(4,159,153,0.1)",
      borderColor: "#049F99",
    },
  }}
    variant={planFilter === "college" ? "contained" : "outlined"}
    onClick={() => setPlanFilter("college")}
  >
    College
  </Button>
</div>

        {/* ===== PLAN LIST (UNCHANGED UI) ===== */}
        {fetching ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6">

            {filteredPlans.map((plan) => (
              <Card key={plan._id} className="overflow-hidden">
  <div className="flex flex-col lg:flex-row">
    
    {/* IMAGE SECTION (TOP / LEFT) */}
    <div className="lg:w-48 bg-muted flex items-center justify-center p-2">
  <div className="w-40 h-32 rounded-xl bg-background border flex items-center justify-center overflow-hidden">

        {plan.plan_image ? (
          <img
            src={plan.plan_image}
            alt={plan.planName}
            className="w-full h-full object-contain" // object fit contain property for image size 
          />
        ) : (
          <Image className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
    </div>

    {/* CONTENT SECTION */}
    <CardContent className="flex-1 p-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">

        {/* DETAILS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-semibold">{plan.planName}</h3>
<Badge
  className={
    plan.status === 1
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300"
  }
>
  {plan.status === 1 ? "Active" : "Inactive"}
</Badge>

          </div>

          <p className="text-sm text-muted-foreground max-w-xl line-clamp-2">
  {plan.description}
</p>


          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {getDurationLabel(plan.duration)}
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4" /> ₹{plan.price}
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {getCategoryLabel(plan.instituteType)}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(plan.createdAt).toLocaleDateString("en-IN")}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button sx={{
            height: "30px",
            width: "60px",
            color: "#fafafa",
            background: "#049F99"
          }}
            variant="contained"
            onClick={() => setViewPlan(plan)}
          >
            View
          </Button>

          <Button
  variant="outlined"
  onClick={() => togglePlanStatus(plan._id, plan.status)}
  sx={{
    height: "30px",
    width: "60px",
    color: "#049F99",
    borderColor: "#049F99",
    "&:hover": {
      borderColor: "#049F99",
      backgroundColor: "rgba(4,159,153,0.08)"
    }
  }}
>
  <Power className="h-4 w-4 mr-1" />
</Button>

<Button sx={{
            height: "30px",
            width: "70px",
            borderColor: "error.main",
          }}
  variant="contained"
  color="error"
  onClick={() => deletePlan(plan._id)}
>
  <Trash2 className="h-4 w-4 mr-1" />
  Delete
</Button>

        </div>

      </div>
    </CardContent>
  </div>
</Card>

            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AddPlanPage;
