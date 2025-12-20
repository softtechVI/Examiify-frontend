import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  HeadphonesIcon,
  Globe
} from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";

interface ContactInfo {
  icon: typeof Mail;
  title: string;
  description: string;
  info: string;
  color: string;
}

interface SupportOption {
  icon: typeof MessageSquare;
  title: string;
  description: string;
  action: string;
}

const Contact: React.FC = () => {
  const {
    formData,
    isLoading,
    errors,
    handleInputChange,
    handleSubmit,
  } = useContactForm();

  const contactInfo: ContactInfo[] = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      info: "support@examify.com",
      color: "text-primary"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      info: "+1 (555) 123-4567",
      color: "text-accent"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our headquarters",
      info: "123 Education Ave, Tech City, TC 12345",
      color: "text-primary-light"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're here to help",
      info: "Mon-Fri: 9AM-6PM EST",
      color: "text-success"
    }
  ];

  const supportOptions: SupportOption[] = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant support for urgent questions",
      action: "Start Chat"
    },
    {
      icon: HeadphonesIcon,
      title: "Phone Support",
      description: "Speak directly with our experts",
      action: "Call Now"
    },
    {
      icon: Globe,
      title: "Help Center",
      description: "Browse our comprehensive documentation",
      action: "Visit Help Center"
    }
  ];


  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <MessageSquare className="h-4 w-4 mr-2" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your
            <span className="block text-gradient">Exam Management?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about Examify? Want to schedule a demo? Our team is here to help you 
            get started on your journey to efficient exam management.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <Card 
              key={index} 
              className="card-gradient card-hover text-center p-6 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-background to-muted/50 mb-4">
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <p className="font-medium text-foreground">{item.info}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Contact Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Contact Form */}
          <Card className="card-gradient animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Send Us a Message
              </CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="border-border focus:border-primary"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="border-border focus:border-primary"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Institution Name</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Educational Institution"
                    className="border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your needs..."
                    required
                    rows={5}
                    className="border-border focus:border-primary resize-none"
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="btn-hero w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Support Options */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Other Ways to Reach Us
              </h3>
              <p className="text-muted-foreground mb-8">
                Choose the support option that works best for you. Our dedicated team is available 
                to assist with any questions about Examify.
              </p>
            </div>

            <div className="space-y-4">
              {supportOptions.map((option, index) => (
                <Card 
                  key={index} 
                  className="card-gradient card-hover p-6 cursor-pointer group"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 group-hover:shadow-glow transition-all duration-300">
                          <option.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {option.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {option.description}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="btn-outline-hero opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {option.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Contact */}
            <Card className="card-gradient bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <h4 className="font-bold text-foreground mb-2">Need Immediate Assistance?</h4>
                <p className="text-muted-foreground mb-4">
                  For urgent technical issues or sales inquiries
                </p>
                <Button className="btn-hero">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Looking for Quick Answers?
          </h3>
          <p className="text-muted-foreground mb-6">
            Check out our comprehensive FAQ section for instant solutions to common questions.
          </p>
          <Button variant="outline" className="btn-outline-hero">
            Browse FAQ
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;