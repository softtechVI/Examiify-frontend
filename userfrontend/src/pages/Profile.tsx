
import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Building, MapPin, Calendar, Shield, Sparkles, Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useSessionStore from "@/store/userSession";

const ProfilePage = () => {
  const { user } = useSessionStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [sessions, setSessions] = useState([
    { id: 1, date: "2025-01-15", duration: "2h 30m", status: "completed" },
    { id: 2, date: "2025-01-10", duration: "1h 45m", status: "completed" },
    { id: 3, date: "2025-01-05", duration: "3h 15m", status: "completed" },
  ]);

  const getRoleLabel = (role: string | number) => {
    if (role === 2 || role === "2") return "Teacher";
    if (role === 1 || role === "1") return "Admin";
    return "Student";
  };

  const getStatusLabel = (status: number) => {
    if (status === 1) return "Active";
    if (status === 2) return "Pending";
    return "Inactive";
  };

  const getStatusColor = (status: number) => {
    if (status === 1) return "bg-green-500/10 text-green-600 border-green-500/20";
    if (status === 2) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    return "bg-red-500/10 text-red-600 border-red-500/20";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border/40 shadow-lg">
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{getRoleLabel(user.role)}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-accent"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile Details</span>
          </button>
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "session"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-accent"
            }`}
            onClick={() => setActiveTab("session")}
          >
            <Clock className="w-5 h-5" />
            <span className="font-medium">Sessions</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === "profile" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Profile Information</h1>
              <Badge className={getStatusColor(user.status)}>
                {getStatusLabel(user.status)}
              </Badge>
            </div>

            {/* Personal Information */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <User className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium text-foreground">{(user as any).phoneNumber || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium text-foreground">{getRoleLabel(user.role)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Institute Information */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Building className="w-5 h-5 text-primary" />
                Institute Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Building className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Institute Name</p>
                    <p className="font-medium text-foreground">{(user as any).institute || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Building className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Institute Type</p>
                    <p className="font-medium text-foreground">
                      {(user as any).instituteType || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 md:col-span-2">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground">
                      {(user as any).address || "N/A"}, {(user as any).city || "N/A"}, {(user as any).state || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Status */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                Account Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Valid From</p>
                    <p className="font-medium text-foreground">
                      {(user as any).validStart ? new Date((user as any).validStart).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Valid Until</p>
                    <p className="font-medium text-foreground">
                      {(user as any).validUpto ? new Date((user as any).validUpto).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">AI Status</p>
                    <p className="font-medium text-foreground">
                      {(user as any).aiStatus === 1 ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "session" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Session Management</h1>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Session
              </Button>
            </div>

            <div className="grid gap-4">
              {sessions.map((session) => (
                <Card key={session.id} className="p-6 bg-card/50 backdrop-blur-sm border-border/40 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Session #{session.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} • {session.duration}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      {session.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/40 border-dashed text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">No Active Session</h3>
              <p className="text-muted-foreground mb-4">Start a new session to begin tracking your activity</p>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create New Session
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
