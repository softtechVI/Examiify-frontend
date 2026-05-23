// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AdminLayout } from "@/Components/layout/AdminLayout";
// import { Card, CardContent } from "@/Components/ui/card";
// import { Button } from "@/Components/ui/button";
// import { Input } from "@/Components/ui/input";
// import { Label } from "@/Components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/Components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/Components/ui/select";
// import { Shield, Plus, Pencil, Search, Users } from "lucide-react";
// import { defaultRoles, Role } from "@/data/roleData";

// const roleColors = [
//   "hsl(174, 72%, 40%)",
//   "hsl(220, 70%, 50%)",
//   "hsl(38, 92%, 50%)",
//   "hsl(142, 76%, 36%)",
//   "hsl(0, 84%, 60%)",
//   "hsl(280, 60%, 50%)",
// ];

// const Roles = () => {
//   const navigate = useNavigate();
//   const [roles, setRoles] = useState<Role[]>(defaultRoles);
//   const [search, setSearch] = useState("");
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [newRoleName, setNewRoleName] = useState("");
//   const [newRoleColor, setNewRoleColor] = useState(roleColors[0]);

//   const filtered = roles.filter((r) =>
//     r.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleCreate = () => {
//     if (!newRoleName.trim()) return;
//     const newRole: Role = {
//       _id: Date.now().toString(),
//       name: newRoleName.trim(),
//       color: newRoleColor,
//       defaultRoute: "/admindashboard",
//       canCreateRoles: [],
//       permissions: {},
//       createdAt: new Date().toISOString().split("T")[0],
//     };
//     setRoles([...roles, newRole]);
//     setNewRoleName("");
//     setDialogOpen(false);
//     navigate(`/roles/${newRole._id}`);
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6 lg:p-8 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="space-y-1">
//             <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//               <Shield className="h-8 w-8 text-primary" />
//               Roles & Permissions
//             </h1>
//             <p className="text-muted-foreground">
//               Manage user roles and their access permissions
//             </p>
//           </div>
//           <Button onClick={() => setDialogOpen(true)} className="gap-2">
//             <Plus className="h-4 w-4" />
//             Add New Role
//           </Button>
//         </div>

//         {/* Search */}
//         <div className="relative max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search roles..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9"
//           />
//         </div>

//         {/* Roles Grid */}
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filtered.map((role) => {
//             const permCount = Object.values(role.permissions).flat().length;
//             return (
//               <Card
//                 key={role._id}
//                 className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4"
//                 style={{ borderLeftColor: role.color }}
//                 onClick={() => navigate(`/roles/${role._id}`)}
//               >
//                 <CardContent className="p-5 space-y-4">
//                   <div className="flex items-start justify-between">
//                     <div
//                       className="h-11 w-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
//                       style={{ backgroundColor: role.color }}
//                     >
//                       {role.name.charAt(0)}
//                     </div>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(`/roles/${role._id}`);
//                       }}
//                     >
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-foreground text-lg">
//                       {role.name}
//                     </h3>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {permCount} permissions assigned
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                     <Users className="h-3.5 w-3.5" />
//                     <span>
//                       Can create:{" "}
//                       {role.canCreateRoles.length > 0
//                         ? role.canCreateRoles.join(", ")
//                         : "None"}
//                     </span>
//                   </div>

//                   <div className="pt-2 border-t border-border">
//                     <span className="text-xs text-muted-foreground">
//                       Created: {role.createdAt}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}

//           {/* Add Role Card */}
//           <Card
//             className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]"
//             onClick={() => setDialogOpen(true)}
//           >
//             <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
//               <Plus className="h-8 w-8" />
//               <span className="font-medium">Add New Role</span>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Create Role Dialog */}
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Create New Role</DialogTitle>
//               <DialogDescription>
//                 Add a new role and configure its permissions
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <Label htmlFor="roleName">Role Name</Label>
//                 <Input
//                   id="roleName"
//                   placeholder="e.g. Manager, Editor..."
//                   value={newRoleName}
//                   onChange={(e) => setNewRoleName(e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Role Color</Label>
//                 <div className="flex gap-2 flex-wrap">
//                   {roleColors.map((color) => (
//                     <button
//                       key={color}
//                       className={`h-8 w-8 rounded-full border-2 transition-all ${
//                         newRoleColor === color
//                           ? "border-foreground scale-110"
//                           : "border-transparent"
//                       }`}
//                       style={{ backgroundColor: color }}
//                       onClick={() => setNewRoleColor(color)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleCreate} disabled={!newRoleName.trim()}>
//                 Create & Configure
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </AdminLayout>
//   );
// };

// export default Roles;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Shield, Plus, Pencil, Search, Users } from "lucide-react";
import { defaultRoles, Role } from "@/data/roleData";
import {
  brandColors,
  pageWrapperSx,
  pageHeaderSx,
  pageTitleSx,
  dialogBtnSx,
} from "@/theme";

const roleColors = [
  "hsl(174, 72%, 40%)",
  "hsl(220, 70%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(142, 76%, 36%)",
  "hsl(0, 84%, 60%)",
  "hsl(280, 60%, 50%)",
];

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleColor, setNewRoleColor] = useState(roleColors[0]);

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newRoleName.trim()) return;
    const newRole: Role = {
      _id: Date.now().toString(),
      name: newRoleName.trim(),
      color: newRoleColor,
      defaultRoute: "/admindashboard",
      canCreateRoles: [],
      permissions: {},
      createdAt: new Date().toISOString().split("T")[0],
    };
    setRoles([...roles, newRole]);
    setNewRoleName("");
    setDialogOpen(false);
    navigate(`/roles/${newRole._id}`);
  };

  return (
    <AdminLayout>
      <Box sx={pageWrapperSx}>

        {/* HEADER */}
        <Box sx={pageHeaderSx}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h3" sx={pageTitleSx}>
                Roles & Permissions
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 5 }}>
              Manage user roles and their access permissions
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={dialogBtnSx}
            startIcon={<Plus size={16} />}
            onClick={() => setDialogOpen(true)}
          >
            Add New Role
          </Button>
        </Box>

        {/* SEARCH */}
        <TextField
          placeholder="Search roles..."
          value={search}
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 360 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color="#6b7280" />
              </InputAdornment>
            ),
          }}
        />

        {/* ROLES GRID */}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            },
          }}
        >
          {filtered.map((role) => {
            const permCount = Object.values(role.permissions).flat().length;
            return (
              <Card
                key={role._id}
                onClick={() => navigate(`/roles/${role._id}`)}
                sx={{
                  borderLeft: `4px solid ${role.color}`,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                    "& .edit-btn": { opacity: 1 },
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>

                  {/* Avatar + Edit */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                    <Box
                      sx={{
                        height: 44,
                        width: 44,
                        borderRadius: "50%",
                        bgcolor: role.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        fontFamily: "DIN, sans-serif",
                      }}
                    >
                      {role.name.charAt(0)}
                    </Box>
                    <IconButton
                      size="small"
                      className="edit-btn"
                      sx={{ opacity: 0, transition: "opacity 0.2s" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/roles/${role._id}`);
                      }}
                    >
                      <Pencil size={16} />
                    </IconButton>
                  </Box>

                  {/* Name + Permissions */}
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="h6" sx={{ color: "text.primary" }}>
                      {role.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {permCount} permissions assigned
                    </Typography>
                  </Box>

                  {/* Can Create */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <Users size={14} color="#6b7280" />
                    <Typography variant="caption" color="text.secondary">
                      Can create:{" "}
                      {role.canCreateRoles.length > 0
                        ? role.canCreateRoles.join(", ")
                        : "None"}
                    </Typography>
                  </Box>

                  {/* Created At */}
                  <Box sx={{ pt: 1.5, borderTop: "1px solid #e5e7eb" }}>
                    <Typography variant="caption" color="text.secondary">
                      Created: {role.createdAt}
                    </Typography>
                  </Box>

                </CardContent>
              </Card>
            );
          })}

          {/* Add Role Card */}
          <Card
            onClick={() => setDialogOpen(true)}
            sx={{
              border: "2px dashed #e5e7eb",
              boxShadow: "none",
              cursor: "pointer",
              minHeight: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.2s",
              "&:hover": { borderColor: brandColors.primary },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
                "&:last-child": { pb: 2 },
              }}
            >
              <Plus size={32} />
              <Typography variant="subtitle2" color="text.secondary">
                Add New Role
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* CREATE ROLE DIALOG */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Role</DialogTitle>
          <DialogContent dividers>
            <DialogContentText sx={{ mb: 2 }}>
              Add a new role and configure its permissions
            </DialogContentText>

            {/* Role Name */}
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              Role Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Manager, Editor..."
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              sx={{ mb: 2.5 }}
            />

            {/* Role Color */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Role Color
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {roleColors.map((color) => (
                <Box
                  key={color}
                  onClick={() => setNewRoleColor(color)}
                  sx={{
                    height: 32,
                    width: 32,
                    borderRadius: "50%",
                    bgcolor: color,
                    cursor: "pointer",
                    border: newRoleColor === color ? "2px solid #1a1a1a" : "2px solid transparent",
                    transform: newRoleColor === color ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.15s, border 0.15s",
                  }}
                />
              ))}
            </Box>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={dialogBtnSx}
              onClick={handleCreate}
              disabled={!newRoleName.trim()}
            >
              Create & Configure
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </AdminLayout>
  );
};

export default Roles;