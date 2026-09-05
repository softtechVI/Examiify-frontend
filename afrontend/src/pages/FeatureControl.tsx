import { useEffect, useState } from "react";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import { FeatureCard } from "@/Components/features/FeatureCard";
import {
  getFeatures,
  updateFeaturesBulk,
  resetFeatures,
} from "../services/feature";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
} from "@mui/material";
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
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  pageWrapperSx,
  pageHeaderSx,
  pageTitleSx,
  filterRowSx,
  filterButtonSx,
  brandColors,
} from "@/theme";

type UserType = "both" | "admin" | "user";

type Feature = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  userType: UserType;
  category: string;
  icon: LucideIcon;
};

const normalizeUserType = (value: string): UserType => {
  if (value === "admin" || value === "user" || value === "both") {
    return value;
  }

  return "both";
};

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Shield,
  KeyRound,
  Brain,
  FileCheck,
  Mail,
  Bell,
  CreditCard,
  UserCheck,
  Lock,
};

const getIconByName = (iconName?: string): LucideIcon =>
  (iconName && iconMap[iconName]) || Shield;

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
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasChanges, setHasChanges] = useState(false);

useEffect(() => {
  const loadFeatures = async () => {
    try {
      setLoading(true);

      const data = await getFeatures();

      setFeatures(
        data.map((feature: any) => ({
          ...(feature as Feature),
          id: feature.featureId,
          // ensure icon name is string when passed to getIconByName
          icon: getIconByName(String(feature.icon)),
        })) as Feature[]
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error ?? "Failed to load features");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  loadFeatures();
}, []);

  const handleToggle = (featureId: string, enabled: boolean) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === featureId ? { ...feature, enabled } : feature
      )
    );
    setHasChanges(true);
  };

const handleSave = async () => {
  try {
    const updates = features.map((feature) => ({
      featureId: feature.id,
      enabled: feature.enabled,
    }));

    await updateFeaturesBulk(updates);

    toast.success("Feature settings saved successfully");

    setHasChanges(false);
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to save feature settings"
    );
  }
};

const handleReset = async () => {
  try {
    await resetFeatures();

    setFeatures(initialFeatures);
    setHasChanges(false);

    toast.success("Feature settings reset to default");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to reset feature settings"
    );
  }
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
      <Box sx={pageWrapperSx}>

        {/* HEADER */}
        <Box sx={pageHeaderSx}>
          <Box>
            <Typography sx={pageTitleSx}>Feature Control</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 5 }}>
              Manage features for admin and user roles across your platform
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<RefreshCw size={16} />}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!hasChanges}
              startIcon={<Save size={16} />}
              sx={{
                background: brandColors.primary,
                "&:hover": { background: brandColors.primaryDark },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>

        {/* STATS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {/* Total Features */}
          <Card>
            <CardContent sx={{ pt: 2.5, display: "flex", alignItems: "center", gap: 1.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(4,159,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={20} color={brandColors.primary} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
                  {features.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">Total Features</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Enabled */}
          <Card>
            <CardContent sx={{ pt: 2.5, display: "flex", alignItems: "center", gap: 1.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(46,125,50,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={20} color="#2e7d32" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
                  {enabledCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">Enabled</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Disabled */}
          <Card>
            <CardContent sx={{ pt: 2.5, display: "flex", alignItems: "center", gap: 1.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={20} color="#6b7280" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
                  {disabledCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">Disabled</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* FILTERS */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {/* Search */}
          <TextField
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ flex: 1, maxWidth: { md: 400 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#6b7280" />
                </InputAdornment>
              ),
            }}
          />

          {/* Category Filter */}
          <Box sx={filterRowSx}>
            {categories.map((category) => (
              <Button
                key={category}
                variant="outlined"
                size="small"
                sx={filterButtonSx(selectedCategory === category)}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </Box>
        </Box>

        {/* FEATURE CARDS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
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
        </Box>

        {/* EMPTY STATE */}
        {filteredFeatures.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary">
              No features found matching your criteria.
            </Typography>
          </Box>
        )}

      </Box>
    </AdminLayout>
  );
};

export default FeatureControl;