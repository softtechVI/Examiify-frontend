import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Shield, 
  BarChart3, 
  Users, 
  FileText, 
  Clock,
  CheckCircle,
  Zap
} from "lucide-react";
import featuresImage from "@/assets/features-illustration.jpg";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Effortlessly plan and organize exams with intelligent conflict detection and automatic notifications.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Military-grade encryption and anti-cheating measures ensure exam integrity and student privacy.",
      color: "text-accent"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into student performance, question difficulty, and institutional metrics.",
      color: "text-primary-light"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Tailored interfaces for administrators, teachers, and students with role-based permissions.",
      color: "text-accent-light"
    },
    {
      icon: FileText,
      title: "Question Bank",
      description: "Vast library of categorized questions with AI-powered suggestions and difficulty ratings.",
      color: "text-primary-dark"
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "Live exam supervision with instant alerts for suspicious activities and technical issues.",
      color: "text-success"
    }
  ];

  const stats = [
    { number: "50%", label: "Faster Exam Creation" },
    { number: "99.9%", label: "System Reliability" },
    { number: "24/7", label: "Technical Support" },
    { number: "Zero", label: "Data Loss Incidents" }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="block text-gradient">Manage Exams Efficiently</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform provides all the tools necessary to streamline your examination 
            process from creation to result analysis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-gradient card-hover border-l-4 border-l-primary/30 group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br from-background to-muted/50 w-fit mb-4 group-hover:shadow-glow transition-all duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-slide-up">
            <img 
              src={featuresImage} 
              alt="Examiify features illustration"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
          <div className="animate-fade-in">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Designed for Modern Education
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Built with educators in mind, Examiify combines intuitive design with powerful functionality 
              to deliver an unmatched examination experience.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                "Seamless integration with existing LMS platforms",
                "Mobile-responsive design for any device",
                "Customizable branding and white-label solutions",
                "GDPR compliant with enterprise-grade security"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Button className="btn-hero">
              Explore All Features
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
