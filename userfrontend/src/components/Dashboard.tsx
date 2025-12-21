import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  FileText,
  Calendar,
  MapPin,
  BarChart3,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  buttonText: string;
  gradient: string;
  delay: number;
  onClick?: () => void;
}

const FeatureCard = ({ title, description, icon: Icon, buttonText, gradient, delay, onClick }: FeatureCardProps) => {
  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-[1px] transition-all duration-500 hover:scale-105 hover:rotate-1 animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-full rounded-2xl bg-card/95 backdrop-blur-sm p-8 transition-all duration-300 group-hover:bg-card/98">
        {/* Floating decoration */}
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-10 w-10 text-primary group-hover:text-primary-dark transition-colors duration-300" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {description}
            </p>
          </div>
          
          <Button 
            className="group/btn relative bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0 overflow-hidden"
            onClick={onClick}
          >
            <span className="relative z-10 flex items-center gap-2">
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const features = [
    {
      title: "Manage Exam",
      description: "Create and schedule new exams with precision and ease.",
      icon: Calendar,
      buttonText: "View Schedule",
      gradient: "from-blue-500/20 via-indigo-500/20 to-purple-600/20",
      delay: 0,
    },
    {
      title: "Room Management", 
      description: "Efficiently manage and allocate rooms for all examinations.",
      icon: MapPin,
      buttonText: "Manage Rooms",
      gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-600/20",
      delay: 100,
    },
    {
      title: "Manage Students",
      description: "Comprehensive student information and profile management.",
      icon: Users,
      buttonText: "Manage",
      gradient: "from-orange-500/20 via-red-500/20 to-pink-600/20",
      delay: 200,
    },
    {
      title: "Seat Allocation",
      description: "Smart automated seat assignment for optimal arrangement.",
      icon: ClipboardList,
      buttonText: "Allocate Seats",
      gradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-600/20",
      delay: 300,
    },
    {
      title: "Generate Reports",
      description: "Comprehensive analytics and detailed examination reports.",
      icon: BarChart3,
      buttonText: "View Reports",
      gradient: "from-yellow-500/20 via-amber-500/20 to-orange-600/20",
      delay: 400,
    },
    {
      title: "Add Class And Degree",
      description: "Organize academic programs and class configurations.",
      icon: GraduationCap,
      buttonText: "Add Details",
      gradient: "from-green-500/20 via-emerald-500/20 to-teal-600/20",
      delay: 500,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-primary font-semibold">Examiify Dashboard</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent leading-tight animate-fade-in">
                Welcome to<br />
                <span className="relative">
                  Excellence
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full transform scale-x-0 animate-[scale-x_1s_ease-out_0.5s_forwards]" />
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Your comprehensive examination management system. Streamline every aspect of exam administration with powerful, intuitive tools designed for modern educational institutions.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                buttonText={feature.buttonText}
                gradient={feature.gradient}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-gradient-to-r from-card/50 via-card/60 to-card/50 backdrop-blur-xl rounded-3xl p-8 border border-primary/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Total Exams", value: "1,234", icon: FileText },
                { label: "Active Rooms", value: "56", icon: MapPin },
                { label: "Registered Students", value: "8,901", icon: Users },
                { label: "Reports Generated", value: "445", icon: BarChart3 },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors duration-300">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-card-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-xl border-t border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-card-foreground">Examiify</span>
              </div>
              
              <p className="text-muted-foreground text-center">
                © 2024 Examiify. Empowering educational excellence.
              </p>
              
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="text-sm text-muted-foreground">Powered by modern technology</span>
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;