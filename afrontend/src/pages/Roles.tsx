import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Shield, Plus, Pencil, Search, Users } from "lucide-react";
import { defaultRoles, Role } from "@/data/roleData";

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
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and their access permissions
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Role
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Roles Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((role) => {
            const permCount = Object.values(role.permissions).flat().length;
            return (
              <Card
                key={role._id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4"
                style={{ borderLeftColor: role.color }}
                onClick={() => navigate(`/roles/${role._id}`)}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className="h-11 w-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: role.color }}
                    >
                      {role.name.charAt(0)}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/roles/${role._id}`);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {role.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {permCount} permissions assigned
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>
                      Can create:{" "}
                      {role.canCreateRoles.length > 0
                        ? role.canCreateRoles.join(", ")
                        : "None"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Created: {role.createdAt}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add Role Card */}
          <Card
            className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]"
            onClick={() => setDialogOpen(true)}
          >
            <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
              <Plus className="h-8 w-8" />
              <span className="font-medium">Add New Role</span>
            </CardContent>
          </Card>
        </div>

        {/* Create Role Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Add a new role and configure its permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  placeholder="e.g. Manager, Editor..."
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Role Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {roleColors.map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        newRoleColor === color
                          ? "border-foreground scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewRoleColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!newRoleName.trim()}>
                Create & Configure
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Roles;
