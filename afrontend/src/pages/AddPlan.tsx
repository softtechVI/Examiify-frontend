import { useEffect, useState } from "react";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
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

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                Add New Plan
              </Button>
            </DialogTrigger>

            {/* ===== MODAL (UNCHANGED) ===== */}
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
                <DialogDescription>
                  Add a new subscription plan for your users.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Plan Name */}
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input
                    value={formData.planName}
                    onChange={(e) =>
                      setFormData({ ...formData, planName: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(v) =>
                      setFormData({ ...formData, duration: v })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Monthly (1 Month)</SelectItem>
                      <SelectItem value="3">Quarterly (3 Months)</SelectItem>
                      <SelectItem value="6">Half-Yearly (6 Months)</SelectItem>
                      <SelectItem value="12">Yearly (12 Months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <RadioGroup
                    value={formData.instituteType}
                    onValueChange={(v) =>
                      setFormData({ ...formData, instituteType: v })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" />
                      <Label>School</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" />
                      <Label>College & University</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
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
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <Label>Plan Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Plan
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={!!viewPlan} onOpenChange={() => setViewPlan(null)}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>{viewPlan?.planName}</DialogTitle>
      <DialogDescription>
        Complete plan details
      </DialogDescription>
    </DialogHeader>

    {viewPlan && (
      <div className="space-y-4">
        {viewPlan.plan_image && (
          <img
            src={viewPlan.plan_image}
            alt={viewPlan.planName}
            className="w-full h-60 object-contain border rounded-lg"
          />
        )}

        <div className="flex gap-4 flex-wrap text-sm">
          <Badge
            className={
              viewPlan.status === 1
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {viewPlan.status === 1 ? "Active" : "Inactive"}
          </Badge>

          <span>₹ {viewPlan.price}</span>
          <span>{getDurationLabel(viewPlan.duration)}</span>
          <span>{getCategoryLabel(viewPlan.instituteType)}</span>
        </div>

        <div>
          <Label>Description</Label>
          <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">
            {viewPlan.description}
          </p>
        </div>
      </div>
    )}
  </DialogContent>
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
    variant={planFilter === "all" ? "default" : "outline"}
    onClick={() => setPlanFilter("all")}
  >
    All
  </Button>

  <Button
    variant={planFilter === "active" ? "default" : "outline"}
    onClick={() => setPlanFilter("active")}
  >
    Active
  </Button>

  <Button
    variant={planFilter === "inactive" ? "default" : "outline"}
    onClick={() => setPlanFilter("inactive")}
  >
    Inactive
  </Button>

  <Button
    variant={planFilter === "school" ? "default" : "outline"}
    onClick={() => setPlanFilter("school")}
  >
    School
  </Button>

  <Button
    variant={planFilter === "college" ? "default" : "outline"}
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
          <Button
  size="sm"
  variant="secondary"
  onClick={() => setViewPlan(plan)}
>
  View
</Button>

          <Button
  size="sm"
  variant="outline"
  onClick={() => togglePlanStatus(plan._id, plan.status)}
>
  <Power className="h-4 w-4 mr-1" />
</Button>

<Button
  size="sm"
  variant="destructive"
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



// import { useEffect, useState } from "react";
// import { AdminLayout } from "@/Components/layout/AdminLayout";
// import {
//   Button,
//   TextField,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogActions,
//   DialogContentText,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Input,
// } from "@mui/material";

// import {
//   Plus,
//   Image,
//   Trash2,
//   Power,
//   Calendar,
//   IndianRupee,
//   Clock,
//   Building2,
//   Loader2,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// import { AddPlan, GetAllPlan, DeletePlan, UpdatePlanStatus } from "@/services/api";
// import type { Plan } from "@/types";
// import { SelectContent } from "@radix-ui/react-select";
// import { SelectItem } from "@/Components/ui/select";
// import { DialogHeader } from "@/components/ui/dialog";

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
//   }, []);

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

//   /* ================= UI (100% SAME AS CODE 2) ================= */
//   return (
//     <AdminLayout>
//       <div className="p-6 lg:p-8 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="space-y-1">
//             <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
//               Subscription Plans
//             </h1>
//             <p className="text-muted-foreground">
//               Manage your subscription plans and pricing
//             </p>
//           </div>

//           <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//             <DialogContent asChild>
//               <Button className="gap-2">
//                 Add New Plan
//               </Button>
//             </DialogContent>

//             {/* ===== MODAL (UNCHANGED) ===== */}
//             <DialogContent className="sm:max-w-lg">
//               <DialogActions>
//                 <DialogTitle>Create New Plan</DialogTitle>
//                 <DialogContentText>
//                   Add a new subscription plan for your users.
//                 </DialogContentText>
//               </DialogActions>

//               <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//                 {/* Plan Name */}
//                 <div className="space-y-2">
//                   <InputLabel>Plan Name</InputLabel>
//                   <TextField
//                     value={formData.planName}
//                     onChange={(e) =>
//                       setFormData({ ...formData, planName: e.target.value })
//                     }
//                     required
//                   />
//                 </div>

//                 {/* Duration */}
//                 <div className="space-y-2">
//                   <InputLabel>Duration</InputLabel>
//                   <Select
//                     value={formData.duration}
//                     onValueChange={(v) =>
//                       setFormData({ ...formData, duration: v })
//                     }
//                     required
//                   >
//                     <SelectContent className="w-full">
//                       <Select placeholder="Select duration" />
//                     </SelectContent>
//                     <SelectContent>
//                       <SelectItem value="1">Monthly (1 Month)</SelectItem>
//                       <SelectItem value="3">Quarterly (3 Months)</SelectItem>
//                       <SelectItem value="6">Half-Yearly (6 Months)</SelectItem>
//                       <SelectItem value="12">Yearly (12 Months)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Category */}
//                 <div className="space-y-2">
//                   <InputLabel>Category</InputLabel>
//                   <Radio
//                     value={formData.instituteType}
//                     onValueChange={(v) =>
//                       setFormData({ ...formData, instituteType: v })
//                     }
//                     className="flex gap-4"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroup value="1" />
//                       <InputLabel>School</InputLabel>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroup value="2" />
//                       <InputLabel>College & University</InputLabel>
//                     </div>
//                   </Radio>
//                 </div>

//                 {/* Price */}
//                 <div className="space-y-2">
//                   <InputLabel>Price (₹)</InputLabel>
//                   <TextField
//                     type="number"
//                     value={formData.price}
//                     onChange={(e) =>
//                       setFormData({ ...formData, price: e.target.value })
//                     }
//                     required
//                   />
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-2">
//                   <InputLabel>Description</InputLabel>
//                   <TextField
//                     multiline
//                     rows={3}
//                     value={formData.description}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         description: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </div>

//                 {/* Image */}
//                 <div className="space-y-2">
//                   <InputLabel>Plan Image</InputLabel>
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         image: e.target.files?.[0] || null,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setIsModalOpen(false)}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={loading}>
//                     {loading && (
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     )}
//                     Create Plan
//                   </Button>
//                 </div>
//               </form>
//             </DialogContent>
//           </Dialog>

//           <Dialog open={!!viewPlan} onOpenChange={() => setViewPlan(null)}>
//   <DialogContent className="max-w-2xl">
//     <DialogHeader>
//       <DialogTitle>{viewPlan?.planName}</DialogTitle>
//       <DialogContentText>
//         Complete plan details
//       </DialogContentText>
//     </DialogHeader>

//     {viewPlan && (
//       <div className="space-y-4">
//         {viewPlan.plan_image && (
//           <img
//             src={viewPlan.plan_image}
//             alt={viewPlan.planName}
//             className="w-full h-60 object-contain border rounded-lg"
//           />
//         )}

//         <div className="flex gap-4 flex-wrap text-sm">
//           <FormControl
//             className={
//               viewPlan.status === 1
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }
//           >
//             {viewPlan.status === 1 ? "Active" : "Inactive"}
//           </FormControl>

//           <span>₹ {viewPlan.price}</span>
//           <span>{getDurationLabel(viewPlan.duration)}</span>
//           <span>{getCategoryLabel(viewPlan.instituteType)}</span>
//         </div>

//         <div>
//           <InputLabel>Description</InputLabel>
//           <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">
//             {viewPlan.description}
//           </p>
//         </div>
//       </div>
//     )}
//   </DialogContent>
// </Dialog>


//         </div>
//         <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
//   <Card>
//     <CardContent className="pt-6">
//       <div className="text-2xl font-bold">{plans.length}</div>
//       <p className="text-xs text-muted-foreground">Total Plans</p>
//     </CardContent>
//   </Card>

//   <Card>
//     <CardContent className="pt-6">
//       <div className="text-2xl font-bold text-success">
//         {plans.filter((p) => p.status === 1).length}
//       </div>
//       <p className="text-xs text-muted-foreground">Active Plans</p>
//     </CardContent>
//   </Card>

//   <Card>
//     <CardContent className="pt-6">
//       <div className="text-2xl font-bold text-muted-foreground">
//         {plans.filter((p) => p.status === 0).length}
//       </div>
//       <p className="text-xs text-muted-foreground">Inactive Plans</p>
//     </CardContent>
//   </Card>

//   <Card>
//     <CardContent className="pt-6">
//       <div className="text-2xl font-bold">
//         {plans.filter((p) => p.instituteType === 1).length}
//       </div>
//       <p className="text-xs text-muted-foreground">School Plans</p>
//     </CardContent>
//   </Card>

//   {/* ✅ NEW COLLEGE CARD */}
//   <Card>
//     <CardContent className="pt-6">
//       <div className="text-2xl font-bold">
//         {plans.filter((p) => p.instituteType === 2).length}
//       </div>
//       <p className="text-xs text-muted-foreground">College Plans</p>
//     </CardContent>
//   </Card>
// </div>


//         <div className="flex flex-wrap gap-2">
//   <Button
//     variant={planFilter === "all" ? "default" : "outline"}
//     onClick={() => setPlanFilter("all")}
//   >
//     All
//   </Button>

//   <Button
//     variant={planFilter === "active" ? "default" : "outline"}
//     onClick={() => setPlanFilter("active")}
//   >
//     Active
//   </Button>

//   <Button
//     variant={planFilter === "inactive" ? "default" : "outline"}
//     onClick={() => setPlanFilter("inactive")}
//   >
//     Inactive
//   </Button>

//   <Button
//     variant={planFilter === "school" ? "default" : "outline"}
//     onClick={() => setPlanFilter("school")}
//   >
//     School
//   </Button>

//   <Button
//     variant={planFilter === "college" ? "default" : "outline"}
//     onClick={() => setPlanFilter("college")}
//   >
//     College
//   </Button>
// </div>

//         {/* ===== PLAN LIST (UNCHANGED UI) ===== */}
//         {fetching ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-8 w-8 animate-spin" />
//           </div>
//         ) : (
//           <div className="grid gap-6">

//             {filteredPlans.map((plan) => (
//               <Card key={plan._id} className="overflow-hidden">
//   <div className="flex flex-col lg:flex-row">
    
//     {/* IMAGE SECTION (TOP / LEFT) */}
//     <div className="lg:w-48 bg-muted flex items-center justify-center p-2">
//   <div className="w-40 h-32 rounded-xl bg-background border flex items-center justify-center overflow-hidden">

//         {plan.plan_image ? (
//           <img
//             src={plan.plan_image}
//             alt={plan.planName}
//             className="w-full h-full object-contain" // object fit contain property for image size 
//           />
//         ) : (
//           <Image className="h-10 w-10 text-muted-foreground" />
//         )}
//       </div>
//     </div>

//     {/* CONTENT SECTION */}
//     <CardContent className="flex-1 p-6">
//       <div className="flex flex-col lg:flex-row justify-between gap-4">

//         {/* DETAILS */}
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 flex-wrap">
//             <h3 className="text-xl font-semibold">{plan.planName}</h3>
//             <FormControl
//               className={
//                 plan.status === 1
//                   ? "bg-green-100 text-green-700 border border-green-300"
//                   : "bg-red-100 text-red-700 border border-red-300"
//               }
//             >
//               {plan.status === 1 ? "Active" : "Inactive"}
//             </FormControl>

//                       </div>

//                       <p className="text-sm text-muted-foreground max-w-xl line-clamp-2">
//               {plan.description}
//             </p>


//           <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <Clock className="h-4 w-4" />
//               {getDurationLabel(plan.duration)}
//             </div>
//             <div className="flex items-center gap-1">
//               <IndianRupee className="h-4 w-4" /> ₹{plan.price}
//             </div>
//             <div className="flex items-center gap-1">
//               <Building2 className="h-4 w-4" />
//               {getCategoryLabel(plan.instituteType)}
//             </div>
//             <div className="flex items-center gap-1">
//               <Calendar className="h-4 w-4" />
//               {new Date(plan.createdAt).toLocaleDateString("en-IN")}
//             </div>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex gap-2">
//           <Button
//           size="sm"
//           variant="secondary"
//           onClick={() => setViewPlan(plan)}
//         >
//           View
//         </Button>

//           <Button
//             size="sm"
//             variant="outline"
//             onClick={() => togglePlanStatus(plan._id, plan.status)}
//           >
//             <Power className="h-4 w-4 mr-1" />
//           </Button>

//           <Button
//             size="sm"
//             variant="destructive"
//             onClick={() => deletePlan(plan._id)}
//           >
//             <Trash2 className="h-4 w-4 mr-1" />
//             Delete
//           </Button>

//         </div>

//       </div>
//     </CardContent>
//   </div>
// </Card>

//             ))}
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default AddPlanPage;
