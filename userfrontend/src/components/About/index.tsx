import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Heart, 
  Award, 
  Globe,
  Users2,
  TrendingUp
} from "lucide-react";
import aboutImage from "@/assets/about-illustration.jpg";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "Continuously pushing the boundaries of educational technology"
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "Making quality education tools available to institutions worldwide"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Delivering superior products that exceed user expectations"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Founded",
      description: "Started with a vision to revolutionize exam management"
    },
    {
      year: "2021",
      title: "100+ Schools",
      description: "Reached our first major milestone of serving 100 institutions"
    },
    {
      year: "2023",
      title: "1M+ Exams",
      description: "Successfully processed over one million examinations"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Extended our services to 15+ countries worldwide"
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main About Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Globe className="h-4 w-4 mr-2" />
              About Examiify
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Empowering Education Through
              <span className="block text-gradient">Smart Technology</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Examiify was born from the vision of transforming how educational institutions 
              manage examinations. We understand the challenges educators face - from creating 
              secure assessments to analyzing performance data - and we've built a comprehensive 
              solution that addresses every aspect of the examination lifecycle.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our platform combines cutting-edge technology with intuitive design, ensuring that 
              both technical and non-technical users can harness its full potential. We're not 
              just a software company; we're partners in your educational journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero">
                Learn More About Us
              </Button>
              <Button variant="outline" className="btn-outline-hero">
                Meet Our Team
              </Button>
            </div>
          </div>

          <div className="animate-slide-up">
            <img 
              src={aboutImage} 
              alt="About Examiify - Educational institution with digital overlay"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Our Core Values
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Examiify
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="card-gradient card-hover text-center p-6 animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-4">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 p-8 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary-light text-white">
          <div className="text-center">
            <Users2 className="h-8 w-8 mx-auto mb-4 text-white/90" />
            <div className="text-3xl sm:text-4xl font-bold mb-2">500+</div>
            <div className="text-white/90 font-medium">Partner Institutions</div>
          </div>
          <div className="text-center">
            <Globe className="h-8 w-8 mx-auto mb-4 text-white/90" />
            <div className="text-3xl sm:text-4xl font-bold mb-2">15+</div>
            <div className="text-white/90 font-medium">Countries Served</div>
          </div>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-4 text-white/90" />
            <div className="text-3xl sm:text-4xl font-bold mb-2">1M+</div>
            <div className="text-white/90 font-medium">Students Assessed</div>
          </div>
          <div className="text-center">
            <Award className="h-8 w-8 mx-auto mb-4 text-white/90" />
            <div className="text-3xl sm:text-4xl font-bold mb-2">99.9%</div>
            <div className="text-white/90 font-medium">Satisfaction Rate</div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Our Journey
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Key milestones in our mission to transform education
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((milestone, index) => (
            <Card 
              key={index} 
              className="card-gradient card-hover text-center p-6 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gradient mb-2">
                  {milestone.year}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3">
                  {milestone.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {milestone.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;