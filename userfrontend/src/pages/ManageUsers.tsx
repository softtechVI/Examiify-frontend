import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PanelsTopLeft, Table as TableIcon, Mail, Phone, ShieldCheck, User as UserIcon } from "lucide-react";
import { message } from "antd";
import Table from "@/components/Table";
import { getUsers, deleteUser } from "../API/users"; // adjust import path as needed
import { User } from "../types"; // adjust import path as needed

interface DisplayUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

const getRoleColor = (role: string | number) => {
  const r = Number(role);
  switch (r) {
    case 2:
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"; // admin
    case 3:
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";       // teacher
    case 4:
      return "bg-green-100 text-green-800 hover:bg-green-200";    // student
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Inactive":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const tableColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formattedData, setFormattedData] = useState<DisplayUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data: User[] = await getUsers();

      // Filter out super_admin (role === 1)
      const filtered = data.filter((u) => {
        const r = (u as unknown as Record<string, unknown>);
        return r.role !== 1;
      });

      const fd: DisplayUser[] = filtered.map((user) => {
        const u = user as unknown as Record<string, unknown>;
        return {
          _id: typeof u._id === "string" ? u._id : String(u._id ?? ""),
          name: typeof u.name === "string" ? u.name : String(u.name ?? ""),
          email: typeof u.email === "string" ? u.email : String(u.email ?? ""),
          phone: typeof u.phone === "string" ? u.phone : String(u.phone ?? ""),
          role: typeof u.role === "string" ? u.role : String(u.role ?? ""),
          status: typeof u.status === "string" ? u.status : "Active",
        };
      });

      setUsers(filtered);
      setFormattedData(fd);
    } catch {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      message.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setFormattedData((prev) => prev.filter((u) => u._id !== id));
    } catch {
      message.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Manage Users
            </h1>
            <p className="text-muted-foreground">
              View and manage all registered users (excluding super admins)
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Card / Table toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <div
                onClick={() => setViewMode("card")}
                className={`flex items-center justify-center px-4 py-2 cursor-pointer transition-colors duration-300 ${
                  viewMode === "card"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Card View"
              >
                <PanelsTopLeft className="h-5 w-5" />
              </div>
              <div
                onClick={() => setViewMode("table")}
                className={`flex items-center justify-center px-4 py-2 cursor-pointer transition-colors duration-300 ${
                  viewMode === "table"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Table View"
              >
                <TableIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading users...</p>
        ) : formattedData.length === 0 ? (
          <p>No users found.</p>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formattedData.map((user) => (
              <Card
                key={user._id}
                className="p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="space-y-4">
                  {/* Top row: name + role badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {user.role}
                      </p>
                    </div>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Table
            data={formattedData}
            columns={tableColumns}
            getStatusColor={getStatusColor}
            onDelete={handleDeleteUser}
          />
        )}
      </div>
    </div>
  );
};

export default ManageUsers;