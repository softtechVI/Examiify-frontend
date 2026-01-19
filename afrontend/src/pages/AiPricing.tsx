// import { useState } from "react";
// import { AdminLayout } from "@/components/layout/AdminLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Brain, IndianRupee, Users, Edit2, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import type { AiPrice } from "@/types";

// const mockAiPrices: AiPrice[] = [
//   { _id: "1", priceCents: 50, active: true, totalConnectedUsers: 1234, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
//   { _id: "2", priceCents: 30, active: false, totalConnectedUsers: 567, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString() },
// ];

// const AiPricing = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [prices, setPrices] = useState<AiPrice[]>(mockAiPrices);
//   const [newPrice, setNewPrice] = useState("");
//   const { toast } = useToast();

//   const handleUpdatePrice = async () => {
//     if (!newPrice || parseFloat(newPrice) <= 0) {
//       toast({ title: "Error", description: "Please enter a valid price.", variant: "destructive" });
//       return;
//     }
//     setLoading(true);
//     await new Promise((r) => setTimeout(r, 500));
//     toast({ title: "Price Updated", description: "AI pricing has been updated successfully." });
//     setIsModalOpen(false);
//     setNewPrice("");
//     setLoading(false);
//   };

//   const handleToggleStatus = async (id: string) => {
//     setPrices(prices.map((p) => p._id === id ? { ...p, active: !p.active } : p));
//     toast({ title: "Status Updated", description: "AI pricing status has been changed." });
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6 lg:p-8 space-y-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="space-y-1">
//             <h1 className="text-2xl lg:text-3xl font-bold">AI Pricing</h1>
//             <p className="text-muted-foreground">Manage AI analysis pricing and settings</p>
//           </div>
//           <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//             <DialogTrigger asChild>
//               <Button className="gap-2"><Edit2 className="h-4 w-4" />Update Price</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader><DialogTitle>Update AI Price</DialogTitle></DialogHeader>
//               <div className="space-y-4 mt-4">
//                 <div className="space-y-2">
//                   <Label>Price per Analysis (₹)</Label>
//                   <Input type="number" placeholder="e.g., 50" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
//                 </div>
//                 <div className="flex justify-end gap-3">
//                   <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
//                   <Button onClick={handleUpdatePrice} disabled={loading}>
//                     {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save
//                   </Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card><CardContent className="pt-6 flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-primary/10"><Brain className="h-5 w-5 text-primary" /></div>
//             <div><div className="text-2xl font-bold">₹{prices.find(p => p.active)?.priceCents || 0}</div><p className="text-xs text-muted-foreground">Current Price</p></div>
//           </CardContent></Card>
//           <Card><CardContent className="pt-6 flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-success/10"><Users className="h-5 w-5 text-success" /></div>
//             <div><div className="text-2xl font-bold">{prices.reduce((a, p) => a + p.totalConnectedUsers, 0)}</div><p className="text-xs text-muted-foreground">Connected Users</p></div>
//           </CardContent></Card>
//           <Card><CardContent className="pt-6 flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-warning/10"><IndianRupee className="h-5 w-5 text-warning" /></div>
//             <div><div className="text-2xl font-bold">{prices.filter(p => p.active).length}</div><p className="text-xs text-muted-foreground">Active Plans</p></div>
//           </CardContent></Card>
//         </div>

//         <Card>
//           <CardHeader><CardTitle>Pricing History</CardTitle><CardDescription>All AI pricing configurations</CardDescription></CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow><TableHead>Price (₹)</TableHead><TableHead>Users</TableHead><TableHead>Updated</TableHead><TableHead>Status</TableHead><TableHead>Active</TableHead></TableRow>
//               </TableHeader>
//               <TableBody>
//                 {prices.map((price) => (
//                   <TableRow key={price._id}>
//                     <TableCell className="font-medium">₹{price.priceCents}</TableCell>
//                     <TableCell>{price.totalConnectedUsers}</TableCell>
//                     <TableCell>{new Date(price.updatedAt).toLocaleDateString()}</TableCell>
//                     <TableCell><Badge variant={price.active ? "default" : "secondary"}>{price.active ? "Active" : "Inactive"}</Badge></TableCell>
//                     <TableCell><Switch checked={price.active} onCheckedChange={() => handleToggleStatus(price._id)} /></TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AiPricing;


import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Brain,
  IndianRupee,
  Users,
  Edit2,
  Loader2,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  GetAiPrice,
  ModifyAiPrice,
  ModifyAiStatus,
  DeleteAiPrice,
} from "@/services/api";
import type { AiPrice } from "@/types";

const AiPricing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<AiPrice[]>([]);
  const [newPrice, setNewPrice] = useState("");
  const { toast } = useToast();

  const fetchPrices = async () => {
    try {
      const data = await GetAiPrice();
      setPrices(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleUpdatePrice = async () => {
    if (!newPrice || Number(newPrice) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await ModifyAiPrice(Number(newPrice));
      toast({ title: "Price Updated Successfully" });
      setIsModalOpen(false);
      setNewPrice("");
      fetchPrices();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, status: boolean) => {
    try {
      await ModifyAiStatus(id, status);
      fetchPrices();
      toast({ title: "Status Updated" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DeleteAiPrice(id);
      toast({ title: "AI Price Deleted" });
      fetchPrices();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">AI Pricing</h1>
            <p className="text-muted-foreground">
              Manage AI analysis pricing and settings
            </p>
          </div>

          {/* MODAL */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Edit2 className="h-4 w-4" />
                Update Price
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update AI Price</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Price per Analysis (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdatePrice} disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  ₹{prices.find((p) => p.active)?.priceCents || 0}
                </div>
                <p className="text-xs text-muted-foreground">Current Price</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {prices.reduce(
                    (a, p) => a + (p.totalConnectedUsers || 0),
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Connected Users
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <IndianRupee className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {prices.filter((p) => p.active).length}
                </div>
                <p className="text-xs text-muted-foreground">Active Plans</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing History</CardTitle>
            <CardDescription>All AI pricing configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {prices.map((price) => (
                  <TableRow key={price._id}>
                    <TableCell className="font-medium">
                      ₹{price.priceCents}
                    </TableCell>
                    <TableCell>{price.totalConnectedUsers}</TableCell>
                    <TableCell>
                      {new Date(price.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={price.active ? "default" : "secondary"}
                      >
                        {price.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={price.active}
                        onCheckedChange={(v) =>
                          handleToggleStatus(price._id, v)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(price._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AiPricing;
