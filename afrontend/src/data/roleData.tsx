
export interface Permission {
  key: string;
  label: string;
}

export interface PermissionModule {
  key: string;
  label: string;
  permissions: Permission[];
}

export interface Role {
  _id: string;
  name: string;
  color: string;
  defaultRoute: string;
  canCreateRoles: string[];
  permissions: Record<string, string[]>;
  createdAt: string;
}

export const permissionModules: PermissionModule[] = [
  {
    key: "user",
    label: "User",
    permissions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
      { key: "export", label: "Export" },
    ],
  },
  {
    key: "batch",
    label: "Batch",
    permissions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "quest",
    label: "Quest",
    permissions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "tutorial",
    label: "Tutorial",
    permissions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "course",
    label: "Course",
    permissions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "quiz",
    label: "Quiz",
    permissions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
      { key: "grade", label: "Grade" },
    ],
  },
];

export const availableRoleNames = [
  "Super Admin",
  "Admin",
  "Manager",
  "Teacher",
  "Student",
  "Viewer",
];

export const defaultRoles: Role[] = [
  {
    _id: "1",
    name: "Super Admin",
    color: "hsl(174, 72%, 40%)",
    defaultRoute: "/admindashboard",
    canCreateRoles: ["Admin", "Manager", "Teacher"],
    permissions: {
      user: ["view", "create", "edit", "delete", "export"],
      batch: ["view", "create", "edit", "delete"],
      quest: ["view", "create", "edit", "delete"],
      tutorial: ["view", "create", "edit", "delete"],
      course: ["view", "create", "edit", "delete"],
      quiz: ["view", "create", "edit", "delete", "grade"],
    },
    createdAt: "2024-01-15",
  },
  {
    _id: "2",
    name: "Admin",
    color: "hsl(220, 70%, 50%)",
    defaultRoute: "/admindashboard",
    canCreateRoles: ["Manager", "Teacher"],
    permissions: {
      user: ["view", "create", "edit"],
      batch: ["view", "create", "edit"],
      quest: ["view", "create"],
      tutorial: ["view", "create", "edit"],
      course: ["view", "create"],
      quiz: ["view", "create", "edit", "grade"],
    },
    createdAt: "2024-02-10",
  },
  {
    _id: "3",
    name: "Teacher",
    color: "hsl(38, 92%, 50%)",
    defaultRoute: "/admindashboard",
    canCreateRoles: [],
    permissions: {
      user: ["view"],
      batch: ["view", "edit"],
      quest: ["view", "create", "edit"],
      tutorial: ["view", "create", "edit"],
      course: ["view"],
      quiz: ["view", "create", "edit", "grade"],
    },
    createdAt: "2024-03-05",
  },
  {
    _id: "4",
    name: "Student",
    color: "hsl(142, 76%, 36%)",
    defaultRoute: "/dashboard",
    canCreateRoles: [],
    permissions: {
      user: ["view"],
      batch: ["view"],
      quest: ["view"],
      tutorial: ["view"],
      course: ["view"],
      quiz: ["view"],
    },
    createdAt: "2024-03-20",
  },
];
