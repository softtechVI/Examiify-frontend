import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { ArrowLeft, Save, Trash2, Shield, Lock, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteRole, getRoles, updateRole } from "@/services/api";
import { brandColors, pageWrapperSx, dialogBtnSx } from "@/theme";
import { getPermissionLabel, permissionGroups, roleColorMap } from "@/data/roleData";
import type { RoleRecord } from "@/types";

const getRoleColor = (role: RoleRecord) => {
  if (role.name in roleColorMap) {
    return roleColorMap[role.name];
  }
  return "hsl(220, 70%, 50%)";
};

const RoleEdit = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [role, setRole] = useState<RoleRecord | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const fetchRole = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data.roles);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load role";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    const found = roles.find((item) => item._id === roleId) || null;
    setRole(found);
    setName(found?.name || "");
    setDescription(found?.description || "");
    setSelectedPermissions(found?.permissions || []);
    setIsActive(found?.isActive ?? true);
  }, [roles, roleId]);

  const isSystemRole = role?.code === 1 || role?.key === "super-admin";

  const allPermissions = useMemo(
    () => permissionGroups.flatMap((group) => group.permissions.map((permission) => permission.key)),
    []
  );

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((item) => item !== permission)
        : [...prev, permission]
    );
  };

  const toggleGroup = (groupPermissions: string[]) => {
    setSelectedPermissions((prev) => {
      const allSelected = groupPermissions.every((perm) => prev.includes(perm));
      return allSelected
        ? prev.filter((perm) => !groupPermissions.includes(perm))
        : [...new Set([...prev, ...groupPermissions])];
    });
  };

  const toggleAll = () => {
    setSelectedPermissions((prev) =>
      prev.length === allPermissions.length ? [] : allPermissions
    );
  };

  const handleSave = async () => {
    if (!role) return;

    if (isSystemRole) {
      toast({
        title: "Read only",
        description: "System roles cannot be modified.",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await updateRole(role._id, {
        name,
        description,
        permissions: selectedPermissions,
        isActive,
      });
      setRole(response.role);
      toast({
        title: "Role updated",
        description: `${response.role.name} was saved successfully.`,
      });
      await fetchRole();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save role";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!role || isSystemRole) return;

    const confirmed = window.confirm(`Delete role "${role.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteRole(role._id);
      toast({
        title: "Role deleted",
        description: `${role.name} has been removed.`,
      });
      navigate("/roles");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete role";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ ...pageWrapperSx, py: 8, textAlign: "center" }}>
          <Typography color="text.secondary">Loading role...</Typography>
        </Box>
      </AdminLayout>
    );
  }

  if (!role) {
    return (
      <AdminLayout>
        <Box sx={{ ...pageWrapperSx, py: 8, textAlign: "center" }}>
          <Typography color="text.secondary">Role not found.</Typography>
        </Box>
      </AdminLayout>
    );
  }

  const totalSelected = selectedPermissions.length;
  const roleColor = getRoleColor(role);
  const allSelected = totalSelected === allPermissions.length;

  return (
    <AdminLayout>
      <Box sx={pageWrapperSx}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/roles")}>
              <ArrowLeft size={20} />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  height: 40,
                  width: 40,
                  borderRadius: "50%",
                  bgcolor: roleColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {role.name.charAt(0)}
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: "text.primary", fontSize: "1.5rem", fontWeight: 700 }}>
                  {role.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isSystemRole ? "Protected role - read only" : "Configure permissions and settings"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {isSystemRole ? (
              <Chip icon={<Lock size={14} />} label="Protected" />
            ) : (
              <Chip icon={<Sparkles size={14} />} label="Editable" />
            )}
            <Button
              variant="contained"
              sx={dialogBtnSx}
              startIcon={<Save size={16} />}
              onClick={handleSave}
              disabled={saving || isSystemRole}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Trash2 size={16} />}
              onClick={handleDelete}
              disabled={deleting || isSystemRole}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" },
            mt: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Shield size={18} color={brandColors.primary} />
                    <Typography variant="subtitle2" color="text.primary">
                      Permissions
                    </Typography>
                  </Box>
                  <Button size="small" onClick={toggleAll} disabled={isSystemRole}>
                    {allSelected ? "Clear all" : "Select all"}
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {totalSelected} of {allPermissions.length} permissions enabled
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {permissionGroups.map((group) => {
                    const groupKeys = group.permissions.map((permission) => permission.key);
                    const groupSelected = groupKeys.every((perm) => selectedPermissions.includes(perm));

                    return (
                      <Card key={group.key} variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                            <Typography variant="subtitle2">{group.label}</Typography>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={groupSelected}
                                  onChange={() => toggleGroup(groupKeys)}
                                  disabled={isSystemRole}
                                />
                              }
                              label="Select group"
                              sx={{ m: 0 }}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
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
                                    disabled={isSystemRole}
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
                                sx={{ alignItems: "flex-start", gap: 1, m: 0 }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontSize: "0.95rem", mb: 2 }}>
                  Role Settings
                </Typography>

                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Role Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSystemRole}
                  sx={{ mb: 2 }}
                />

                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSystemRole}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontSize: "0.95rem", mb: 2 }}>
                  Summary
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Role code
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {role.code}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Active
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {isActive ? "Yes" : "No"}
                </Typography>
              </Box>
                  <Divider />
                  <Typography variant="body2" color="text.secondary">
                    Permission keys
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedPermissions.slice(0, 6).map(getPermissionLabel).join(", ")}
                    {selectedPermissions.length > 6 ? ` +${selectedPermissions.length - 6} more` : ""}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontSize: "0.95rem", mb: 2 }}>
                  Status
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isSystemRole}
                />
                  }
                  label="Role is active"
                  sx={{ m: 0 }}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default RoleEdit;
