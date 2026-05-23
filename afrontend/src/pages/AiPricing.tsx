import { useEffect, useState } from "react";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Switch,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Brain,
  IndianRupee,
  Users,
  Edit2,
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
import { brandColors, pageWrapperSx, pageHeaderSx, pageTitleSx, dialogBtnSx } from "@/theme";

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
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleUpdatePrice = async () => {
    if (!newPrice || Number(newPrice) <= 0) {
      toast({ title: "Error", description: "Please enter a valid price", variant: "destructive" });
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
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DeleteAiPrice(id);
      toast({ title: "AI Price Deleted" });
      fetchPrices();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <Box sx={pageWrapperSx}>

        {/* HEADER */}
        <Box sx={pageHeaderSx}>
          <Box>
            <Typography sx={pageTitleSx}>AI Pricing</Typography>
            <Typography sx={{ml: 5}} variant="body2" color="text.secondary">
              Manage AI analysis pricing and settings
            </Typography>
          </Box>

          {/* UPDATE PRICE BUTTON */}
          <Button
            variant="contained"
            sx={dialogBtnSx}
            startIcon={<Edit2 size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            Update Price
          </Button>
        </Box>

        {/* STATS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {/* Current Price */}
          <Card>
            <CardContent sx={{ pt: 3, display: "flex", alignItems: "center", gap: 1.5, "&:last-child": { pb: 3 } }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(4,159,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain size={20} color={brandColors.primary} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
                  ₹{prices.find((p) => p.active)?.priceCents || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Current Price</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Connected Users */}
          <Card>
            <CardContent sx={{ pt: 3, display: "flex", alignItems: "center", gap: 1.5, "&:last-child": { pb: 3 } }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(46,125,50,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={20} color="#2e7d32" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
                  {prices.reduce((a, p) => a + (p.totalConnectedUsers || 0), 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">Connected Users</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Active Plans */}
          <Card>
            <CardContent sx={{ pt: 3, display: "flex", alignItems: "center", gap: 1.5, "&:last-child": { pb: 3 } }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(237,108,2,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IndianRupee size={20} color="#ed6c02" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
                  {prices.filter((p) => p.active).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">Active Plans</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* TABLE */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Pricing History</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              All AI pricing configurations
            </Typography>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Price (₹)</TableCell>
                    <TableCell>Users</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prices.map((price) => (
                    <TableRow key={price._id}>
                      <TableCell sx={{ fontWeight: 500 }}>₹{price.priceCents}</TableCell>
                      <TableCell>{price.totalConnectedUsers}</TableCell>
                      <TableCell>{new Date(price.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={price.active ? "Active" : "Inactive"}
                          color={price.active ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={price.active}
                          onChange={(e) => handleToggleStatus(price._id, e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: brandColors.primary },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: brandColors.primary },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(price._id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>

        {/* UPDATE PRICE DIALOG */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update AI Price</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Price per Analysis (₹)
              </Typography>
              <TextField
                type="number"
                placeholder="e.g., 50"
                fullWidth
                size="small"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={dialogBtnSx}
              onClick={handleUpdatePrice}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : null}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </AdminLayout>
  );
};

export default AiPricing;