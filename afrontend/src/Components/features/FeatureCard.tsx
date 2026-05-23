import { Box, Typography, Chip, Switch, Card } from "@mui/material";
import { LucideIcon } from "lucide-react";
import { brandColors } from "@/theme";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  userType: "admin" | "user" | "both";
  category?: string;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  userType,
  category,
}: FeatureCardProps) => {
  const userTypeLabel =
    userType === "admin" ? "Admin Only" : userType === "user" ? "User Only" : "All Users";

  const userTypeColor =
    userType === "admin"
      ? brandColors.primary
      : userType === "user"
      ? "#2e7d32"
      : "#ed6c02";

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 3,
        boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0px 4px 12px rgba(0,0,0,0.12)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>

        {/* Left: Icon + Content */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>

          {/* Icon box */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: enabled ? "rgba(4,159,153,0.1)" : "#f3f4f6",
              color: enabled ? brandColors.primary : "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={24} />
          </Box>

          {/* Text */}
          <Box>
            {/* Title + Category */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}>
                {title}
              </Typography>
              {category && (
                <Chip
                  label={category}
                  size="small"
                  variant="filled"
                  sx={{ fontSize: "0.7rem", height: 20, bgcolor: "#f3f4f6", color: "#6b7280" }}
                />
              )}
            </Box>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, lineHeight: 1.6, fontSize: "0.85rem" }}
            >
              {description}
            </Typography>

            {/* User type badge */}
            <Box sx={{ mt: 1 }}>
              <Chip
                label={userTypeLabel}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: 22,
                  borderColor: userTypeColor,
                  color: userTypeColor,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Right: Switch + label */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
          <Switch
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: brandColors.primary },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: brandColors.primary },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: enabled ? "#2e7d32" : "#6b7280",
              fontSize: "0.75rem",
            }}
          >
            {enabled ? "Enabled" : "Disabled"}
          </Typography>
        </Box>

      </Box>
    </Card>
  );
};