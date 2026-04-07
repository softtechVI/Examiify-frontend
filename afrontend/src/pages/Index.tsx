import { AdminLayout } from "@/Components/layout/AdminLayout";
import { Building2, Plus, FileText } from "lucide-react";

const StatCard = ({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: number;
  label: string;
}) => (
  <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-lg">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div>
        <p className="text-3xl font-bold text-card-foreground">{value}</p>
        <p className="text-sm font-medium text-primary">{label}</p>
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground italic">
            Welcome to the Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Building2} value={25} label="Total Institute" />
          <StatCard icon={Plus} value={25} label="Add Plan" />
          <StatCard icon={FileText} value={25} label="Exams Conduct" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
