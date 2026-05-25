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
  Checkbox,
  FormControlLabel,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { Plus, Search, Users, Lock, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createRole, getRoles } from "@/services/api";
import {useEffect, useMemo} from "react";
import {
  brandColors,
  pageWrapperSx,
  pageHeaderSx,
  pageTitleSx,
  dialogBtnSx,
} from "@/theme";
import {
  defaultRoleNames,
  getPermissionLabel,
  permissionGroups,
  roleColorMap,
} from "@/data/roleData";
import type { RoleRecord } from "@/types";

const getRoleColor = (role: RoleRecord, index: number) => {
  if (role.name in roleColorMap) {
    return roleColorMap[role.name];
  }

  const palette = [
    "hsl(174, 72%, 40%)",
    "hsl(220, 70%, 50%)",
    "hsl(38, 92%, 50%)",
    "hsl(142, 76%, 36%)",
    "hsl(280, 60%, 50%)",
  ];

  return palette[index % palette.length];
};

const Roles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [permissionCatalog, setPermissionCatalog] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data.roles);
      setPermissionCatalog(data.permissionCatalog);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load roles";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filtered = useMemo(
    () =>
      roles.filter((role) =>
        [role.name, role.key, role.description || ""]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [roles, search]
  );

  const resetDialog = () => {
    setDialogOpen(false);
    setNewRoleName("");
    setNewRoleDescription("");
    setSelectedPermissions([]);
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((item) => item !== permission)
        : [...prev, permission]
    );
  };

  const handleCreate = async () => {
    if (!newRoleName.trim()) return;

    setSaving(true);
    try {
      const response = await createRole({
        name: newRoleName.trim(),
        description: newRoleDescription.trim(),
        permissions: selectedPermissions,
      });
      toast({
        title: "Role created",
        description: `${response.role.name} was created successfully.`,
      });
      resetDialog();
      await fetchRoles();
      navigate(`/roles/${response.role._id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create role";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={pageWrapperSx}>
        <Box sx={pageHeaderSx}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h3" sx={pageTitleSx}>
                Roles & Permissions
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 5 }}>
              Manage the system roles stored in the database
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

        <TextField
          placeholder="Search roles..."
          value={search}
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 420 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color="#6b7280" />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Card>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">Loading roles...</Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
            }}
          >
            {filtered.map((role, index) => {
              const isSystem = role.code === 1 || role.key === "super-admin";
              const permCount = role.permissions.length;
              const color = getRoleColor(role, index);

              return (
                <Card
                  key={role._id}
                  onClick={() => navigate(`/roles/${role._id}`)}
                  sx={{
                    borderLeft: `4px solid ${color}`,
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0px 12px 28px rgba(0,0,0,0.10)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                      <Box
                        sx={{
                          height: 44,
                          width: 44,
                          borderRadius: "50%",
                          bgcolor: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "1.125rem",
                        }}
                      >
                        {role.name.charAt(0)}
                      </Box>
                      {isSystem ? (
                        <Chip
                          size="small"
                          icon={<Lock size={14} />}
                          label="Protected"
                          variant="outlined"
                          sx={{ borderRadius: 999 }}
                        />
                      ) : (
                        <Chip
                          size="small"
                          icon={<Sparkles size={14} />}
                          label={role.isSystem ? "Seeded" : "Custom"}
                          sx={{ borderRadius: 999 }}
                        />
                      )}
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="h6" sx={{ color: "text.primary" }}>
                        {role.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {role.description || "No description provided"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                      <Chip size="small" label={`${permCount} permissions`} />
                      <Chip size="small" label={`Code ${role.code}`} />
                      <Chip size="small" label={role.isActive ? "Active" : "Inactive"} />
                    </Stack>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                      <Users size={14} color="#6b7280" />
                      <Typography variant="caption" color="text.secondary">
                        {role.permissions.slice(0, 3).map(getPermissionLabel).join(", ")}
                        {role.permissions.length > 3 ? ` +${role.permissions.length - 3} more` : ""}
                      </Typography>
                    </Box>

                    <Box sx={{ pt: 1.5, borderTop: "1px solid #e5e7eb" }}>
                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(role.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}

            <Card
              onClick={() => setDialogOpen(true)}
              sx={{
                border: "2px dashed #e5e7eb",
                boxShadow: "none",
                cursor: "pointer",
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
        )}

        <Dialog open={dialogOpen} onClose={resetDialog} maxWidth="md" fullWidth>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogContent dividers>
            <DialogContentText sx={{ mb: 2 }}>
              Create a custom role and choose the permissions it should have.
            </DialogContentText>

            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              Role Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Branch Manager"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              placeholder="What can this role do?"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Permissions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {permissionGroups.map((group) => (
                <Card key={group.key} variant="outlined">
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {group.label}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(1, 1fr)",
                          sm: "repeat(2, 1fr)",
                        },
                        gap: 1,
                      }}
                    >
                      {group.permissions.map((permission) => (
                        <FormControlLabel
                          key={permission.key}
                          control={
                            <Checkbox
                              checked={selectedPermissions.includes(permission.key)}
                              onChange={() => togglePermission(permission.key)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {permission.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {permission.description}
                              </Typography>
                            </Box>
                          }
                          sx={{
                            alignItems: "flex-start",
                            gap: 1,
                            m: 0,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">
              Default roles are seeded in the database. Custom roles will be created as additional entries.
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={resetDialog}>Cancel</Button>
            <Button
              variant="contained"
              sx={dialogBtnSx}
              onClick={handleCreate}
              disabled={!newRoleName.trim() || saving}
            >
              {saving ? "Creating..." : "Create Role"}
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {defaultRoleNames.map((roleName) => (
            <Chip key={roleName} label={roleName} variant="outlined" />
          ))}
          <Chip
            label={`${permissionCatalog.length} backend permissions`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default Roles;
