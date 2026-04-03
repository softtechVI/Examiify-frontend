import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, Save, Shield } from "lucide-react";
import {
  defaultRoles,
  permissionModules,
  availableRoleNames,
  Role,
} from "../data/roleData";
import { useToast } from "@/hooks/use-toast";

const RoleEdit = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [defaultRoute, setDefaultRoute] = useState("/admindashboard");
  const [canCreateRoles, setCanCreateRoles] = useState<string[]>([]);

  useEffect(() => {
    const found = defaultRoles.find((r) => r._id === roleId);
    if (found) {
      setRole(found);
      setPermissions({ ...found.permissions });
      setDefaultRoute(found.defaultRoute);
      setCanCreateRoles([...found.canCreateRoles]);
    } else {
      // New role with this ID
      setRole({
        _id: roleId || "",
        name: "New Role",
        color: "hsl(174, 72%, 40%)",
        defaultRoute: "/admindashboard",
        canCreateRoles: [],
        permissions: {},
        createdAt: new Date().toISOString().split("T")[0],
      });
      setPermissions({});
    }
  }, [roleId]);

  const togglePermission = (moduleKey: string, permKey: string) => {
    setPermissions((prev) => {
      const current = prev[moduleKey] || [];
      const updated = current.includes(permKey)
        ? current.filter((p) => p !== permKey)
        : [...current, permKey];
      return { ...prev, [moduleKey]: updated };
    });
  };

  const toggleAllModule = (moduleKey: string, allPerms: string[]) => {
    setPermissions((prev) => {
      const current = prev[moduleKey] || [];
      const allSelected = allPerms.every((p) => current.includes(p));
      return {
        ...prev,
        [moduleKey]: allSelected ? [] : [...allPerms],
      };
    });
  };

  const toggleSelectAll = () => {
    const allPermsSelected = permissionModules.every((mod) => {
      const current = permissions[mod.key] || [];
      return mod.permissions.every((p) => current.includes(p.key));
    });

    if (allPermsSelected) {
      setPermissions({});
    } else {
      const all: Record<string, string[]> = {};
      permissionModules.forEach((mod) => {
        all[mod.key] = mod.permissions.map((p) => p.key);
      });
      setPermissions(all);
    }
  };

  const toggleCanCreateRole = (roleName: string) => {
    setCanCreateRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSave = () => {
    toast({
      title: "Role Updated",
      description: `Permissions for "${role?.name}" have been saved successfully.`,
    });
  };

  if (!role) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-muted-foreground">
          Role not found.
        </div>
      </AdminLayout>
    );
  }

  const totalPerms = Object.values(permissions).flat().length;
  const maxPerms = permissionModules.reduce(
    (acc, m) => acc + m.permissions.length,
    0
  );
  const allSelected = totalPerms === maxPerms;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/roles")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: role.color }}
              >
                {role.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {role.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Configure permissions and settings
                </p>
              </div>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Permissions Grid */}
          <div className="space-y-4">
            {/* Select All Bar */}
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">
                    Permissions ({totalPerms}/{maxPerms})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                  <Label className="text-sm cursor-pointer" onClick={toggleSelectAll}>
                    Select All
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Permission Modules */}
            {permissionModules.map((mod) => {
              const currentPerms = permissions[mod.key] || [];
              const allModPerms = mod.permissions.map((p) => p.key);
              const allModSelected = allModPerms.every((p) =>
                currentPerms.includes(p)
              );

              return (
                <Card key={mod.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{mod.label}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={allModSelected}
                          onCheckedChange={() =>
                            toggleAllModule(mod.key, allModPerms)
                          }
                        />
                        <span
                          className="text-xs text-muted-foreground cursor-pointer"
                          onClick={() => toggleAllModule(mod.key, allModPerms)}
                        >
                          Select All
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {mod.permissions.map((perm) => {
                        const isChecked = currentPerms.includes(perm.key);
                        return (
                          <label
                            key={perm.key}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                              isChecked
                                ? "bg-accent border-primary/30"
                                : "bg-card border-border hover:border-primary/20"
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() =>
                                togglePermission(mod.key, perm.key)
                              }
                            />
                            <span className="text-sm font-medium">
                              {perm.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Role Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Route</Label>
                  <Select value={defaultRoute} onValueChange={setDefaultRoute}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="/admindashboard">
                        Admin Dashboard
                      </SelectItem>
                      <SelectItem value="/dashboard">Dashboard</SelectItem>
                      <SelectItem value="/courses">Courses</SelectItem>
                      <SelectItem value="/quizzes">Quizzes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Roles You Can Create
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableRoleNames
                  .filter((r) => r !== role.name)
                  .map((roleName) => (
                    <label
                      key={roleName}
                      className="flex items-center gap-2 cursor-pointer py-1"
                    >
                      <Checkbox
                        checked={canCreateRoles.includes(roleName)}
                        onCheckedChange={() => toggleCanCreateRole(roleName)}
                      />
                      <span className="text-sm">{roleName}</span>
                    </label>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Permissions</span>
                  <span className="font-medium">{totalPerms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modules Active</span>
                  <span className="font-medium">
                    {
                      Object.entries(permissions).filter(
                        ([, v]) => v.length > 0
                      ).length
                    }
                    /{permissionModules.length}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${(totalPerms / maxPerms) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RoleEdit;
