import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-3 rounded-lg",
              enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-card-foreground">{title}</h3>
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  userType === "admin"
                    ? "border-primary text-primary"
                    : userType === "user"
                    ? "border-success text-success"
                    : "border-warning text-warning"
                )}
              >
                {userType === "admin" ? "Admin Only" : userType === "user" ? "User Only" : "All Users"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-primary"
          />
          <span
            className={cn(
              "text-xs font-medium",
              enabled ? "text-success" : "text-muted-foreground"
            )}
          >
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
};
