import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Power,
  Calendar,
  Percent,
  IndianRupee,
  Eye,
  Ticket,
  Loader2,
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


  /* ================= FORM STATE (EXACT CODE-1 MATCH) ================= */

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
    planId: [] as string[], // ✅ IMPORTANT
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

  /* ================= PLAN TOGGLE (MULTI SELECT) ================= */

  const togglePlanSelection = (planId: string) => {
    setFormData((prev) => ({
      ...prev,
      planId: prev.planId.includes(planId)
        ? prev.planId.filter((id) => id !== planId)
        : [...prev.planId, planId],
    }));
  };

  /* ================= SUBMIT (SAME AS CODE-1) ================= */

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

      // ✅ EXACT CODE-1 LOGIC
      formData.planId.forEach((id) => fd.append("planId", id));

      if (editingId) {
        await updateCouponData(editingId, fd);
      } else {
        await AddCoupon(fd);
      }

      toast({
        title: editingId ? "Coupon Updated" : "Coupon Added",
      });

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
      planId: c.applicablePlanId || [], // ✅ PREFILL
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
  const getStatusBadge = (coupon: Coupon) => {
    if (new Date(coupon.endDate) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (coupon.status === "1") {
      return <Badge className="bg-success text-success-foreground">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };


  const filteredCoupons = coupons.filter((c) => {
  const isExpired = new Date(c.endDate) < new Date();

  if (filterStatus === "active") {
    return c.status === "1" && !isExpired;
  }

  if (filterStatus === "inactive") {
    return c.status === "0" && !isExpired;
  }

  if (filterStatus === "expired") {
    return isExpired;
  }

  return true; // all
});

  /* ================= UI ================= */

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Coupons & Discounts</h1>
          <Button onClick={() => setOpenForm(true)}>
            Add Coupon
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Coupons" value={coupons.length} icon={Ticket} />
          <StatCard title="Active" value={activeCount} icon={Power} />
          <StatCard title="Inactive" value={inactiveCount} icon={Power} />
          <StatCard title="Expired" value={expiredCount} icon={Calendar} />
          <StatCard title="Used" value={usedCount} icon={Percent} />
      </div>

      {/* FILTER BAR */}
<div className="flex flex-wrap gap-2">
  <Button
    variant={filterStatus === "all" ? "default" : "outline"}
    onClick={() => setFilterStatus("all")}
  >
    All
  </Button>

  <Button
    variant={filterStatus === "active" ? "default" : "outline"}
    onClick={() => setFilterStatus("active")}
  >
    Active
  </Button>

  <Button
    variant={filterStatus === "inactive" ? "default" : "outline"}
    onClick={() => setFilterStatus("inactive")}
  >
    Inactive
  </Button>

  <Button
    variant={filterStatus === "expired" ? "destructive" : "outline"}
    onClick={() => setFilterStatus("expired")}
  >
    Expired
  </Button>
</div>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>All Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              // <Table>
              //   <TableHeader>
              //     <TableRow>
              //       <TableHead>Code</TableHead>
              //       <TableHead>Discount</TableHead>
              //       <TableHead>Status</TableHead>
              //       <TableHead className="text-right">Actions</TableHead>
              //     </TableRow>
              //   </TableHeader>
              //   <TableBody>
              //     {filteredCoupons.map((c) => (
              //       <TableRow key={c._id}>
              //         <TableCell className="font-mono">
              //           {c.couponCode}
              //         </TableCell>
              //         <TableCell>
              //           {c.discountType === "percentage"
              //             ? `${c.discountValue}%`
              //             : `₹${c.discountValue}`}
              //         </TableCell>
              //         <TableCell>
              //           {getStatusBadge(c)}
              //         </TableCell>
              //         <TableCell className="text-right flex justify-end gap-2">
              //           <Button
              //             size="icon"
              //             variant="ghost"
              //             onClick={() => viewCoupon(c)}
              //           >
              //             <Eye />
              //           </Button>

              //           <Button
              //             size="icon"
              //             variant="ghost"
              //             onClick={() => editCoupon(c)}
              //           >
              //             ✏️
              //           </Button>
              //           {/* <Button
              //             size="icon"
              //             variant="ghost"
              //             onClick={() => toggleStatus(c._id, c.status)}
              //           >
              //             <Power />
              //           </Button> */}
              //           <Button
              //             size="icon"
              //             variant="ghost"
              //             disabled={new Date(c.endDate) < new Date()}
              //             onClick={() => toggleStatus(c._id, c.status)}
              //             title={
              //               new Date(c.endDate) < new Date()
              //                 ? "Expired coupon cannot be activated"
              //                 : "Toggle Status"
              //             }
              //           >
              //             <Power
              //               className={
              //                 new Date(c.endDate) < new Date()
              //                   ? "opacity-40 cursor-not-allowed"
              //                   : ""
              //               }
              //             />
              //           </Button>

              //           <Button
              //             size="icon"
              //             variant="ghost"
              //             className="text-destructive"
              //             onClick={() => deleteCoupon(c._id)}
              //           >
              //             <Trash2 />
              //           </Button>
              //         </TableCell>
              //       </TableRow>
              //     ))}
              //   </TableBody>
              // </Table>
              <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Code</TableHead>
      <TableHead>Discount</TableHead>
      <TableHead>Associated Plans</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {filteredCoupons.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={4}
          className="text-center text-muted-foreground py-6"
        >
          No coupons found
        </TableCell>
      </TableRow>
    ) : (
      filteredCoupons.map((c) => (
        <TableRow key={c._id}>
          <TableCell className="font-mono">
            {c.couponCode}
          </TableCell>

          <TableCell>
            {c.discountType === "percentage"
              ? `${c.discountValue}%`
              : `₹${c.discountValue}`}
          </TableCell>

          <TableCell>
  <div className="flex flex-wrap gap-1">
    {c.applicablePlanId && c.applicablePlanId.length > 0 ? (
      c.applicablePlanId.map((id) => {
        const plan = plans.find((p) => p._id === id);
        return plan ? (
          <Badge
            key={id}
            variant="secondary"
            className="text-xs"
          >
            {plan.planName}
          </Badge>
        ) : null;
      })
    ) : (
      <span className="text-muted-foreground text-xs">—</span>
    )}
  </div>
</TableCell>

          

          <TableCell>
            {getStatusBadge(c)}
          </TableCell>

          <TableCell className="text-right flex justify-end gap-2">
            {/* VIEW */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => viewCoupon(c)}
            >
              <Eye />
            </Button>

            {/* EDIT */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editCoupon(c)}
            >
              ✏️
            </Button>

            {/* TOGGLE STATUS (LOCKED IF EXPIRED) */}
            <Button
              size="icon"
              variant="ghost"
              disabled={new Date(c.endDate) < new Date()}
              onClick={() => toggleStatus(c._id, c.status)}
              title={
                new Date(c.endDate) < new Date()
                  ? "Expired coupon cannot be activated"
                  : "Toggle Status"
              }
            >
              <Power
                className={
                  new Date(c.endDate) < new Date()
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }
              />
            </Button>

            {/* DELETE */}
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive"
              onClick={() => deleteCoupon(c._id)}
            >
              <Trash2 />
            </Button>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>

            )}
          </CardContent>
        </Card>

        {/* ADD / EDIT DIALOG */}
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Coupon" : "Add New Coupon"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Coupon Code"
                value={formData.couponCode}
                onChange={(v) => setFormData({ ...formData, couponCode: v })}
              />
              <Field
                label="Discount Value"
                type="number"
                value={formData.discountValue}
                onChange={(v) => setFormData({ ...formData, discountValue: v })}
              />
              <Field
                label="Max Discount"
                type="number"
                value={formData.maxDiscount}
                onChange={(v) => setFormData({ ...formData, maxDiscount: v })}
              />
              <Field
                label="Min Order Amount"
                type="number"
                value={formData.minOrderAmount}
                onChange={(v) =>
                  setFormData({ ...formData, minOrderAmount: v })
                }
              />
              <Field
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(v) => setFormData({ ...formData, startDate: v })}
              />
              <Field
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(v) => setFormData({ ...formData, endDate: v })}
              />
              <Field
                label="Usage Limit"
                type="number"
                value={formData.usageLimit}
                onChange={(v) => setFormData({ ...formData, usageLimit: v })}
              />
              <Field
                label="Per User Limit"
                type="number"
                value={formData.perUserLimit}
                onChange={(v) => setFormData({ ...formData, perUserLimit: v })}
              />

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* PLANS */}
              <div className="md:col-span-2">
                <Label>Associated Plans</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                  {plans.map((p) => (
                    <label key={p._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.planId.includes(p._id)}
                        onChange={() => togglePlanSelection(p._id)}
                      />
                      {p.planName}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setOpenForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingId ? "Update Coupon" : "Add Coupon"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Details Modal */}
        <Dialog open={openView} onOpenChange={setOpenView}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Coupon Details</DialogTitle>
            </DialogHeader>

            {selectedCoupon && (
              <div className="space-y-4">
                {/* Coupon Code */}
                <div className="flex justify-center">
                  <code className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xl font-mono font-bold">
                    {selectedCoupon.couponCode}
                  </code>
                </div>

                {/* Description */}
                <p className="text-center text-muted-foreground">
                  {selectedCoupon.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Discount</p>
                    <p className="font-medium">
                      {selectedCoupon.discountType === "percentage"
                        ? `${selectedCoupon.discountValue}%`
                        : `₹${selectedCoupon.discountValue}`}
                      {selectedCoupon.maxDiscount &&
                        ` (Max ₹${selectedCoupon.maxDiscount})`}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Min Order</p>
                    <p className="font-medium">
                      ₹{selectedCoupon.minOrderAmount || 0}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Usage</p>
                    <p className="font-medium">
                      {selectedCoupon.coupanUsed || 0} /{" "}
                      {selectedCoupon.usageLimit}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Per User</p>
                    <p className="font-medium">{selectedCoupon.perUserLimit}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {new Date(selectedCoupon.startDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {new Date(selectedCoupon.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">
                      {selectedCoupon.instituteType || "-"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Visible to Users</p>
                    <p className="font-medium">
                      {/* {selectedCoupon.isVisible === "1" ? "Yes" : "No"} */}
                    </p>
                  </div>
                </div>

                {/* Associated Plans */}
                {selectedCoupon.applicablePlanId && selectedCoupon.applicablePlanId.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Associated Plans
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCoupon.applicablePlanId.map((id, idx) => {
                        const plan = plans.find((p) => p._id === id);
                        return plan ? (
                          <span
                            key={idx}
                            className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                          >
                            {plan.planName}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex justify-center pt-2">
                  {selectedCoupon && getStatusBadge(selectedCoupon)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

/* ================= HELPERS ================= */

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <Card>
      <CardContent className="pt-6 flex items-center gap-3">
        <div className="p-2 rounded bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
