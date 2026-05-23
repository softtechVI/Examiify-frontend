export interface PermissionGroup {
  key: string;
  label: string;
  permissions: Array<{
    key: string;
    label: string;
    description: string;
  }>;
}

export const permissionGroups: PermissionGroup[] = [
  {
    key: "roles",
    label: "Roles",
    permissions: [
      { key: "manage_roles", label: "Manage Roles", description: "Create, edit, and remove roles." },
    ],
  },
  {
    key: "users",
    label: "Users",
    permissions: [
      { key: "manage_users", label: "Manage Users", description: "Approve and manage user accounts." },
      { key: "manage_profile", label: "Manage Profile", description: "Update personal profile settings." },
    ],
  },
  {
    key: "academics",
    label: "Academics",
    permissions: [
      { key: "manage_exams", label: "Manage Exams", description: "Create and control exams." },
      { key: "manage_students", label: "Manage Students", description: "Create and manage student records." },
      { key: "manage_rooms", label: "Manage Rooms", description: "Create and manage exam rooms." },
      { key: "view_exams", label: "View Exams", description: "See available exams." },
      { key: "attempt_exams", label: "Attempt Exams", description: "Take assigned exams." },
      { key: "view_results", label: "View Results", description: "Check exam outcomes." },
      { key: "view_reports", label: "View Reports", description: "Inspect dashboards and reports." },
    ],
  },
  {
    key: "billing",
    label: "Billing",
    permissions: [
      { key: "manage_plans", label: "Manage Plans", description: "Create and update subscription plans." },
      { key: "manage_coupons", label: "Manage Coupons", description: "Create and edit coupon codes." },
      { key: "manage_ai", label: "Manage AI", description: "Change AI pricing and status." },
      { key: "manage_settings", label: "Manage Settings", description: "Adjust system-wide settings." },
    ],
  },
];

export const permissionCatalog = permissionGroups.flatMap((group) =>
  group.permissions.map((permission) => permission.key)
);

export const defaultRoleNames = ["Super Admin", "Admin", "Faculty", "Student"];

export const roleColorMap: Record<string, string> = {
  "Super Admin": "hsl(174, 72%, 40%)",
  Admin: "hsl(220, 70%, 50%)",
  Faculty: "hsl(38, 92%, 50%)",
  Student: "hsl(142, 76%, 36%)",
};

export const getPermissionLabel = (key: string) =>
  permissionGroups
    .flatMap((group) => group.permissions)
    .find((permission) => permission.key === key)?.label ?? key;
