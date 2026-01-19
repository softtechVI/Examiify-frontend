import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { FeatureCard } from "@/components/features/FeatureCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  KeyRound,
  Brain,
  Shield,
  Mail,
  Bell,
  CreditCard,
  FileCheck,
  UserCheck,
  Lock,
  Smartphone,
  Search,
  RefreshCw,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface Feature {
  id: string;
  icon: any;
  title: string;
  description: string;
  enabled: boolean;
  userType: "admin" | "user" | "both";
  category: string;
}

const initialFeatures: Feature[] = [
  {
    id: "otp-login",
    icon: Smartphone,
    title: "OTP Login",
    description: "Enable one-time password authentication for secure login. Users will receive OTP via SMS or email.",
    enabled: true,
    userType: "both",
    category: "Authentication",
  },
  {
    id: "two-factor",
    icon: Shield,
    title: "Two-Factor Authentication",
    description: "Require two-factor authentication for all admin accounts to enhance security.",
    enabled: true,
    userType: "admin",
    category: "Authentication",
  },
  {
    id: "password-login",
    icon: KeyRound,
    title: "Password Login",
    description: "Allow users to login with traditional email and password combination.",
    enabled: true,
    userType: "both",
    category: "Authentication",
  },
  {
    id: "ai-analysis",
    icon: Brain,
    title: "AI Analysis",
    description: "Enable AI-powered analysis for exam results, performance predictions, and personalized recommendations.",
    enabled: true,
    userType: "both",
    category: "AI Features",
  },
  {
    id: "ai-grading",
    icon: FileCheck,
    title: "AI Auto-Grading",
    description: "Automatically grade subjective answers using AI technology for faster result processing.",
    enabled: false,
    userType: "admin",
    category: "AI Features",
  },
  {
    id: "email-notifications",
    icon: Mail,
    title: "Email Notifications",
    description: "Send email notifications for exam schedules, results, and important updates.",
    enabled: true,
    userType: "both",
    category: "Notifications",
  },
  {
    id: "push-notifications",
    icon: Bell,
    title: "Push Notifications",
    description: "Enable push notifications for real-time alerts on mobile and web browsers.",
    enabled: false,
    userType: "user",
    category: "Notifications",
  },
  {
    id: "online-payments",
    icon: CreditCard,
    title: "Online Payments",
    description: "Allow users to make payments for exam fees and subscriptions online.",
    enabled: true,
    userType: "user",
    category: "Payments",
  },
  {
    id: "user-verification",
    icon: UserCheck,
    title: "User Verification",
    description: "Require identity verification for users before they can access exams.",
    enabled: false,
    userType: "user",
    category: "Security",
  },
  {
    id: "session-lock",
    icon: Lock,
    title: "Exam Session Lock",
    description: "Lock browser during exams to prevent tab switching and copy-paste actions.",
    enabled: true,
    userType: "user",
    category: "Security",
  },
];

const categories = ["All", "Authentication", "AI Features", "Notifications", "Payments", "Security"];

const FeatureControl = () => {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (featureId: string, enabled: boolean) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled } : f))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success("Feature settings saved successfully!");
    setHasChanges(false);
  };

  const handleReset = () => {
    setFeatures(initialFeatures);
    setHasChanges(false);
    toast.info("Features reset to default settings");
  };

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const enabledCount = features.filter((f) => f.enabled).length;
  const disabledCount = features.length - enabledCount;

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Feature Control</h1>
            <p className="text-muted-foreground mt-1">
              Manage features for admin and user roles across your platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{features.length}</p>
                <p className="text-sm text-muted-foreground">Total Features</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{enabledCount}</p>
                <p className="text-sm text-muted-foreground">Enabled</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{disabledCount}</p>
                <p className="text-sm text-muted-foreground">Disabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-primary hover:bg-primary/90"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              enabled={feature.enabled}
              onToggle={(enabled) => handleToggle(feature.id, enabled)}
              userType={feature.userType}
              category={feature.category}
            />
          ))}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No features found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FeatureControl;
